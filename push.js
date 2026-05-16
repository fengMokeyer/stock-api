// api/push.js - PushPlus 推送
const axios = require('axios');

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ code: 405, message: 'Method Not Allowed' });
  }

  try {
    const { token, title, content, template = 'txt' } = req.body;

    if (!token) {
      return res.status(400).json({ code: 400, message: '缺少 PushPlus Token' });
    }

    if (!content) {
      return res.status(400).json({ code: 400, message: '缺少推送内容' });
    }

    // 调用 PushPlus API
    const response = await axios.post('http://www.pushplus.plus/send', {
      token,
      title: title || '股票监控提醒',
      content,
      template
    });

    if (response.data.code === 200) {
      res.status(200).json({
        code: 200,
        message: '推送成功',
        data: response.data
      });
    } else {
      res.status(200).json({
        code: response.data.code,
        message: response.data.msg
      });
    }
  } catch (e) {
    console.error('推送失败:', e);
    res.status(500).json({ code: 500, message: e.message });
  }
};
