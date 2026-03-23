import { useState, useEffect, useRef } from "react";
import { Camera, User, Settings, ChevronRight, Save } from "lucide-react";

export default function Profile() {
  // Carrega os dados salvos ou usa o padrão "MESTRE NEXUS"
  const [userName, setUserName] = useState(() => localStorage.getItem("nexus_user_name") || "MESTRE NEXUS");
  const [profileImage, setProfileImage] = useState(() => localStorage.getItem("nexus_user_avatar") || null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistência de dados
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-32 px-4 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <header className="flex flex-col items-center pt-12 pb-8">
        {/* CONTAINER DA FOTO */}
        <div className="relative">
          <div className="w-32 h-32 rounded-[40px] bg-blue-600 flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white dark:border-slate-900">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-white" />
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-3 bg-slate-900 text-white rounded-2xl border-4 border-white dark:border-slate-900 hover:scale-110 transition-transform shadow-lg"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        </div>

        {/* NOME DO MESTRE */}
        <div className="mt-6 text-center">
          {isEditing ? (
            <div className="flex flex-col items-center gap-3">
              <input 
                autoFocus
                className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white border-b-2 border-blue-600 outline-none text-center bg-transparent"
                value={userName}
                onChange={(e) => setUserName(e.target.value.toUpperCase())}
              />
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest"
              >
                <Save className="w-3 h-3" /> SALVAR NOME
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none">
                {userName}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Comandante do Sistema</p>
            </>
          )}
        </div>
      </header>

      <section className="space-y-3">
        <button 
          onClick={() => setIsEditing(true)}
          className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
              <User className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black uppercase text-slate-900 dark:text-white">Editar Identidade</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Mudar nome e codinome</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </button>

        <button className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-sm opacity-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl">
              <Settings className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black uppercase text-slate-900 dark:text-white">Preferências</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Aparência do império</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </button>
      </section>
    </div>
  );
}
