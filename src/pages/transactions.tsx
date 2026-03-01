import { useState } from "react";
import { Layout } from "@/components/layout";
import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions";
import { formatCurrency, formatDate } from "@/lib/format";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  MoreVertical,
  Trash2,
  Receipt
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  if (isLoading) return <Layout><div className="p-8 text-center">Carregando...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Histórico</h1>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar..." 
              className="pl-9 bg-white rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          {filteredTransactions.length === 0 ? (
            <div className="p-20 text-center text-slate-400">
              <Receipt className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Nenhuma transação encontrada.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {tx.type === 'income' ? <ArrowUpRight /> : <ArrowDownRight />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{tx.description}</p>
                      <p className="text-xs text-slate-500">{formatDate(tx.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className={`font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatCurrency(tx.amount)}
                    </p>
                    <button onClick={() => handleDelete(tx.id)} className="p-2 text-slate-300 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
