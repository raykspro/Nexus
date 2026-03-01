import { useState } from "react";
import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions";
import { formatCurrency, formatDate } from "@/lib/format";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Trash2,
  Receipt
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Transactions() {
  const { data: transactions = [], isLoading } = useTransactions();
  const deleteMutation = useDeleteTransaction();
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions
    .filter((t) => t.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = async (id: number) => {
    if (confirm("Mestre, tem certeza que deseja excluir esta movimentação?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-400">Carregando histórico, mestre...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white">Histórico</h1>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Buscar..." 
            className="pl-9 bg-slate-900 border-slate-800 text-white rounded-full focus:ring-blue-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        {filteredTransactions.length === 0 ? (
          <div className="p-20 text-center text-slate-500">
            <Receipt className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>Nenhuma transação encontrada.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-100">{tx.description}</p>
                    <p className="text-xs text-slate-500">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {formatCurrency(tx.amount)}
                  </p>
                  <button 
                    onClick={() => handleDelete(tx.id)} 
                    className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
