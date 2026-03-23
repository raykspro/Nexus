import { useState, useRef } from "react";
import { useTransactions, useDeleteTransaction, useCreateTransaction } from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/format";
import { 
  Utensils, Car, HeartPulse, Wallet, Banknote, ArrowDownLeft, 
  Trash2, CreditCard, Gamepad2, GraduationCap, LayoutGrid, Clock, RefreshCcw, FileUp
} from "lucide-react";

const categoryConfig: any = {
  "Alimentação": { icon: Utensils, color: "text-orange-400 bg-orange-950/50" },
  "Transporte": { icon: Car, color: "text-sky-400 bg-sky-950/50" },
  "Saúde": { icon: HeartPulse, color: "text-rose-400 bg-rose-950/50" },
  "Salário": { icon: Wallet, color: "text-emerald-400 bg-emerald-950/50" },
  "Investimento": { icon: Banknote, color: "text-purple-400 bg-purple-950/50" },
  "Fatura": { icon: CreditCard, color: "text-slate-400 bg-slate-800/50" },
  "Lazer": { icon: Gamepad2, color: "text-purple-400 bg-purple-950/50" },
  "Estudos": { icon: GraduationCap, color: "text-indigo-400 bg-indigo-950/50" },
  "Outros": { icon: LayoutGrid, color: "text-slate-500 bg-slate-800/20" },
};

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const createTransaction = useCreateTransaction();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCategory = (desc: string) => {
    const d = desc.toLowerCase();
    if (/salario|recebido|recebida|provento|rendimento/i.test(d)) return "Salário";
    if (/food|restaurante|pizza|burguer|lanche|comer|padaria|mercado|carrefour|ifood|99food/i.test(d)) return "Alimentação";
    if (/uber|99|pop|taxi|posto|combustivel|gasolina/i.test(d)) return "Transporte";
    if (/farmacia|drogaria|hosp|saude|unimed|odonto/i.test(d)) return "Saúde";
    if (/curso|faculdade|escola|estudos|educacao|udemy|alura/i.test(d)) return "Estudos";
    if (/fatura|pagamento fatura|cartao credito/i.test(d)) return "Fatura";
    if (/game|jogos|lazer|netflix|spotify|soccer|arena/i.test(d)) return "Lazer";
    return "Outros";
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
        if (columns.length < 3) return;

        // CAPTURA DE DATA: Coluna 0 (Ex: 24/01/2026)
        const rawDate = columns[0]?.trim();
        const rawValue = columns[1]?.trim() || "0";
        const description = columns[columns.length - 1]?.trim() || "Importado via Planilha";

        const numericStr = rawValue.replace(/[^\d,.-]/g, '').replace(',', '.');
        const numericValue = parseFloat(numericStr);

        if (isNaN(numericValue)) return;

        // CONVERSÃO DE DATA: Transforma DD/MM/YYYY em objeto Date válido
        let finalDateISO = new Date().toISOString();
        if (rawDate) {
          const parts = rawDate.split('/');
          if (parts.length === 3) {
            const dateObj = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]), 12, 0, 0);
            if (!isNaN(dateObj.getTime())) {
              finalDateISO = dateObj.toISOString();
            }
          }
        }

        const type = numericValue < 0 ? 'expense' : 'income';
        const amount = Math.abs(numericValue);
        const category = getCategory(description);

        createTransaction.mutate({
          description,
          amount,
          category,
          type,
          date: finalDateISO // Agora utiliza a data real do extrato
        });
        count++;
      });
      alert(`Mestre, ${count} operações foram sincronizadas temporalmente.`);
    };
    reader.readAsText(file);
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      }).format(date);
    } catch (e) { return "Data Pendente"; }
  };

  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32">
      <header className="flex justify-between items-end pb-4 border-b border-slate-200 dark:border-slate-800 px-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
            <span className="text-slate-900 dark:text-white transition-colors">NEXUS</span>{" "}
            <span className="text-blue-600">EXTRATO</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">Sincronização de Histórico</p>
        </div>
        <div className="flex gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all">
            <FileUp className="w-4 h-4" />
          </button>
          <button 
             onClick={() => confirm("Aniquilar registros, Mestre?") && transactions.forEach(t => deleteTransaction.mutate(t.id))}
             className="p-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="space-y-3 px-4">
        {sorted.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px]">
            <p className="text-slate-300 dark:text-slate-700 italic uppercase font-black text-[10px] tracking-widest">
              O banco de dados aguarda ordens, Mestre.
            </p>
          </div>
        ) : (
          sorted.map((t) => {
            const config = categoryConfig[t.category] || categoryConfig["Outros"];
            const Icon = config.icon;

            return (
              <div key={t.id} className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm hover:border-blue-500/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-2xl ${config.color} transition-colors`}>
                    <Icon className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  
                  <div className="max-w-[200px]">
                    <p className="font-bold text-slate-900 dark:text-white text-sm tracking-tight truncate leading-tight uppercase">
                      {t.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                       <p className={`text-[9px] uppercase font-black tracking-widest ${config.color.split(' ')[0]}`}>
                        {t.category}
                      </p>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                        <Clock className="w-2.5 h-2.5" />
                        <p className="text-[9px] uppercase font-black tracking-widest">
                          {formatDateTime(t.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-black text-[15px] tracking-tighter ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                  </p>
                  <button 
                    onClick={() => deleteTransaction.mutate(t.id)}
                    className="text-[9px] font-bold text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-auto"
                  >
                    <Trash2 className="w-3 h-3" /> Remover
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
