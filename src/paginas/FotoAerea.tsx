import { FormEvent, useState } from 'react';
import { ArrowRight, Check, Copy, Globe, MapPinned, Search, ShieldCheck } from 'lucide-react';
import Layout from '../Layout';
import { rota } from '../config';
import { enviarFormulario } from '../formulario';

/** Serviços estaduais testados: o KPORTOFOTO usa sozinho, o cliente não precisa colar nada. */
const prontos = [
  { estado: 'Santa Catarina', fonte: 'SIG-SC, Governo de SC', ano: '2012', link: 'https://sigsc.sc.gov.br/sigserver/SIGSC/wms' },
  { estado: 'Paraná', fonte: 'Copel / Governo do PR', ano: '2012', link: 'https://geoserver.pr.gov.br/geoserver/ows' },
  { estado: 'Espírito Santo', fonte: 'GEOBASES / IEMA', ano: '2012 a 2015 (0,25 m)', link: 'https://ide.geobases.es.gov.br/geoserver/ows' },
];

const passos = [
  {
    icon: Search, tone: 'blue', title: '1. Procure o portal de mapas',
    description: 'Pesquise no Google: "geoportal" ou "mapa digital" mais o nome da sua cidade ou estado. Muitas prefeituras têm um (GeoSampa, GeoCuritiba, SIG da cidade...).',
  },
  {
    icon: Globe, tone: 'teal', title: '2. Ache o "serviço WMS"',
    description: 'No portal, procure por "WMS", "serviços web", "GetCapabilities" ou "geoserviços". O link costuma terminar em /wms, /ows ou /geoserver.',
  },
  {
    icon: Copy, tone: 'slate', title: '3. Cole no KPORTOFOTO',
    description: 'Copie o link e cole quando o Kit pedir. Ele lê o serviço sozinho, mostra as fotos aéreas que cobrem o lote e guarda para as próximas vezes.',
  },
];

