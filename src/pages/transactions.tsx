import { useState, useRef } from "react";
import { useTransactions, useDeleteTransaction, useCreateTransaction } from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/format";
import * as pdfjsLib from "pdfjs-dist"; // Necessário instalar: npm install pdfjs-dist
import { 
  Utensils, Car, HeartPulse, Wallet, Banknote, ArrowDownLeft, 
  Trash2, CreditCard, Gamepad2, GraduationCap, LayoutGrid, Clock, 
  RefreshCcw, FileUp, Smartphone, ShoppingBag, Zap
} from "lucide-react";

// Configuração Global de PDF Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const categoryConfig: any = {
  "Alimentação": { icon: Utensils },
  "Transporte": { icon: Car },
  "Saúde": { icon: HeartPulse },
  "Salário": { icon: Wallet },
  "PIX": { icon: Smartphone },
  "Investimento": { icon: Banknote },
  "Fatura": { icon: CreditCard },
  "Lazer": { icon: Gamepad2 },
  "Estudos": { icon: GraduationCap },
  "Compras": { icon: ShoppingBag },
  "Contas": { icon: Zap },
  "Outros": { icon: LayoutGrid },
};

export default function Transactions() {
  const { data: transactions = [] } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const createTransaction = useCreateTransaction();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // MOTOR DE CATEGORIZAÇÃO ULTRA-EXPANDIDO
  const getCategoryAndDescription = (rawDesc: string) => {
    let d = rawDesc.toLowerCase();
    let finalDesc = rawDesc;
    let category = "Outros";

    // REGRA DO MESTRE: Formatação de PIX para CAIXA ALTA
    if (d.includes("pix") || d.includes("transferencia")) {
      finalDesc = rawDesc.toUpperCase();
      category = "PIX";
    }

    // DICIONÁRIO TÁTICO EXPANDIDO
    if (/food|restaurante|pizza|burguer|lanche|comer|padaria|mercado|carrefour|muffato|pao|cafe|coffee|doceria|ifood|99food/i.test(d)) category = "Alimentação";
    else if (/uber|99|pop|taxi|posto|shell|ipiranga|combustivel|br|estac|pedagio|oficina|pneu|rodoviaria/i.test(d)) category = "Transporte";
    else if (/game|jogos|lazer|netflix|spotify|soccer|arena|barber|corte|cinema|show|ingresso|steam|playstation|xbox|clube/i.test(d)) category = "Lazer";
    else if (/farmacia|drogaria|hosp|saude|unimed|odonto|exame|dentista|pague|menos|raia/i.test(d)) category = "Saúde";
    else if (/curso|faculdade|escola|livro|estudos|educacao|udemy|alura|mensalidade/i.test(d)) category = "Estudos";
    else if (/amazon|mercadolivre|shopee|magalu|casas|bahia|loja|vestuario|roupa|calcado/i.test(d)) category = "Compras";
    else if (/luz|agua|energia|copel|sanepar|internet|vivo|claro|tim|aluguel|condominio/i.test(d)) category = "Contas";
    else if (/nuinvest|binance|corretora|tesouro|cdb|invest/i.test(d)) category = "Investimento";
    else if (category !== "PIX" && /recebida|recebido|salario|pagamento|provento|rendimento/i.test(d)) category = "Salário";

    return { category, finalDesc };
  };

  // PROCESSADOR UNIVERSAL DE TEXTO
  const processTextData = (text: string) => {
    const lines = text.split('\n');
    let count = 0;

    lines.forEach((line) => {
      // Captura o valor (com sinal opcional) e o restante da linha como descrição
      const valueMatch = line.match(/(-?\d{1,3}(\.\d{3})*,\d{2})/);
      if (!valueMatch) return;

      const numericStr = valueMatch[0].replace('.', '').replace(',', '.');
      const numericValue = parseFloat(numericStr);
      const rawDescription = line.replace(valueMatch[0], '').replace(/R\$/g, '').trim() || "Operação Nexus";

      if (isNaN(numericValue)) return;

      const type = numericValue < 0 ? 'expense' : 'income';
      const amount = Math.abs(numericValue);
      const { category, finalDesc } = getCategoryAndDescription(rawDescription);

      createTransaction.mutate({
        description: finalDesc,
        amount,
        category,
        type,
        date: new Date().toISOString()
      });
      count++;
    });
    alert(`Mestre, ${count} registros assimilados com sucesso.`);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item: any) => item.str).join(" ") + "\n";
      }
      processTextData(fullText);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => processTextData(e.target?.result as string);
      reader.readAsText(file);
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
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">Multi-Intelligence System</p>
        </div>
        <div className="flex gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv,.txt,.pdf" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-blue-600 text-white rounded-lg shadow-lg">
            <FileUp className="w-4 h-4" />
          </button>
          <button onClick={() => confirm("Resetar base de dados, Mestre?") && transactions.forEach(t => deleteTransaction.mutate(t.id))} className="p-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px]">
            <p className="text-slate-300 italic uppercase font-black text-[10px] tracking-widest">Aguardando CSV ou PDF, Mestre.</p>
          </div>
        ) : (
          sorted.map((t) => {
            const Icon = categoryConfig[t.category]?.icon || ArrowDownLeft;
            return (
              <div key={t.id} className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-900 dark:text-white text-white dark:text-slate-900"><Icon className="w-5 h-5 stroke-[2.5px]" /></div>
                  <div className="max-w-[180px]">
                    <p className={`font-bold text-sm tracking-tight truncate ${t.category === 'PIX' ? 'uppercase' : ''}`}>{t.description}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{t.category}</p>
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
