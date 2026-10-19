import Layout from '../Layout';
import { EMAIL_CONTATO, rota } from '../config';

type Secao = { titulo: string; paragrafos?: string[]; itens?: string[] };
type Texto = { selo: string; titulo: string; destaque: string; atualizada: string; intro: string; secoes: Secao[] };

const contato = `Contato: ${EMAIL_CONTATO} · WhatsApp (19) 99279-7870.`;

export const PRIVACIDADE_KIT: Texto = {
  selo: 'PRIVACIDADE',
  titulo: 'Política de privacidade',
  destaque: 'Kit Projetista.',
  atualizada: '10 de outubro de 2026',
  intro: 'O Kit Projetista é um plugin para AutoCAD e Civil 3D que roda no seu computador. Ele não pede cadastro, não envia seus desenhos para lugar nenhum e não coleta dados de uso. Esta política explica o pouco que ele guarda e o que acontece quando você usa o nosso site, compra ou pede suporte.',
  secoes: [
    { titulo: 'Quem somos', paragrafos: [`Kit Projetista, responsável pelo plugin, pelo site e pelo atendimento. ${contato}`] },
    {
      titulo: 'O que fica só no seu computador',
      itens: [
        'Seus desenhos. O plugin lê e altera apenas os desenhos abertos no AutoCAD, quando você usa um comando. Nada do desenho é enviado para fora.',
        'Configurações (unidades, camadas, opções das ferramentas), em %APPDATA%\\KitProjetista.',
        'Licença e período de teste. A chave de ativação e a data de início do teste ficam gravadas no seu computador, protegidas por assinatura digital.',
        'Registro de erros. Se um comando falhar, o detalhe técnico fica no arquivo erros.log, na mesma pasta. Ele só sai do seu computador se você mesmo enviar ao suporte.',
      ],
    },
    {
      titulo: 'Código da máquina',
      paragrafos: ['Para ligar a licença ao seu computador, o plugin calcula um código da máquina (começa com M2-) a partir de identificadores do hardware e do Windows. Esses identificadores passam por uma função de resumo criptográfico (SHA-256): o código não revela os números originais e não identifica você pessoalmente. O código só é enviado se você clicar em Copiar código da máquina e mandar para nós, para receber a chave.'],
    },
    {
      titulo: 'O que o plugin envia pela internet',
      paragrafos: ['Nenhum dado é enviado automaticamente. O plugin não tem telemetria, anúncios nem rastreamento. Os botões de assinatura e suporte apenas abrem o seu WhatsApp ou o seu e-mail com uma mensagem pronta, e você decide se envia.'],
    },
    {
      titulo: 'Nosso site e formulários',
      paragrafos: ['Quando você pede o teste grátis, fala com a gente pelo formulário "Vamos conversar" ou se inscreve como testador da Calculadora do Projetista, recebemos por e-mail o que você preencher (nome, e-mail, WhatsApp, cidade, mensagem e plano de interesse). Usamos esses dados só para liberar o teste, responder você, enviar o convite de teste do app e, se você marcar que aceita, mandar e-mails sobre o Kit Projetista. Você pode cancelar esses e-mails a qualquer momento. O envio passa pelo serviço FormSubmit, que entrega a mensagem na nossa caixa de e-mail. O site não usa anúncios nem ferramentas de rastreamento.'],
    },
    {
      titulo: 'Compras',
      paragrafos: ['As compras são feitas pela Hotmart ou pela loja da Autodesk, conforme o lugar onde você assinou. Os dados de pagamento são tratados por essas plataformas, conforme as políticas de privacidade delas; nós não recebemos o número do seu cartão. Recebemos seu nome, e-mail e o plano comprado, usados para emitir a chave, prestar suporte e avisar sobre atualizações do produto.'],
    },
    {
      titulo: 'Suporte',
      paragrafos: ['Quando você fala com a gente por e-mail ou WhatsApp, usamos a conversa e o código da máquina para atender você e emitir ou reemitir a chave.'],
    },
    {
      titulo: 'Terceiros e compartilhamento',
      paragrafos: ['O plugin não usa ferramentas de análise, redes de publicidade nem SDKs de terceiros. Não vendemos, alugamos nem compartilhamos seus dados com outras empresas, inclusive empresas ligadas a nós. Os únicos terceiros que recebem dados são as plataformas de venda e pagamento (Hotmart, Autodesk e PayPal), só com os dados necessários para a compra, e o serviço que entrega os formulários do site por e-mail. Só trabalhamos com plataformas que se comprometem a proteger esses dados no mesmo nível desta política e da LGPD. Também podemos fornecer dados quando a lei ou uma ordem judicial exigir.'],
    },
    {
      titulo: 'Por quanto tempo guardamos e quando apagamos',
      itens: [
        'No seu computador: os arquivos do plugin ficam até você desinstalar o Kit e apagar a pasta %APPDATA%\\KitProjetista.',
        'Dados de compra e suporte (nome, e-mail, plano, código da máquina e conversas): guardados enquanto a licença estiver ativa e por até 12 meses depois do fim, para reativação e suporte. Depois disso, são apagados.',
        'Dados dos formulários do site: guardados por até 12 meses depois do último contato, ou até você pedir para apagar.',
        'Registros fiscais da venda: mantidos pelo prazo exigido pela legislação brasileira.',
        'Pedidos de exclusão são atendidos em até 15 dias, exceto o que a lei nos obriga a manter.',
      ],
    },
    {
      titulo: 'Seus direitos (LGPD)',
      paragrafos: [`Você pode pedir a qualquer momento para ver, corrigir ou apagar os dados que temos sobre você, revogar o seu consentimento ou deixar de receber nossos e-mails, escrevendo para ${EMAIL_CONTATO}. O texto desta política também fica no próprio plugin, na aba Licença (comando KPLICENCA). Para apagar o que o plugin guarda no seu computador, desinstale o Kit e apague a pasta %APPDATA%\\KitProjetista.`],
    },
    {
      titulo: 'Mudanças nesta política',
      paragrafos: ['Se esta política mudar, a data no topo será atualizada e as mudanças importantes serão avisadas nesta página e nas novidades da versão.'],
    },
  ],
};

