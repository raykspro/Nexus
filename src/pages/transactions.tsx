import { useState, useRef, useMemo } from "react";
import { useTransactions, useDeleteTransaction, useUpdateTransaction } from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/format";
import { 
  Utensils, Car, HeartPulse, Wallet, CreditCard, 
  Gamepad2, GraduationCap, LayoutGrid, FileUp, Trash2, X, Eye, Pencil, Check, Calendar, Banknote
} from "lucide-react";

const categoryConfig: Record<string, { icon: any, color: string }> = {
  "Alimentação": { icon: Utensils, color: "text-orange-400 bg-orange-950/50" },
  "Transporte": { icon: Car, color: "text-sky-400 bg-sky-950/50" },
  "Saúde": { icon: HeartPulse, color: "text-rose-400 bg-rose-950/50" },
  "Salário": { icon: Wallet, color: "text-emerald-400 bg-emerald-950/50" },
  "Fatura": { icon: CreditCard, color: "text-slate-400 bg-slate-800/50" },
  "Lazer": { icon: Gamepad2, color: "text-purple-400 bg-purple-950/50" },
  "Estudos": { icon: GraduationCap, color: "text-indigo-400 bg-indigo-950/50" },
  "Pix": { icon: Banknote, color: "text-cyan-400 bg-cyan-950/50" },
  "Débito": { icon: CreditCard, color: "text-amber-400 bg-amber-950/50" },
  "Outros": { icon: LayoutGrid, color: "text-slate-500 bg-slate-800/20" },
};

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const updateTransaction = useUpdateTransaction();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inspectingId, setInspectingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const sorted = useMemo(() => 
    ([...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())),
  [transactions]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32 px-4 bg-slate-950 min-h-screen text-white">
      <header className="flex justify-between items-end pb-4 border-b border-slate-800 pt-8">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
            NEXUS <span className="text-blue-600">EXTRATO</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Gestão de Comandos</p>
        </div>
        <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-slate-900 border border-slate-800 text-blue-500 rounded-xl">
          <FileUp className="w-5 h-5" />
          <input type="file" ref={fileInputRef} className="hidden" accept=".csv" />
        </button>
      </header>

      <div className="space-y-3">
        {sorted.map((t) => {
          const config = categoryConfig[t.category] || categoryConfig["Outros"];
          const Icon = config.icon;
          const isInspecting = inspectingId === t.id;

          return (
            <div key={t.id} className={`bg-slate-900/40 p-4 rounded-[28px] border transition-all duration-500 ${isInspecting ? 'border-blue-600/50 bg-slate-900 shadow-2xl scale-[1.02]' : 'border-slate-800'}`}>
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setInspectingId(isInspecting ? null : t.id)}>
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`p-3.5 rounded-2xl ${config.color} flex-shrink-0 shadow-inner`}>
                    <Icon className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm tracking-tight truncate uppercase">{t.description}</p>
                    <div className="flex gap-2 items-center">
                       <span className="text-[9px] uppercase font-black tracking-widest opacity-60 text-blue-400">{t.category}</span>
                       <span className="text-[8px] text-slate-500">•</span>
                       <span className="text-[9px] uppercase font-medium text-slate-500">{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <p className={`font-black text-[15px] italic tracking-tighter ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {t.type === 'expense' ? '- ' : '+ '}{formatCurrency(t.amount)}
                  </p>
                  <Eye className={`w-4 h-4 ${isInspecting ? 'text-blue-500' : 'text-slate-700'}`} />
                </div>
              </div>

              {isInspecting && (
                <div className="mt-5 pt-5 border-t border-slate-800/50 space-y-4 animate-in slide-in-from-top-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                      <label className="text-[7px] font-black text-slate-500 uppercase block mb-1">Data do Lançamento</label>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                        <Calendar className="w-3 h-3 text-blue-500" /> {new Date(t.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                      <label className="text-[7px] font-black text-slate-500 uppercase block mb-1">Método</label>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                        <CreditCard className="w-3 h-3 text-purple-500" /> {t.category === 'Pix' || t.category === 'Salário' ? 'TRANSFERÊNCIA' : 'CARTÃO'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {confirmDelete === t.id ? (
                      <button 
                        onClick={() => { deleteTransaction.mutate(t.id); setInspectingId(null); }}
                        className="flex-1 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-tighter animate-pulse"
                      >
                        CONFIRMAR EXCLUSÃO DEFINITIVA
                      </button>
                    ) : (
                      <>
                        <button onClick={() => setConfirmDelete(t.id)} className="p-3 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => setInspectingId(null)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20">
                          CONCLUÍDO
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
