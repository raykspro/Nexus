import React from "react";
import { LayoutDashboard, History, Settings, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Painel" },
    { href: "/transactions", icon: History, label: "Histórico" },
    { href: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 font-sans">
      {/* Header Minimalista com efeito Glassmorphism */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 rotate-3">
              <span className="text-white font-black text-sm italic -rotate-3">N</span>
            </div>
            <h1 className="font-black italic tracking-tighter text-slate-900 text-lg">
              NEXUS <span className="text-blue-600">FINANÇAS</span>
            </h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
            <Settings className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* Área de Conteúdo sobre Fundo Neutro */}
      <main className="max-w-md mx-auto px-6 pt-8 pb-44 animate-in fade-in duration-500">
        {children}
      </main>

      {/* Navegação Inferior Premium */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/50 pb-8 pt-4 px-10 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a className="flex flex-col items-center gap-1.5 group transition-all">
                  <div className={`p-2 rounded-xl transition-all ${
                    isActive 
                      ? "bg-blue-50 text-blue-600 shadow-sm" 
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}>
                    <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    isActive ? "text-blue-600" : "text-slate-400"
                  }`}>
                    {item.label}
                  </span>
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
