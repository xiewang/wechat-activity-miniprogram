const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

/**
 * 活动API路由
 * 处理活动相关的所有请求
 */

/**
 * GET /api/activities
 * 获取已审核活动列表（支持分页）
 * 查询参数：page, limit, type, region, ageGroup
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // 构建查询条件
    const query = { status: 'approved' };
    
    if (req.query.type) {
      query.type = req.query.type;
    }
    if (req.query.region) {
      query.region = req.query.region;
    }
    if (req.query.ageGroup) {
      query.ageGroup = req.query.ageGroup;
    }
    
    // 获取活动列表
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    // 获取总数
    const total = await Activity.countDocuments(query);
    
    res.json({
      success: true,
      data: activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取活动列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取活动列表失败',
      error: error.message
    });
  }
});

/**
 * GET /api/activities/search
 * 搜索活动
 * 查询参数：keyword, type, region, ageGroup, page, limit
 */
router.get('/search', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // 构建查询条件
    const query = { status: 'approved' };
    
    // 关键词搜索（标题和描述）
    if (req.query.keyword) {
      query.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }
    
    // 筛选条件
    if (req.query.type) {
      query.type = req.query.type;
    }
    if (req.query.region) {
      query.region = req.query.region;
    }
    if (req.query.ageGroup) {
      query.ageGroup = req.query.ageGroup;
    }
    
    // 获取搜索结果
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    const total = await Activity.countDocuments(query);
    
    res.json({
      success: true,
      data: activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('搜索活动失败:', error);
    res.status(500).json({
      success: false,
      message: '搜索活动失败',
      error: error.message
    });
  }
});

/**
 * GET /api/activities/types
 * 获取所有活动类型及其数量
 */
router.get('/types', async (req, res) => {
  try {
    const typeStats = await Activity.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // 格式化结果
    const types = typeStats.map(item => ({
      type: item._id,
      count: item.count
    }));
    
    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    console.error('获取活动类型统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取活动类型统计失败',
      error: error.message
    });
  }
});

/**
 * GET /api/activities/:id
 * 获取单个活动详情
 */
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).select('-__v');
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: '活动不存在'
      });
    }
    
    // 增加浏览次数
    activity.viewCount += 1;
    await activity.save();
    
    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('获取活动详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取活动详情失败',
      error: error.message
    });
  }
});

module.exports = router;
