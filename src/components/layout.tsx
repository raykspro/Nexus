import React, { useState, useEffect } from "react";
import { LayoutDashboard, History, User, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isDark, setIsDark] = useState(false);

  // Sincronia de Tema: Aplica a classe 'dark' no elemento raiz
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-slate-950 text-white" : "bg-[#F8FAFC] text-slate-900"}`}>
      {/* Header com Alternador de Tema */}
      <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md ${isDark ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-200"}`}>
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm italic">N</span>
            </div>
            <h1 className="font-black italic tracking-tighter text-lg uppercase">Nexus</h1>
          </div>
          
          <button 
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl border transition-all ${isDark ? "bg-slate-900 border-slate-700 text-yellow-400" : "bg-white border-slate-200 text-slate-400"}`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-8 pb-44">
        {children}
      </main>

      {/* Navegação Inferior Adaptativa */}
      <nav className={`fixed bottom-0 left-0 right-0 border-t pb-8 pt-4 px-10 z-40 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <div className="max-w-md mx-auto flex justify-between items-center">
          <Link href="/">
            <a className={`flex flex-col items-center gap-1 ${location === "/" ? "text-blue-500" : "text-slate-500"}`}>
              <LayoutDashboard className="w-5 h-5 stroke-[2.5px]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Painel</span>
            </a>
          </Link>
          <Link href="/transactions">
            <a className={`flex flex-col items-center gap-1 ${location === "/transactions" ? "text-blue-500" : "text-slate-500"}`}>
              <History className="w-5 h-5 stroke-[2.5px]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Extrato</span>
            </a>
          </Link>
          <Link href="/profile">
            <a className={`flex flex-col items-center gap-1 ${location === "/profile" ? "text-blue-500" : "text-slate-500"}`}>
              <User className="w-5 h-5 stroke-[2.5px]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Perfil</span>
            </a>
          </Link>
        </div>
      </nav>
    </div>
  );
}
