// lib/stock.js - 股票数据获取
const axios = require('axios');

// 获取股票行情
async function getQuote(codes) {
  if (!codes || codes.length === 0) {
    return { code: 400, message: '缺少股票代码' };
  }

  const result = {};

  try {
    const codesStr = codes.join(',');
    const url = `https://hq.sinajs.cn/list=${codesStr}`;

    const response = await axios.get(url, {
      headers: {
        'Referer': 'https://finance.sina.com.cn',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const data = response.data;
    const lines = data.split('\n').filter(line => line.trim());

    for (const line of lines) {
      const match = line.match(/var hq_str_(\w+)="(.*)"/);
      if (match) {
        const code = match[1];
        const content = match[2];

        if (content) {
          const arr = content.split(',');

          if (arr.length >= 32) {
            const name = arr[0];
            const lastClose = parseFloat(arr[2]);
            const currentPrice = parseFloat(arr[3]);
            const volume = parseInt(arr[8]);

            const change = lastClose > 0
              ? ((currentPrice - lastClose) / lastClose * 100).toFixed(2)
              : '0.00';

            result[code] = {
              name: name,
              price: currentPrice.toFixed(2),
              change: change,
              volume: volume
            };
          }
        } else {
          result[code] = {
            name: getStockName(code),
            price: '--',
            change: '0.00',
            volume: 0
          };
        }
      }
    }
  } catch (e) {
    console.error('获取行情失败:', e.message);
    for (const code of codes) {
      result[code] = {
        name: getStockName(code),
        price: '--',
        change: '0.00',
        volume: 0
      };
    }
  }

  return { code: 200, data: result };
}

// 搜索股票
async function searchStock(keyword) {
  if (!keyword) {
    return { code: 400, message: '缺少搜索关键词' };
  }

  try {
    const url = `https://suggest3.sinajs.cn/suggest/suggest?type=11,12,13,14,15&key=${encodeURIComponent(keyword)}&count=20`;

    const response = await axios.get(url, {
      headers: {
        'Referer': 'https://finance.sina.com.cn',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const data = response.data;
    const results = [];
    const match = data.match(/var suggestvalue="(.*)"/);

    if (match && match[1]) {
      const items = match[1].split(';').filter(item => item.trim());

      for (const item of items) {
        const parts = item.split(',');
        if (parts.length >= 2) {
          let code = parts[0];
          const name = parts[1];

          if (!code.startsWith('sh') && !code.startsWith('sz')) {
            code = code.startsWith('6') ? 'sh' + code : 'sz' + code;
          }

          results.push({ code, name });
        }
      }
    }

    return { code: 200, data: results.slice(0, 20) };
  } catch (e) {
    console.error('搜索股票失败:', e.message);
    return { code: 200, data: [] };
  }
}

function getStockName(code) {
  const names = {
    'sh600519': '贵州茅台',
    'sz000858': '五粮液',
    'sh601318': '中国平安',
    'sz000001': '平安银行',
    'sh600036': '招商银行',
    'sz300750': '宁德时代',
    'sz002594': '比亚迪',
    'sh000001': '上证指数',
    'sz399001': '深证成指'
  };
  return names[code] || code;
}

module.exports = { getQuote, searchStock, getStockName };
