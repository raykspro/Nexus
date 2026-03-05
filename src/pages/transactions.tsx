import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/format";
import { 
  Utensils, 
  Car, 
  HeartPulse, 
  Wallet,
  Banknote,
  ArrowDownLeft,
  LucideIcon,
  Trash2,
  CreditCard,
  Gamepad2,
  GraduationCap,
  LayoutGrid,
  Clock
} from "lucide-react";

const categoryConfig: Record<string, { icon: LucideIcon }> = {
  "Alimentação": { icon: Utensils },
  "Transporte": { icon: Car },
  "Saúde": { icon: HeartPulse },
  "Salário": { icon: Wallet },
  "Investimento": { icon: Banknote },
  "Fatura": { icon: CreditCard },
  "Lazer": { icon: Gamepad2 },
  "Estudos": { icon: GraduationCap },
  "Outros": { icon: LayoutGrid },
};

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  // FUNÇÃO DE ELITE: Captura o momento exato com data e hora
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date).replace(',', ' •');
    } catch (e) {
      return "Data Pendente";
    }
  };

  const sorted = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32">
      <header className="flex justify-between items-end pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          {/* IDENTIDADE NEXUS: Nome em Azul, Extrato em cor base */}
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">
            <span className="text-blue-600">NEXUS</span>{" "}
            <span className="text-slate-900 dark:text-white">EXTRATO</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Registros de Operações</p>
        </div>
        <span className="text-[10px] font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200 dark:border-slate-700">
          {transactions.length} Itens
        </span>
      </header>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px] py-16 text-center">
            <p className="text-slate-300 dark:text-slate-700 italic uppercase font-black text-[10px] tracking-widest">Cofre vazio, mestre.</p>
          </div>
        ) : (
          sorted.map((t) => {
            const config = categoryConfig[t.category] || { icon: ArrowDownLeft };
            const Icon = config.icon;

            return (
              <div key={t.id} className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm group hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                    <Icon className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">{t.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                       <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">
                        {t.category}
                      </p>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">
                          {formatDateTime(t.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-black text-sm tracking-tighter ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
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
