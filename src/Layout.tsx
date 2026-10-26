import { ReactNode, useState } from 'react';
import { ArrowRight, ChevronRight, Instagram, Linkedin, Menu, MessageCircle, Search, X, Youtube } from 'lucide-react';
import { EMAIL_CONTATO, REDES, WHATSAPP, rota } from './config';

function TikTok({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.5 2.6 2.4 4.4 5 4.6" />
    </svg>
  );
}

type Props = { children: ReactNode; naInicial: boolean; en?: boolean };

const WHATSAPP_EN = 'https://wa.me/5519992797870?text=' + encodeURIComponent('Hi! I have a question about Kit Projetista.');


/** Vai para uma seção da página inicial (rola se já estiver nela, senão abre a inicial na seção). */
export function irPara(id: string, naInicial: boolean, en = false) {
  if (naInicial) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  else window.location.href = rota(en ? 'en/' : '') + '#' + id;
}

export default function Layout({ children, naInicial, en = false }: Props) {
  const t = (pt: string, ingles: string) => (en ? ingles : pt);
  const inicio = rota(en ? 'en/' : '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const ir = (id: string) => {
    setMenuOpen(false);
    irPara(id, naInicial, en);
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
        <a className="brand" href={inicio} aria-label={t('Ir para o início', 'Go to home')}>
          <span style={{ display: 'block' }}>KIT <b>PROJETISTA</b></span>
        </a>
        <nav className="desktop-nav" aria-label={t('Navegação principal', 'Main navigation')}>
          <button onClick={() => ir(en ? 'features' : 'recursos')}>{t('Recursos', 'Features')}</button>
          <button onClick={() => ir(en ? 'plans' : 'planos')}>{t('Planos', 'Pricing')}</button>
          {!en && <a href={rota('planta-de-situacao/')}>Planta de situação</a>}
          {!en && <a href={rota('calculadora/')}>Calculadora</a>}
          {!en && <a href={rota('tutoriais/')}>Tutoriais</a>}
          <button onClick={() => ir(en ? 'contact' : 'contato')}>{t('Contato', 'Contact')}</button>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button search-button"
            aria-label={t('Pesquisar', 'Search')}
            onClick={() => setSearchOpen(!searchOpen)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Search size={18} strokeWidth={1.8} />
          </button>
          <button className="icon-button menu-button" aria-label={menuOpen ? t('Fechar menu', 'Close menu') : t('Abrir menu', 'Open menu')} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      {searchOpen && (
        <div style={{ padding: '15px 20px', backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px', backdropFilter: 'blur(10px)', position: 'sticky', top: '0', zIndex: 40 }}>
          <input
            type="text"
            placeholder={t('O que procura?', 'What are you looking for?')}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none' }}
            autoFocus
          />
          <button onClick={handleSearch} className="button button-primary" style={{ padding: '0 20px', borderRadius: '8px' }}>
            {t('Procurar', 'Search')}
          </button>
        </div>
      )}

      {menuOpen && (
        <div className="mobile-menu">
          <button onClick={() => ir(en ? 'features' : 'recursos')}>{t('Recursos', 'Features')} <ChevronRight size={16} /></button>
          <button onClick={() => ir(en ? 'plans' : 'planos')}>{t('Planos', 'Pricing')} <ChevronRight size={16} /></button>
          {!en && <a href={rota('planta-de-situacao/')}>Planta de situação grátis <ChevronRight size={16} /></a>}
          {!en && <a href={rota('calculadora/')}>Calculadora do Projetista <ChevronRight size={16} /></a>}
          {!en && <a href={rota('tutoriais/')}>Tutoriais de AutoCAD <ChevronRight size={16} /></a>}
          <button onClick={() => ir(en ? 'contact' : 'contato')}>{t('Contato', 'Contact')} <ChevronRight size={16} /></button>
          <a href={rota(en ? 'en/privacy/' : 'privacidade/')}>{t('Privacidade', 'Privacy')} <ChevronRight size={16} /></a>
        </div>
      )}

      {children}

      <footer className="footer">
        <div className="footer-brand"><img src={rota('KIT_PROJETISTA_KP_Monogram.png')} alt="KP" /><span>KIT PROJETISTA</span></div>
        <div className="footer-middle">
          <span className="footer-copyright">© Copyright-2026 Kit Projetista</span>
          <span className="footer-social">
            <a href={REDES.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
            <a href={REDES.youtube} target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={18} /></a>
            <a href={REDES.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><TikTok size={18} /></a>
            <a href={REDES.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
          </span>
          <span className="footer-links">
            {en ? (
              <>
                <a href={rota('en/privacy/')}>Privacy policy</a>
                <a href={rota('en/terms/')}>Terms of use</a>
              </>
            ) : (
              <>
                <a href={rota('planta-de-situacao/')}>Planta de situação grátis</a>
                <a href={rota('tutoriais/')}>Tutoriais</a>
                <a href={rota('privacidade/')}>Política de privacidade</a>
                <a href={rota('calculadora/privacidade/')}>Privacidade da Calculadora</a>
                <a href={rota('termos/')}>Termos de uso</a>
              </>
            )}
            <a href={`mailto:${EMAIL_CONTATO}`}>{EMAIL_CONTATO}</a>
          </span>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{t('Voltar ao topo', 'Back to top')} <ArrowRight size={14} /></button>
      </footer>

      <a className="whatsapp-fab" href={en ? WHATSAPP_EN : WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label={t('Falar no WhatsApp', 'Chat on WhatsApp')}>
        <MessageCircle size={26} />
      </a>
    </main>
  );
}
