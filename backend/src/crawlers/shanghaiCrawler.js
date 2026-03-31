const Activity = require('../models/Activity');

/**
 * 上海活动爬虫
 * 模拟抓取上海各类教育活动信息
 */

// 上海各区列表
const SHANGHAI_DISTRICTS = [
  '黄浦区', '徐汇区', '长宁区', '静安区', '普陀区',
  '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区',
  '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'
];

// 活动类型
const ACTIVITY_TYPES = ['体育', '艺术', '科技', '公益', '学术', '实践', '其他'];

// 年龄段
const AGE_GROUPS = ['幼儿', '小学', '初中', '高中'];

/**
 * 模拟从上海教育局官网抓取数据
 */
async function crawlShanghaiEducationBureau() {
  console.log('开始抓取：上海市教育局官网...');
  
  // 模拟数据 - 实际使用时替换为真实爬虫逻辑
  const mockData = [
    {
      title: '2024年上海市中小学生暑期体育夏令营',
      description: '面向全市中小学生的暑期体育活动，包含篮球、足球、游泳等项目',
      type: '体育',
      region: '浦东新区',
      ageGroup: '小学',
      targetGroup: '全体学生',
      location: '浦东新区青少年活动中心',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-07-15'),
      deadline: new Date('2024-06-25'),
      organizer: '上海市教育局',
      contact: '021-12345678',
      sourceUrl: 'https://edu.sh.gov.cn/activity/1'
    },
    {
      title: '青少年科技创新大赛',
      description: '培养青少年科技创新能力，展示科技作品',
      type: '科技',
      region: '徐汇区',
      ageGroup: '初中',
      targetGroup: '全体学生',
      location: '徐汇区青少年活动中心',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-08-05'),
      deadline: new Date('2024-07-20'),
      organizer: '上海市青少年科技教育中心',
      contact: '021-87654321',
      sourceUrl: 'https://edu.sh.gov.cn/activity/2'
    },
    {
      title: '少儿美术作品展征集',
      description: '面向全市幼儿的绘画作品征集活动',
      type: '艺术',
      region: '黄浦区',
      ageGroup: '幼儿',
      targetGroup: '全体学生',
      location: '黄浦区少年宫',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-30'),
      deadline: new Date('2024-05-25'),
      organizer: '黄浦区教育局',
      contact: '021-23456789',
      sourceUrl: 'https://edu.sh.gov.cn/activity/3'
    }
  ];
  
  return mockData;
}

/**
 * 模拟从社区活动平台抓取数据
 */
async function crawlCommunityPlatform() {
  console.log('开始抓取：社区活动平台...');
  
  const mockData = [
    {
      title: '社区亲子阅读活动',
      description: '增进亲子关系的阅读分享活动',
      type: '实践',
      region: '静安区',
      ageGroup: '幼儿',
      targetGroup: '全体学生',
      location: '静安区图书馆',
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-15'),
      deadline: new Date('2024-06-10'),
      organizer: '静安区社区服务中心',
      contact: '021-34567890',
      sourceUrl: 'https://community.sh.gov.cn/event/1'
    },
    {
      title: '青少年志愿者服务活动',
      description: '参与社区环保宣传，培养社会责任感',
      type: '公益',
      region: '闵行区',
      ageGroup: '高中',
      targetGroup: '全体学生',
      location: '闵行区各社区',
      startDate: new Date('2024-07-10'),
      endDate: new Date('2024-07-20'),
      deadline: new Date('2024-07-05'),
      organizer: '闵行区志愿者协会',
      contact: '021-45678901',
      sourceUrl: 'https://community.sh.gov.cn/event/2'
    },
    {
      title: '暑期数学思维训练营',
      description: '提升数学思维能力，备战各类数学竞赛',
      type: '学术',
      region: '杨浦区',
      ageGroup: '小学',
      targetGroup: '全体学生',
      location: '杨浦区教育学院',
      startDate: new Date('2024-07-05'),
      endDate: new Date('2024-07-25'),
      deadline: new Date('2024-06-28'),
      organizer: '杨浦区教育局',
      contact: '021-56789012',
      sourceUrl: 'https://community.sh.gov.cn/event/3'
    }
  ];
  
  return mockData;
}

