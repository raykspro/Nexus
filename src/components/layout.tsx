import React from "react";
import { LayoutDashboard, History, User } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Header Minimalista */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-black text-sm italic">N</span>
            </div>
            <h1 className="font-black italic tracking-tighter text-slate-900 text-lg">
              NEXUS <span className="text-blue-600">FINANÇAS</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Área de Conteúdo */}
      <main className="max-w-md mx-auto px-6 pt-8 pb-44 animate-in fade-in duration-500">
        {children}
      </main>

      {/* Navegação Inferior Estática (Sem dependências de rota) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/50 pb-8 pt-4 px-10 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto flex justify-between items-center opacity-60">
          <div className="flex flex-col items-center gap-1.5 text-blue-600">
            <LayoutDashboard className="w-5 h-5 stroke-[2.5px]" />
            <span className="text-[10px] font-black uppercase tracking-widest">Painel</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-slate-400">
            <History className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Extrato</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-slate-400">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Perfil</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