export default function FotoAerea() {
  const [cidade, setCidade] = useState('');
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(false);
  const [ok, setOk] = useState(false);
  const [copiado, setCopiado] = useState('');

  const copiar = async (texto: string) => {
    try { await navigator.clipboard.writeText(texto); setCopiado(texto); setTimeout(() => setCopiado(''), 1800); } catch { /* sem área de transferência */ }
  };

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);
    setErro(false);
    try {
      await enviarFormulario(`Foto aérea — ${cidade}`, {
        Origem: 'Guia da foto aérea (KPORTOFOTO)',
        'Cidade/UF': cidade,
        'E-mail': email,
        'Link encontrado': link || 'Não informado',
      });
      setOk(true);
    } catch {
      setErro(true);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Layout naInicial={false}>
      <section className="hero hero-legal section-padding">
        <div className="hero-orbit orbit-one" />
        <div className="eyebrow"><span className="eyebrow-dot" /> KPORTOFOTO · GRÁTIS</div>
        <h1>A foto aérea oficial da sua cidade <em>por baixo do projeto.</em></h1>
        <p className="hero-copy">O KPORTOFOTO baixa a ortofoto do serviço de mapas da prefeitura ou do estado e encaixa no AutoCAD, georreferenciada sob a planta de situação. Sem login e sem custo.</p>
      </section>

      <section className="features-section section-padding">
        <div className="section-heading">
          <div><div className="eyebrow dark"><span className="eyebrow-dot" /> JÁ VEM PRONTO</div><h2>Nesses estados <span style={{ color: '#1e6887' }}>é só digitar o CEP.</span></h2></div>
          <p>Testamos os serviços estaduais abaixo: cobrem o estado inteiro e são de acesso livre. O Kit usa sozinho, você não precisa colar nada.</p>
        </div>
        <div className="features-grid features-grid-3">
          {prontos.map((p) => (
            <article className="feature-card feature-teal" key={p.estado}>
              <div className="feature-top"><MapPinned size={25} strokeWidth={1.6} /></div>
              <h3>{p.estado}</h3>
              <p>{p.fonte} · {p.ano}</p>
            </article>
          ))}
        </div>
        <p className="form-note" style={{ marginTop: 18 }}>
          Fora desses estados, o comando <b>KPSATELITE</b> já mostra o satélite do próprio AutoCAD em qualquer lugar (basta estar com a conta Autodesk conectada, como o AutoCAD já exige). O KPORTOFOTO é para quem quer a foto oficial, que costuma ser mais nítida.
        </p>
      </section>

      <section className="features-section section-padding" style={{ paddingTop: 0 }}>
        <div className="section-heading">
          <div><div className="eyebrow dark"><span className="eyebrow-dot" /> OUTRAS CIDADES</div><h2>Como achar o link <span style={{ color: '#1e6887' }}>da sua prefeitura.</span></h2></div>
          <p>Leva uns 5 minutos e você faz uma vez só: o Kit guarda o serviço.</p>
        </div>
        <div className="features-grid features-grid-3">
          {passos.map(({ icon: Icon, title, description, tone }) => (
            <article className={`feature-card feature-${tone}`} key={title}>
              <div className="feature-top"><Icon size={25} strokeWidth={1.6} /></div>
              <h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>

        <div className="privacy-card" style={{ marginTop: 28 }}>
          <Copy size={26} strokeWidth={1.6} />
          <div>
            <h3>Links que já testamos</h3>
            <p>Também servem para colar no KPORTOFOTO ou no QGIS.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'grid', gap: 8 }}>
              {prontos.map((p) => (
                <li key={p.link} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', fontSize: 13 }}>
                  <b style={{ minWidth: 120 }}>{p.estado}</b>
                  <code style={{ wordBreak: 'break-all', fontSize: 12 }}>{p.link}</code>
                  <button type="button" className="button button-outline" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => copiar(p.link)}>
                    {copiado === p.link ? 'Copiado' : 'Copiar'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="privacy-card" style={{ marginTop: 16 }}>
          <ShieldCheck size={26} strokeWidth={1.6} />
          <div>
            <h3>Cada serviço tem suas regras.</h3>
            <p>A imagem é baixada na hora, direto do serviço público, e o crédito vai escrito na legenda. Confira as regras de uso da sua prefeitura ou estado: a maioria é de acesso livre, mas algumas pedem crédito ou são só para consulta.</p>
            <a href={rota('privacidade/')}>Ver a política de privacidade <ArrowRight size={14} /></a>
          </div>
        </div>
      </section>

      <section id="pedir" className="contact-section section-padding">
        <div className="contact-panel">
          <div className="contact-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> NÃO ACHOU?</div>
            <h2>Mande sua cidade que <em>a gente procura.</em></h2>
            <p>Procuramos o serviço da sua cidade, testamos e, se funcionar, colocamos pronto no Kit para todo mundo da região. Respondemos por e-mail.</p>
            <div className="contact-detail"><span className="detail-line" /><span>Grátis, para quem usa o Kit</span></div>
          </div>

          {ok ? (
            <div className="success-state">
              <div className="success-icon"><Check size={26} /></div>
              <h3>Recebido!</h3>
              <p>Vamos procurar o serviço de {cidade.split('/')[0].trim() || 'sua cidade'} e te respondemos por e-mail.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={enviar}>
              <label>Cidade / UF (obrigatório)<input required type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Paulínia / SP" /></label>
              <label>E-mail (obrigatório)<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" /></label>
              <label>Se achou algum link, cole aqui<input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." /></label>
              {erro && <p className="form-error">Não foi possível enviar agora. Tente novamente em instantes.</p>}
              <button className="button button-primary" type="submit" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Pedir minha cidade'} <ArrowRight size={17} />
              </button>
              <p className="form-note">Usamos seu e-mail só para responder este pedido. Veja a <a href={rota('privacidade/')}>política de privacidade</a>.</p>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
