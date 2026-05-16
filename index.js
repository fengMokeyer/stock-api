// api/index.js - 主入口
module.exports = (req, res) => {
  res.status(200).json({
    name: '股票监控 API',
    version: '1.0.0',
    endpoints: {
      '/api/quote': '获取股票行情 (GET ?codes=sh600519,sz000858)',
      '/api/search': '搜索股票 (GET ?keyword=茅台)',
      '/api/news': '获取资讯列表 (GET)',
      '/api/push': '发送推送 (POST)'
    }
  });
};
