import { useTransactions } from "@/hooks/use-transactions";
import { formatCurrency, formatDate } from "@/lib/format";
import { 
  Utensils, 
  PartyPopper, 
  PiggyBank, 
  Repeat, 
  Car, 
  Layers, 
  HeartPulse, 
  Wallet,
  CreditCard,
  Banknote,
  Coins,
  ArrowDownLeft,
  LucideIcon
} from "lucide-react";

// Mapeamento de ícones com tipagem LucideIcon para evitar alertas de build
const categoryConfig: Record<string, { icon: LucideIcon, color: string }> = {
  "Alimentação": { icon: Utensils, color: "text-orange-400 bg-orange-400/10" },
  "Lazer": { icon: PartyPopper, color: "text-purple-400 bg-purple-400/10" },
  "Reservado": { icon: PiggyBank, color: "text-sky-400 bg-sky-400/10" },
  "Assinatura": { icon: Repeat, color: "text-indigo-400 bg-indigo-400/10" },
  "Transporte": { icon: Car, color: "text-cyan-400 bg-cyan-400/10" },
  "Parcelamento": { icon: Layers, color: "text-yellow-400 bg-yellow-400/10" },
  "Cuidados Pessoais": { icon: HeartPulse, color: "text-pink-400 bg-pink-400/10" },
  "Salário": { icon: Wallet, color: "text-emerald-400 bg-emerald-400/10" },
  "Investimento": { icon: Banknote, color: "text-blue-500 bg-blue-500/10" },
  "Extra": { icon: Coins, color: "text-amber-400 bg-amber-400/10" },
};

const methodIcons: Record<string, LucideIcon> = {
  "Pix": Coins,
  "Cartão de Crédito": CreditCard,
  "Cartão de Débito": CreditCard,
  "Dinheiro": Banknote,
};

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();

  // Ordenação cronológica: do mais recente para o mais antigo
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Registro de Operações</p>
          <h1 className="text-3xl font-black text-white italic tracking-tighter">HISTÓRICO</h1>
        </div>
        <span className="bg-blue-600/10 text-blue-400 border border-blue-600/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-1">
          {transactions.length} Operações
        </span>
      </header>

      <div className="space-y-3">
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-[32px] border border-dashed border-slate-800">
            <p className="text-slate-600 font-bold text-xs uppercase italic">Nenhum rastro financeiro encontrado, mestre.</p>
          </div>
        ) : (
          sortedTransactions.map((t) => {
            const config = categoryConfig[t.category] || { icon: ArrowDownLeft, color: "text-slate-400 bg-slate-400/10" };
            const Icon = config.icon;
            const MethodIcon = methodIcons[t.paymentMethod] || CreditCard;

            return (
              <div key={t.id} className="group bg-slate-900/40 hover:bg-slate-900/80 p-4 rounded-[24px] border border-slate-800/50 hover:border-blue-900/30 transition-all active:scale-[0.98]">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className={`p-3 rounded-2xl ${config.color} transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.3)]`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div>
                      <p className="font-bold text-slate-100 text-sm leading-tight group-hover:text-white transition-colors">{t.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider flex items-center gap-1 bg-slate-800/50 px-2 py-0.5 rounded-md">
                          <MethodIcon className="w-2.5 h-2.5" />
                          {t.paymentMethod}
                        </span>
                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-wider">
                          {t.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-black text-base tracking-tight ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-500'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </p>
                    <p className="text-[9px] font-bold text-slate-600 mt-0.5 uppercase">
                      {formatDate(t.date)}
                    </p>
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
