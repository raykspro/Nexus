import { useState } from "react";
import { useTransactions, useDeleteTransaction, useCreateTransaction } from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/format";
import { 
  Utensils, Car, HeartPulse, Wallet, Banknote, ArrowDownLeft, 
  Trash2, CreditCard, Gamepad2, GraduationCap, LayoutGrid, Clock, RefreshCcw, FileText, Send
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
  
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // INTELIGÊNCIA DE PROCESSAMENTO RECALIBRADA
  const handleProcessImport = () => {
    const lines = importText.split('\n');
    let count = 0;

    lines.forEach(line => {
      // Captura valores no formato 00,00 ou 1.000,00
      const valueMatch = line.match(/(\d{1,3}(\.\d{3})*,\d{2})/);
      if (!valueMatch) return;

      const amount = parseFloat(valueMatch[0].replace('.', '').replace(',', '.'));
      const description = line.replace(valueMatch[0], '').replace(/R\$/g, '').trim() || "Nova Transação";
      
      let category = "Outros";
      
      // Lógica de Prioridade: 99Food vs 99 Corridas
      if (/ifood|99food|99 food|restaurante|pizza|burguer|lanche|comer/i.test(line)) {
        category = "Alimentação";
      } 
      else if (/uber|99|99pop|taxi|posto|combustivel|shell|ipiranga/i.test(line)) {
        category = "Transporte";
      }
      else if (/farmacia|drogaria|hospital|saude|unimed/i.test(line)) {
        category = "Saúde";
      }
      else if (/netflix|spotify|game|jogos|lazer/i.test(line)) {
        category = "Lazer";
      }
      else if (/pix recebido|salario|pagamento recebido/i.test(line)) {
        category = "Salário";
      }

      const type = /recebido|pix recebido|salario/i.test(line) ? 'income' : 'expense';

      createTransaction.mutate({
        description,
        amount,
        category,
        type,
        date: new Date().toISOString()
      });
      count++;
    });

    alert(`${count} registros processados e integrados ao império, Mestre!`);
    setImportText("");
    setIsImporting(false);
  };

  const handleClearAll = () => {
    if (confirm("Mestre, deseja realmente aniquilar TODOS os registros?")) {
      transactions.forEach((t) => deleteTransaction.mutate(t.id));
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }).format(date).replace(',', ' •');
    } catch (e) { return "Data Pendente"; }
  };

  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32">
      <header className="flex justify-between items-end pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          {/* IDENTIDADE VISUAL: NEXUS (REATIVO), EXTRATO (AZUL FIXO) */}
          <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
            <span className="text-slate-900 dark:text-white transition-colors">NEXUS</span>{" "}
            <span className="text-blue-600">EXTRATO</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">Registros de Operações</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsImporting(!isImporting)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg">
            <FileText className="w-4 h-4" />
          </button>
          <button onClick={handleClearAll} className="p-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ÁREA DE IMPORTAÇÃO INTELIGENTE */}
      {isImporting && (
        <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-[28px] space-y-3 border border-blue-500/20 animate-in slide-in-from-top-4">
          <p className="text-[9px] font-black uppercase text-blue-600 tracking-widest">Cole o extrato bancário abaixo:</p>
          <textarea 
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Ex: 05/03 99Food R$ 45,00"
            className="w-full h-32 bg-white dark:bg-slate-900 rounded-2xl p-4 text-xs border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
          />
          <button 
            onClick={handleProcessImport}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-md"
          >
            <Send className="w-3 h-3" /> Processar Dados
          </button>
        </div>
      )}

      {/* LISTA DE REGISTROS */}
      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px]">
            <p className="text-slate-300 italic uppercase font-black text-[10px] tracking-widest">Cofre aguardando registros, mestre.</p>
          </div>
        ) : (
          sorted.map((t) => {
            const Icon = categoryConfig[t.category]?.icon || ArrowDownLeft;
            return (
              <div key={t.id} className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm group hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900"><Icon className="w-5 h-5 stroke-[2.5px]" /></div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">{t.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">{t.category}</p>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-2.5 h-2.5" /><p className="text-[9px] uppercase font-black tracking-widest">{formatDateTime(t.date)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm tracking-tighter ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                  </p>
                  <button onClick={() => deleteTransaction.mutate(t.id)} className="text-[9px] font-black uppercase text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">Remover</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
