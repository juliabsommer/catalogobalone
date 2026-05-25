const https = require('https');

function notionQuery(token, database) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      page_size: 100,
      sorts: [{ property: 'Vendida', direction: 'ascending' }],
    });

    const options = {
      hostname: 'api.notion.com',
      path: `/v1/databases/${database}/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

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
    const response = await notionQuery(token, database);

    if (response.status !== 200) {
      return { statusCode: response.status, body: JSON.stringify({ error: response.body }) };
    }

    const data = JSON.parse(response.body);

    const pecas = data.results.map(page => {
      const p = page.properties;

      const fotos = p['Foto']?.files || [];
      const fotoUrl = fotos.length > 0
        ? (fotos[0].type === 'external' ? fotos[0].external.url : fotos[0].file.url)
        : null;

      return {
        id:           page.id,
        nome:         p['Nome']?.title?.[0]?.plain_text          || 'Sem nome',
        cat:          p['Categoria']?.select?.name               || 'Outros',
        tam:          p['Tamanho']?.rich_text?.[0]?.plain_text   || '',
        cor:          p['Cor']?.rich_text?.[0]?.plain_text       || '',
        medidas:      p['Medidas']?.rich_text?.[0]?.plain_text   || '',
        preco:        p['Preço']?.number                         || 0,
        parcelas:     p['Parcelas']?.number                      || 0,
        valorParcela: p['Valor Parcela']?.number                 || 0,
        desc:         p['Descrição']?.rich_text?.[0]?.plain_text || '',
        emoji:        p['Emoji']?.rich_text?.[0]?.plain_text     || '👗',
        nova:         p['Nova']?.checkbox                        || false,
        vendida:      p['Vendida']?.checkbox                     || false,
        foto:         fotoUrl,
      };
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(pecas),
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
