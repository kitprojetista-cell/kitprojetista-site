import { FormEvent, MouseEvent, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, Download, FileText, Layers, MapPin, Search, ShieldCheck } from 'lucide-react';
import Layout from '../Layout';
import TesteModal from '../TesteModal';
import { rota } from '../config';
import { enviarFormulario, guardarPendente } from '../formulario';
import { Desenho, anguloLegivel, gerarDxf, legenda, localizar, montar, recentrar, remontar } from '../situacao/situacao';

const RAIOS = [100, 150, 250, 400];
const CHAVE_CADASTRO = 'kp_cadastro_situacao';

function jaCadastrado() {
  try { return localStorage.getItem(CHAVE_CADASTRO) === '1'; } catch { return false; }
}

/** Prévia em SVG, no mesmo desenho do DXF (norte para cima). */
function Previa({ d, aoClicar }: { d: Desenho; aoClicar?: (dx: number, dy: number) => void }) {
  const ref = useRef<SVGSVGElement>(null);
  const r = d.raio, h = Math.max(2, r / 45);
  const clicar = (ev: MouseEvent<SVGSVGElement>) => {
    const svg = ref.current, m = svg?.getScreenCTM();
    if (!svg || !m || !aoClicar) return;
    const p = svg.createSVGPoint();
    p.x = ev.clientX; p.y = ev.clientY;
    const q = p.matrixTransform(m.inverse());
    if (Math.abs(q.x) > r || Math.abs(q.y) > r) return;
    aoClicar(q.x, -q.y);
  };
  const pts = (lista: { x: number; y: number }[]) => lista.map((p) => `${p.x.toFixed(2)},${(-p.y).toFixed(2)}`).join(' ');
  const rObra = Math.max(4, r / 25), nt = r * 0.09, nb = { x: r - nt * 1.1, y: r - nt * 2.4 };
  return (
    <svg ref={ref} onClick={clicar} className={`situacao-svg${aoClicar ? ' situacao-clicavel' : ''}`} viewBox={`${-r * 1.04} ${-r * 1.04} ${r * 2.08} ${r * 2.08}`} role="img" aria-label="Prévia da planta de situação">
      <defs><clipPath id="moldura"><rect x={-r} y={-r} width={2 * r} height={2 * r} /></clipPath></defs>
      <rect x={-r} y={-r} width={2 * r} height={2 * r} fill="#fff" />
      <g clipPath="url(#moldura)">
        {/* Rua = borda escura (o meio-fio, como sai no DXF) + pista clara por cima */}
        {[...d.vias].sort((a, b) => b.largura - a.largura).map((v, i) => (
          <polyline key={'b' + i} points={pts(v.pontos)} fill="none" stroke="#6f8590" strokeWidth={v.largura + r / 160} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {[...d.vias].sort((a, b) => b.largura - a.largura).map((v, i) => (
          <polyline key={'p' + i} points={pts(v.pontos)} fill="none" stroke="#dfe7eb" strokeWidth={v.largura} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {d.edificacoes.map((e, i) => <polygon key={i} points={pts(e)} fill="#eef2f4" stroke="#8a99a3" strokeWidth={r / 450} />)}
        {d.rotulos.map((t, i) => (
          <text key={i} x={t.ponto.x} y={-t.ponto.y} fontSize={h} textAnchor="middle" dominantBaseline="middle" fill="#14394f"
            transform={`rotate(${-anguloLegivel(t.angulo)} ${t.ponto.x} ${-t.ponto.y})`} style={{ fontFamily: 'Arial, sans-serif' }}>{t.nome}</text>
        ))}
      </g>
      <g stroke="#b03a8f" strokeWidth={r / 300} fill="none">
        <circle cx={0} cy={0} r={rObra} />
        <line x1={-rObra * 1.6} y1={0} x2={rObra * 1.6} y2={0} />
        <line x1={0} y1={-rObra * 1.6} x2={0} y2={rObra * 1.6} />
      </g>
      <text x={rObra * 1.9} y={-rObra * 1.2} fontSize={h} fill="#b03a8f" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>LOCAL DA OBRA</text>
      <rect x={-r} y={-r} width={2 * r} height={2 * r} fill="none" stroke="#14394f" strokeWidth={r / 250} />
      <polygon points={pts([{ x: nb.x, y: nb.y + nt * 1.6 }, { x: nb.x - nt * 0.45, y: nb.y }, { x: nb.x + nt * 0.45, y: nb.y }])} fill="#14394f" />
      <text x={nb.x} y={-(nb.y + nt * 2.05)} fontSize={h * 1.2} textAnchor="middle" fill="#14394f" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>N</text>
    </svg>
  );
}

export default function PlantaSituacao() {
  const [busca, setBusca] = useState('');
  const [raio, setRaio] = useState(150);
  const [utmReal, setUtmReal] = useState(true);
  const [estado, setEstado] = useState<'livre' | 'buscando' | 'pronto'>('livre');
  const [passo, setPasso] = useState('');
  const [erro, setErro] = useState('');
  const [desenho, setDesenho] = useState<Desenho | null>(null);
  const [original, setOriginal] = useState<Desenho | null>(null);
  const [movendo, setMovendo] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whats, setWhats] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [baixou, setBaixou] = useState(false);
  const [cadastrado, setCadastrado] = useState(jaCadastrado);
  const [testeAberto, setTesteAberto] = useState(false);

  const linhasLegenda = useMemo(() => (desenho ? legenda(desenho) : []), [desenho]);

  const gerar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(''); setDesenho(null); setBaixou(false); setEstado('buscando');
    try {
      setPasso('Procurando o endereço...');
      const local = await localizar(busca);
      setPasso('Baixando as ruas do OpenStreetMap...');
      const d = await montar(local, raio);
      if (!d.vias.length && !d.edificacoes.length) throw new Error('O mapa não tem ruas cadastradas nesse raio. Tente um raio maior.');
      setDesenho(d);
      setOriginal(d);
      setEstado('pronto');
    } catch (x) {
      setErro((x as Error).message || 'Não deu para gerar agora. Tente de novo.');
      setEstado('livre');
    }
  };

  /** Clique no mapa: o local da obra vai para o ponto clicado e a planta se recentraliza. */
  const mover = async (dx: number, dy: number) => {
    if (!desenho || movendo) return;
    setBaixou(false);
    const perto = recentrar(desenho, dx, dy);
    if (perto) { setDesenho(perto); return; }
    setMovendo(true); setErro('');
    try { setDesenho(await remontar(desenho, dx, dy)); }
    catch (x) { setErro((x as Error).message || 'Não deu para atualizar o mapa agora.'); }
    finally { setMovendo(false); }
  };

  const baixar = () => {
    if (!desenho) return;
    const blob = new Blob([gerarDxf(desenho, utmReal)], { type: 'application/dxf' });
    const a = document.createElement('a');
    const primeira = desenho.local.descricao.split(',')[0] || '';
    const local = /^\s*-?\d/.test(primeira) ? 'coordenadas'
      : primeira.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 40) || 'local';
    a.href = URL.createObjectURL(blob);
    a.download = `planta-de-situacao-${local}.dxf`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    setBaixou(true);
  };

  const cadastrarEBaixar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!desenho) return;
    setEnviando(true);
    const assunto = `Planta de situação — ${nome}`;
    const dados = {
      Origem: 'Planta de situação grátis (site)',
      Nome: nome,
      'E-mail': email,
      WhatsApp: whats || 'Não informado',
      'Local pesquisado': busca,
      'Endereço encontrado': desenho.local.descricao,
    };
    try { await enviarFormulario(assunto, dados); }
    catch { guardarPendente(assunto, dados); }
    finally {
      try { localStorage.setItem(CHAVE_CADASTRO, '1'); } catch { /* nada */ }
      setCadastrado(true);
      setEnviando(false);
      baixar();
    }
  };

  return (
    <Layout naInicial={false}>
      <section className="hero hero-legal section-padding">
        <div className="hero-orbit orbit-one" />
        <div className="eyebrow"><span className="eyebrow-dot" /> GRÁTIS · SEM CADASTRO PARA VER</div>
        <h1>Planta de situação pelo CEP, <em>pronta em DXF.</em></h1>
        <p className="hero-copy">Digite o CEP ou o endereço do lote e baixe a planta de situação com as ruas reais, os nomes, o norte e as coordenadas UTM. Abre no AutoCAD, ZWCAD, BricsCAD e qualquer CAD.</p>
      </section>

      <section className="features-section section-padding situacao-secao">
        <form className="situacao-busca" onSubmit={gerar}>
          <label className="situacao-campo">
            <span>CEP, endereço ou coordenadas</span>
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="13145-370  ou  Rua X, 100, Cidade, UF  ou  -22.76, -47.15" required />
          </label>
          <label className="situacao-raio">
            <span>Raio</span>
            <select value={raio} onChange={(e) => setRaio(Number(e.target.value))}>
              {RAIOS.map((r) => <option key={r} value={r}>{r} m</option>)}
            </select>
          </label>
          <button className="button button-primary" type="submit" disabled={estado === 'buscando'}>
            {estado === 'buscando' ? passo || 'Gerando...' : 'Gerar planta'} <Search size={17} />
          </button>
        </form>
        {erro && <p className="form-error situacao-erro">{erro}</p>}

        {desenho && (
          <div className="situacao-resultado">
            <div className="situacao-previa">
              {desenho.local.aproximado && (
                <p className="situacao-aviso">Localização aproximada: {desenho.local.aproximado}. Clique no mapa onde fica o lote, ou cole as coordenadas do Google Maps no campo de busca.</p>
              )}
              <p className="situacao-dica">
                {movendo ? 'Atualizando o mapa...' : 'Clique no mapa onde fica o lote para mover o local da obra.'}
                {original && desenho !== original && !movendo && (
                  <button type="button" className="situacao-voltar" onClick={() => { setDesenho(original); setBaixou(false); }}>Voltar ao ponto do endereço</button>
                )}
              </p>
              <Previa d={desenho} aoClicar={mover} />
              <div className="situacao-legenda">
                <b>{linhasLegenda[0]}</b>
                {linhasLegenda.slice(1, 3).map((l) => <span key={l}>{l}</span>)}
              </div>
              <p className="situacao-fonte">Mapa: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">{desenho.bruto.fonte}</a>. Confira as divisas com o levantamento do lote.</p>
            </div>

            <div className="situacao-lado">
              {!baixou ? (
                cadastrado ? (
                  <div className="situacao-cartao">
                    <h3>Sua planta está pronta.</h3>
                    <p>Arquivo DXF em metros, com camadas separadas (vias, nomes, edificações, obra e moldura).</p>
                    <label className="situacao-opcao">Posição no desenho
                      <select value={utmReal ? 'utm' : 'origem'} onChange={(e) => setUtmReal(e.target.value === 'utm')}>
                        <option value="utm">Coordenadas UTM reais (georreferenciado)</option>
                        <option value="origem">Local da obra na origem (0,0)</option>
                      </select>
                    </label>
                    <button className="button button-primary" onClick={baixar}>Baixar DXF <Download size={17} /></button>
                  </div>
                ) : (
                  <form className="contact-form situacao-cartao" onSubmit={cadastrarEBaixar}>
                    <h3>Baixe o DXF grátis.</h3>
                    <p>Deixe seu contato e o download começa na hora. Pedimos só uma vez.</p>
                    <label>Nome (obrigatório)<input required type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome e Sobrenome" /></label>
                    <label>E-mail (obrigatório)<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" /></label>
                    <label>WhatsApp<input type="tel" value={whats} onChange={(e) => setWhats(e.target.value)} placeholder="(00) 00000-0000" /></label>
                    <label className="situacao-opcao">Posição no desenho
                      <select value={utmReal ? 'utm' : 'origem'} onChange={(e) => setUtmReal(e.target.value === 'utm')}>
                        <option value="utm">Coordenadas UTM reais (georreferenciado)</option>
                        <option value="origem">Local da obra na origem (0,0)</option>
                      </select>
                    </label>
                    <button className="button button-primary" type="submit" disabled={enviando}>
                      {enviando ? 'Preparando...' : 'Baixar DXF'} <Download size={17} />
                    </button>
                    <p className="form-note">Usamos seu contato para enviar novidades do Kit Projetista, e você pode pedir para sair quando quiser. Veja a <a href={rota('privacidade/')}>política de privacidade</a>.</p>
                  </form>
                )
              ) : (
                <div className="situacao-cartao situacao-convite">
                  <div className="success-icon"><Check size={26} /></div>
                  <h3>Download feito.</h3>
                  <p>No AutoCAD, o <b>Kit Projetista</b> faz isso com um comando, direto no desenho, e ainda o carimbo de prefeitura, o quadro de áreas, a área dos cômodos e o memorial descritivo.</p>
                  <button className="button button-primary" onClick={() => setTesteAberto(true)}>Testar o Kit 7 dias grátis <ArrowRight size={17} /></button>
                  <button className="button button-outline" onClick={baixar}>Baixar de novo <Download size={17} /></button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="features-section section-padding" style={{ paddingTop: 0 }}>
        <div className="section-heading">
          <div><div className="eyebrow dark"><span className="eyebrow-dot" /> COMO FUNCIONA</div><h2>Do CEP ao CAD <span style={{ color: '#1e6887' }}>em segundos.</span></h2></div>
          <p>Feito por quem aprova projeto na prefeitura: o que a planta de situação precisa, sem desenhar rua por rua.</p>
        </div>
        <div className="features-grid features-grid-3">
          <article className="feature-card feature-blue"><div className="feature-top"><MapPin size={25} strokeWidth={1.6} /></div><h3>Ruas reais, com nome</h3><p>Traçado e nomes do OpenStreetMap, largura da pista pelo tipo de via e as edificações em volta quando o mapa tiver.</p></article>
          <article className="feature-card feature-teal"><div className="feature-top"><Layers size={25} strokeWidth={1.6} /></div><h3>Pronto para a prancha</h3><p>Local da obra, norte, moldura e legenda com endereço e coordenadas UTM (SIRGAS 2000). Em metros, com camadas separadas.</p></article>
          <article className="feature-card feature-slate"><div className="feature-top"><FileText size={25} strokeWidth={1.6} /></div><h3>Abre em qualquer CAD</h3><p>DXF compatível com AutoCAD, ZWCAD, BricsCAD, GstarCAD e LibreCAD. É só inserir na prancha e ajustar a escala.</p></article>
        </div>

        <div className="situacao-video">
          <iframe src="https://www.youtube-nocookie.com/embed/HI89SHBiOKE" title="Como gerar a planta de situação pelo CEP" loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          <div>
            <div className="eyebrow dark"><span className="eyebrow-dot" /> VEJA EM 1 MINUTO</div>
            <h2>Como gerar a sua planta de situação</h2>
            <ol>
              <li>Digite o CEP, o endereço ou cole as coordenadas do Google Maps.</li>
              <li>Escolha o raio e clique em <b>Gerar planta</b>.</li>
              <li>Se o lote não estiver no círculo, clique nele no mapa para ajustar.</li>
              <li>Baixe o DXF e abra no seu CAD, já nas coordenadas UTM reais.</li>
            </ol>
            <button className="button button-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Gerar a minha agora <ArrowRight size={17} /></button>
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'VideoObject',
          name: 'Como gerar a planta de situação pelo CEP, grátis, em DXF',
          description: 'Planta de situação com as ruas reais, nomes, norte e coordenadas UTM, gerada pelo CEP no site do Kit Projetista e baixada em DXF georreferenciado.',
          thumbnailUrl: 'https://i.ytimg.com/vi/HI89SHBiOKE/hqdefault.jpg',
          uploadDate: '2026-10-28T12:00:00-03:00',
          embedUrl: 'https://www.youtube.com/embed/HI89SHBiOKE',
          contentUrl: 'https://www.youtube.com/shorts/HI89SHBiOKE',
        }) }} />

        <div className="situacao-texto">
          <h2>O que é a planta de situação?</h2>
          <p>É o desenho que mostra onde o lote fica na cidade: as ruas em volta, com os nomes, a quadra, o norte e, em muitas prefeituras, a distância até a esquina mais próxima. Ela é pedida na aprovação de projeto, no alvará de construção, na regularização e em vários processos de cartório.</p>
          <h3>Como usar o arquivo</h3>
          <p>Abra o DXF no seu CAD, copie o desenho para a prancha e ajuste a escala (é comum 1:1000 ou 1:2000). O arquivo vem georreferenciado, nas coordenadas UTM reais (SIRGAS 2000): o levantamento topográfico e o KML do Google Earth caem no lugar certo por cima dele. Se preferir o lote no ponto 0,0 do desenho, escolha isso antes de baixar. O círculo marca o ponto encontrado pelo endereço; se o lote estiver em outro lugar, clique nele no mapa antes de baixar e a planta se recentraliza ali. Confira as divisas com o levantamento ou a matrícula, porque o mapa é uma referência, não um levantamento topográfico.</p>
          <h3>De onde vêm os dados?</h3>
          <p>As ruas e edificações vêm do OpenStreetMap, um mapa aberto mantido por voluntários. Em cidades grandes ele costuma ser bem completo; em loteamentos novos pode faltar alguma rua. O CEP é consultado no ViaCEP. Tudo é feito no seu navegador: o desenho não passa pelos nossos servidores.</p>
        </div>

        <div className="privacy-card" style={{ marginTop: 28 }}>
          <ShieldCheck size={26} strokeWidth={1.6} />
          <div>
            <h3>Quer isso direto no AutoCAD?</h3>
            <p>O Kit Projetista desenha a planta de situação com o comando KPSITUACAO, no ponto que você escolher, e liga o satélite do próprio AutoCAD por baixo. Grátis para sempre dentro do Kit, junto com dezenas de ferramentas pagas para projeto e aprovação.</p>
            <a href={rota('')}>Conhecer o Kit Projetista <ArrowRight size={14} /></a>
          </div>
        </div>
      </section>

      <TesteModal aberto={testeAberto} fechar={() => setTesteAberto(false)} />
    </Layout>
  );
}
