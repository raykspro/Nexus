import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Erro silencioso no console para não quebrar o build, mas alertar o desenvolvedor
  console.error('Elemento root não encontrado.');
}
