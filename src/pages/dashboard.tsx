import { useState } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { PieChart, BarChart3, Calendar, ChevronDown } from "lucide-react";
// Importaremos bibliotecas simples de gráfico se o Senhor desejar, 
// por ora, preparei a estrutura de visualização de elite.

export default function Dashboard() {
  const { data: transactions = [] } = useTransactions();
  const [timeRange, setTimeRange] = useState("30"); // dias
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Seletor de Inteligência Temporal */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button 
            onClick={() => setChartType("pie")}
            className={`p-2 rounded-xl transition-all ${chartType === 'pie' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}
          >
            <PieChart className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setChartType("bar")}
            className={`p-2 rounded-xl transition-all ${chartType === 'bar' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}
          >
            <BarChart3 className="w-5 h-5" />
          </button>
        </div>

        <div className="relative group">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-white border border-slate-100 px-4 py-2 pr-10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm outline-none focus:ring-2 ring-blue-100 transition-all cursor-pointer"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="365">Últimos 12 meses</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Container do Gráfico Premium */}
      <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Distribuição de Gastos</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Análise por Categoria</p>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        {/* Visualização de Dados */}
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-50 rounded-[32px]">
          {/* Aqui entrará o componente do Recharts ou gráfico customizado */}
          <div className="text-center">
             <p className="text-slate-300 italic font-black text-[10px] uppercase tracking-[0.3em]">
               Renderizando Gráfico {chartType === 'pie' ? 'Circular' : 'Normal'}...
             </p>
             <p className="text-[9px] text-slate-200 mt-1 uppercase font-bold">Filtro: {timeRange} Dias</p>
          </div>
        </div>

        {/* Legendas de Elite */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Alimentação</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Saúde</span>
          </div>
        </div>
      </section>
    </div>
  );
}
