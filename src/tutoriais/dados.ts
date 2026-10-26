// Páginas "como fazer" (uma por tarefa que o projetista pesquisa no Google).
// Cada item vira /<slug>/, entra no menu Tutoriais, no sitemap e ganha título e descrição próprios.
// Para criar uma página nova, é só acrescentar um item aqui.

export type Tutorial = {
  slug: string;
  /** Título da aba e do Google (até ~60 caracteres). */
  titulo: string;
  /** Descrição do Google (até ~155 caracteres). */
  descricao: string;
  /** Rótulo curto no menu e nos cartões. */
  curto: string;
  selo: string;
  h1: string;
  destaque: string;
  chamada: string;
  video?: { mp4: string; poster: string; legenda: string };
  /** Vídeo do YouTube (o ID, o que vem depois de watch?v= ou /shorts/). Vazio = sem vídeo. */
  youtube?: string;
  /** Guia simples, passo a passo (ex.: instalação). Usado no lugar da comparação manual × Kit. */
  guia?: { titulo: string; passos: { titulo: string; texto: string }[] };
  /** O jeito de sempre, no AutoCAD puro. */
  manual?: { titulo: string; passos: string[]; problema: string };
  /** O jeito com o Kit. */
  kit?: { comando: string; passos: string[]; gratis?: string };
  perguntas: { p: string; r: string }[];
};

