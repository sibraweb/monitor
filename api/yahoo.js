export default async function handler(req, res) {
  const { ticker, weeks } = req.query;
  const period2 = Math.floor(Date.now() / 1000);
  const period1 = period2 - (parseInt(weeks) || 20) * 7 * 24 * 3600;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1wk&period1=${period1}&period2=${period2}&events=history`;
  
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await resp.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
