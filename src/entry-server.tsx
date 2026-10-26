// Gera o HTML pronto de cada página no build (o Google lê o texto sem precisar rodar o JavaScript).
// No navegador, main.tsx monta a mesma tela por cima, igual a antes.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { TUTORIAIS } from './tutoriais/dados';

/** Páginas que saem da lista de tutoriais (título e descrição do Google de cada uma). */
export const paginasTutoriais = [
  { rota: 'tutoriais', titulo: 'Tutoriais de AutoCAD para projetistas | Kit Projetista', descricao: 'Passo a passo das tarefas que mais se repetem no AutoCAD: área dos cômodos, quadro de áreas, metragem por layer e mais, do jeito manual e do jeito rápido.' },
  ...TUTORIAIS.map((t) => ({ rota: t.slug, titulo: t.titulo, descricao: t.descricao })),
];

export function render(caminho: string) {
  return renderToString(
    <StrictMode>
      <App caminho={caminho} />
    </StrictMode>,
  );
}
