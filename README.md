# Site do Kit Projetista

Site do plugin Kit Projetista e da Calculadora do Projetista. React + Vite, publicado no GitHub Pages.

## Páginas

| Endereço | Conteúdo |
| --- | --- |
| `/` | Kit Projetista: recursos, planos (Hotmart), teste grátis e contato |
| `/calculadora/` | App Calculadora do Projetista e inscrição de testadores |
| `/privacidade/` | Política de privacidade do Kit e do site |
| `/calculadora/privacidade/` | Política de privacidade do app (link usado na Play Store) |

## O que mudar no dia a dia

Tudo em `src/config.ts`:

- `PLAY_STORE`: link do app na Play Store. Preenchido, troca "Quero ser testador" por "Baixar na Play Store".
- `YOUTUBE_SHORT`: ID do Short (o que vem depois de `/shorts/`). Preenchido, mostra o vídeo na página da Calculadora.
- `EMAIL_FORMULARIOS`: e-mail que recebe os formulários (via FormSubmit; na primeira mensagem chega um e-mail de ativação).
- `LINK_TESTE_GRATIS`: pasta liberada depois do formulário do teste grátis.

Os planos e links da Hotmart ficam em `src/paginas/Inicio.tsx`.

## Publicar

Todo push na branch `main` publica sozinho (GitHub Actions → Pages).

Domínio próprio: criar o arquivo `public/CNAME` com `kitprojetista.com.br`, configurar o DNS no registro.br
e informar o domínio em Settings → Pages.

## Rodar no computador

```
npm install
npm run dev
```
