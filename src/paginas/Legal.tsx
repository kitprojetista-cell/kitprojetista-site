import { useEffect, useState } from 'react';
import Layout from '../Layout';
import { EMAIL_CONTATO, rota } from '../config';

type Secao = { titulo: string; paragrafos?: string[]; itens?: string[] };
type Texto = { selo: string; titulo: string; destaque: string; atualizada: string; rotuloData?: string; intro: string; secoes: Secao[] };

const contato = `Contato: ${EMAIL_CONTATO} · WhatsApp (19) 99279-7870.`;

export const PRIVACIDADE_KIT: Texto = {
  selo: 'PRIVACIDADE',
  titulo: 'Política de privacidade',
  destaque: 'Kit Projetista.',
  atualizada: '24 de outubro de 2026',
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
      paragrafos: ['Quando você pede o teste grátis, fala com a gente pelo formulário "Vamos conversar" ou se inscreve como testador da Calculadora do Projetista, recebemos por e-mail o que você preencher (nome, e-mail, WhatsApp, cidade, mensagem e plano de interesse). Usamos esses dados só para liberar o teste, responder você, enviar o convite de teste do app e, se você marcar que aceita, mandar e-mails sobre o Kit Projetista. Você pode cancelar esses e-mails a qualquer momento. O envio passa pelo serviço FormSubmit, que entrega a mensagem na nossa caixa de e-mail. O site não usa anúncios nem cookies. Para saber quantas pessoas visitam o site e de onde vêm (por exemplo, Facebook ou YouTube), usamos o Cloudflare Web Analytics, que conta as visitas de forma anônima, sem cookies e sem identificar quem você é.'],
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
      paragrafos: ['O plugin não usa ferramentas de análise, redes de publicidade nem SDKs de terceiros. Não vendemos, alugamos nem compartilhamos seus dados com outras empresas, inclusive empresas ligadas a nós. Os únicos terceiros que recebem dados são as plataformas de venda e pagamento (Hotmart, Autodesk e PayPal), só com os dados necessários para a compra, o serviço que entrega os formulários do site por e-mail e o Cloudflare Web Analytics, que recebe só dados anônimos de visita ao site. Só trabalhamos com plataformas que se comprometem a proteger esses dados no mesmo nível desta política e da LGPD. Também podemos fornecer dados quando a lei ou uma ordem judicial exigir.'],
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
  atualizada: '19 de outubro de 2026',
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

export const TERMOS_KIT: Texto = {
  "selo": "TERMOS DE USO",
  "titulo": "Termos de uso",
  "destaque": "Kit Projetista.",
  "atualizada": "21 de outubro de 2026",
  "rotuloData": "Versão de",
  "intro": "Estes Termos regem o uso do Kit Projetista, conjunto de ferramentas (plugin) para AutoCAD e Civil 3D, desenvolvido e licenciado por Odovaldo Dossi de Lima, sob o nome Kit Projetista (\"nós\"). Ao instalar, ativar ou usar o Kit Projetista, você concorda com estes Termos. Se não concordar, não instale nem use o produto.",
  "secoes": [
    {
      "titulo": "1. Licença de uso",
      "paragrafos": [
        "1.1. Você não compra o software: você recebe uma licença de uso pessoal, não exclusiva e intransferível, válida pelo período contratado e para o plano escolhido.",
        "1.2. Cada licença vale para um computador, identificado pelo código da máquina. Para usar em outro computador, é preciso outra licença ou pedir ao suporte a transferência.",
        "1.3. O Kit Projetista, seu código, marca, ícones, manual e materiais pertencem a nós. Estes Termos não transferem nenhum direito de propriedade."
      ]
    },
    {
      "titulo": "2. O que não é permitido",
      "paragrafos": [
        "• Copiar, revender, alugar, emprestar ou distribuir o Kit Projetista ou a sua chave de ativação.",
        "• Compartilhar a chave com outras pessoas ou usar a mesma licença em mais computadores do que o contratado.",
        "• Descompilar, fazer engenharia reversa ou modificar o software, ou tentar burlar a licença, o período de teste ou a assinatura digital.",
        "• Usar o Kit Projetista para atividades ilegais ou com programas sem licença válida.",
        "O descumprimento pode levar ao cancelamento da licença, sem reembolso, além das medidas legais cabíveis."
      ]
    },
    {
      "titulo": "3. Responsabilidade técnica e conferência dos resultados",
      "paragrafos": [
        "3.1. O Kit Projetista é uma ferramenta de apoio. Medições, quantitativos, cotas, quadros de áreas (inclusive NBR 12721), memoriais descritivos, verificações de acessibilidade e de iluminação e ventilação e orçamentos dependem do desenho, das configurações e das informações fornecidas por você.",
        "3.2. Cabe a você conferir todos os resultados antes de usá-los. A responsabilidade técnica pelo projeto, pelos documentos entregues a clientes, prefeituras, cartórios e órgãos públicos e pela respectiva ART ou RRT é sempre do profissional habilitado que os assina.",
        "3.3. As tabelas de preços (como a SINAPI), normas e códigos de obras usados como referência podem mudar. Confira sempre a versão vigente aplicável ao seu projeto."
      ]
    },
    {
      "titulo": "4. Garantia e limite de responsabilidade",
      "paragrafos": [
        "4.1. Trabalhamos para que o Kit Projetista funcione como descrito na página de vendas e no manual, e corrigimos os defeitos comunicados ao suporte. Não garantimos que o software seja livre de erros ou compatível com todas as configurações de computador e versões de AutoCAD.",
        "4.2. Na máxima extensão permitida pela lei, não respondemos por lucros cessantes, perda de dados, atrasos de projeto ou danos indiretos decorrentes do uso do Kit Projetista, e nossa responsabilidade total fica limitada ao valor pago por você nos últimos 12 meses. Esta cláusula não afasta os direitos garantidos ao consumidor pelo Código de Defesa do Consumidor.",
        "4.3. Recomendamos manter cópias de segurança dos seus desenhos."
      ]
    },
    {
      "titulo": "5. Teste, assinatura, cancelamento e reembolso",
      "paragrafos": [
        "5.1. Ao instalar, você tem 7 dias de teste gratuito com todas as ferramentas liberadas. Depois disso, é preciso uma licença ativa.",
        "5.2. As assinaturas são vendidas pela Hotmart ou pela loja de aplicativos da Autodesk, com os preços e as condições de renovação informados no momento da compra. O pagamento é processado por essas plataformas.",
        "5.3. A renovação não é automática: para parar de usar, basta não renovar. As ferramentas deixam de funcionar ao fim do período já pago; os seus desenhos continuam normais.",
        "5.4. Você pode desistir da compra em até 7 dias e receber o valor de volta, conforme o Código de Defesa do Consumidor, pedindo o reembolso pela plataforma onde comprou.",
        "5.5. O preço de fundador, quando oferecido, é mantido nas renovações enquanto a assinatura continuar ativa sem interrupção."
      ]
    },
    {
      "titulo": "6. Atualizações e suporte",
      "paragrafos": [
        "6.1. Enquanto a licença estiver ativa, você recebe as atualizações do seu plano. Podemos alterar, melhorar, mover entre planos ou retirar ferramentas, avisando nas novidades da versão; ferramentas já pagas continuam disponíveis até o fim do período contratado.",
        "6.2. O suporte é feito por e-mail (contato@kitprojetista.com.br) e WhatsApp ((19) 99279-7870), em dias úteis e horário comercial."
      ]
    },
    {
      "titulo": "7. Privacidade",
      "paragrafos": [
        "O tratamento de dados pessoais segue a Política de Privacidade do Kit Projetista, que acompanha o produto e está disponível na aba Licença do plugin."
      ]
    },
    {
      "titulo": "8. Marcas de terceiros",
      "paragrafos": [
        "AutoCAD e Civil 3D são marcas registradas da Autodesk, Inc. O Kit Projetista é um produto independente, sem vínculo com a Autodesk. Você precisa de uma licença válida do AutoCAD ou do Civil 3D para usar o Kit Projetista."
      ]
    },
    {
      "titulo": "9. Alterações destes Termos",
      "paragrafos": [
        "Podemos atualizar estes Termos. A versão nova vale a partir do aceite no instalador ou do uso continuado depois do aviso. A data no topo indica a versão em vigor."
      ]
    },
    {
      "titulo": "10. Lei e foro",
      "paragrafos": [
        "Estes Termos seguem a lei brasileira. Fica eleito o foro do domicílio do consumidor; quando o cliente for pessoa jurídica que use o produto em sua atividade empresarial, fica eleito o foro da comarca de Paulínia/SP."
      ]
    }
  ]
};

export const TERMS_KIT_EN: Texto = {
  "selo": "TERMS OF USE",
  "titulo": "Terms of use",
  "destaque": "Kit Projetista.",
  "atualizada": "October 21, 2026",
  "rotuloData": "Version of",
  "intro": "These Terms govern the use of Kit Projetista, a set of tools (plugin) for AutoCAD and Civil 3D, developed and licensed by Odovaldo Dossi de Lima under the name Kit Projetista (\"we\"). By installing, activating or using Kit Projetista you agree to these Terms. If you do not agree, do not install or use the product. In case of conflict, the Portuguese version prevails.",
  "secoes": [
    {
      "titulo": "1. License",
      "paragrafos": [
        "1.1. You do not buy the software: you receive a personal, non-exclusive, non-transferable license to use it for the paid period and the chosen plan.",
        "1.2. Each license is valid for one computer, identified by its machine code. Using it on another computer requires another license or a transfer requested from support.",
        "1.3. Kit Projetista, its code, brand, icons, manual and materials belong to us. These Terms transfer no ownership rights."
      ]
    },
    {
      "titulo": "2. What is not allowed",
      "paragrafos": [
        "• Copying, reselling, renting, lending or distributing Kit Projetista or its activation key.",
        "• Sharing the key or using one license on more computers than purchased.",
        "• Decompiling, reverse engineering or modifying the software, or trying to bypass the license, the trial period or the digital signature.",
        "• Using Kit Projetista for illegal activities or with unlicensed software.",
        "Breaching these rules may lead to cancellation of the license without refund, plus applicable legal measures."
      ]
    },
    {
      "titulo": "3. Professional responsibility and checking results",
      "paragrafos": [
        "3.1. Kit Projetista is a support tool. Measurements, takeoffs, dimensions, area schedules (including NBR 12721), lot descriptions, accessibility and lighting checks and cost estimates depend on the drawing, the settings and the information you provide.",
        "3.2. You must check all results before using them. Professional responsibility for the design, for documents delivered to clients, city halls, registries and public agencies, and for the corresponding ART or RRT always lies with the licensed professional who signs them.",
        "3.3. Price tables (such as SINAPI), standards and building codes used as references may change. Always check the version in force for your project."
      ]
    },
    {
      "titulo": "4. Warranty and limitation of liability",
      "paragrafos": [
        "4.1. We work to make Kit Projetista behave as described on the sales page and in the manual, and we fix defects reported to support. We do not warrant that the software is error-free or compatible with every computer setup and AutoCAD version.",
        "4.2. To the maximum extent permitted by law, we are not liable for lost profits, data loss, project delays or indirect damages arising from the use of Kit Projetista, and our total liability is limited to the amount you paid in the last 12 months. This clause does not remove consumer rights under the Brazilian Consumer Protection Code.",
        "4.3. We recommend keeping backups of your drawings."
      ]
    },
    {
      "titulo": "5. Trial, subscription, cancellation and refund",
      "paragrafos": [
        "5.1. After installing, you get a free 7-day trial with every tool unlocked. After that, an active license is required.",
        "5.2. Subscriptions are sold through Hotmart or the Autodesk app store, at the prices and renewal terms shown at checkout. Payment is processed by those platforms.",
        "5.3. Renewal is not automatic: to stop using it, simply do not renew. The tools stop working at the end of the period already paid; your drawings are not affected.",
        "5.4. You may withdraw from the purchase within 7 days and get your money back, by requesting a refund on the platform where you bought.",
        "5.5. Founder pricing, when offered, is kept on renewals while the subscription remains active without interruption."
      ]
    },
    {
      "titulo": "6. Updates and support",
      "paragrafos": [
        "6.1. While your license is active you receive the updates for your plan. We may change, improve, move between plans or remove tools, announcing it in the release notes; tools already paid for remain available until the end of the paid period.",
        "6.2. Support is provided by e-mail (contato@kitprojetista.com.br) and WhatsApp (+55 19 99279-7870) on business days, during business hours (Brasília time)."
      ]
    },
    {
      "titulo": "7. Privacy",
      "paragrafos": [
        "Personal data is handled under the Kit Projetista Privacy Policy, which ships with the product and is available on the plugin's License tab."
      ]
    },
    {
      "titulo": "8. Third-party trademarks",
      "paragrafos": [
        "AutoCAD and Civil 3D are registered trademarks of Autodesk, Inc. Kit Projetista is an independent product, not affiliated with Autodesk. A valid AutoCAD or Civil 3D license is required to use Kit Projetista."
      ]
    },
    {
      "titulo": "9. Changes to these Terms",
      "paragrafos": [
        "We may update these Terms. The new version applies from its acceptance in the installer or from continued use after notice. The date at the top shows the version in force."
      ]
    },
    {
      "titulo": "10. Governing law and venue",
      "paragrafos": [
        "These Terms are governed by Brazilian law. The courts of the consumer's domicile have jurisdiction; for business customers using the product in their commercial activity, the courts of Paulínia, São Paulo, Brazil."
      ]
    }
  ]
};

export const PRIVACY_KIT_EN: Texto = {
  selo: 'PRIVACY',
  titulo: 'Privacy policy',
  destaque: 'Kit Projetista.',
  atualizada: 'October 24, 2026',
  rotuloData: 'Updated on',
  intro: 'Kit Projetista is a plugin for AutoCAD and Civil 3D that runs on your computer. It requires no sign-up, does not send your drawings anywhere and does not collect usage data. This policy explains the little it stores and what happens when you use our website, buy or ask for support. In case of conflict, the Portuguese version prevails.',
  secoes: [
    { titulo: 'Who we are', paragrafos: [`Kit Projetista, responsible for the plugin, the website and support. Contact: ${EMAIL_CONTATO} · WhatsApp +55 19 99279-7870.`] },
    {
      titulo: 'What stays only on your computer',
      itens: [
        'Your drawings. The plugin reads and changes only the drawings open in AutoCAD, when you use a command. Nothing in the drawing is sent out.',
        'Settings (units, layers, tool options), in %APPDATA%\\KitProjetista.',
        'License and trial period. The activation key and the trial start date are stored on your computer, protected by a digital signature.',
        'Error log. If a command fails, the technical details go to the erros.log file, in the same folder. It only leaves your computer if you send it to support yourself.',
      ],
    },
    {
      titulo: 'Computer code',
      paragrafos: ['To tie the license to your computer, the plugin calculates a computer code (starting with M2-) from hardware and Windows identifiers. These identifiers go through a cryptographic hash function (SHA-256): the code does not reveal the original numbers and does not identify you personally. The code is only sent if you click Copy computer code and send it to us to receive your key.'],
    },
    {
      titulo: 'What the plugin sends over the internet',
      paragrafos: ['No data is sent automatically. The plugin has no telemetry, ads or tracking. The subscription and support buttons only open your WhatsApp or your e-mail with a ready message, and you decide whether to send it.'],
    },
    {
      titulo: 'Our website and forms',
      paragrafos: ['When you request the free trial, contact us through the "Let\'s talk" form or sign up as a tester of the Calculadora do Projetista app, we receive by e-mail what you fill in (name, e-mail, WhatsApp, city, message and plan of interest). We use this data only to unlock the trial, reply to you, send the app test invitation and, if you agree, send e-mails about Kit Projetista. You can stop these e-mails at any time. Forms are delivered by the FormSubmit service, which sends the message to our inbox. The website uses no ads or cookies. To know how many people visit the website and where they come from (for example, Facebook or YouTube), we use Cloudflare Web Analytics, which counts visits anonymously, without cookies and without identifying you.'],
    },
    {
      titulo: 'Purchases',
      paragrafos: ['Purchases are made through Hotmart or the Autodesk App Store, depending on where you subscribed. Payment data is handled by those platforms, under their privacy policies; we do not receive your card number. We receive your name, e-mail and the plan purchased, used to issue the key, provide support and tell you about product updates.'],
    },
    {
      titulo: 'Support',
      paragrafos: ['When you talk to us by e-mail or WhatsApp, we use the conversation and the computer code to help you and to issue or reissue the key.'],
    },
    {
      titulo: 'Third parties and sharing',
      paragrafos: ['The plugin uses no analytics tools, ad networks or third-party SDKs. We do not sell, rent or share your data with other companies, including companies related to us. The only third parties that receive data are the sales and payment platforms (Hotmart, Autodesk and PayPal), with only the data needed for the purchase, the service that delivers the website forms by e-mail, and Cloudflare Web Analytics, which only receives anonymous website visit data. We only work with platforms committed to protecting this data at the same level as this policy and the Brazilian General Data Protection Law (LGPD). We may also provide data when required by law or a court order.'],
    },
    {
      titulo: 'How long we keep data and when we delete it',
      itens: [
        'On your computer: the plugin files stay until you uninstall the Kit and delete the %APPDATA%\\KitProjetista folder.',
        'Purchase and support data (name, e-mail, plan, computer code and conversations): kept while the license is active and for up to 12 months after it ends, for reactivation and support. After that, it is deleted.',
        'Website form data: kept for up to 12 months after the last contact, or until you ask us to delete it.',
        'Tax records of the sale: kept for the period required by Brazilian law.',
        'Deletion requests are handled within 15 days, except for what the law requires us to keep.',
      ],
    },
    {
      titulo: 'Your rights',
      paragrafos: [`You may ask at any time to see, correct or delete the data we hold about you, withdraw your consent or stop receiving our e-mails, by writing to ${EMAIL_CONTATO}. This policy is also available in the plugin itself, in the License tab (KPLICENCA command). To delete what the plugin stores on your computer, uninstall the Kit and delete the %APPDATA%\\KitProjetista folder.`],
    },
    {
      titulo: 'Changes to this policy',
      paragrafos: ['If this policy changes, the date at the top will be updated and important changes will be announced on this page and in the version notes.'],
    },
  ],
};

type Link = { href: string; rotulo: string };

/** Outra língua da mesma página: link no topo e, se o navegador não estiver em português, um aviso. */
export default function Legal({ texto, voltar, outroIdioma }: { texto: Texto; voltar: Link; outroIdioma?: Link & { ingles: boolean } }) {
  const [sugerir, setSugerir] = useState(false);
  useEffect(() => {
    const lingua = (navigator.language || '').toLowerCase();
    if (outroIdioma?.ingles && !lingua.startsWith('pt')) setSugerir(true);
  }, [outroIdioma]);
  return (
    <Layout naInicial={false} en={outroIdioma?.ingles === false}>
      <section className="hero hero-legal section-padding">
        <div className="hero-orbit orbit-one" />
        <div className="eyebrow"><span className="eyebrow-dot" /> {texto.selo}</div>
        <h1>{texto.titulo} <em>{texto.destaque}</em></h1>
        <p className="hero-copy">{texto.rotuloData ?? 'Atualizada em'} {texto.atualizada}</p>
        {outroIdioma && (
          <p className="hero-copy" style={{ marginTop: 8 }}>
            {sugerir && <strong lang="en">This page is also available in English: </strong>}
            <a href={rota(outroIdioma.href)} lang={outroIdioma.ingles ? 'en' : 'pt-BR'} style={{ color: '#9fd6df', textDecoration: 'underline' }}>{outroIdioma.rotulo}</a>
          </p>
        )}
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
