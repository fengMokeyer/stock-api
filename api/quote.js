// api/quote.js - 获取股票行情
const { getQuote } = require('../lib/stock');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { codes } = req.query;
    if (!codes) {
      return res.status(400).json({ code: 400, message: '缺少股票代码' });
    }

    const codeList = codes.split(',').map(c => c.trim()).filter(c => c);
    const result = await getQuote(codeList);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message });
  }
};
