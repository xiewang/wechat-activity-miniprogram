const Activity = require('../models/Activity');

/**
 * 过期检查工具
 * 定期检查并归档已过期的活动
 */

/**
 * 检查并归档过期活动
 * 将超过endDate的活动标记为archived
 */
async function checkAndArchiveExpiredActivities() {
  console.log('========== 开始执行过期检查 ==========');
  console.log(`时间: ${new Date().toLocaleString('zh-CN')}`);
  
  try {
    const now = new Date();
    
    // 查找已过期但尚未归档的活动
    const expiredActivities = await Activity.find({
      status: 'approved',
      endDate: { $lt: now },
      isExpired: false
    });
    
    console.log(`发现 ${expiredActivities.length} 个过期活动`);
    
    let archivedCount = 0;
    
    for (const activity of expiredActivities) {
      try {
        // 更新活动状态
        activity.status = 'archived';
        activity.isExpired = true;
        activity.updatedAt = now;
        
        await activity.save();
        
        console.log(`已归档活动: ${activity.title}`);
        archivedCount++;
      } catch (error) {
        console.error(`归档活动失败: ${activity.title}`, error.message);
      }
    }
    
    // 同时检查报名截止的活动
    const deadlineExpired = await Activity.find({
      status: 'approved',
      deadline: { $lt: now },
      endDate: { $gte: now },  // 活动还没结束但报名截止了
      isExpired: false
    });
    
    console.log(`发现 ${deadlineExpired.length} 个报名已截止的活动`);
    
    console.log('========== 过期检查完成 ==========');
    console.log(`归档活动数: ${archivedCount}`);
    console.log(`报名截止活动数: ${deadlineExpired.length}`);
    
    return {
      success: true,
      archivedCount,
      deadlineExpiredCount: deadlineExpired.length,
      timestamp: now
    };
  } catch (error) {
    console.error('过期检查执行失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 获取即将过期的活动
 * @param {number} days - 多少天内过期
 * @returns {Promise<Array>} - 即将过期的活动列表
 */
async function getExpiringActivities(days = 7) {
  try {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    
    const activities = await Activity.find({
      status: 'approved',
      endDate: { $gte: now, $lte: future },
      isExpired: false
    }).sort({ endDate: 1 });
    
    return activities;
  } catch (error) {
    console.error('获取即将过期活动失败:', error);
    return [];
  }
}

module.exports = {
  checkAndArchiveExpiredActivities,
  getExpiringActivities
};
