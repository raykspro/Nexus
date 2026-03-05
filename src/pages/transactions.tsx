import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions";
import { formatCurrency, formatDate } from "@/lib/format";

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  const sorted = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="flex justify-between items-end border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-black text-white italic tracking-tighter">HISTÓRICO</h1>
        <span className="text-[10px] font-black text-blue-400 bg-blue-600/10 px-3 py-1 rounded-full uppercase tracking-widest">
          {transactions.length} Itens
        </span>
      </header>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <p className="text-center text-slate-600 py-10 italic uppercase font-black text-[10px]">Cofre vazio, mestre.</p>
        ) : (
          sorted.map((t) => (
            <div key={t.id} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`w-1 h-8 rounded-full ${t.type === 'income' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]'}`} />
                <div>
                  <p className="font-bold text-slate-100 text-sm">{t.description}</p>
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">
                    {t.category} • {formatDate(t.date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`font-black text-sm ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                  </p>
                  <button 
                    onClick={() => confirm("Aniquilar registro?") && deleteTransaction.mutate(t.id)}
                    className="text-rose-600 font-black text-[8px] uppercase tracking-tighter mt-1 hover:text-rose-400"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
