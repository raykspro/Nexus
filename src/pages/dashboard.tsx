import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { 
  PieChart as PieIcon, 
  BarChart3, 
  Calendar, 
  ChevronDown,
  TrendingUp 
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from "recharts";

export default function Dashboard() {
  const { data: transactions = [] } = useTransactions();
  const [timeRange, setTimeRange] = useState("30");
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  // Filtro de Inteligência Temporal
  const filteredData = useMemo(() => {
    const now = new Date();
    const days = parseInt(timeRange);
    
    const totals = transactions
      .filter(t => t.type === 'expense')
      .filter(t => {
        const tDate = new Date(t.date);
        const diff = (now.getTime() - tDate.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= days;
      })
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [transactions, timeRange]);

  const COLORS = ["#0F172A", "#334155", "#64748B", "#94A3B8", "#CBD5E1"];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-start">
        <div>
          {/* Sincronia Total de Cores no Título */}
          <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">
            Nexus <span className="text-blue-600 dark:text-blue-500">Analytics</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Gestão de Ativos</p>
        </div>
        <div className="relative">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className={`appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-slate-900 transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:focus:border-blue-500`}
          >
            <option value="30">30 Dias</option>
            <option value="90">90 Dias</option>
            <option value="365">12 Meses</option>
          </select>
          <ChevronDown className="w-3 h-3 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-600" />
        </div>
      </header>

      {/* Seletor de Tipo de Gráfico */}
      <div className="flex gap-2">
        <button onClick={() => setChartType("pie")} className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${chartType === 'pie' ? 'bg-slate-900 text-white border-slate-900 dark:bg-blue-600 dark:border-blue-600' : 'bg-white text-slate-400 border-slate-100 dark:bg-slate-950 dark:text-slate-600 dark:border-slate-800'}`}>
          <PieIcon className="w-4 h-4" /> Pizza
        </button>
        <button onClick={() => setChartType("bar")} className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${chartType === 'bar' ? 'bg-slate-900 text-white border-slate-900 dark:bg-blue-600 dark:border-blue-600' : 'bg-white text-slate-400 border-slate-100 dark:bg-slate-950 dark:text-slate-600 dark:border-slate-800'}`}>
          <BarChart3 className="w-4 h-4" /> Barras
        </button>
      </div>

      {/* Gráfico Principal P&B Premium */}
      <section className={`bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm min-h-[350px] flex flex-col dark:bg-slate-900 dark:border-slate-800`}>
        <div className="mb-6 flex items-center gap-2">
           <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-500" />
           <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest">Fluxo de Saída por Categoria</span>
        </div>

        {/* Campo do Gráfico P&B Premium */}
        <div className="flex-1 w-full min-h-[250px] bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-100 dark:bg-slate-950 dark:border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "pie" ? (
              <PieChart>
                <Pie data={filteredData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {filteredData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} />
              </PieChart>
            ) : (
              <BarChart data={filteredData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94A3B8'}} />
                <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '16px', border: 'none', shadow: 'none' }} />
                <Bar dataKey="value" fill="#0F172A" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </section>

      {/* Botões de Ação Restaurados */}
      <div className="fixed bottom-28 left-0 right-0 px-6 max-w-md mx-auto z-50">
        <AddTransactionDialog />
      </div>
    </div>
  );
}
