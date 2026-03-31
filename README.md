# 微信活动小程序

## 项目简介

本项目是一个微信小程序，自动收集并展示上海地区面向中小学生、幼儿等的课内外活动、兴趣活动等信息。

### 主要功能

1. **每日自动抓取** - 后台定时爬取上海教育局、社区活动平台等数据源
2. **活动分类展示** - 按体育、艺术、科技、公益等类型分组展示
3. **智能搜索** - 支持按类型、地区、年龄段等多维度筛选
4. **活动详情** - 展示完整活动信息，包括过期提醒、联系方式等
5. **法律风险提示** - 免责声明和用户须知
6. **后台审核** - 管理员审核机制，防止非法或误发布的内容

## 技术栈

### 后端
- Node.js + Express
- MongoDB + Mongoose
- JWT 认证
- node-cron 定时任务

### 前端（微信小程序）
- 微信小程序原生开发
- ES6+

## 项目结构

```
wechat-activity-miniprogram/
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── index.js           # 服务器入口
│   │   ├── models/            # 数据模型
│   │   │   ├── Activity.js    # 活动模型
│   │   │   └── Admin.js       # 管理员模型
│   │   ├── routes/            # API路由
│   │   │   ├── activities.js  # 活动路由
│   │   │   ├── admin.js       # 管理员路由
│   │   │   └── legal.js       # 法律相关路由
│   │   ├── crawlers/          # 爬虫模块
│   │   │   └── shanghaiCrawler.js  # 上海活动爬虫
│   │   ├── middleware/        # 中间件
│   │   │   └── auth.js        # JWT认证中间件
│   │   └── utils/             # 工具函数
│   │       └── expiryChecker.js    # 过期检查工具
│   ├── package.json
│   └── .env.example           # 环境变量示例
│
├── miniprogram/               # 小程序前端
│   ├── pages/                 # 页面
│   │   ├── index/            # 首页
│   │   ├── search/           # 搜索页
│   │   ├── detail/           # 详情页
│   │   └── disclaimer/       # 免责声明页
│   ├── utils/                # 工具函数
│   │   └── api.js            # API封装
│   ├── images/               # 图片资源
│   ├── app.js                # 小程序入口
│   ├── app.json              # 小程序配置
│   ├── app.wxss              # 全局样式
│   ├── project.config.json   # 项目配置
│   └── sitemap.json          # 站点地图
│
├── README.md
└── .gitignore
```

## 快速开始

### 后端部署

1. 安装依赖
```bash
cd backend
npm install
```

2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，配置 MongoDB 连接字符串等
```

3. 启动服务器
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 小程序开发

1. 使用微信开发者工具打开 `miniprogram` 目录

2. 在 `app.js` 中配置 API 基础地址
```javascript
globalData: {
  apiBaseUrl: 'http://localhost:3000/api'  // 开发环境
  // apiBaseUrl: 'https://your-domain.com/api'  // 生产环境
}
```

3. 添加图片资源到 `images` 目录

4. 编译预览

## API 接口文档

### 活动相关
- `GET /api/activities` - 获取活动列表
- `GET /api/activities/:id` - 获取活动详情
- `GET /api/activities/search` - 搜索活动
- `GET /api/activities/types` - 获取活动类型统计

### 管理员相关
- `GET /api/admin/pending` - 获取待审核活动
- `PUT /api/admin/approve/:id` - 审核通过
- `PUT /api/admin/reject/:id` - 审核拒绝
- `GET /api/admin/stats` - 获取统计数据

### 法律相关
- `GET /api/legal/disclaimer` - 免责声明
- `GET /api/legal/terms` - 服务条款

## 定时任务

- **每天凌晨 2:00** - 执行爬虫任务，抓取最新活动
- **每天凌晨 3:00** - 检查并归档过期活动

## 数据模型

### Activity（活动）
- title: 标题
- description: 描述
- type: 类型（体育/艺术/科技/公益/学术/实践/其他）
- region: 地区
- ageGroup: 年龄段（幼儿/小学/初中/高中）
- targetGroup: 目标人群
- location: 活动地点
- startDate: 开始日期
- endDate: 结束日期
- deadline: 报名截止
- organizer: 主办方
- contact: 联系方式
- sourceUrl: 原文链接
- status: 状态（pending/approved/rejected/archived）
- isExpired: 是否过期

## 注意事项

1. 爬虫模块目前使用模拟数据，实际使用时需要替换为真实的数据源爬取逻辑
2. 小程序需要配置合法域名才能访问后端 API
3. 生产环境需要配置 HTTPS
4. 建议定期备份 MongoDB 数据

## 开发计划

- [ ] 接入真实数据源爬虫
- [ ] 添加用户收藏功能
- [ ] 添加活动提醒功能
- [ ] 优化搜索算法
- [ ] 添加数据分析面板

## 许可证

MIT License
