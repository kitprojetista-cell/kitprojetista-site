import { ReactNode, useState } from 'react';
import { ArrowRight, ChevronRight, Instagram, Menu, MessageCircle, Search, X, Youtube } from 'lucide-react';
import { EMAIL_CONTATO, REDES, WHATSAPP, rota } from './config';

function TikTok({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.5 2.6 2.4 4.4 5 4.6" />
    </svg>
  );
}

type Props = { children: ReactNode; naInicial: boolean };

/** Vai para uma seção da página inicial (rola se já estiver nela, senão abre a inicial na seção). */
export function irPara(id: string, naInicial: boolean) {
  if (naInicial) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  else window.location.href = rota('') + '#' + id;
}

export default function Layout({ children, naInicial }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const ir = (id: string) => {
    setMenuOpen(false);
    irPara(id, naInicial);
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      (window as unknown as { find: (s: string) => boolean }).find(searchText);
    }
  };

  return (
    <main className="site-shell">
      <div className="page-noise" />

      <header className="topbar">
        <a className="brand" href={rota('')} aria-label="Ir para o início">
          <span style={{ display: 'block' }}>KIT <b>PROJETISTA</b></span>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <button onClick={() => ir('recursos')}>Recursos</button>
          <button onClick={() => ir('planos')}>Planos</button>
          <a href={rota('calculadora/')}>Calculadora</a>
          <button onClick={() => ir('contato')}>Contato</button>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button search-button"
            aria-label="Pesquisar"
            onClick={() => setSearchOpen(!searchOpen)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Search size={18} strokeWidth={1.8} />
          </button>
          <button className="icon-button menu-button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      {searchOpen && (
        <div style={{ padding: '15px 20px', backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px', backdropFilter: 'blur(10px)', position: 'sticky', top: '0', zIndex: 40 }}>
          <input
            type="text"
            placeholder="O que procura?"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none' }}
            autoFocus
          />
          <button onClick={handleSearch} className="button button-primary" style={{ padding: '0 20px', borderRadius: '8px' }}>
            Procurar
          </button>
        </div>
      )}

      {menuOpen && (
        <div className="mobile-menu">
          <button onClick={() => ir('recursos')}>Recursos <ChevronRight size={16} /></button>
          <button onClick={() => ir('planos')}>Planos <ChevronRight size={16} /></button>
          <a href={rota('calculadora/')}>Calculadora do Projetista <ChevronRight size={16} /></a>
          <button onClick={() => ir('contato')}>Contato <ChevronRight size={16} /></button>
          <a href={rota('privacidade/')}>Privacidade <ChevronRight size={16} /></a>
        </div>
      )}

      {children}

      <footer className="footer">
        <div className="footer-brand"><img src={rota('KIT_PROJETISTA_KP_Monogram.png')} alt="KP" /><span>KIT PROJETISTA</span></div>
        <div className="footer-middle">
          <span className="footer-copyright">© Copyright-2026 Kit Projetista</span>
          <span className="footer-social">
            <a href={REDES.instagram} target="_blank" rel="noreferrer" aria-label="Instagram do Kit Projetista"><Instagram size={18} /></a>
            <a href={REDES.youtube} target="_blank" rel="noreferrer" aria-label="YouTube do Kit Projetista"><Youtube size={18} /></a>
            <a href={REDES.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok do Kit Projetista"><TikTok size={18} /></a>
          </span>
          <span className="footer-links">
            <a href={rota('privacidade/')}>Política de privacidade</a>
            <a href={rota('calculadora/privacidade/')}>Privacidade da Calculadora</a>
            <a href={rota('termos/')}>Termos de uso</a>
            <a href={rota('en/privacy/')} lang="en">Privacy (English)</a>
            <a href={rota('en/terms/')} lang="en">Terms (English)</a>
            <a href={`mailto:${EMAIL_CONTATO}`}>{EMAIL_CONTATO}</a>
          </span>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Voltar ao topo <ArrowRight size={14} /></button>
      </footer>

      <a className="whatsapp-fab" href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
        <MessageCircle size={26} />
      </a>
    </main>
  );
}
