import Inicio from './paginas/Inicio';
import Calculadora from './paginas/Calculadora';
import Legal, { PRIVACIDADE_APP, PRIVACIDADE_KIT, PRIVACY_KIT_EN, TERMOS_KIT, TERMS_KIT_EN } from './paginas/Legal';
import { BASE } from './config';

/** Escolhe a página pelo endereço (cada rota tem seu próprio index.html gerado no build). */
function App() {
  let caminho = window.location.pathname;
  if (caminho.startsWith(BASE)) caminho = caminho.slice(BASE.length);
  caminho = caminho.replace(/index\.html$/, '').replace(/\/+$/, '');

  switch (caminho) {
    case 'calculadora':
      return <Calculadora />;
    case 'calculadora/privacidade':
      return <Legal texto={PRIVACIDADE_APP} voltar={{ href: 'calculadora/', rotulo: 'Voltar para a Calculadora' }} />;
    case 'privacidade':
      return <Legal texto={PRIVACIDADE_KIT} voltar={{ href: '', rotulo: 'Voltar para o início' }} outroIdioma={{ href: 'en/privacy/', rotulo: 'Read in English', ingles: true }} />;
    case 'termos':
      return <Legal texto={TERMOS_KIT} voltar={{ href: '', rotulo: 'Voltar para o início' }} outroIdioma={{ href: 'en/terms/', rotulo: 'Read in English', ingles: true }} />;
    case 'en/privacy':
      return <Legal texto={PRIVACY_KIT_EN} voltar={{ href: '', rotulo: 'Back to home' }} outroIdioma={{ href: 'privacidade/', rotulo: 'Ler em português', ingles: false }} />;
    case 'en/terms':
      return <Legal texto={TERMS_KIT_EN} voltar={{ href: '', rotulo: 'Back to home' }} outroIdioma={{ href: 'termos/', rotulo: 'Ler em português', ingles: false }} />;
    default:
      return <Inicio />;
  }
}

export default App;
