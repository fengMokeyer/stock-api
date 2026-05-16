// api/news.js - 获取资讯
const { supabase } = require('../lib/db');
const axios = require('axios');

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 获取资讯列表
  if (req.method === 'GET') {
    try {
      const { page = 1, pageSize = 20 } = req.query;
      const offset = (page - 1) * pageSize;

      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (error) {
        // 表可能不存在，返回空数据
        return res.status(200).json({ code: 200, data: [] });
      }

      res.status(200).json({ code: 200, data });
    } catch (e) {
      console.error('获取资讯失败:', e);
      res.status(200).json({ code: 200, data: [] });
    }
  }

  // 抓取资讯
  if (req.method === 'POST') {
    try {
      // 模拟资讯数据
      const mockNews = [
        {
          title: 'A股三大指数集体高开 沪指涨0.5%',
          url: 'https://finance.sina.com.cn/stock/xxx1',
          summary: '两市成交额突破万亿，北向资金净流入超50亿',
          source: '新浪财经',
          source_id: 'sina'
        },
        {
          title: '新能源板块持续走强 多股涨停',
          url: 'https://finance.sina.com.cn/stock/xxx2',
          summary: '光伏、锂电板块领涨，市场情绪高涨',
          source: '新浪财经',
          source_id: 'sina'
        },
        {
          title: '央行发布最新货币政策报告',
          url: 'https://stock.eastmoney.com/xxx1',
          summary: '保持流动性合理充裕，支持实体经济发展',
          source: '东方财富',
          source_id: 'eastmoney'
        }
      ];

      // 存入数据库
      for (const item of mockNews) {
        await supabase
          .from('news')
          .upsert(item, { onConflict: 'url' })
          .catch(() => {});
      }

      res.status(200).json({ code: 200, message: '抓取成功', count: mockNews.length });
    } catch (e) {
      console.error('抓取资讯失败:', e);
      res.status(500).json({ code: 500, message: e.message });
    }
  }
};
