import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions";
import { formatCurrency, formatDate } from "@/lib/format";
import { 
  Utensils, 
  Car, 
  HeartPulse, 
  Wallet,
  Banknote,
  Coins,
  ArrowDownLeft,
  LucideIcon,
  Trash2
} from "lucide-react";

const categoryConfig: Record<string, { icon: LucideIcon }> = {
  "Alimentação": { icon: Utensils },
  "Transporte": { icon: Car },
  "Saúde": { icon: HeartPulse },
  "Salário": { icon: Wallet },
  "Investimento": { icon: Banknote },
  "Extra": { icon: Coins },
};

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  const sorted = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">Histórico</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Registros de Operações</p>
        </div>
        <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200">
          {transactions.length} Itens
        </span>
      </header>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-100 rounded-[32px] py-16 text-center">
            <p className="text-slate-300 italic uppercase font-black text-[10px] tracking-widest">Cofre vazio, mestre.</p>
          </div>
        ) : (
          sorted.map((t) => {
            const config = categoryConfig[t.category] || { icon: ArrowDownLeft };
            const Icon = config.icon;

            return (
              <div key={t.id} className="bg-white p-4 rounded-[24px] border border-slate-200 flex justify-between items-center shadow-sm group hover:border-slate-400 transition-all">
                <div className="flex items-center gap-4">
                  {/* Ícone em P&B Sólido */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
                    <Icon className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm tracking-tight">{t.description}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-0.5">
                      {t.category} • {formatDate(t.date)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-black text-sm tracking-tighter ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </p>
                    <button 
                      onClick={() => confirm("Aniquilar registro, Mestre?") && deleteTransaction.mutate(t.id)}
                      className="text-[9px] font-black uppercase text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-auto"
                    >
                      <Trash2 className="w-3 h-3" /> Remover
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