export const TUTORIAIS: Tutorial[] = [
  {
    slug: 'como-instalar-kit-projetista',
    titulo: 'Como instalar o Kit Projetista e testar grátis por 7 dias',
    descricao: 'Passo a passo em vídeo para baixar, instalar e abrir o Kit Projetista no AutoCAD: cadastro no site, avisos do navegador e do Windows e a aba do Kit.',
    curto: 'Instalar o Kit',
    selo: 'TUTORIAL · INSTALAÇÃO',
    h1: 'Como instalar o Kit Projetista e',
    destaque: 'testar grátis por 7 dias.',
    chamada: 'Do site até as ferramentas abertas no AutoCAD em menos de 2 minutos. Veja o vídeo ou siga os passos escritos.',
    youtube: '',
    guia: {
      titulo: 'Passo a passo',
      passos: [
        { titulo: 'Peça o teste no site', texto: 'Em kitprojetista.com.br, clique em "Teste Gratuito por 7 dias", preencha o nome e o e-mail (o WhatsApp é opcional) e clique em "Liberar download".' },
        { titulo: 'Baixe o instalador', texto: 'Clique em "Baixar o Kit". Se o Chrome mostrar um aviso sobre o arquivo, clique no aviso e depois em "Baixar arquivo suspeito". O aviso aparece porque o instalador ainda é novo; o arquivo é seguro.' },
        { titulo: 'Rode o instalador', texto: 'Abra a pasta Downloads e dê um duplo clique no instalador do Kit Projetista. Se o Windows mostrar "Editor desconhecido", clique em "Mais informações" e depois em "Executar assim mesmo".' },
        { titulo: 'Instale', texto: 'No instalador, clique no botão para instalar e confirme em "OK". Não precisa ser administrador do computador.' },
        { titulo: 'Abra o AutoCAD', texto: 'Abra o AutoCAD e aguarde carregar. No aviso de segurança, clique em "Always Load" (Sempre carregar): é o AutoCAD pedindo permissão para abrir o plugin.' },
        { titulo: 'Use o Kit', texto: 'Clique na aba "Kit Projetista", no topo da tela: ali ficam todas as ferramentas. Em "Central" você vê tudo o que o seu plano oferece. O teste de 7 dias começa no primeiro uso.' },
      ],
    },
    perguntas: [
      { p: 'Precisa de cartão de crédito para testar?', r: 'Não. O teste de 7 dias é liberado só com nome e e-mail, sem cartão e sem compromisso.' },
      { p: 'Por que o navegador e o Windows mostram aviso?', r: 'Porque o instalador é novo e ainda não tem assinatura digital, então o navegador e o Windows ainda não o conhecem. É um aviso padrão para programas novos; o arquivo vem do nosso próprio site e é seguro.' },
      { p: 'Funciona em qual AutoCAD?', r: 'No AutoCAD completo e no Civil 3D, do 2015 ao 2027, no Windows. O AutoCAD LT não aceita plugins.' },
      { p: 'O que acontece depois dos 7 dias?', r: 'As ferramentas pagas pedem a assinatura, e o Medidor de Linhas e a Planta de Situação continuam grátis para sempre.' },
    ],
  },
  {
    slug: 'area-dos-comodos-autocad',
    titulo: 'Como calcular a área dos cômodos no AutoCAD | Kit Projetista',
    descricao: 'Calcule a área e o perímetro de cada cômodo no AutoCAD com um clique dentro do ambiente, com rótulo e descontando pilares. Veja o jeito manual e o automático.',
    curto: 'Área dos cômodos',
    selo: 'TUTORIAL · ÁREA NO AUTOCAD',
    h1: 'Como calcular a área dos cômodos no AutoCAD',
    destaque: 'com um clique.',
    chamada: 'O jeito tradicional exige contornar cada ambiente e digitar o texto à mão. Veja o passo a passo e como fazer o mesmo clicando dentro do cômodo.',
    video: { mp4: 'videos/area-comodos-pt.mp4', poster: 'videos/area-comodos-pt.jpg', legenda: 'Área e perímetro de cada cômodo com um clique dentro do ambiente.' },
    manual: {
      titulo: 'No AutoCAD, sem plugin',
      passos: [
        'Digite _BOUNDARY (Contorno), clique dentro do cômodo e confirme: o AutoCAD cria uma polilinha fechada seguindo as paredes.',
        'Selecione a polilinha e abra as Propriedades (Ctrl+1): a área e o comprimento (perímetro) aparecem ali. Outra opção é o comando _AREA, clicando canto por canto.',
        'Converta a unidade: se o desenho está em centímetros, a área vem em cm² e precisa ser dividida por 10.000 para dar m².',
        'Escreva um texto com o nome do ambiente, a área e o perímetro e posicione no meio do cômodo.',
        'Repita para cada ambiente. Se uma parede mudar, refaça o contorno e corrija o texto.',
      ],
      problema: 'Numa planta com 10 ou 15 ambientes, isso leva de 30 minutos a uma hora, e é fácil esquecer de atualizar um texto depois de mexer numa parede.',
    },
    kit: {
      comando: 'KPAREA',
      passos: [
        'Digite KPAREA (ou clique em Área no Ribbon do Kit).',
        'Clique dentro do cômodo e digite o nome (Sala, Quarto 1, Banheiro...).',
        'O Kit encontra o contorno, calcula a área e o perímetro já em m² e m, desconta pilares e vazios internos e escreve o rótulo no meio do ambiente.',
        'Continue clicando nos outros cômodos. No fim, KPAREATABELA monta o quadro de áreas com todos eles.',
      ],
    },
    perguntas: [
      { p: 'Funciona com o desenho em centímetros ou milímetros?', r: 'Sim. O Kit lê a unidade do desenho e escreve a área sempre em m² e o perímetro em m, sem você precisar converter.' },
      { p: 'E se o cômodo tiver um pilar no meio?', r: 'O Kit desconta os pilares e vazios que estiverem dentro do contorno, como manda a conta de área útil.' },
      { p: 'E se eu mudar uma parede depois?', r: 'Meça de novo o ambiente que mudou com KPAREA e rode KPATUALIZAR: o quadro de áreas se atualiza de uma vez, sem redigitar nada.' },
      { p: 'Funciona no AutoCAD LT?', r: 'Não. O Kit funciona no AutoCAD completo e no Civil 3D, do 2015 ao 2027, no Windows. O AutoCAD LT não aceita plugins.' },
    ],
  },
  {
    slug: 'quadro-de-areas-autocad',
    titulo: 'Quadro de áreas automático no AutoCAD | Kit Projetista',
    descricao: 'Monte o quadro de áreas no AutoCAD com todos os ambientes, áreas e o total somado sozinho, e atualize depois de mudar a planta. Passo a passo manual e automático.',
    curto: 'Quadro de áreas',
    selo: 'TUTORIAL · QUADRO DE ÁREAS',
    h1: 'Quadro de áreas no AutoCAD',
    destaque: 'montado sozinho.',
    chamada: 'O quadro de áreas é obrigatório na maioria das aprovações e costuma ser montado à mão, número por número. Veja como fazer e como automatizar.',
    manual: {
      titulo: 'No AutoCAD, sem plugin',
      passos: [
        'Meça a área de cada ambiente (com _BOUNDARY e as Propriedades, ou com _AREA) e anote num papel ou planilha.',
        'Crie uma tabela com o comando _TABLE, com colunas para ambiente, área e perímetro.',
        'Digite cada nome e cada área na tabela, célula por célula.',
        'Na linha do total, use uma fórmula da tabela (=Sum) para somar a coluna de áreas.',
        'Quando a planta mudar, meça de novo e corrija os números na tabela.',
      ],
      problema: 'O risco é o quadro ficar diferente da planta: basta uma parede mudar e um número não ser corrigido. Em análise na prefeitura, isso vira comunique-se.',
    },
    kit: {
      comando: 'KPAREATABELA',
      passos: [
        'Meça os ambientes com KPAREA, clicando dentro de cada um (veja o tutorial de área dos cômodos).',
        'Digite KPAREATABELA e escolha Tudo, ou selecione só os ambientes que entram no quadro.',
        'Clique onde o quadro vai ficar: ele sai com o nome, a área e o perímetro de cada ambiente e o total somado.',
        'Mudou a planta? Meça de novo os ambientes alterados e rode KPATUALIZAR: o quadro se atualiza de uma vez.',
      ],
    },
    perguntas: [
      { p: 'Dá para escolher quais ambientes entram no quadro?', r: 'Sim. Na hora de montar, escolha Tudo ou selecione só os rótulos dos ambientes que você quer no quadro.' },
      { p: 'O quadro soma o total sozinho?', r: 'Sim, a linha de total já sai somada, e o quadro é refeito com os valores novos quando você roda KPATUALIZAR.' },
      { p: 'Posso levar o quadro para o Excel?', r: 'O quadro é uma tabela do próprio AutoCAD, então dá para copiar ou exportar como qualquer tabela. O Kit também gera planilhas nas ferramentas de quantitativo.' },
      { p: 'Preciso desenhar os contornos antes?', r: 'Não. O KPAREA encontra o contorno sozinho a partir das paredes quando você clica dentro do ambiente.' },
    ],
  },
  {
    slug: 'somar-linhas-por-layer-autocad',
    titulo: 'Como somar o comprimento de linhas por layer no AutoCAD',
    descricao: 'Some o comprimento de linhas e polilinhas por layer no AutoCAD (tubulação, fiação, rodapé, cerca) e gere a tabela de metragem. Grátis com o Kit Projetista.',
    curto: 'Somar linhas por layer',
    selo: 'TUTORIAL · METRAGEM NO AUTOCAD',
    h1: 'Como somar o comprimento das linhas por layer no AutoCAD',
    destaque: 'em segundos.',
    chamada: 'Tubulação, fiação, rodapé, guarda-corpo, cerca: o quantitativo depende de somar dezenas de linhas. Veja o caminho manual e a forma rápida, grátis.',
    manual: {
      titulo: 'No AutoCAD, sem plugin',
      passos: [
        'Use _QSELECT (Seleção rápida) para selecionar os objetos de um layer, por exemplo HIDRÁULICA-ÁGUA FRIA.',
        'As Propriedades mostram o comprimento de cada linha, mas não somam a seleção inteira.',
        'Para somar, use _DATAEXTRACTION (Extração de dados): escolha os objetos, marque a propriedade Comprimento, agrupe por layer e exporte para uma planilha.',
        'Some na planilha e repita para cada layer. Se o desenho mudar, refaça a extração.',
      ],
      problema: 'A extração de dados tem muitas telas e opções, e quem faz isso toda semana acaba dependendo de uma rotina LISP baixada da internet.',
    },
    kit: {
      comando: 'KPMEDIR',
      gratis: 'Medir e escrever a medida na linha é grátis para sempre no Kit, mesmo depois do teste.',
      passos: [
        'Digite KPMEDIR e selecione as linhas (ou a planta inteira).',
        'O Kit soma linhas, polilinhas, arcos e splines (e os objetos lineares do Civil 3D) e mostra o total de cada layer, na hora.',
        'KPMEDIDA escreve o comprimento no meio de cada linha, para conferir trecho por trecho.',
        'KPTABELA monta a tabela de metragem por layer, com custo, direto no desenho (recurso do plano).',
      ],
    },
    perguntas: [
      { p: 'É grátis mesmo?', r: 'Sim. O Medidor de Linhas (KPMEDIR e KPMEDIDA) continua grátis depois dos 7 dias de teste. A tabela de metragem com custo faz parte do plano.' },
      { p: 'Soma polilinhas e arcos também?', r: 'Sim. Linhas, polilinhas, arcos e splines entram na soma, cada um no seu layer. No Civil 3D, os objetos lineares também.' },
      { p: 'Serve para quantitativo de instalações?', r: 'É o uso mais comum: tubulação de água e esgoto, eletrodutos e fiação, rodapé, soleiras, cercas e guarda-corpos.' },
      { p: 'E se o desenho não tiver unidade definida?', r: 'O Kit avisa quando a unidade do desenho não está definida e mostra em qual unidade considerou as medidas, para você não errar a metragem.' },
    ],
  },
];

export const buscarTutorial = (slug: string) => TUTORIAIS.find((t) => t.slug === slug);
