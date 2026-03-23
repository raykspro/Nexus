import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { TrendingUp, Wallet, ArrowDownCircle, PieChart as PieIcon, BarChart3, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/format";
// Importação dos componentes de gráfico robustos
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";

// Função para renderizar a fatia ativa com destaque e texto central
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#94a3b8" className="text-[10px] font-black uppercase tracking-[0.2em]">
        {payload.name}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="white" className="text-xs font-black italic tracking-tighter">
        {formatCurrency(value)}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function Dashboard() {
  const { data: transactions = [] } = useTransactions();
  const [viewType, setViewType] = useState<"pie" | "bar">("pie");
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const stats = useMemo(() => {
    let totalExpenses = 0;
    let totalIncomes = 0;
    const categoryData: Record<string, number> = {};

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

    if (filter === 'all') {
      const chartData = [
        { name: "Entradas", value: totalIncomes, color: "#10b981" },
        { name: "Saídas", value: totalExpenses, color: "#ef4444" }
      ].filter(item => item.value > 0);
      return { chartData, totalExpenses, totalIncomes, displayTotal: totalIncomes - totalExpenses };
    }

    const currentTotal = filter === 'expense' ? totalExpenses : totalIncomes;
    const chartData = Object.entries(categoryData).map(([name, value]) => ({
      name,
      value,
      color: filter === 'expense' ? "#3b82f6" : "#10b981",
    })).sort((a, b) => b.value - a.value);

    return { chartData, totalExpenses, totalIncomes, displayTotal: currentTotal };
  }, [transactions, filter, selectedMonth, selectedYear]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-32 px-4 bg-slate-950 min-h-screen text-slate-200">
      <header className="flex justify-between items-start pt-8">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
            <span className="text-white">NEXUS</span>{" "}
            <span className="text-blue-600">ANALYTICS</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Visão Geral do Império</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <Calendar className="w-3 h-3 text-blue-600 ml-1" />
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer text-slate-300"
          >
            {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m, i) => (
              <option key={m} value={i} className="bg-slate-900">{m}</option>
            ))}
          </select>
        </div>
      </header>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-[28px]">
          <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest block mb-1">Entradas</span>
          <p className="text-xl font-black text-emerald-400 italic">{formatCurrency(stats.totalIncomes)}</p>
        </div>
        <div className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-[28px]">
          <span className="text-[8px] font-black uppercase text-rose-500 tracking-widest block mb-1">Saídas</span>
          <p className="text-xl font-black text-rose-400 italic">{formatCurrency(stats.totalExpenses)}</p>
        </div>
      </div>

      <section className="bg-slate-900 p-6 rounded-[32px] border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-white">
              {filter === 'all' ? 'Balanço Unificado' : filter === 'expense' ? 'Gastos por Categoria' : 'Ganhos por Categoria'}
            </h2>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-xl">
            <button onClick={() => setViewType("pie")} className={`p-1.5 rounded-lg ${viewType === "pie" ? "bg-slate-700 text-blue-400 shadow-lg" : "text-slate-500"}`}><PieIcon className="w-3.5 h-3.5" /></button>
            <button onClick={() => setViewType("bar")} className={`p-1.5 rounded-lg ${viewType === "bar" ? "bg-slate-700 text-blue-400 shadow-lg" : "text-slate-500"}`}><BarChart3 className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {/* SELETOR DE FILTRO */}
        <div className="flex gap-2 justify-center mb-8">
          {['all', 'expense', 'income'].map((opt) => (
            <button
              key={opt}
              onClick={() => { setFilter(opt as any); setActiveIndex(null); }}
              className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                filter === opt ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-800 text-slate-500"
              }`}
            >
              {opt === 'all' ? 'Geral' : opt === 'expense' ? 'Gastos' : 'Ganhos'}
            </button>
          ))}
        </div>

        {/* ÁREA DO GRÁFICO */}
        <div className="h-[300px] w-full flex items-center justify-center">
          {stats.chartData.length > 0 ? (
            viewType === "pie" ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex ?? undefined}
                    activeShape={renderActiveShape}
                    data={stats.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={95}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onClick={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    stroke="none"
                    paddingAngle={filter === 'all' ? 2 : 5}
                  >
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} className="outline-none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full space-y-5 px-2">
                {stats.chartData.map((item) => (
                  <div key={item.name} className="group">
                    <div className="flex justify-between text-[10px] font-black uppercase mb-1.5">
                      <span className="text-slate-500 group-hover:text-blue-400 transition-colors">{item.name}</span>
                      <span className="text-white">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ 
                          width: `${(item.value / stats.chartData.reduce((a,b) => a + b.value, 0)) * 100}%`, 
                          backgroundColor: item.color 
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-[10px] font-black uppercase text-slate-600 italic tracking-widest">O banco de dados está vazio, Mestre.</p>
          )}
        </div>
      </section>
    </div>
  );
}
