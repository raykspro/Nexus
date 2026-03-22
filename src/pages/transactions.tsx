import { useState, useRef } from "react";
import { useTransactions, useDeleteTransaction, useCreateTransaction } from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/format";
import { 
  Utensils, Car, HeartPulse, Wallet, Banknote, ArrowDownLeft, 
  Trash2, CreditCard, Gamepad2, GraduationCap, LayoutGrid, Clock, RefreshCcw, FileUp, Send, FileText
} from "lucide-react";

const categoryConfig: any = {
  "Alimentação": { icon: Utensils },
  "Transporte": { icon: Car },
  "Saúde": { icon: HeartPulse },
  "Salário": { icon: Wallet },
  "Investimento": { icon: Banknote },
  "Fatura": { icon: CreditCard },
  "Lazer": { icon: Gamepad2 },
  "Estudos": { icon: GraduationCap },
  "Outros": { icon: LayoutGrid },
};

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const createTransaction = useCreateTransaction();
  
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // LÓGICA DE CATEGORIZAÇÃO (99Food vs 99 Corridas integrada)
  const getCategory = (desc: string) => {
    const d = desc.toLowerCase();
    if (/ifood|99food|99 food|restaurante|pizza|burguer|lanche|comer/i.test(d)) return "Alimentação";
    if (/uber|99|99pop|taxi|posto|combustivel|shell|ipiranga/i.test(d)) return "Transporte";
    if (/farmacia|drogaria|hospital|saude|unimed/i.test(d)) return "Saúde";
    if (/netflix|spotify|game|jogos|lazer/i.test(d)) return "Lazer";
    if (/pix recebido|salario|pagamento recebido/i.test(d)) return "Salário";
    return "Outros";
  };

  // PROCESSADOR DE ARQUIVO CSV
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      let count = 0;

      lines.forEach((line) => {
        // Padrão: encontra valores com ou sem sinal de menos
        const valueMatch = line.match(/(-?\d{1,3}(\.\d{3})*,\d{2})/);
        if (!valueMatch) return;

        // Limpeza do valor para formato numérico
        const rawValue = valueMatch[0].replace('.', '').replace(',', '.');
        const numericValue = parseFloat(rawValue);
        
        const description = line.replace(valueMatch[0], '').replace(/R\$/g, '').trim() || "Importado via Planilha";
        
        // REGRA DO MESTRE: Negativo = Despesa, Positivo = Ganho
        const type = numericValue < 0 ? 'expense' : 'income';
        const amount = Math.abs(numericValue);
        const category = getCategory(description);

        createTransaction.mutate({
          description,
          amount,
          category,
          type,
          date: new Date().toISOString()
        });
        count++;
      });
      alert(`${count} registros da planilha foram assimilados pelo Nexus, mestre!`);
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (confirm("Mestre, deseja aniquilar todos os registros?")) {
      transactions.forEach((t) => deleteTransaction.mutate(t.id));
    }
  };

  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32">
      <header className="flex justify-between items-end pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
            <span className="text-slate-900 dark:text-white">NEXUS</span>{" "}
            <span className="text-blue-600">EXTRATO</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">Gestão de Fluxo</p>
        </div>
        
        <div className="flex gap-2">
          {/* Input de arquivo escondido para manter a estética */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg"
            title="Subir Planilha"
          >
            <FileUp className="w-4 h-4" />
          </button>
          <button onClick={handleClearAll} className="p-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500 transition-all">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ÁREA DE STATUS VAZIA */}
      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px]">
            <p className="text-slate-300 italic uppercase font-black text-[10px] tracking-widest">
              Suba sua planilha no botão azul, Mestre.
            </p>
          </div>
        ) : (
          sorted.map((t) => {
            const Icon = categoryConfig[t.category]?.icon || ArrowDownLeft;
            return (
              <div key={t.id} className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900"><Icon className="w-5 h-5 stroke-[2.5px]" /></div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">{t.description}</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">{t.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm tracking-tighter ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
