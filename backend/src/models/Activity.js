const mongoose = require('mongoose');

/**
 * 活动数据模型
 * 存储所有收集到的活动信息
 */
const activitySchema = new mongoose.Schema({
  // 活动标题
  title: {
    type: String,
    required: [true, '活动标题不能为空'],
    trim: true,
    maxlength: [200, '标题不能超过200个字符']
  },
  
  // 活动描述
  description: {
    type: String,
    trim: true
  },
  
  // 活动类型
  type: {
    type: String,
    enum: ['体育', '艺术', '科技', '公益', '学术', '实践', '其他'],
    required: [true, '活动类型不能为空']
  },
  
  // 地区（上海各区）
  region: {
    type: String,
    trim: true,
    required: [true, '地区不能为空']
  },
  
  // 年龄段
  ageGroup: {
    type: String,
    enum: ['幼儿', '小学', '初中', '高中'],
    required: [true, '年龄段不能为空']
  },
  
  // 目标人群
  targetGroup: {
    type: String,
    default: '全体学生',
    trim: true
  },
  
  // 活动地点
  location: {
    type: String,
    trim: true
  },
  
  // 活动开始日期
  startDate: {
    type: Date
  },
  
  // 活动结束日期
  endDate: {
    type: Date
  },
  
  // 报名截止日期
  deadline: {
    type: Date
  },
  
  // 主办方
  organizer: {
    type: String,
    trim: true
  },
  
  // 联系方式
  contact: {
    type: String,
    trim: true
  },
  
  // 原始链接
  sourceUrl: {
    type: String,
    trim: true
  },
  
  // 状态：待审核/已通过/已拒绝/已归档
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'archived'],
    default: 'pending'
  },
  
  // 是否已过期
  isExpired: {
    type: Boolean,
    default: false
  },
  
  // 浏览次数
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  // 自动添加 createdAt 和 updatedAt
  timestamps: true
});

// 索引优化查询性能
activitySchema.index({ status: 1, type: 1 });
activitySchema.index({ status: 1, region: 1 });
activitySchema.index({ status: 1, ageGroup: 1 });
activitySchema.index({ status: 1, createdAt: -1 });
activitySchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Activity', activitySchema);
