import { useTransactions } from "@/hooks/use-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

export default function Dashboard() {
  const { data: transactions = [] } = useTransactions();
  const expenses = transactions.filter(t => t.type === 'expense');
  
  const categories = expenses.reduce((acc: Record<string, number>, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const total = Object.values(categories).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-white italic">NEXUS <span className="text-blue-500">ANALYTICS</span></h2>

      <Card className="bg-slate-900 border-slate-800 rounded-[24px]">
        <CardHeader>
          <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gastos por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(categories).map(([name, value]) => (
            <div key={name} className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold uppercase text-slate-300">
                <span>{name}</span>
                <span className="text-blue-400">{formatCurrency(value)}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600" 
                  style={{ width: `${(value / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {expenses.length === 0 && <p className="text-slate-600 text-center py-4">Sem dados, mestre.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
