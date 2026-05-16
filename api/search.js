// api/search.js - 搜索股票
const { searchStock } = require('../lib/stock');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ code: 400, message: '缺少搜索关键词' });
    }

    const result = await searchStock(keyword);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ code: 500, message: e.message });
  }
};
