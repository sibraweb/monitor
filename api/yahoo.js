export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { ticker, periods, interval } = req.query;
  if (!ticker) { res.status(400).json({ error: 'ticker requerido' }); return; }

  // Mapear interval a formato Yahoo Finance
  const intervalMap = {
    'day':   '1d',
    'week':  '1wk',
    'month': '1mo',
  };
  const yahooInterval = intervalMap[interval] || '1wk';

  // Calcular period1 según intervalo
  const n = parseInt(periods) || 60;
  const period2 = Math.floor(Date.now() / 1000);
  let period1;
  if (yahooInterval === '1d') {
    period1 = period2 - n * 24 * 3600;
  } else if (yahooInterval === '1wk') {
    period1 = period2 - n * 7 * 24 * 3600;
  } else {
    period1 = period2 - n * 30 * 24 * 3600;
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=${yahooInterval}&period1=${period1}&period2=${period2}&events=history`;

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      }
    });
    if (!resp.ok) {
      res.status(resp.status).json({ error: `Yahoo devolvió ${resp.status}` });
      return;
    }
    const data = await resp.json();
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
