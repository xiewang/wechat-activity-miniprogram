const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
require('dotenv').config();

// 引入路由
const activitiesRouter = require('./routes/activities');
const adminRouter = require('./routes/admin');
const legalRouter = require('./routes/legal');

// 引入工具
const { runCrawler } = require('./crawlers/shanghaiCrawler');
const { checkAndArchiveExpiredActivities } = require('./utils/expiryChecker');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 连接MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wechat-activities', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB连接成功'))
  .catch(err => console.error('MongoDB连接失败:', err));

// 路由
app.use('/api/activities', activitiesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/legal', legalRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'wechat-activity-backend'
  });
});

// 手动触发爬虫（用于测试）
app.post('/api/crawler/run', async (req, res) => {
  try {
    const result = await runCrawler();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 手动触发过期检查（用于测试）
app.post('/api/expiry/check', async (req, res) => {
  try {
    const result = await checkAndArchiveExpiredActivities();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  
  // 处理Mongoose验证错误
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: '数据验证失败',
      errors: messages
    });
  }
  
  // 处理Mongoose重复键错误
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: '数据已存在',
      error: err.message
    });
  }
  
  // 处理Mongoose CastError（无效的ObjectId）
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: '无效的ID格式',
      error: err.message
    });
  }
  
  // 默认错误响应
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 设置定时任务
const CRAWLER_CRON = process.env.CRAWLER_CRON || '0 2 * * *';

// 每天执行爬虫任务
console.log(`爬虫定时任务已设置: ${CRAWLER_CRON}`);
cron.schedule(CRAWLER_CRON, async () => {
  console.log('定时任务触发：执行爬虫...');
  await runCrawler();
});

// 每天执行过期检查（凌晨3点）
cron.schedule('0 3 * * *', async () => {
  console.log('定时任务触发：执行过期检查...');
  await checkAndArchiveExpiredActivities();
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`服务器启动成功！`);
  console.log(`端口: ${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API地址: http://localhost:${PORT}`);
  console.log(`========================================`);
});

module.exports = app;
