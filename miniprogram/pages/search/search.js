// pages/search/search.js
// 搜索页逻辑

const { api } = require('../../utils/api');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 搜索关键词
    keyword: '',
    // 筛选条件
    filters: {
      type: '',
      region: '',
      ageGroup: ''
    },
    // 活动列表
    activities: [],
    // 分页信息
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    // 加载状态
    loading: false,
    // 是否还有更多数据
    hasMore: true,
    // 是否显示筛选面板
    showFilter: false,
    // 筛选选项
    typeOptions: ['全部', '体育', '艺术', '科技', '公益', '学术', '实践', '其他'],
    regionOptions: ['全部', '黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
    ageGroupOptions: ['全部', '幼儿', '小学', '初中', '高中']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 如果URL中有type参数，设置筛选条件
    if (options.type) {
      this.setData({
        'filters.type': options.type
      });
    }
    // 初始加载
    this.searchActivities();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时刷新
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.resetSearch();
    this.searchActivities().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore();
    }
  },

  /**
   * 搜索活动
   */
  async searchActivities() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const params = {
        page: this.data.pagination.page,
        limit: this.data.pagination.limit,
        keyword: this.data.keyword || undefined,
        type: this.data.filters.type || undefined,
        region: this.data.filters.region || undefined,
        ageGroup: this.data.filters.ageGroup || undefined
      };
      
      const res = await api.activities.search(params);
      
      if (res.success) {
        const newActivities = this.data.pagination.page === 1 
          ? res.data 
          : [...this.data.activities, ...res.data];
        
        this.setData({
          activities: newActivities,
          pagination: res.pagination,
          hasMore: res.pagination.page < res.pagination.totalPages
        });
      }
    } catch (error) {
      console.error('搜索失败:', error);
      wx.showToast({
        title: '搜索失败',
        icon: 'error'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 加载更多
   */
  async loadMore() {
    if (!this.data.hasMore || this.data.loading) return;
    
    this.setData({
      'pagination.page': this.data.pagination.page + 1
    });
    
    await this.searchActivities();
  },

  /**
   * 重置搜索
   */
  resetSearch() {
    this.setData({
      activities: [],
      'pagination.page': 1,
      hasMore: true
    });
  },

  /**
   * 输入关键词
   */
  onKeywordInput(e) {
    this.setData({
      keyword: e.detail.value
    });
  },

  /**
   * 确认搜索
   */
  onSearchConfirm() {
    this.resetSearch();
    this.searchActivities();
  },

  /**
   * 清除关键词
   */
  onClearKeyword() {
    this.setData({
      keyword: ''
    });
    this.resetSearch();
    this.searchActivities();
  },

  /**
   * 切换筛选面板
   */
  onToggleFilter() {
    this.setData({
      showFilter: !this.data.showFilter
    });
  },

  /**
   * 选择类型
   */
  onSelectType(e) {
    const type = e.currentTarget.dataset.value;
    this.setData({
      'filters.type': type === '全部' ? '' : type
    });
    this.resetSearch();
    this.searchActivities();
  },

  /**
   * 选择地区
   */
  onSelectRegion(e) {
    const region = e.currentTarget.dataset.value;
    this.setData({
      'filters.region': region === '全部' ? '' : region
    });
    this.resetSearch();
    this.searchActivities();
  },

  /**
   * 选择年龄段
   */
  onSelectAgeGroup(e) {
    const ageGroup = e.currentTarget.dataset.value;
    this.setData({
      'filters.ageGroup': ageGroup === '全部' ? '' : ageGroup
    });
    this.resetSearch();
    this.searchActivities();
  },

  /**
   * 清除所有筛选
   */
  onClearFilters() {
    this.setData({
      filters: {
        type: '',
        region: '',
        ageGroup: ''
      }
    });
    this.resetSearch();
    this.searchActivities();
  },

  /**
   * 点击活动
   */
  onActivityTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
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
