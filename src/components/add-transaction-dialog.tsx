import { useState } from "react";
import { useCreateTransaction } from "@/hooks/use-transactions";
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

  const handleAction = (e: React.FormEvent) => {
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
      className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 font-black text-2xl border-2 border-blue-400/30 active:scale-90 transition-all"
    >
      +
    </button>
  );

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[70] flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-sm rounded-[32px] border border-slate-800 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Novo <span className="text-blue-500">Registro</span></h2>
          <button onClick={() => setOpen(false)} className="text-slate-500 font-black text-sm">FECHAR</button>
        </div>

        <form onSubmit={handleAction} className="space-y-4">
          <Input 
            placeholder="Descrição" 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="bg-slate-950 border-slate-800 h-12 rounded-xl text-white"
          />
          
          <Input 
            type="number" 
            step="0.01" 
            placeholder="Valor (R$)" 
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            className="bg-slate-950 border-slate-800 h-12 rounded-xl text-white"
          />

          <div className="grid grid-cols-2 gap-3">
            <select 
              className="w-full h-12 bg-slate-950 text-white border border-slate-800 rounded-xl px-2 text-[10px] font-black uppercase"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>

            <select 
              className="w-full h-12 bg-slate-950 text-white border border-slate-800 rounded-xl px-2 text-[10px] font-black uppercase"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {["Alimentação", "Lazer", "Transporte", "Saúde", "Salário", "Extra"].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={createTransaction.isPending}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-900/20"
          >
            {createTransaction.isPending ? "PROCESSANDO..." : "CONFIRMAR"}
          </button>
        </form>
      </div>
    </div>
  );
}
