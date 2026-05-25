// netlify/functions/pecas.js
// Esta função roda no servidor do Netlify e busca as peças do Notion.
// Ela resolve o problema de CORS (bloqueio do navegador direto na API do Notion).

exports.handler = async () => {
  const token    = process.env.NOTION_TOKEN;
  const database = process.env.NOTION_DATABASE;

  if (!token || !database) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Variáveis NOTION_TOKEN e NOTION_DATABASE não configuradas.' }),
    };
  }

  try {
    const resp = await fetch(`https://api.notion.com/v1/databases/${database}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 100,
        sorts: [{ property: 'Vendida', direction: 'ascending' }],
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return { statusCode: resp.status, body: JSON.stringify({ error: err }) };
    }

    const data = await resp.json();

    // Transforma o formato bruto do Notion em algo simples para o site
    const pecas = data.results.map(page => {
      const p = page.properties;

      // Pega a URL da foto (pode ser upload direto ou link externo)
      const fotos = p['Foto']?.files || [];
      const fotoUrl = fotos.length > 0
        ? (fotos[0].type === 'external' ? fotos[0].external.url : fotos[0].file.url)
        : null;

      return {
        id:       page.id,
        nome:     p['Nome']?.title?.[0]?.plain_text        || 'Sem nome',
        cat:      p['Categoria']?.select?.name             || 'Outros',
        tam:      p['Tamanho']?.rich_text?.[0]?.plain_text || '',
        preco:    p['Preço']?.number                       || 0,
        desc:     p['Descrição']?.rich_text?.[0]?.plain_text || '',
        emoji:    p['Emoji']?.rich_text?.[0]?.plain_text   || '👗',
        nova:     p['Nova']?.checkbox                      || false,
        vendida:  p['Vendida']?.checkbox                   || false,
        foto:     fotoUrl,
      };
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pecas),
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
