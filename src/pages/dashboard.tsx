import { useTransactions } from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/format";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";

export default function Dashboard() {
  const { data: transactions = [] } = useTransactions();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalBalance = income - expenses;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Card de Saldo Principal */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <p className="text-slate-400 font-medium mb-2">Saldo Total</p>
          <h2 className="text-5xl font-bold tracking-tight">
            {formatCurrency(totalBalance)}
          </h2>
        </div>
        <Wallet className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/5 rotate-12" />
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
            <ArrowUpCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Receitas</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(income)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
            <ArrowDownCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Despesas</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(expenses)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
