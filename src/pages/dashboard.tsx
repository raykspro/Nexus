import { useMemo } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { TrendingUp, Wallet, ArrowDownCircle } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export default function Dashboard() {
  const { data: transactions = [] } = useTransactions();

  // Lógica de Inteligência: Processamento de Dados Nativo
  const stats = useMemo(() => {
    const categories: Record<string, number> = {};
    let totalExpenses = 0;
    let totalIncomes = 0;

    transactions.forEach(t => {
      if (t.type === 'expense') {
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        {/* CORREÇÃO CRÍTICA: NEXUS em Azul, Analytics em Branco/Preto */}
        <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
          <span className="text-blue-600 dark:text-blue-500">NEXUS</span>{" "}
          <span className="text-slate-900 dark:text-white">ANALYTICS</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">Visão Geral do Império</p>
      </header>

      {/* Cards de Resumo Rápido */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-600/10 border border-emerald-600/20 p-4 rounded-[24px]">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-3 h-3 text-emerald-600" />
            <span className="text-[8px] font-black uppercase text-emerald-600 tracking-widest">Entradas</span>
          </div>
          <p className="text-lg font-black text-emerald-600 tracking-tighter">{formatCurrency(stats.totalIncomes)}</p>
        </div>
        <div className="bg-rose-600/10 border border-rose-600/20 p-4 rounded-[24px]">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownCircle className="w-3 h-3 text-rose-600" />
            <span className="text-[8px] font-black uppercase text-rose-600 tracking-widest">Saídas</span>
          </div>
          <p className="text-lg font-black text-rose-600 tracking-tighter">{formatCurrency(stats.totalExpenses)}</p>
        </div>
      </div>

      {/* Gráfico de Barras Nativo (Gastos por Categoria) */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
        <div className="mb-8 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Distribuição de Gastos</h2>
        </div>

        <div className="space-y-6">
          {stats.chartData.length > 0 ? (
            stats.chartData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">{item.name}</span>
                  <span className="text-[11px] font-black text-slate-900 dark:text-white italic">{formatCurrency(item.value)}</span>
                </div>
                {/* Barra de Progresso Nexus */}
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Aguardando dados, Mestre...</p>
            </div>
          )}
        </div>
      </section>

      <div className="pt-4 flex justify-center">
        <AddTransactionDialog />
      </div>
    </div>
  );
}
