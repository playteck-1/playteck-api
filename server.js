const express = require('express');
const gplay = require('google-play-scraper');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS total
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/api/apps/:pkg', async (req, res) => {
  const pkg = req.params.pkg;
  if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/i.test(pkg))
    return res.status(400).json({ error: 'Package inválido' });

  // Tenta pt_BR primeiro, depois en
  for (const [lang, country] of [['pt_BR','br'],['en','us']]) {
    try {
      const d = await gplay.app({ appId: pkg, lang, country, throttle: 2 });
      return res.json(d);
    } catch(e) { continue; }
  }
  res.status(404).json({ error: 'App não encontrado' });
});

app.get('/', (req, res) => res.json({ status:'ok', service:'PlayTeck API v1' }));
app.listen(PORT, () => console.log('PlayTeck API :' + PORT));
