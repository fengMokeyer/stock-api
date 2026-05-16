// api/news.js - 获取资讯
const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // 返回模拟资讯
    const news = [
      { title: 'A股三大指数集体高开 沪指涨0.5%', source: '新浪财经', time: '09:30' },
      { title: '新能源板块持续走强 多股涨停', source: '东方财富', time: '10:15' },
      { title: '央行发布最新货币政策报告', source: '财联社', time: '14:00' }
    ];
    return res.status(200).json({ code: 200, data: news });
  }

  if (req.method === 'POST') {
    return res.status(200).json({ code: 200, message: '抓取成功', count: 3 });
  }
};
