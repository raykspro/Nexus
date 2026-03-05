import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions";
import { formatCurrency, formatDate } from "@/lib/format";
import { Trash2, ReceiptText } from "lucide-react";

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-white italic">HISTÓRICO</h1>
        <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full uppercase">
          {transactions.length} Itens
        </span>
      </header>

      <div className="space-y-3 pb-24">
        {sortedTransactions.map((t) => (
          <div key={t.id} className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={`w-1 h-10 rounded-full ${t.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <div>
                <p className="font-bold text-slate-100 text-sm">{t.description}</p>
                <p className="text-[10px] text-slate-500 uppercase font-black">{t.category}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className={`font-black text-sm ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </p>
                <p className="text-[9px] text-slate-600 font-bold">{formatDate(t.date)}</p>
              </div>
              <button 
                onClick={() => confirm("Confirmar exclusão?") && deleteTransaction.mutate(t.id)}
                className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
