import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions";
import { formatCurrency, formatDate } from "@/lib/format";

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  const handleDelete = (id: string) => {
    if (confirm("Senhor, deseja deletar este registro?")) {
      deleteTransaction.mutate(id);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-black text-white italic">HISTÓRICO</h1>
      <div className="space-y-3">
        {transactions.map((t) => (
          <div key={t.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-100">{t.description}</p>
              <p className="text-[10px] text-slate-500 uppercase">{t.category} • {formatDate(t.date)}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className={`font-black ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-500'}`}>
                {formatCurrency(t.amount)}
              </p>
              <button onClick={() => handleDelete(t.id)} className="text-rose-500 font-bold text-xs">
                DEL
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
