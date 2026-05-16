// api/search.js - 搜索股票
const { searchStock } = require('../lib/stock');

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ code: 405, message: 'Method Not Allowed' });
  }

  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ code: 400, message: '缺少搜索关键词' });
    }

    const result = await searchStock(keyword);
    res.status(200).json(result);
  } catch (e) {
    console.error('搜索股票失败:', e);
    res.status(500).json({ code: 500, message: e.message });
  }
};
