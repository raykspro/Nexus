import { useState } from "react";
import { useCreateTransaction } from "@/hooks/use-transactions";
import { Plus, X } from "lucide-react";
import { Input } from "./ui/input";

export default function AddTransactionDialog() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateTransaction();
  
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "Geral",
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    try {
      await createMutation.mutateAsync({
        ...formData,
        amount: Number(formData.amount)
      });
      setOpen(false);
      setFormData({ ...formData, description: "", amount: "" });
    } catch (error) {
      alert("Erro ao salvar, mestre. Verifique os dados.");
    }
  };

  return (
    <>
      {/* Botão Flutuante - z-index alto para ficar sobre o menu */}
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-28 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-50 active:scale-95"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Modal de Lançamento */}
      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-md rounded-t-[32px] md:rounded-[32px] p-8 border border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Novo Lançamento</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 p-2"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex bg-slate-800 p-1 rounded-2xl">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'income'})}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formData.type === 'income' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'}`}
                >Receita</button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'expense'})}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formData.type === 'expense' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'}`}
                >Despesa</button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">DESCRIÇÃO</label>
                <Input 
                  placeholder="Ex: Aluguel, Salário..." 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">VALOR (R$)</label>
                <Input 
                  type="number" 
                  step="0.01"
                  placeholder="0,00" 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50"
              >
                {createMutation.isPending ? "Salvando..." : "Confirmar Lançamento"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
