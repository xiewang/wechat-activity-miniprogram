// pages/index/index.js
// 首页逻辑

const { api } = require('../../utils/api');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 活动类型列表
    activityTypes: [],
    // 推荐活动列表
    recommendedActivities: [],
    // 最新活动列表
    latestActivities: [],
    // 加载状态
    loading: true,
    // 当前选中的分类
    selectedType: null,
    // 是否显示全部推荐
    showAllRecommended: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时刷新数据
    if (!this.data.loading) {
      this.loadData();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载页面数据
   */
  async loadData() {
    this.setData({ loading: true });
    
    try {
      // 并行加载数据
      await Promise.all([
        this.loadActivityTypes(),
        this.loadRecommendedActivities(),
        this.loadLatestActivities()
      ]);
    } catch (error) {
      console.error('加载数据失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 加载活动类型统计
   */
  async loadActivityTypes() {
    try {
      const res = await api.activities.getTypes();
      if (res.success) {
        this.setData({
          activityTypes: res.data
        });
      }
    } catch (error) {
      console.error('加载活动类型失败:', error);
    }
  },

  /**
   * 加载推荐活动
   */
  async loadRecommendedActivities() {
    try {
      const res = await api.activities.getList({ 
        page: 1, 
        limit: 6 
      });
      if (res.success) {
        this.setData({
          recommendedActivities: res.data
        });
      }
    } catch (error) {
      console.error('加载推荐活动失败:', error);
    }
  },

  /**
   * 加载最新活动
   */
  async loadLatestActivities() {
    try {
      const res = await api.activities.getList({ 
        page: 1, 
        limit: 10 
      });
      if (res.success) {
        this.setData({
          latestActivities: res.data
        });
      }
    } catch (error) {
      console.error('加载最新活动失败:', error);
    }
  },

  /**
   * 点击活动类型
   */
  onTypeTap(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/search/search?type=${type}`
    });
  },

  /**
   * 点击活动卡片
   */
  onActivityTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  /**
   * 查看更多推荐
   */
  onViewMoreRecommended() {
    this.setData({
      showAllRecommended: !this.data.showAllRecommended
    });
  },

  /**
   * 跳转到搜索页
   */
  onSearchTap() {
    wx.switchTab({
      url: '/pages/search/search'
    });
  },

  /**
   * 格式化日期
   */
  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },

  /**
   * 检查活动是否即将截止
   */
  isDeadlineSoon(deadline) {
    if (!deadline) return false;
    const now = new Date();
    const dl = new Date(deadline);
    const diffDays = Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  }
});
