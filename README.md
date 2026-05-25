# 🛍️ Catálogo Online do Brechó

Site de catálogo público conectado ao Notion. Sua mãe edita no Notion, o site atualiza sozinho.

**Tempo estimado de configuração: ~40 minutos**

---

## Visão geral do que você vai fazer

```
Sua mãe edita no Notion
        ↓
   Netlify busca os dados automaticamente
        ↓
   Site público atualiza na hora
        ↓
   Clientes veem as peças e chamam no WhatsApp
```

---

## ETAPA 1 — Configurar o Notion

### 1.1 — Criar o banco de dados

1. Acesse [notion.so](https://notion.so) e faça login
2. Na barra lateral, clique em **"+ Adicionar uma página"**
3. Nomeie como **"Catálogo do Brechó"**
4. Digite `/tabela` e selecione **"Tabela — Página inteira"**

### 1.2 — Configurar as colunas

Delete as colunas padrão e crie exatamente estas:

| Coluna       | Tipo no Notion     | Para que serve                          |
|--------------|--------------------|-----------------------------------------|
| Nome         | Título (padrão)    | Nome da peça                            |
| Categoria    | Seleção            | Vestidos, Blusas, Calças, etc.          |
| Tamanho      | Texto              | PP, P, M, G, GG, 38, 40…               |
| Preço        | Número             | Valor em reais (só o número, sem R$)    |
| Descrição    | Texto              | Detalhes da peça (opcional)             |
| Emoji        | Texto              | Um emoji que representa a peça (👗 👚 🧥) |
| Foto         | Arquivos e mídia   | Foto da peça (do celular)               |
| Nova         | Caixa de seleção   | Marcar quando for novidade              |
| Vendida      | Caixa de seleção   | Marcar quando a peça for vendida        |

> 💡 **Dica:** Na coluna Categoria, adicione as opções: Vestidos, Blusas, Calças, Casacos, Saias, Acessórios, Outros

### 1.3 — Criar a integração (chave de acesso)

1. Acesse [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Clique em **"+ Nova integração"**
3. Nome: `Catálogo Brechó`
4. Associe ao workspace correto
5. Em "Capacidades", deixe apenas **"Ler conteúdo"** marcado
6. Clique em **"Enviar"**
7. **Copie o "Token interno de integração"** — começa com `secret_...`
   - Guarde em algum lugar seguro! (ex: bloco de notas)

### 1.4 — Conectar o banco à integração

1. Volte para a tabela do Catálogo no Notion
2. Clique nos **três pontinhos `...`** no canto superior direito da página
3. Clique em **"Conexões"** (ou "Connect to")
4. Busque e selecione **"Catálogo Brechó"**
5. Confirme

### 1.5 — Pegar o ID do banco de dados

1. Abra a tabela no navegador (não no app)
2. Olhe a URL: `https://www.notion.so/SeuNome/XXXXXXXX...XXXXXXXX?v=...`
3. O ID são os **32 caracteres** entre o último `/` e o `?`
4. Guarde esse ID também

---

## ETAPA 2 — Subir o site no Netlify

### 2.1 — Criar conta no Netlify

1. Acesse [netlify.com](https://netlify.com)
2. Clique em **"Sign up"** → entre com sua conta do GitHub (recomendado) ou email

### 2.2 — Criar o repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em **"+"** → **"New repository"**
3. Nome: `brecho` (ou qualquer nome)
4. Marque **"Public"**
5. Clique em **"Create repository"**

### 2.3 — Enviar os arquivos para o GitHub

**Opção mais fácil (pelo navegador):**

1. Na página do repositório, clique em **"uploading an existing file"**
2. Arraste todos os arquivos desta pasta:
   - `index.html`
   - `config.js`
   - `netlify.toml`
   - A pasta `netlify/` com o arquivo `netlify/functions/pecas.js`
3. Clique em **"Commit changes"**

> ⚠️ Importante: a pasta `netlify/functions/pecas.js` precisa manter essa estrutura de pastas!

**Opção pelo terminal:**
```bash
cd brecho-netlify
git init
git add .
git commit -m "catálogo do brechó"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/brecho.git
git push -u origin main
```

### 2.4 — Conectar o Netlify ao GitHub

1. No Netlify, clique em **"Add new site"** → **"Import an existing project"**
2. Selecione **"GitHub"**
3. Autorize o Netlify a acessar seus repositórios
4. Selecione o repositório `brecho`
5. Nas configurações de build:
   - **Build command:** deixe vazio
   - **Publish directory:** `.` (ponto)
6. Clique em **"Deploy site"**

### 2.5 — Configurar as variáveis secretas do Notion

> As credenciais do Notion ficam no painel do Netlify (não no código), então ficam seguras!

1. No painel do Netlify, vá em **"Site configuration"** → **"Environment variables"**
2. Clique em **"Add a variable"** e adicione:

   | Key               | Value                          |
   |-------------------|--------------------------------|
   | `NOTION_TOKEN`    | `secret_SeuTokenAqui...`       |
   | `NOTION_DATABASE` | `SeuIdDoBancoDeDadosAqui`      |

3. Clique em **"Save"**
4. Vá em **"Deploys"** → clique em **"Trigger deploy"** → **"Deploy site"**

Pronto! Após o deploy (1-2 minutos), o site estará no ar. O Netlify mostra o link — algo como `brecho-seunome.netlify.app`.

---

## ETAPA 3 — Personalizar o site

Edite o arquivo `config.js`:

```javascript
window.BRECHO_CONFIG = {
  nomeBrecho: "Brechó da Dona Fulana",  // ← nome do brechó
  whatsapp:   "5511999998888",           // ← 55 + DDD + número (só dígitos)
};
```

Salve, faça o commit e push — o Netlify atualiza o site automaticamente em 1 minuto.

---

## Como sua mãe vai usar no dia a dia

### 📱 Baixar o app Notion no celular
1. Buscar "Notion" na App Store ou Play Store
2. Fazer login com a conta que tem o catálogo

### ➕ Adicionar uma peça nova
1. Abrir a tabela "Catálogo do Brechó"
2. Tocar no **`+`** no final da lista (ou "Nova entrada")
3. Preencher: Nome, Categoria (selecionar), Tamanho, Preço
4. Tocar em **Foto** → escolher da galeria ou tirar foto na hora
5. Colocar um emoji no campo **Emoji** (ex: 👗)
6. Marcar **Nova** como ✅ se for novidade
7. Fechar — pronto! Aparece no site em segundos

### ✅ Marcar como vendida
1. Tocar na linha da peça na tabela
2. Marcar **Vendida** como ✅
3. A peça some dos disponíveis no site automaticamente

### 🗑️ Remover uma peça
1. Pressionar e segurar a linha na tabela
2. Tocar em **"Deletar"**

---

## Personalizando as cores

No `index.html`, dentro do `<style>`, edite as variáveis CSS:

```css
:root {
  --terra:       #5C3D2E;  /* cor principal (marrom) */
  --terra-light: #8C5E45;  /* versão mais clara */
  --creme:       #F5EDE6;  /* fundo suave */
  --creme-dark:  #EDE0D4;  /* fundo do hero */
}
```

Para uma paleta diferente, por exemplo rosa:
```css
--terra:       #7A3552;
--terra-light: #A85070;
--creme:       #FAF0F4;
--creme-dark:  #F5E0EA;
```

---

## Domínio personalizado (opcional)

Para ter um endereço como `brecho-da-maria.com.br`:

1. Comprar o domínio (ex: na [Registro.br](https://registro.br) por ~R$ 40/ano)
2. No painel do Netlify → **"Domain management"** → **"Add custom domain"**
3. Seguir as instruções para apontar o DNS

---

## ❓ Problemas comuns

**O site mostra "Site em configuração"?**
→ Verifique se as variáveis `NOTION_TOKEN` e `NOTION_DATABASE` estão corretas no Netlify
→ Verifique se a integração foi conectada ao banco no Notion (Passo 1.4)
→ Faça um novo deploy no Netlify

**As fotos não aparecem?**
→ O Notion gera URLs temporárias para fotos. Se sumirem, sua mãe pode re-fazer upload da foto no Notion.
→ Para fotos permanentes, use URLs externas (Imgur, Google Photos) no campo Foto

**Quero adicionar uma nova categoria?**
→ No Notion, clique na coluna Categoria → edite as opções de seleção
→ Não precisa alterar o código — o site cria os filtros automaticamente!
