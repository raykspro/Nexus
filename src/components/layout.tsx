import React from "react";
import { LayoutDashboard, History, User } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Header Clean */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <h1 className="font-black italic tracking-tighter text-slate-900">
              NEXUS <span className="text-blue-600">FINANÇAS</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-md mx-auto px-6 pt-8 pb-40">
        {children}
      </main>

      {/* Navegação Blindada (Sem links externos para evitar erro) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-8 pt-4 px-10 z-40">
        <div className="max-w-md mx-auto flex justify-between items-center text-slate-400">
          <div className="flex flex-col items-center gap-1">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] font-bold uppercase text-blue-600">Painel</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <History className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Extrato</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Perfil</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
