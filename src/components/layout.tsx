import { Link, useLocation } from "wouter";
import { LayoutDashboard, ReceiptText } from "lucide-react";
import { AddTransactionDialog } from "./add-transaction-dialog";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-50">
      <header className="fixed top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md z-40 max-w-md mx-auto p-6 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-3">
          <img 
            src="/Nexus/logo-nexus.png" 
            className="w-10 h-10 rounded-2xl shadow-lg border border-slate-800" 
            alt="Nexus Logo" 
          />
          <h1 className="text-2xl font-black text-white tracking-tighter italic">
            NEXUS <span className="text-blue-500 not-italic">FINANÇAS</span>
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 pt-28">
        {children}
      </main>

      {/* O Cetro do Mestre: O botão flutuante de lançamentos */}
      <AddTransactionDialog />

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 px-6 py-3 flex justify-around items-center max-w-md mx-auto z-50 rounded-t-[24px]">
        <Link href="/">
          <div className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${isActive('/') ? 'text-blue-400 scale-110' : 'text-slate-500'}`}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
          </div>
        </Link>
        <Link href="/transactions">
          <div className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${isActive('/transactions') ? 'text-blue-400 scale-110' : 'text-slate-500'}`}>
            <ReceiptText className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Histórico</span>
          </div>
        </Link>
      </nav>
    </div>
  );
}
