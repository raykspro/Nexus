import { useState } from "react";
import { useCreateTransaction } from "@/hooks/use-transactions";

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
      className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 font-black text-2xl"
    >
      +
    </button>
  );

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-sm rounded-[32px] border border-slate-800 p-6 space-y-6 shadow-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-white italic">NOVO <span className="text-blue-500">REGISTRO</span></h2>
          <button onClick={() => setOpen(false)} className="text-slate-500 font-bold uppercase text-[10px]">Fechar</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            placeholder="Descrição" 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-4 text-white text-sm focus:border-blue-500 outline-none"
          />
          
          <input 
            type="number" 
            step="0.01" 
            placeholder="Valor (R$)" 
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            className="w-full h-12 bg-slate-950 border border-slate-800 rounded-xl px-4 text-white text-sm focus:border-blue-500 outline-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <select 
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full h-12 bg-slate-950 text-white border border-slate-800 rounded-xl px-2 text-[10px] font-black uppercase outline-none"
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>

            <select 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-12 bg-slate-950 text-white border border-slate-800 rounded-xl px-2 text-[10px] font-black uppercase outline-none"
            >
              {["Alimentação", "Lazer", "Transporte", "Saúde", "Salário", "Extra"].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={createTransaction.isPending}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-lg shadow-blue-900/40"
          >
            {createTransaction.isPending ? "Processando..." : "Confirmar Lançamento"}
          </button>
        </form>
      </div>
    </div>
  );
}
