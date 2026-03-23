import { useState, useRef, useMemo } from "react"; // Adicionado useMemo para performance
import { useTransactions, useDeleteTransaction, useUpdateTransaction, useCreateTransaction } from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/format";
import { 
  Utensils, Car, HeartPulse, Wallet, CreditCard, 
  Gamepad2, GraduationCap, LayoutGrid, FileUp, Trash2, X, Eye 
} from "lucide-react";

// Blindagem de Tipagem para o Mestre
interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
}

const categoryConfig: Record<string, { icon: any, color: string }> = {
  "Alimentação": { icon: Utensils, color: "text-orange-400 bg-orange-950/50" },
  "Transporte": { icon: Car, color: "text-sky-400 bg-sky-950/50" },
  "Saúde": { icon: HeartPulse, color: "text-rose-400 bg-rose-950/50" },
  "Salário": { icon: Wallet, color: "text-emerald-400 bg-emerald-950/50" },
  "Fatura": { icon: CreditCard, color: "text-slate-400 bg-slate-800/50" },
  "Lazer": { icon: Gamepad2, color: "text-purple-400 bg-purple-950/50" },
  "Estudos": { icon: GraduationCap, color: "text-indigo-400 bg-indigo-950/50" },
  "Outros": { icon: LayoutGrid, color: "text-slate-500 bg-slate-800/20" },
};

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const updateTransaction = useUpdateTransaction();
  const createTransaction = useCreateTransaction();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inspectingId, setInspectingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // MOTOR HÍBRIDO OTIMIZADO
  const getCategoryAndMethod = (rawDesc: string) => {
    const d = rawDesc.toLowerCase();
    let category = "Outros";
    if (/salario|recebido|recebida|provento/i.test(d)) category = "Salário";
    else if (/food|restaurante|pizza|burguer|lanche|padaria|mercado|carrefour|ifood/i.test(d)) category = "Alimentação";
    else if (/uber|99|pop|taxi|posto|combustivel|gasolina/i.test(d)) category = "Transporte";
    else if (/farmacia|drogaria|hosp|saude|unimed|odonto/i.test(d)) category = "Saúde";
    else if (/fatura|pagamento fatura/i.test(d)) category = "Fatura";
    else if (/game|jogos|lazer|netflix|spotify|soccer|arena/i.test(d)) category = "Lazer";
    else if (/curso|faculdade|escola|estudos/i.test(d)) category = "Estudos";

    return { category };
  };

  const cleanDescription = (rawDesc: string) => {
    return rawDesc
      .replace(/Transferência (enviada|recebida) pelo Pix - /gi, "")
      .replace(/Compra no (débito|crédito) - /gi, "")
      .split("-")[0].trim().toUpperCase();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n');
      rows.forEach((row, index) => {
        if (index === 0 || !row.trim()) return;
        const columns = row.split(/[;,]/);
        if (columns.length < 2) return;
        
        const rawDesc = columns[columns.length - 1];
        const { category } = getCategoryAndMethod(rawDesc);
        const amountStr = columns[1].replace(/[^\d,.-]/g, '').replace(',', '.');
        const amount = Math.abs(parseFloat(amountStr));
        
        createTransaction.mutate({
          description: cleanDescription(rawDesc),
          amount,
          category,
          type: parseFloat(amountStr) < 0 ? 'expense' : 'income',
          date: new Date().toISOString()
        });
      });
    };
    reader.readAsText(file);
  };

  // Ordenação memorizada para evitar re-renders pesados
  const sorted = useMemo(() => 
    [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [transactions]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32 px-4">
      <header className="flex justify-between items-end pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white">
            NEXUS <span className="text-blue-600">EXTRATO</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Gestão de Comandos</p>
        </div>
        <div className="flex gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
            <FileUp className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="space-y-3">
        {sorted.map((t: Transaction) => {
          const config = categoryConfig[t.category] || categoryConfig["Outros"];
          const Icon = config.icon;
          const isInspecting = inspectingId === t.id;

          return (
            <div key={t.id} className={`bg-slate-900/50 p-4 rounded-[24px] border transition-all duration-300 ${isInspecting ? 'border-blue-500 shadow-2xl scale-[1.02]' : 'border-slate-800'}`}>
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setInspectingId(isInspecting ? null : t.id)}>
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`p-3.5 rounded-2xl ${config.color} flex-shrink-0`}>
                    <Icon className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm tracking-tight truncate uppercase leading-tight">
                      {t.description}
                    </p>
                    <p className={`text-[9px] uppercase font-black tracking-widest ${config.color.split(' ')[0]}`}>{t.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <p className={`font-black text-[15px] tracking-tighter ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                    {t.type === 'expense' ? '- ' : '+ '}{formatCurrency(t.amount)}
                  </p>
                  <Eye className={`w-4 h-4 transition-colors ${isInspecting ? 'text-blue-500' : 'text-slate-600'}`} />
                </div>
              </div>

              {isInspecting && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Descrição</label>
                    <input 
                      className="bg-slate-950 border border-slate-800 rounded-lg w-full p-3 text-xs text-white font-bold uppercase focus:border-blue-600 outline-none"
                      defaultValue={t.description}
                      onBlur={(e) => {
                        if (e.target.value.toUpperCase() !== t.description) {
                           updateTransaction.mutate({ ...t, description: e.target.value.toUpperCase() });
                        }
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Categoria</label>
                      <select 
                        className="bg-slate-950 border border-slate-800 rounded-lg w-full p-2 text-[10px] text-white font-bold outline-none"
                        value={t.category}
                        onChange={(e) => updateTransaction.mutate({ ...t, category: e.target.value })}
                      >
                        {Object.keys(categoryConfig).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="flex items-end justify-end gap-2">
                      {confirmDelete === t.id ? (
                        <div className="flex gap-2 animate-in zoom-in">
                          <button onClick={() => { deleteTransaction.mutate(t.id); setInspectingId(null); }} className="px-3 py-2 bg-rose-500 text-white rounded-lg text-[9px] font-black">CONFIRMAR?</button>
                          <button onClick={() => setConfirmDelete(null)} className="p-2 bg-slate-800 text-white rounded-lg"><X className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(t.id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20"><Trash2 className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => setInspectingId(null)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-black text-[9px] hover:bg-blue-500">FECHAR</button>
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
