const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { authenticateToken } = require('../middleware/auth');

/**
 * 管理员API路由
 * 处理后台审核和管理相关请求
 */

/**
 * GET /api/admin/pending
 * 获取待审核活动列表
 * 需要管理员权限
 */
router.get('/pending', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const activities = await Activity.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    const total = await Activity.countDocuments({ status: 'pending' });
    
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
    console.error('获取待审核活动失败:', error);
    res.status(500).json({
      success: false,
      message: '获取待审核活动失败',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/approve/:id
 * 审核通过活动
 * 需要管理员权限
 */
router.put('/approve/:id', authenticateToken, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'approved',
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: '活动不存在'
      });
    }
    
    res.json({
      success: true,
      message: '活动已通过审核',
      data: activity
    });
  } catch (error) {
    console.error('审核活动失败:', error);
    res.status(500).json({
      success: false,
      message: '审核活动失败',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/reject/:id
 * 审核拒绝活动
 * 需要管理员权限
 */
router.put('/reject/:id', authenticateToken, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: '活动不存在'
      });
    }
    
    res.json({
      success: true,
      message: '活动已被拒绝',
      data: activity
    });
  } catch (error) {
    console.error('拒绝活动失败:', error);
    res.status(500).json({
      success: false,
      message: '拒绝活动失败',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/stats
 * 获取统计数据
 * 需要管理员权限
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // 各状态活动数量
    const statusStats = await Activity.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // 各类型活动数量
    const typeStats = await Activity.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    // 今日新增
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Activity.countDocuments({
      createdAt: { $gte: today }
    });
    
    // 本周新增
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekCount = await Activity.countDocuments({
      createdAt: { $gte: weekAgo }
    });
    
    // 总浏览量
    const viewStats = await Activity.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$viewCount' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        byStatus: statusStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byType: typeStats.map(item => ({
          type: item._id,
          count: item.count
        })),
        todayAdded: todayCount,
        weekAdded: weekCount,
        totalViews: viewStats[0]?.totalViews || 0
      }
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取统计数据失败',
      error: error.message
    });
  }
});

module.exports = router;
