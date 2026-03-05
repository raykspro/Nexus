import { useState } from "react";
import { useCreateTransaction } from "@/hooks/use-transactions";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);
  const createTransaction = useCreateTransaction();
  
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "Alimentação",
    paymentMethod: "Pix",
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTransaction.mutate({
      ...formData,
      amount: parseFloat(formData.amount)
    }, {
      onSuccess: () => {
        setOpen(false);
        setFormData({ ...formData, description: "", amount: "" });
      }
    });
  };

  if (!open) return (
    <button 
      onClick={() => setOpen(true)}
      className="fixed bottom-28 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 border-2 border-blue-400/20 active:scale-95 transition-all"
    >
      <Plus className="w-8 h-8" />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-md rounded-[32px] border border-slate-800 p-6 space-y-6 shadow-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-white italic">NOVO <span className="text-blue-500">LANÇAMENTO</span></h2>
          <button onClick={() => setOpen(false)} className="p-2 text-slate-500"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            {(['expense', 'income'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t })}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === t ? (t === 'income' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white') : 'text-slate-500'}`}
              >
                {t === 'income' ? 'Receita' : 'Despesa'}
              </button>
            ))}
          </div>

          <Input 
            placeholder="Descrição (ex: Almoço)" 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          
          <Input 
            type="number" 
            step="0.01" 
            placeholder="Valor (R$)" 
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Categoria</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-12 bg-slate-950 border border-slate-800 rounded-2xl px-4 text-xs font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
              >
                {["Alimentação", "Lazer", "Transporte", "Saúde", "Salário", "Investimento", "Extra"].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Método</label>
              <select 
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full h-12 bg-slate-950 border border-slate-800 rounded-2xl px-4 text-xs font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
              >
                {["Pix", "Cartão de Crédito", "Dinheiro", "Cartão de Débito"].map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all"
          >
            Confirmar Lançamento
          </button>
        </form>
      </div>
    </div>
  );
}
