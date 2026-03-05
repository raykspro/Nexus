import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', color: '#0F172A', fontFamily: 'sans-serif' }}>
      {/* Header Profissional Neutro */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, width: '100%', backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 24px' }}>
        <div style={{ maxWidth: '448px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: '#2563EB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'white', fontWeight: '900' }}>
              N
            </div>
            <h1 style={{ fontWeight: '900', fontStyle: 'italic', letterSpacing: '-0.05em' }}>
              NEXUS <span style={{ color: '#2563EB' }}>FINANÇAS</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Área de Operações */}
      <main style={{ maxWidth: '448px', margin: '0 auto', padding: '32px 24px 160px 24px' }}>
        {children}
      </main>

      {/* Barra de Navegação Estática */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTop: '1px solid #E2E8F0', padding: '16px 40px 32px 40px', zIndex: 40 }}>
        <div style={{ maxWidth: '448px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#2563EB' }}>
            <span>Painel</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>Extrato</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>Perfil</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
