import { useState } from "react";
import { useCreateTransaction } from "@/hooks/use-transactions";
import { X } from "lucide-react";

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);
  const [initialType, setInitialType] = useState<"income" | "expense">("expense");
  const createTransaction = useCreateTransaction();
  
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "Alimentação",
    paymentMethod: "Pix",
    date: new Date().toISOString().split('T')[0]
  });

  const handleOpen = (type: "income" | "expense") => {
    setInitialType(type);
    setFormData(prev => ({ ...prev, description: "", amount: "" })); // Limpa os campos
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTransaction.mutate({
      ...formData,
      type: initialType, // Usa o tipo selecionado no botão
      amount: parseFloat(formData.amount)
    }, {
      onSuccess: () => {
        setOpen(false);
      }
    });
  };

  // Botões táticos flutuantes acima da navegação inferior
  const renderLaunchButtons = () => (
    <div className="fixed bottom-24 left-0 right-0 px-4 z-50 flex gap-3 max-w-md mx-auto">
      <button 
        onClick={() => handleOpen("expense")}
        className="flex-1 h-14 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-rose-950/30 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <ArrowDownLeft className="w-4 h-4" /> Despesas
      </button>
      <button 
        onClick={() => handleOpen("income")}
        className="flex-1 h-14 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-950/30 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <Wallet className="w-4 h-4" /> Receitas
      </button>
    </div>
  );

  if (!open) return renderLaunchButtons();

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-sm rounded-[32px] border border-slate-800 p-6 space-y-6 shadow-2xl">
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-black italic uppercase tracking-tighter ${initialType === 'income' ? 'text-emerald-400' : 'text-rose-500'}`}>
            Novo Lançamento <span className="text-white text-xs block font-bold not-italic">{initialType === 'income' ? '(Receita)' : '(Despesa)'}</span>
          </h2>
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
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-12 bg-slate-950 text-white border border-slate-800 rounded-xl px-2 text-[10px] font-black uppercase outline-none"
            >
              {initialType === "expense" ? 
                ["Alimentação", "Lazer", "Transporte", "Saúde", "Extra"].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                )) :
                ["Salário", "Investimento", "Extra"].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              }
            </select>

            <select 
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full h-12 bg-slate-950 text-white border border-slate-800 rounded-xl px-2 text-[10px] font-black uppercase outline-none"
            >
              {["Pix", "Cartão de Crédito", "Dinheiro", "Cartão de Débito"].map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={createTransaction.isPending}
            className={`w-full py-4 ${initialType === 'income' ? 'bg-emerald-600' : 'bg-rose-600'} text-white rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-lg shadow-blue-900/40`}
          >
            {createTransaction.isPending ? "Processando..." : `Confirmar ${initialType === 'income' ? 'Receita' : 'Despesa'}`}
          </button>
        </form>
      </div>
    </div>
  );
}
// Importações adicionais necessárias para o novo AddTransactionDialog
import { Wallet, ArrowDownLeft } from "lucide-react";
