import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { TrendingUp, Wallet, ArrowDownCircle, PieChart, BarChart3, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export default function Dashboard() {
  const { data: transactions = [] } = useTransactions();
  const [viewType, setViewType] = useState<"pie" | "bar">("pie");
  
  // NOVO ESTADO DE FILTRO: 'all' (Padrão), 'expense' ou 'income'
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");

  const stats = useMemo(() => {
    let totalExpenses = 0;
    let totalIncomes = 0;
    const categoryData: Record<string, number> = {};

    transactions.forEach(t => {
      const amount = Number(t.amount);
      if (t.type === 'expense' || t.type === 'despesa') {
        totalExpenses += amount;
        if (filter === 'expense') categoryData[t.category] = (categoryData[t.category] || 0) + amount;
      } else {
        totalIncomes += amount;
        if (filter === 'income') categoryData[t.category] = (categoryData[t.category] || 0) + amount;
      }
    });

    // Lógica do Gráfico "Geral" (Ganhos vs Gastos)
    if (filter === 'all') {
      const total = totalIncomes + totalExpenses;
      const chartData = [
        { name: "Entradas", value: totalIncomes, color: "#10b981", percentage: total > 0 ? (totalIncomes / total) * 100 : 0 },
        { name: "Saídas", value: totalExpenses, color: "#ef4444", percentage: total > 0 ? (totalExpenses / total) * 100 : 0 }
      ];
      return { chartData, totalExpenses, totalIncomes, displayTotal: totalIncomes - totalExpenses };
    }

    // Lógica para Gastos ou Ganhos Individuais
    const currentTotal = filter === 'expense' ? totalExpenses : totalIncomes;
    const chartData = Object.entries(categoryData).map(([name, value]) => ({
      name,
      value,
      color: filter === 'expense' ? "#3b82f6" : "#10b981",
      percentage: currentTotal > 0 ? (value / currentTotal) * 100 : 0
    })).sort((a, b) => b.value - a.value);

    return { chartData, totalExpenses, totalIncomes, displayTotal: currentTotal };
  }, [transactions, filter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-32">
      <header>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
          <span className="text-slate-900 dark:text-white transition-colors">NEXUS</span>{" "}
          <span className="text-blue-600">ANALYTICS</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">Visão Geral do Império</p>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-[28px]">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-emerald-500 rounded-md"><Wallet className="w-3 h-3 text-white" /></div>
            <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">Entradas</span>
          </div>
          <p className="text-lg font-black text-emerald-500">{formatCurrency(stats.totalIncomes)}</p>
        </div>
        <div className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-[28px]">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-rose-500 rounded-md"><ArrowDownCircle className="w-3 h-3 text-white" /></div>
            <span className="text-[8px] font-black uppercase text-rose-500 tracking-widest">Saídas</span>
          </div>
          <p className="text-lg font-black text-rose-500">{formatCurrency(stats.totalExpenses)}</p>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl transition-all">
        {/* CABEÇALHO DO GRÁFICO COM SELETORES */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                {filter === 'all' ? 'Balanço Geral' : filter === 'expense' ? 'Distribuição de Gastos' : 'Origem dos Ganhos'}
              </h2>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button onClick={() => setViewType("pie")} className={`p-1.5 rounded-lg ${viewType === "pie" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400"}`}><PieChart className="w-3.5 h-3.5" /></button>
              <button onClick={() => setViewType("bar")} className={`p-1.5 rounded-lg ${viewType === "bar" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400"}`}><BarChart3 className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* SELETOR DE DADOS (PÍLULAS) - SIMPLES E EFICAZ */}
          <div className="flex gap-2 justify-center">
            {[
              { id: 'all', label: 'Geral' },
              { id: 'expense', label: 'Gastos' },
              { id: 'income', label: 'Ganhos' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFilter(opt.id as any)}
                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                  filter === opt.id 
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent" 
                  : "bg-transparent text-slate-400 border-slate-200 dark:border-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ÁREA DO GRÁFICO SVG */}
        <div className="min-h-[250px] flex items-center justify-center mt-4">
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
                        stroke={item.color || ["#2563eb", "#64748b", "#94a3b8", "#1e293b"][i % 4]}
                        strokeWidth="12"
                        strokeDasharray={strokeDash}
                        strokeDashoffset={-acc.current}
                        className="transition-all duration-700"
                      />
                    );
                    acc.current += item.percentage;
                    return acc;
                  }, { elements: [] as any[], current: 0 }).elements}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {filter === 'all' ? 'Saldo' : 'Total'}
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{formatCurrency(stats.displayTotal)}</span>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-4">
                {stats.chartData.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-[9px] font-black uppercase">
                      <span className="text-slate-500">{item.name}</span>
                      <span className="text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.percentage}%`, backgroundColor: item.color || '#2563eb' }} />
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-[10px] font-black uppercase text-slate-300 italic">Sem dados registrados, Mestre.</p>
          )}
        </div>
      </section>
    </div>
  );
}
