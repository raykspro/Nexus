import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions";
import { formatCurrency, formatDate } from "@/lib/format";

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  // Ordenação por data (mais recente primeiro)
  const sorted = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = (id: string) => {
    if (confirm("Senhor, deseja aniquilar este registro?")) {
      deleteTransaction.mutate(id);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24 animate-in fade-in duration-500">
      <header className="flex justify-between items-end border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-black text-white italic tracking-tighter">HISTÓRICO</h1>
        <span className="text-[10px] font-black text-blue-400 bg-blue-600/10 px-3 py-1 rounded-full uppercase">
          {transactions.length} Operações
        </span>
      </header>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <p className="text-center text-slate-600 py-10 italic">Cofre vazio, mestre.</p>
        ) : (
          sorted.map((t) => (
            <div key={t.id} className="bg-slate-900/60 p-4 rounded-[20px] border border-slate-800 flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className={`w-1.5 h-10 rounded-full ${t.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <div>
                  <p className="font-bold text-slate-100 text-sm">{t.description}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                    {t.category} • {formatDate(t.date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`font-black text-sm ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                  </p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase">{t.paymentMethod}</p>
                </div>
                <button 
                  onClick={() => handleDelete(t.id)}
                  className="bg-rose-500/10 p-2 rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-[10px] font-black uppercase"
                >
                  DEL
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