/**
 * 模拟从学校官方通知抓取数据
 */
async function crawlSchoolAnnouncements() {
  console.log('开始抓取：学校官方通知...');
  
  const mockData = [
    {
      title: '校际足球友谊赛',
      description: '多所小学参与的足球交流活动',
      type: '体育',
      region: '长宁区',
      ageGroup: '小学',
      targetGroup: '男生',
      location: '长宁区体育场',
      startDate: new Date('2024-06-20'),
      endDate: new Date('2024-06-22'),
      deadline: new Date('2024-06-15'),
      organizer: '长宁区体育局',
      contact: '021-67890123',
      sourceUrl: 'https://school.sh.gov.cn/sports/1'
    },
    {
      title: '青少年编程挑战赛',
      description: 'Scratch和Python编程比赛',
      type: '科技',
      region: '虹口区',
      ageGroup: '初中',
      targetGroup: '全体学生',
      location: '虹口区青少年活动中心',
      startDate: new Date('2024-08-10'),
      endDate: new Date('2024-08-12'),
      deadline: new Date('2024-07-30'),
      organizer: '虹口区教育信息中心',
      contact: '021-78901234',
      sourceUrl: 'https://school.sh.gov.cn/tech/1'
    },
    {
      title: '传统文化体验营',
      description: '书法、国画、民乐等传统文化学习',
      type: '艺术',
      region: '宝山区',
      ageGroup: '小学',
      targetGroup: '全体学生',
      location: '宝山区文化馆',
      startDate: new Date('2024-07-15'),
      endDate: new Date('2024-07-28'),
      deadline: new Date('2024-07-08'),
      organizer: '宝山区文化局',
      contact: '021-89012345',
      sourceUrl: 'https://school.sh.gov.cn/art/1'
    }
  ];
  
  return mockData;
}

/**
 * 保存活动到数据库
 * @param {Array} activities - 活动数据数组
 */
async function saveActivities(activities) {
  let savedCount = 0;
  let skippedCount = 0;
  
  for (const activityData of activities) {
    try {
      // 检查是否已存在相同标题的活动
      const existing = await Activity.findOne({ 
        title: activityData.title,
        sourceUrl: activityData.sourceUrl 
      });
      
      if (existing) {
        console.log(`跳过已存在活动: ${activityData.title}`);
        skippedCount++;
        continue;
      }
      
      // 创建新活动，状态为待审核
      const activity = new Activity({
        ...activityData,
        status: 'pending'
      });
      
      await activity.save();
      console.log(`保存新活动: ${activityData.title}`);
      savedCount++;
    } catch (error) {
      console.error(`保存活动失败: ${activityData.title}`, error.message);
    }
  }
  
  return { savedCount, skippedCount };
}

/**
 * 主爬虫函数
 * 执行所有数据源的抓取
 */
async function runCrawler() {
  console.log('========== 开始执行爬虫任务 ==========');
  console.log(`时间: ${new Date().toLocaleString('zh-CN')}`);
  
  try {
    // 从多个数据源抓取
    const results = await Promise.all([
      crawlShanghaiEducationBureau(),
      crawlCommunityPlatform(),
      crawlSchoolAnnouncements()
    ]);
    
    // 合并所有数据
    const allActivities = results.flat();
    console.log(`共抓取到 ${allActivities.length} 条活动数据`);
    
    // 保存到数据库
    const { savedCount, skippedCount } = await saveActivities(allActivities);
    
    console.log('========== 爬虫任务完成 ==========');
    console.log(`新增: ${savedCount} 条`);
    console.log(`跳过: ${skippedCount} 条`);
    
    return {
      success: true,
      total: allActivities.length,
      saved: savedCount,
      skipped: skippedCount
    };
  } catch (error) {
    console.error('爬虫任务执行失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  runCrawler,
  crawlShanghaiEducationBureau,
  crawlCommunityPlatform,
  crawlSchoolAnnouncements
};
