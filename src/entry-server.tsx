// Gera o HTML pronto de cada página no build (o Google lê o texto sem precisar rodar o JavaScript).
// No navegador, main.tsx monta a mesma tela por cima, igual a antes.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export function render(caminho: string) {
  return renderToString(
    <StrictMode>
      <App caminho={caminho} />
    </StrictMode>,
  );
}
