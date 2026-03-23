import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { TrendingUp, Wallet, ArrowDownCircle, PieChart, BarChart3, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export default function Dashboard() {
  const { data: transactions = [] } = useTransactions();
  const [viewType, setViewType] = useState<"pie" | "bar">("pie");
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");

  // --- FILTRO DE PERÍODO (O SONHO DO MESTRE) ---
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const stats = useMemo(() => {
    let totalExpenses = 0;
    let totalIncomes = 0;
    const categoryData: Record<string, number> = {};

    // Filtragem por Período e Cálculo de Totais
    const filtered = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    filtered.forEach(t => {
      const amount = Number(t.amount);
      if (t.type === 'expense' || t.type === 'despesa') {
        totalExpenses += amount;
        if (filter === 'expense') categoryData[t.category] = (categoryData[t.category] || 0) + amount;
      } else {
        totalIncomes += amount;
        if (filter === 'income') categoryData[t.category] = (categoryData[t.category] || 0) + amount;
      }
    });

    // Lógica do Gráfico Unificado (Sem fragmentação do vermelho)
    if (filter === 'all') {
      const total = totalIncomes + totalExpenses;
      const chartData = [
        { name: "Entradas", value: totalIncomes, color: "#10b981", percentage: total > 0 ? (totalIncomes / total) * 100 : 0 },
        { name: "Saídas", value: totalExpenses, color: "#ef4444", percentage: total > 0 ? (totalExpenses / total) * 100 : 0 }
      ].filter(item => item.value > 0); // Remove fatias zeradas para manter o gráfico limpo

      return { chartData, totalExpenses, totalIncomes, displayTotal: totalIncomes - totalExpenses };
    }

    const currentTotal = filter === 'expense' ? totalExpenses : totalIncomes;
    const chartData = Object.entries(categoryData).map(([name, value]) => ({
      name,
      value,
      color: filter === 'expense' ? "#f43f5e" : "#10b981",
      percentage: currentTotal > 0 ? (value / currentTotal) * 100 : 0
    })).sort((a, b) => b.value - a.value);

    return { chartData, totalExpenses, totalIncomes, displayTotal: currentTotal };
  }, [transactions, filter, selectedMonth, selectedYear]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-32 px-4">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
            <span className="text-slate-900 dark:text-white">NEXUS</span>{" "}
            <span className="text-blue-600">ANALYTICS</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">Visão Geral do Império</p>
        </div>

        {/* SELETOR DE PERÍODO */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <Calendar className="w-3 h-3 text-blue-600 ml-1" />
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer text-slate-600 dark:text-slate-300"
          >
            {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m, i) => (
              <option key={m} value={i} className="bg-slate-900">{m}</option>
            ))}
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer text-slate-600 dark:text-slate-300 pr-1"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y} className="bg-slate-900">{y}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-[28px]">
          <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest block mb-1">Entradas</span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 italic">{formatCurrency(stats.totalIncomes)}</p>
        </div>
        <div className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-[28px]">
          <span className="text-[8px] font-black uppercase text-rose-500 tracking-widest block mb-1">Saídas</span>
          <p className="text-xl font-black text-rose-600 dark:text-rose-400 italic">{formatCurrency(stats.totalExpenses)}</p>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl transition-all">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
              {filter === 'all' ? 'Balanço Unificado' : filter === 'expense' ? 'Distribuição de Gastos' : 'Origem dos Ganhos'}
            </h2>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button onClick={() => setViewType("pie")} className={`p-1.5 rounded-lg ${viewType === "pie" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400"}`}><PieChart className="w-3.5 h-3.5" /></button>
            <button onClick={() => setViewType("bar")} className={`p-1.5 rounded-lg ${viewType === "bar" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400"}`}><BarChart3 className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        <div className="flex gap-2 justify-center mb-8">
          {['all', 'expense', 'income'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt as any)}
              className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                filter === opt ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}
            >
              {opt === 'all' ? 'Geral' : opt === 'expense' ? 'Gastos' : 'Ganhos'}
            </button>
          ))}
        </div>

        <div className="min-h-[250px] flex items-center justify-center">
          {stats.chartData.length > 0 ? (
            viewType === "pie" ? (
              <div className="relative w-56 h-56">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {stats.chartData.reduce((acc, item, i) => {
                    const strokeDash = `${item.percentage} ${100 - item.percentage}`;
                    acc.elements.push(
                      <circle
                        key={item.name}
                        cx="50" cy="50" r="40"
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth="14"
                        strokeDasharray={strokeDash}
                        strokeDashoffset={-acc.current}
                        className="transition-all duration-1000 ease-out"
                        strokeLinecap={item.percentage > 2 ? "round" : "butt"}
                      />
                    );
                    acc.current += item.percentage;
                    return acc;
                  }, { elements: [] as any[], current: 0 }).elements}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {filter === 'all' ? 'Saldo Líquido' : 'Total'}
                  </span>
                  <span className={`text-sm font-black italic tracking-tighter ${stats.displayTotal >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-500'}`}>
                    {formatCurrency(stats.displayTotal)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-5">
                {stats.chartData.map((item) => (
                  <div key={item.name} className="group">
                    <div className="flex justify-between text-[10px] font-black uppercase mb-1.5">
                      <span className="text-slate-500 group-hover:text-blue-500 transition-colors">{item.name}</span>
                      <span className="text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-10">
              <p className="text-[10px] font-black uppercase text-slate-300 italic tracking-[0.2em]">O banco de dados está vazio para este período, Mestre.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