export const PRIVACIDADE_APP: Texto = {
  selo: 'PRIVACIDADE',
  titulo: 'Política de privacidade',
  destaque: 'Calculadora do Projetista.',
  atualizada: '15 de outubro de 2026',
  intro: 'A Calculadora do Projetista é um aplicativo gratuito para Android que ajuda a calcular material de obra, organizar obras e projetos, montar listas de compras, comparar orçamentos e desenhar plantas (KPCad). Ele não pede cadastro, não coleta dados pessoais e não tem anúncios.',
  secoes: [
    { titulo: 'Quem somos', paragrafos: [`Kit Projetista, responsável pelo aplicativo. ${contato}`] },
    {
      titulo: 'O que fica só no seu celular',
      itens: [
        'Os valores que você digita nas calculadoras.',
        'Suas obras e projetos (nome, cliente e situação) e as medidas salvas em cada um.',
        'A lista de compras e os preços das lojas.',
        'A sua logo e os seus dados profissionais (nome ou empresa, telefone, CAU/CREA, e-mail), usados só no cabeçalho dos PDFs que você gera.',
        'As plantas do KPCad e os arquivos DXF e PDF que você abre nele.',
        'A chave do KPCad, se você ativar.',
        'Os orçamentos em PDF que você importa. O arquivo é lido no próprio aparelho; o app guarda só os itens e preços que você confirmar.',
        'Suas preferências (o que te trouxe ao app, estado escolhido para os preços).',
      ],
      paragrafos: ['Nada disso é enviado para nós nem para terceiros. Se você desinstalar o app ou apagar os dados dele nas configurações do Android, tudo é apagado.'],
    },
    {
      titulo: 'O que o app usa da internet',
      paragrafos: ['O app baixa, no máximo uma vez por dia, uma tabela pública de preços de referência (SINAPI) hospedada no GitHub. Nenhum dado seu é enviado nesse download. Como em qualquer acesso à internet, o servidor do GitHub recebe o endereço IP do aparelho; veja a política de privacidade do GitHub.'],
    },
    {
      titulo: 'Avisos (notificações), só se você ligar',
      paragrafos: [
        'O app pode avisar quando a tabela de preços for atualizada e quando sair novidade. Isso fica desligado até você aceitar, e dá para desligar a qualquer momento em Sobre › Avisos.',
        'Os avisos são entregues pelo Firebase Cloud Messaging, um serviço do Google. Quando você liga, o Firebase cria neste aparelho um identificador do aplicativo (token), que fica com o Google só para entregar as notificações. Os avisos vão para todos que ligaram, por assunto: o app não pede cadastro, não guarda nem envia esse identificador para nós e não envia dados das suas obras. Ao desligar, o identificador é apagado. Veja também a política de privacidade do Google.',
      ],
    },
    {
      titulo: 'Permissões',
      itens: [
        'Internet: para baixar a tabela de preços e, se você ligar os avisos, para recebê-los.',
        'Notificações (Android 13 ou mais novo): pedida só se você ligar os avisos.',
        'Sensor de movimento: usado pelo nível, sem permissão especial e sem guardar nada.',
      ],
      paragrafos: ['O app não acessa câmera, microfone, localização, contatos nem os seus arquivos por conta própria. Um arquivo (orçamento em PDF, planta em DXF ou PDF, imagem da logo) só é aberto quando você escolhe ou compartilha com o app.'],
    },
    {
      titulo: 'Compartilhamento',
      paragrafos: ['Quando você toca em "Enviar lista pelo WhatsApp" ou em compartilhar (lista, orçamento em PDF, planta em DXF ou PDF), o app abre o WhatsApp ou outro app escolhido por você com o conteúdo pronto. Você decide se envia e para quem.'],
    },
    {
      titulo: 'Código do celular e chave do KPCad',
      paragrafos: ['O KPCad faz parte do plano Essencial do Kit Projetista. Para ativar, o app mostra um "código deste celular", calculado no próprio aparelho a partir de um identificador que o Android dá a este app. Esse código não é enviado pelo app: só sai do celular se você mesmo mandar, para receber a sua chave. A chave é conferida no próprio aparelho, sem internet, e fica guardada só nele.'],
    },
    {
      titulo: 'Terceiros',
      paragrafos: ['O app não usa ferramentas de análise, publicidade nem rastreamento. O único serviço de terceiros é o Firebase Cloud Messaging (Google), usado só para entregar os avisos, se você ligar. Não vendemos nem compartilhamos dados, porque não recebemos dados do app.'],
    },
    {
      titulo: 'Teste antes do lançamento',
      paragrafos: ['Se você se inscreveu como testador no site, guardamos seu nome, e-mail do Google, cidade e perfil só para enviar o convite de teste pela Google Play e avisar sobre o lançamento. Esses dados são apagados quando você pedir, ou até 12 meses depois do lançamento.'],
    },
    {
      titulo: 'Crianças',
      paragrafos: ['O app não é voltado a crianças e não coleta dados de ninguém, incluindo menores de idade.'],
    },
    {
      titulo: 'Seus direitos (LGPD)',
      paragrafos: [`Você pode pedir para ver, corrigir ou apagar os dados de inscrição de testador escrevendo para ${EMAIL_CONTATO}. Pedidos são atendidos em até 15 dias.`],
    },
    {
      titulo: 'Responsabilidade',
      paragrafos: ['Os resultados são de apoio e pré-dimensionamento. Eles não substituem o projeto e a responsabilidade técnica de um profissional habilitado. Os preços do SINAPI são referência e podem ser diferentes dos preços das lojas.'],
    },
    {
      titulo: 'Mudanças nesta política',
      paragrafos: ['Se esta política mudar, a data no topo será atualizada e a nova versão ficará nesta página.'],
    },
  ],
};

export default function Legal({ texto, voltar }: { texto: Texto; voltar: { href: string; rotulo: string } }) {
  return (
    <Layout naInicial={false}>
      <section className="hero hero-legal section-padding">
        <div className="hero-orbit orbit-one" />
        <div className="eyebrow"><span className="eyebrow-dot" /> {texto.selo}</div>
        <h1>{texto.titulo} <em>{texto.destaque}</em></h1>
        <p className="hero-copy">Atualizada em {texto.atualizada}</p>
      </section>

      <section className="legal-section section-padding">
        <article className="legal-body">
          <p className="legal-intro">{texto.intro}</p>
          {texto.secoes.map((s) => (
            <section key={s.titulo}>
              <h2>{s.titulo}</h2>
              {s.itens && <ul>{s.itens.map((i) => <li key={i}>{i}</li>)}</ul>}
              {s.paragrafos?.map((p) => <p key={p}>{p}</p>)}
            </section>
          ))}
          <a className="legal-back" href={rota(voltar.href)}>← {voltar.rotulo}</a>
        </article>
      </section>
    </Layout>
  );
}
