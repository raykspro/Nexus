import { useState } from "react";
import { useCreateTransaction } from "@/hooks/use-transactions";
import { Plus, X } from "lucide-react";
import { Input } from "./ui/input";

const METODOS = ["Pix", "Cartão de Crédito", "Cartão de Débito", "Dinheiro"];
const GASTOS = ["Alimentação", "Lazer", "Reservado", "Assinatura", "Transporte", "Parcelamento", "Cuidados Pessoais"];

export default function AddTransactionDialog() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateTransaction();
  const [formData, setFormData] = useState({
    description: "", amount: "", type: "expense" as "income" | "expense",
    category: "Alimentação", paymentMethod: "Pix",
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;
    await createMutation.mutateAsync({ ...formData, amount: Number(formData.amount) });
    setOpen(false);
    setFormData({ ...formData, description: "", amount: "" });
  };

  if (!open) return (
    <button onClick={() => setOpen(true)} className="fixed bottom-28 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl z-50 transition-transform active:scale-90">
      <Plus className="w-8 h-8" />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-end p-4">
      <div className="bg-slate-900 w-full max-w-md mx-auto rounded-t-[32px] p-8 border border-slate-800">
        <div className="flex justify-between items-center mb-6 text-white font-bold">
          <span>Novo Lançamento</span>
          <button onClick={() => setOpen(false)}><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex bg-slate-800 p-1 rounded-xl">
            <button type="button" onClick={() => setFormData({...formData, type: 'income', category: 'Salário'})} className={`flex-1 py-2 rounded-lg text-xs font-bold ${formData.type === 'income' ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}>Receita</button>
            <button type="button" onClick={() => setFormData({...formData, type: 'expense', category: 'Alimentação'})} className={`flex-1 py-2 rounded-lg text-xs font-bold ${formData.type === 'expense' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}>Despesa</button>
          </div>
          <Input placeholder="Descrição" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <Input type="number" placeholder="Valor" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
          <select className="w-full h-12 bg-slate-800 rounded-xl px-4 text-white outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
            {formData.type === 'expense' ? GASTOS.map(c => <option key={c} value={c}>{c}</option>) : <option value="Salário">Salário</option>}
          </select>
          <select className="w-full h-12 bg-slate-800 rounded-xl px-4 text-white outline-none" value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}>
            {METODOS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold">Confirmar</button>
        </form>
      </div>
    </div>
  );
}
