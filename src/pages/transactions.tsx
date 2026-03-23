import { useState, useRef } from "react";
import { useTransactions, useDeleteTransaction, useCreateTransaction } from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/format";
import { 
  Smartphone, CreditCard, Wallet, Banknote, LayoutGrid, 
  Clock, RefreshCcw, FileUp, Trash2
} from "lucide-react";

// Configuração focada nos Métodos de Pagamento
const categoryConfig: any = {
  "PIX": { icon: Smartphone, color: "text-sky-400 bg-sky-950/50" },
  "DÉBITO": { icon: CreditCard, color: "text-emerald-400 bg-emerald-950/50" },
  "CRÉDITO": { icon: CreditCard, color: "text-orange-400 bg-orange-950/50" },
  "SALÁRIO": { icon: Wallet, color: "text-purple-400 bg-purple-950/50" },
  "FATURA": { icon: Banknote, color: "text-rose-400 bg-rose-950/50" },
  "OUTROS": { icon: LayoutGrid, color: "text-slate-500 bg-slate-800/20" },
};

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const createTransaction = useCreateTransaction();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // MOTOR DE INTELIGÊNCIA: Extrai Categoria (Método) e Limpa Descrição
  const processTransaction = (rawDesc: string) => {
    let d = rawDesc.toLowerCase();
    let category = "OUTROS";
    let cleanDesc = rawDesc;

    // Identificação de Métodos e Limpeza de Prefixos
    if (d.includes("pix")) {
      category = "PIX";
      cleanDesc = rawDesc.replace(/Transferência (enviada|recebida) pelo Pix - /gi, "").replace(/pix/gi, "");
    } else if (d.includes("débito") || d.includes("debito")) {
      category = "DÉBITO";
      cleanDesc = rawDesc.replace(/Compra no débito - /gi, "").replace(/debito/gi, "");
    } else if (d.includes("crédito") || d.includes("credito")) {
      category = "CRÉDITO";
      cleanDesc = rawDesc.replace(/Compra no crédito - /gi, "").replace(/credito/gi, "");
    } else if (d.includes("salário") || d.includes("recebido") || d.includes("recebida")) {
      category = "SALÁRIO";
    } else if (d.includes("fatura")) {
      category = "FATURA";
    }

    // Limpeza final de caracteres residuais e caixa alta
    cleanDesc = cleanDesc.replace(/^- /, "").split("-")[0].trim().toUpperCase();
    if (!cleanDesc) cleanDesc = "OPERAÇÃO NEXUS";

    return { category, cleanDesc };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n');
      let count = 0;

      rows.forEach((row, index) => {
        if (index === 0 && row.toLowerCase().includes('data')) return;
        const columns = row.split(/[;,]/);
        if (columns.length < 3) return;

        const rawDate = columns[0]?.trim();
        const rawValue = columns[1]?.trim() || "0";
        const rawDescription = columns[columns.length - 1]?.trim() || "IMPORTADO";

        const numericStr = rawValue.replace(/[^\d,.-]/g, '').replace(',', '.');
        const numericValue = parseFloat(numericStr);
        if (isNaN(numericValue)) return;

        let finalDateISO = new Date().toISOString();
        if (rawDate) {
          const parts = rawDate.split('/');
          if (parts.length === 3) {
            const dateObj = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]), 12, 0, 0);
            if (!isNaN(dateObj.getTime())) finalDateISO = dateObj.toISOString();
          }
        }

        const { category, cleanDesc } = processTransaction(rawDescription);
        const type = numericValue < 0 ? 'expense' : 'income';

        createTransaction.mutate({
          description: cleanDesc,
          amount: Math.abs(numericValue),
          category,
          type,
          date: finalDateISO
        });
        count++;
      });
      alert(`Mestre, ${count} operações assimiladas.`);
    };
    reader.readAsText(file);
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      }).format(date);
    } catch (e) { return "Data Pendente"; }
  };

  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-32">
      <header className="flex justify-between items-end pb-4 border-b border-slate-200 dark:border-slate-800 px-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
            <span className="text-slate-900 dark:text-white transition-colors">NEXUS</span>{" "}
            <span className="text-blue-600">EXTRATO</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">Sincronização por Método</p>
        </div>
        <div className="flex gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-blue-600 text-white rounded-lg shadow-lg">
            <FileUp className="w-4 h-4" />
          </button>
          <button onClick={() => confirm("Aniquilar registros, Mestre?") && transactions.forEach(t => deleteTransaction.mutate(t.id))} className="p-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="space-y-3 px-4">
        {sorted.map((t) => {
          const config = categoryConfig[t.category] || categoryConfig["OUTROS"];
          const Icon = config.icon;

          return (
            <div key={t.id} className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm group">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`p-3.5 rounded-2xl ${config.color} flex-shrink-0`}>
                  <Icon className="w-5 h-5 stroke-[2.5px]" />
                </div>
                
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-sm tracking-tight truncate uppercase leading-tight">
                    {t.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className={`text-[9px] uppercase font-black tracking-widest ${config.color.split(' ')[0]}`}>
                      {t.category}
                    </p>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                      <Clock className="w-2.5 h-2.5" />
                      <p className="text-[9px] uppercase font-black tracking-widest">{formatDateTime(t.date)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0 ml-4">
                <p className={`font-black text-[15px] tracking-tighter ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </p>
                <button onClick={() => deleteTransaction.mutate(t.id)} className="text-[9px] font-bold text-rose-500 opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-auto">
                  <Trash2 className="w-3 h-3" /> Remover
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
