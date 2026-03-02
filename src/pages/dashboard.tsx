import { useState } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { formatCurrency } from "@/lib/format";

const COLORS = ['#0ea5e9', '#6366f1', '#f59e0b', '#ec4899', '#10b981', '#f43f5e', '#8b5cf6'];

export default function Dashboard() {
  const { data: transactions = [] } = useTransactions();
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("week");

  // Lógica para o Gráfico de Barras (Temporal)
  const getBarData = () => {
    const now = new Date();
    const data: Record<string, number> = {};
    
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const date = new Date(t.date);
      let key = "";
      
      if (timeframe === "week") key = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      else if (timeframe === "month") key = date.toLocaleDateString('pt-BR', { day: '2-digit' });
      else key = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      data[key] = (data[key] || 0) + t.amount;
    });

    return Object.entries(data).map(([name, total]) => ({ name, total }));
  };

  // Lógica para o Gráfico de Pizza (Categorias)
  const getPieData = () => {
    const categories: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Visão Geral</p>
          <h2 className="text-3xl font-black text-white italic">ANALYTICS</h2>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['week', 'month', 'year'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                timeframe === t ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t === 'week' ? 'Semana' : t === 'month' ? 'Mês' : 'Ano'}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico de Barras - Gastos no Tempo */}
      <Card className="bg-slate-900/50 border-slate-800 rounded-[24px] overflow-hidden backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider">Fluxo de Gastos</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getBarData()}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                cursor={{ fill: '#1e293b', radius: 8 }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="total" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Distribuição por Categoria */}
      <Card className="bg-slate-900/50 border-slate-800 rounded-[24px] overflow-hidden backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider">Distribuição por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getPieData()}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {getPieData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {getPieData().map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[10px] font-bold text-slate-400 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
