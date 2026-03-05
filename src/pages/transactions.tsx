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
  LucideIcon
} from "lucide-react";

// Mapeamento de ícones táticos para categorias
const categoryConfig: Record<string, { icon: LucideIcon, color: string }> = {
  "Alimentação": { icon: Utensils, color: "text-orange-400" },
  "Transporte": { icon: Car, color: "text-cyan-400" },
  "Saúde": { icon: HeartPulse, color: "text-pink-400" },
  "Salário": { icon: Wallet, color: "text-emerald-400" },
  "Investimento": { icon: Banknote, color: "text-blue-500" },
  "Extra": { icon: Coins, color: "text-amber-400" },
};

// Ícones para os métodos de pagamento
const methodIcons: Record<string, LucideIcon> = {
  "Pix": Coins,
  "Cartão de Crédito": Banknote,
  "Dinheiro": Banknote,
};

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  const sorted = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-4 space-y-6 pb-24 animate-in fade-in duration-500">
      <header className="flex justify-between items-end border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-black text-white italic tracking-tighter">HISTÓRICO</h1>
        <span className="text-[10px] font-black text-blue-400 bg-blue-600/10 px-3 py-1 rounded-full uppercase tracking-widest">
          {transactions.length} Itens
        </span>
      </header>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <p className="text-center text-slate-600 py-10 italic uppercase font-black text-[10px]">Cofre vazio, mestre.</p>
        ) : (
          sorted.map((t) => {
            const config = categoryConfig[t.category] || { icon: ArrowDownLeft, color: "text-slate-400" };
            const Icon = config.icon;
            const MethodIcon = methodIcons[t.paymentMethod] || Coins;

            return (
              <div key={t.id} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  {/* Categoria com ícone e cor */}
                  <div className={`p-3 rounded-2xl bg-slate-800/50 ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-100 text-sm">{t.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">
                        {t.category} • {formatDate(t.date)}
                      </p>
                      {/* Método de pagamento com ícone sutil */}
                      <span className="text-[9px] text-slate-600 flex items-center gap-1">
                        <MethodIcon className="w-3 h-3" />
                        {t.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-black text-sm tracking-tight ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-500'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </p>
                    <button 
                      onClick={() => confirm("Aniquilar registro?") && deleteTransaction.mutate(t.id)}
                      className="text-rose-600 font-black text-[8px] uppercase tracking-tighter mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remover
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
