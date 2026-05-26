# Catálogo Brechó Balonê

**Case de produto · Desenvolvimento front-end + integração Notion CMS**

Site de catálogo digital para o Brechó Balonê — brechó feminino de Porto Alegre/RS fundado em 2010 pela Fê Bassi. O projeto nasceu da necessidade real da proprietária de divulgar peças pelo WhatsApp de forma organizada, sem depender de terceiros para atualizar o conteúdo.

🔗 **[catalogobalone.netlify.app](https://catalogobalone.netlify.app)**

---

## O problema

A Fê gerenciava o estoque manualmente — fotos no celular, preços no papel, divulgação peça por peça no WhatsApp. Não havia como mostrar tudo disponível de uma vez, e cada venda virava uma troca demorada de mensagens.

**Requisitos reais da cliente:**
- Atualizar peças sozinha, sem tocar em código
- Funcionar bem no celular (clientes e proprietária)
- Finalizar pedido direto pelo WhatsApp
- Custo zero de manutenção

---

## A solução

Catálogo estático com **Notion como CMS**. A proprietária gerencia tudo pelo app do Notion no celular — adiciona peça, coloca foto, marca como vendida — e o site atualiza automaticamente em segundos.

```
Notion (CMS)  →  Netlify Function  →  Site estático  →  WhatsApp
     ↑                                                      ↓
  Fê edita                                          Cliente finaliza pedido
```

---

## Stack

| Camada | Tecnologia | Decisão |
|---|---|---|
| Frontend | HTML + CSS + JS vanilla | Sem framework — zero build step, deploy instantâneo |
| CMS | Notion API | Familiaridade da cliente, app mobile excelente |
| Backend | Netlify Functions (Node.js) | Serverless — esconde credenciais, sem servidor próprio |
| Hospedagem | Netlify | Deploy automático via GitHub, HTTPS gratuito |
| Versionamento | GitHub | Histórico + CI/CD integrado ao Netlify |

---

## Funcionalidades

- **Catálogo com filtros** por categoria — gerados dinamicamente a partir dos dados do Notion
- **Três seções visuais** distintas: roupas, Espaço Boho (artigos esotéricos) e Mini Museu (peças retrô)
- **Seleção múltipla** de peças com carrinho flutuante
- **Mensagem automática para WhatsApp** com todas as peças selecionadas, tamanho, cor, medidas e preços (PIX e parcelado)
- **Tag "Desapego Novo"** para peças recém-adicionadas
- **Peças vendidas** somem do catálogo automaticamente ao marcar campo no Notion
- **Preço PIX e preço cartão** separados por peça
- **Código da peça** exibido no card e incluído na mensagem do pedido
- **Preview rico** no WhatsApp/Instagram via Open Graph (og:image PNG 1200×630)
- **Fallback para dados mock** caso a API do Notion esteja indisponível

---

## Arquitetura

```
catalogobalone.netlify.app
├── index.html          # Frontend completo (HTML + CSS + JS inline)
├── config.js           # Configurações do brechó (nome, WhatsApp)
├── favicon.svg         # Ícone do site
├── og-image.png        # Preview para redes sociais (1200×630)
└── netlify/
    └── functions/
        └── pecas.js    # Serverless function → Notion API
```

**Fluxo de dados:**
1. Cliente abre o site → JS chama `/.netlify/functions/pecas`
2. Netlify Function autentica na Notion API com token em variável de ambiente (nunca exposto no cliente)
3. Dados transformados e retornados como JSON
4. JS renderiza os cards dinamicamente

---

## Segurança

- Credenciais do Notion em **variáveis de ambiente** no Netlify — nunca no código
- Cabeçalhos HTTP de segurança configurados no `netlify.toml`:
  - `Content-Security-Policy` — bloqueia scripts de origens não autorizadas
  - `X-Frame-Options: DENY` — impede clickjacking
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` — desativa câmera, microfone, geolocalização e pagamento
- Site **somente leitura** — nenhuma escrita no Notion pelo frontend

---

## Desafios técnicos

**`fetch` nativo incompatível com Netlify Functions no Node 18**
A função serverless retornava 404. Causa: incompatibilidade entre o bundler padrão e a API `fetch`. Solução: reescrever usando o módulo `https` nativo do Node — zero dependências externas.

**og:image em SVG não renderiza no WhatsApp**
O preview do link aparecia em branco. Solução: gerar PNG 1200×630 com Python/Pillow substituindo o SVG.

**og:image com caminho relativo não carregava em alguns clientes**
WhatsApp exige URL absoluta no `og:image`. Corrigido apontando para `https://catalogobalone.netlify.app/og-image.png`.

---

## Entregáveis além do site

- **Guia PDF** para a proprietária gerenciar o catálogo pelo Notion (sem linguagem técnica)
- **Logo SVG** e favicon criados para o brechó
- **Repositório** com histórico completo de decisões e iterações

---

## Resultado

A Fê consegue adicionar uma peça nova em menos de 2 minutos pelo celular. O catálogo substitui as trocas de mensagens individuais — clientes navegam, selecionam o que querem e enviam o pedido completo de uma vez.

---

*Desenvolvido por [Júlia Sommer](https://github.com/juliabsommer)*
