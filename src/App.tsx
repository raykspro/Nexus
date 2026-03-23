import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/layout"; 
import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";
import { User, ShieldCheck, Settings, Camera, Save } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function App() {
  // --- LÓGICA DE IDENTIDADE DO MESTRE ---
  const [userName, setUserName] = useState(() => localStorage.getItem("nexus_user_name") || "MESTRE NEXUS");
  const [profileImage, setProfileImage] = useState(() => localStorage.getItem("nexus_user_avatar") || null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Salva automaticamente no navegador sempre que houver alteração
  useEffect(() => {
    localStorage.setItem("nexus_user_name", userName);
    if (profileImage) localStorage.setItem("nexus_user_avatar", profileImage);
  }, [userName, profileImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router base="/Nexus">
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/transactions" component={Transactions} />
            
            <Route path="/profile">
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 px-4">
                <header className="text-center py-6 flex flex-col items-center">
                  {/* AVATAR COM UPLOAD */}
                  <div className="relative group">
                    <div className="w-24 h-24 bg-blue-600 rounded-[32px] mx-auto flex items-center justify-center shadow-2xl overflow-hidden border-4 border-white dark:border-slate-800">
                      {profileImage ? (
                        <img src={profileImage} alt="Mestre" className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-white w-12 h-12" />
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-2 bg-slate-900 text-white rounded-xl border-2 border-white dark:border-slate-800 shadow-lg hover:scale-110 transition-transform"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  </div>

                  {/* NOME EDITÁVEL */}
                  <div className="mt-4">
                    {isEditing ? (
                      <div className="flex flex-col items-center gap-2">
                        <input 
                          autoFocus
                          className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white border-b-2 border-blue-600 outline-none text-center bg-transparent"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value.toUpperCase())}
                        />
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-full text-[8px] font-black uppercase tracking-widest"
                        >
                          <Save className="w-3 h-3" /> CONFIRMAR
                        </button>
                      </div>
                    ) : (
                      <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
                          {userName}
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Comandante do Sistema</p>
                      </div>
                    )}
                  </div>
                </header>

                <div className="space-y-3">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Segurança Ativa</span>
                  </div>
                  
                  {/* BOTÃO DE PREFERÊNCIAS QUE ATIVA A EDIÇÃO */}
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 hover:border-blue-500 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Alterar Nome de Guerra</span>
                  </button>
                </div>
              </div>
            </Route>

            <Route>
              <Dashboard />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}
