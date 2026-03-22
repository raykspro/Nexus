import { useState, useRef } from "react";
import { useTransactions, useDeleteTransaction, useCreateTransaction } from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/format";
import { 
  Utensils, Car, HeartPulse, Wallet, Banknote, ArrowDownLeft, 
  RefreshCcw, FileUp, Smartphone, ShoppingBag, Zap, LayoutGrid, CreditCard
} from "lucide-react";

const categoryConfig: any = {
  "Alimentação": { icon: Utensils, color: "bg-orange-500" },
  "Transporte": { icon: Car, color: "bg-blue-500" },
  "Saúde": { icon: HeartPulse, color: "bg-rose-500" },
  "Salário": { icon: Wallet, color: "bg-emerald-500" },
  "PIX": { icon: Smartphone, color: "bg-sky-600" },
  "Débito": { icon: CreditCard, color: "bg-indigo-500" },
  "Crédito": { icon: CreditCard, color: "bg-violet-600" },
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

    // Protocolo de Limpeza Mestre: Débito e Crédito
    if (d.includes("compra no débito") || d.includes("compra no debito")) {
      category = "Débito";
      finalDesc = rawDesc.replace(/compra no débito\s*-\s*/gi, "").replace(/compra no debito\s*-\s*/gi, "").trim();
    } else if (d.includes("compra no crédito") || d.includes("compra no credito")) {
      category = "Crédito";
      finalDesc = rawDesc.replace(/compra no crédito\s*-\s*/gi, "").replace(/compra no credito\s*-\s*/gi, "").trim();
    } else if (d.includes("pix") || d.includes("transferencia")) {
      finalDesc = rawDesc.toUpperCase();
      category = "PIX";
    }

    // Filtros de Nicho (Prioridade sobre Débito/Crédito se houver match específico)
    const lowerFinal = finalDesc.toLowerCase();
    if (/food|restaurante|pizza|burguer|belpanino|lanche|padaria/i.test(lowerFinal)) category = "Alimentação";
    else if (/uber|99|pop|posto|combustivel|shell|ipiranga/i.test(lowerFinal)) category = "Transporte";
    else if (/gold soccer|arena|game|netflix|spotify|lazer/i.test(lowerFinal)) category = "Lazer";
    else if (/farmacia|drogaria|hosp|saude/i.test(lowerFinal)) category = "Saúde";
    else if (/recebida|recebido|salario|pagamento/i.test(lowerFinal)) category = "Salário";

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

        const rawValue = columns[1]?.trim() || "0";
        const rawDescription = columns[columns.length - 1]?.trim() || "Importado";

        const numericStr = rawValue.replace(/[^\d,.-]/g, '').replace(',', '.');
        const numericValue = parseFloat(numericStr);

        if (isNaN(numericValue)) return;

        const type = numericValue < 0 ? 'expense' : 'income';
        const { category, finalDesc } = getCategoryAndDescription(rawDescription);

        createTransaction.mutate({
          description: finalDesc,
          amount: Math.abs(numericValue),
          category,
          type,
          date: new Date().toISOString()
        });
        count++;
      });
      alert(`Mestre, ${count} lançamentos foram purificados e importados.`);
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
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">Dados Purificados</p>
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
            <div key={t.id} className="bg-[#0f172a] p-5 rounded-[32px] border border-slate-800/50 flex justify-between items-center shadow-2xl transition-all">
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${config.color} text-white shadow-inner`}>
                  <Icon className="w-6 h-6 stroke-[2.5px]" />
                </div>
                <div className="max-w-[200px]">
                  <p className="font-bold text-white text-[15px] tracking-tight truncate uppercase leading-tight">{t.description}</p>
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">{t.category}</p>
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
