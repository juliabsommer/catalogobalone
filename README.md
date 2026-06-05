# catalogobalone

Catálogo digital para um brechó feminino em Porto Alegre/RS. O Notion funciona como CMS — a proprietária gerencia o estoque pelo app mobile e as mudanças refletem no site sem nenhuma intervenção técnica.

**[catalogobalone.netlify.app](https://catalogobalone.netlify.app)**

---

## Contexto

O negócio não tinha presença digital estruturada: estoque gerenciado no papel, divulgação peça a peça no WhatsApp. As restrições do projeto eram claras — custo zero de infraestrutura, zero dependência técnica no dia a dia, e funcionar bem em mobile tanto para quem gerencia quanto para quem compra.

A escolha do Notion como CMS veio dessas restrições: a proprietária já usava a ferramenta, o app mobile é bom, e a API é simples o suficiente para expor via uma função serverless sem overhead desnecessário.

---

## Arquitetura

```
GitHub → Netlify CI/CD → site estático (index.html)
                       → Netlify Function (/pecas)
                              ↕
                         Notion API
```

```
.
├── index.html              # toda a UI — HTML, CSS e JS em arquivo único
├── config.js               # nome do brechó e número do WhatsApp
├── og-image.png            # preview Open Graph para WhatsApp/Instagram (1200×630)
├── favicon.svg
├── netlify.toml            # config de build, headers HTTP e image CDN
└── netlify/functions/
    └── pecas.js            # serverless function: proxy autenticado para a Notion API
```

O frontend é um arquivo HTML único sem build step — sem bundler, sem framework. A decisão foi deliberada: o projeto não tem colaboradores, não vai escalar para múltiplas páginas e qualquer pessoa com acesso ao repositório consegue ler e modificar o código sem setup.

---

## Serverless function

`pecas.js` é um proxy entre o frontend e a Notion API. Existe por um motivo específico: expor o `NOTION_TOKEN` diretamente no cliente seria um problema de segurança, mas o site não tem backend próprio.

A função usa o módulo `https` nativo do Node em vez de `fetch`. O bundler padrão do Netlify Functions tem incompatibilidade com a API `fetch` no Node 18 — a função retornava 404 silencioso até ser reescrita sem dependências externas.

```js
// netlify/functions/pecas.js
const https = require('https');

exports.handler = async () => {
  // autentica com NOTION_TOKEN da variável de ambiente
  // transforma a resposta da Notion API no formato esperado pelo frontend
  // retorna JSON com CORS aberto (leitura pública, sem escrita)
};
```

As credenciais ficam nas variáveis de ambiente do Netlify — nunca no código, nunca no repositório.

---

## Otimização de imagens

Fotos enviadas via Notion chegam do S3 da AWS sem compressão — câmeras de celular geram arquivos de 5–15 MB. O Netlify Image CDN resolve isso sem infraestrutura adicional:

```js
function otimizarFoto(url) {
  return `/.netlify/images?url=${encodeURIComponent(url)}&w=600&q=75`;
}
```

A transformação é cacheada na CDN depois da primeira requisição. O `netlify.toml` precisa declarar os domínios remotos permitidos — no caso, os buckets S3 da Notion.

---

## Segurança

Headers configurados no `netlify.toml` para todas as rotas:

```toml
Content-Security-Policy    = "default-src 'self'; script-src 'self' 'unsafe-inline' ..."
X-Frame-Options            = "DENY"
X-Content-Type-Options     = "nosniff"
Referrer-Policy            = "strict-origin-when-cross-origin"
Permissions-Policy         = "camera=(), microphone=(), geolocation=(), payment=()"
```

O site é somente leitura — a Netlify Function só faz `POST /query` na Notion API, nunca escrita.

---

## Open Graph

O WhatsApp não renderiza SVG em previews de link. O `og-image.png` foi gerado com Python/Pillow (1200×630) e a meta tag aponta para URL absoluta — WhatsApp ignora caminhos relativos no `og:image`.

---

## Configuração

Variáveis de ambiente necessárias no Netlify:

| Variável | Descrição |
|---|---|
| `NOTION_TOKEN` | Token da integração (secret_...) |
| `NOTION_DATABASE` | ID do banco de dados do Notion |

Personalização do brechó em `config.js`:

```js
window.BRECHO_CONFIG = {
  nomeBrecho: "Brechó Balonê",
  assinatura: "Fê Bassi",
  whatsapp: "5551999580604",
};
```

---

*[Júlia Sommer](https://github.com/juliabsommer)*
