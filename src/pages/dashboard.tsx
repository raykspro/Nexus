import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { TrendingUp, Wallet, ArrowDownCircle, PieChart, BarChart3 } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export default function Dashboard() {
  const { data: transactions = [] } = useTransactions();
  const [viewType, setViewType] = useState<"pie" | "bar">("pie");

  const stats = useMemo(() => {
    const categories: Record<string, number> = {};
    let totalExpenses = 0;
    let totalIncomes = 0;

    transactions.forEach(t => {
      // Normalização para garantir que despesas sejam lidas corretamente
      if (t.type === 'expense' || t.type === 'despesa') {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
        totalExpenses += t.amount;
      } else {
        totalIncomes += t.amount;
      }
    });

    const chartData = Object.entries(categories)
      .map(([name, value]) => ({
        name,
        value,
        percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);

    return { chartData, totalExpenses, totalIncomes };
  }, [transactions]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-32">
      <header className="flex justify-between items-start">
  <div>
    {/* NOVA IDENTIDADE VISUAL: Nexus sólido, Analytics Azul Fixo */}
    <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
  <span className="text-slate-900 dark:text-white transition-colors">NEXUS</span>{" "}
  <span className="text-blue-600">ANALYTICS</span>
</h1>
    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">Visão Geral do Império</p>
  </div>
</header>
      {/* Cards de Poder Financeiro */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-600/10 border border-emerald-600/20 p-5 rounded-[28px] backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-600 rounded-lg">
              <Wallet className="w-3 h-3 text-white" />
            </div>
            <span className="text-[8px] font-black uppercase text-emerald-600 tracking-widest">Entradas</span>
          </div>
          <p className="text-xl font-black text-emerald-600 tracking-tighter">{formatCurrency(stats.totalIncomes)}</p>
        </div>
        
        <div className="bg-rose-600/10 border border-rose-600/20 p-5 rounded-[28px] backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-rose-600 rounded-lg">
              <ArrowDownCircle className="w-3 h-3 text-white" />
            </div>
            <span className="text-[8px] font-black uppercase text-rose-600 tracking-widest">Saídas</span>
          </div>
          <p className="text-xl font-black text-rose-600 tracking-tighter">{formatCurrency(stats.totalExpenses)}</p>
        </div>
      </div>

      {/* Container do Gráfico Nativo */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl transition-all">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Distribuição de Gastos</h2>
          </div>
          
          {/* Seletor de Visualização */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setViewType("pie")}
              className={`p-2 rounded-lg transition-all ${viewType === "pie" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400"}`}
            >
              <PieChart className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewType("bar")}
              className={`p-2 rounded-lg transition-all ${viewType === "bar" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400"}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="min-h-[250px] flex items-center justify-center">
          {stats.chartData.length > 0 ? (
            viewType === "pie" ? (
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {stats.chartData.reduce((acc, item, i) => {
                    const strokeDash = `${item.percentage} ${100 - item.percentage}`;
                    acc.elements.push(
                      <circle
                        key={item.name}
                        cx="50" cy="50" r="40"
                        fill="transparent"
                        stroke={["#2563eb", "#64748b", "#94a3b8", "#1e293b", "#3b82f6"][i % 5]}
                        strokeWidth="12"
                        strokeDasharray={strokeDash}
                        strokeDashoffset={-acc.current}
                        className="transition-all duration-1000"
                      />
                    );
                    acc.current += item.percentage;
                    return acc;
                  }, { elements: [] as any[], current: 0 }).elements}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(stats.totalExpenses)}</span>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-5">
                {stats.chartData.map((item, i) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                      <span className="text-slate-500">{item.name}</span>
                      <span className="text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center opacity-30 italic">
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Aguardando ordens e dados, Mestre...</p>
            </div>
          )}
        </div>
      </section>

      <div className="flex justify-center">
        <AddTransactionDialog />
      </div>
    </div>
  );
}