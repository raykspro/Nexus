import { useState, useRef, useMemo } from "react";
import { useTransactions, useDeleteTransaction, useUpdateTransaction, useCreateTransaction } from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/format";
import { 
  Utensils, Car, HeartPulse, Wallet, CreditCard, 
  Gamepad2, GraduationCap, LayoutGrid, FileUp, Trash2, X, Eye, Pencil, Check
} from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
}

const categoryConfig: Record<string, { icon: any, color: string }> = {
  "Alimentação": { icon: Utensils, color: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-950/50" },
  "Transporte": { icon: Car, color: "text-sky-600 bg-sky-100 dark:text-sky-400 dark:bg-sky-950/50" },
  "Saúde": { icon: HeartPulse, color: "text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-950/50" },
  "Salário": { icon: Wallet, color: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/50" },
  "Fatura": { icon: CreditCard, color: "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800/50" },
  "Lazer": { icon: Gamepad2, color: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-950/50" },
  "Estudos": { icon: GraduationCap, color: "text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-950/50" },
  "Outros": { icon: LayoutGrid, color: "text-slate-500 bg-slate-100 dark:text-slate-500 dark:bg-slate-800/20" },
};

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const updateTransaction = useUpdateTransaction();
  const createTransaction = useCreateTransaction();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inspectingId, setInspectingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const sorted = useMemo(() => 
    ([...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())),
  [transactions]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32 px-4 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <header className="flex justify-between items-end pb-4 border-b border-slate-200 dark:border-slate-800 pt-8">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
            NEXUS <span className="text-blue-600">EXTRATO</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">Gestão de Comandos</p>
        </div>
        <div className="flex gap-2">
          <input type="file" ref={fileInputRef} onChange={() => {}} accept=".csv" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-blue-600 rounded-xl shadow-sm">
            <FileUp className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="space-y-3">
        {sorted.map((t: Transaction) => {
          const config = categoryConfig[t.category] || categoryConfig["Outros"];
          const Icon = config.icon;
          const isInspecting = inspectingId === t.id;
          const editingThis = isEditing === t.id;

          return (
            <div key={t.id} className={`p-4 rounded-[28px] border transition-all duration-500 
              ${isInspecting 
                ? 'border-blue-600/50 bg-white dark:bg-slate-900 shadow-2xl scale-[1.02]' 
                : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40'}`}>
              
              <div className="flex justify-between items-center cursor-pointer" onClick={() => { setInspectingId(isInspecting ? null : t.id); setIsEditing(null); }}>
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`p-3.5 rounded-2xl ${config.color} flex-shrink-0`}>
                    <Icon className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-sm tracking-tight truncate uppercase">
                      {t.description}
                    </p>
                    <p className="text-[9px] uppercase font-black tracking-widest text-slate-400">{t.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <p className={`font-black text-[15px] italic tracking-tighter ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-slate-200'}`}>
                    {t.type === 'expense' ? '- ' : '+ '}{formatCurrency(t.amount)}
                  </p>
                  <Eye className={`w-4 h-4 transition-all ${isInspecting ? 'text-blue-500 scale-110' : 'text-slate-300'}`} />
                </div>
              </div>

              {isInspecting && (
                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/50 space-y-5 animate-in slide-in-from-top-4 duration-300">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Identificação do Lançamento</label>
                      {!editingThis && (
                        <button onClick={(e) => { e.stopPropagation(); setIsEditing(t.id); }} className="text-blue-600 hover:text-blue-500 transition-colors">
                          <Pencil className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    
                    {editingThis ? (
                      <div className="flex gap-2">
                        <input 
                          autoFocus
                          className="bg-slate-50 dark:bg-slate-950 border border-blue-600/50 rounded-xl w-full p-3 text-xs text-slate-900 dark:text-white font-bold uppercase outline-none"
                          defaultValue={t.description}
                          id={`input-${t.id}`}
                        />
                        <button 
                          onClick={() => {
                            const val = (document.getElementById(`input-${t.id}`) as HTMLInputElement).value;
                            updateTransaction.mutate({ ...t, description: val.toUpperCase() });
                            setIsEditing(null);
                          }}
                          className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-600/20"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-900 dark:text-slate-200 font-bold uppercase bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 italic">
                        {t.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Classificação</label>
                      <select 
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl w-full p-3 text-[10px] text-slate-900 dark:text-white font-black uppercase outline-none cursor-pointer"
                        value={t.category}
                        onChange={(e) => updateTransaction.mutate({ ...t, category: e.target.value })}
                      >
                        {Object.keys(categoryConfig).map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                      </select>
                    </div>

                    <div className="flex items-end justify-end gap-2">
                      {confirmDelete === t.id ? (
                        <div className="flex gap-2 animate-in zoom-in duration-200 w-full">
                          <button 
                            onClick={() => { deleteTransaction.mutate(t.id); setInspectingId(null); }} 
                            className="flex-1 py-3 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-tighter"
                          >
                            CONFIRMAR EXCLUSÃO
                          </button>
                          <button onClick={() => setConfirmDelete(null)} className="p-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-white rounded-xl">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button onClick={() => setConfirmDelete(t.id)} className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-500/20">
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button onClick={() => setInspectingId(null)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-600/20">
                            CONCLUÍDO
                          </button>
                        </>
                      )}
                    </div>
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
