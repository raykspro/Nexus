import { useState, useRef } from "react";
import { useTransactions, useDeleteTransaction, useCreateTransaction } from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/format";
import { 
  Utensils, Car, HeartPulse, Wallet, Banknote, ArrowDownLeft, 
  RefreshCcw, FileUp, Smartphone, ShoppingBag, Zap, LayoutGrid
} from "lucide-react";

const categoryConfig: any = {
  "Alimentação": { icon: Utensils, color: "bg-orange-500" },
  "Transporte": { icon: Car, color: "bg-blue-500" },
  "Saúde": { icon: HeartPulse, color: "bg-rose-500" },
  "Salário": { icon: Wallet, color: "bg-emerald-500" },
  "PIX": { icon: Smartphone, color: "bg-sky-600" },
  "Lazer": { icon: Banknote, color: "bg-purple-500" },
  "Contas": { icon: Zap, color: "bg-yellow-500" },
  "Outros": { icon: LayoutGrid, color: "bg-slate-500" },
};

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const createTransaction = useCreateTransaction();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCategoryAndDescription = (rawDesc: string) => {
    let d = rawDesc.toLowerCase();
    let finalDesc = rawDesc;
    let category = "Outros";

    // Protocolo Mestre: PIX em CAIXA ALTA
    if (d.includes("pix") || d.includes("transferencia")) {
      finalDesc = rawDesc.toUpperCase();
      category = "PIX";
    }

    // Filtros Inteligentes baseados na Imagem 3
    if (/food|restaurante|pizza|burguer|belpanino|lanche|padaria/i.test(d)) category = "Alimentação";
    else if (/uber|99|pop|posto|combustivel|shell|ipiranga/i.test(d)) category = "Transporte";
    else if (/gold soccer|arena|game|netflix|spotify|lazer/i.test(d)) category = "Lazer";
    else if (/farmacia|drogaria|hosp|saude/i.test(d)) category = "Saúde";
    else if (/recebida|recebido|salario|pagamento/i.test(d)) category = "Salário";
    else if (/luz|agua|fatura|internet|aluguel/i.test(d)) category = "Contas";

    return { category, finalDesc };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n');
      let count = 0;

      rows.forEach((row, index) => {
        if (index === 0 && row.toLowerCase().includes('data')) return;
        const columns = row.split(/[;,]/);
        if (columns.length < 2) return;

        // Regra: Coluna 1 é Valor, última coluna é Descrição (Ignora Identificador)
        const rawValue = columns[1]?.trim() || "0";
        const rawDescription = columns[columns.length - 1]?.trim() || "Importado";

        const numericStr = rawValue.replace(/[^\d,.-]/g, '').replace(',', '.');
        const numericValue = parseFloat(numericStr);

        if (isNaN(numericValue)) return;

        const type = numericValue < 0 ? 'expense' : 'income';
        const amount = Math.abs(numericValue);
        const { category, finalDesc } = getCategoryAndDescription(rawDescription);

        createTransaction.mutate({
          description: finalDesc,
          amount,
          category,
          type,
          date: new Date().toISOString()
        });
        count++;
      });
      alert(`Mestre, ${count} operações foram assimiladas.`);
    };
    reader.readAsText(file);
  };

  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32 px-4">
      <header className="flex justify-between items-end pt-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none flex gap-2">
            <span className="text-white">NEXUS</span>
            <span className="text-blue-600">EXTRATO</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">Registros do Império</p>
        </div>
        <div className="flex gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv,.txt" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
            <FileUp className="w-5 h-5" />
          </button>
          <button onClick={() => confirm("Resetar registros?") && transactions.forEach(t => deleteTransaction.mutate(t.id))} className="p-3 bg-slate-800 text-slate-400 rounded-2xl border border-slate-700">
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="space-y-4">
        {sorted.map((t) => {
          const config = categoryConfig[t.category] || categoryConfig["Outros"];
          const Icon = config.icon;
          return (
            <div key={t.id} className="bg-[#0f172a] p-5 rounded-[32px] border border-slate-800/50 flex justify-between items-center shadow-2xl">
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${config.color} text-white`}>
                  <Icon className="w-6 h-6 stroke-[2.5px]" />
                </div>
                <div className="max-w-[200px]">
                  <p className="font-bold text-white text-[15px] tracking-tight truncate leading-tight">{t.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{t.category}</p>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <p className="text-[9px] text-slate-500 font-bold italic">Processado</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-lg tracking-tighter ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
