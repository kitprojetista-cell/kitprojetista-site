import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CLOUDFLARE_ANALYTICS_TOKEN } from './config';
import { reenviarPendentes } from './formulario';

// Contador de visitas (Cloudflare Web Analytics): só carrega se o token estiver configurado.
if (CLOUDFLARE_ANALYTICS_TOKEN) {
  const s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token: CLOUDFLARE_ANALYTICS_TOKEN }));
  document.head.appendChild(s);
}

// Cadastros que não saíram na visita anterior (serviço de e-mail fora do ar): tenta de novo em segundo plano.
setTimeout(() => { reenviarPendentes(); }, 3000);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
