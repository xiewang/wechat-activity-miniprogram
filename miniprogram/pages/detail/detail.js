// pages/detail/detail.js
// 活动详情页逻辑

const { api } = require('../../utils/api');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 活动详情
    activity: null,
    // 加载状态
    loading: true,
    // 倒计时
    countdown: '',
    // 倒计时定时器
    countdownTimer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      this.loadActivityDetail(options.id);
    } else {
      wx.showToast({
        title: '活动ID不存在',
        icon: 'error'
      });
      wx.navigateBack();
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 清除倒计时定时器
    if (this.data.countdownTimer) {
      clearInterval(this.data.countdownTimer);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const activity = this.data.activity;
    if (activity) {
      return {
        title: activity.title,
        path: `/pages/detail/detail?id=${activity._id}`,
        desc: `${activity.type} | ${activity.region} | ${activity.ageGroup}`
      };
    }
    return {
      title: '活动详情'
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    const activity = this.data.activity;
    if (activity) {
      return {
        title: activity.title,
        query: `id=${activity._id}`
      };
    }
    return {
      title: '活动详情'
    };
  },

  /**
   * 加载活动详情
   */
  async loadActivityDetail(id) {
    this.setData({ loading: true });
    
    try {
      const res = await api.activities.getDetail(id);
      
      if (res.success) {
        this.setData({
          activity: res.data,
          loading: false
        });
        
        // 如果有报名截止日期，启动倒计时
        if (res.data.deadline && !res.data.isExpired) {
          this.startCountdown(res.data.deadline);
        }
      } else {
        wx.showToast({
          title: '活动不存在',
          icon: 'error'
        });
        wx.navigateBack();
      }
    } catch (error) {
      console.error('加载活动详情失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
      this.setData({ loading: false });
    }
  },

  /**
   * 启动倒计时
   */
  startCountdown(deadline) {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(deadline).getTime();
      const diff = end - now;
      
      if (diff <= 0) {
        this.setData({ countdown: '已截止' });
        if (this.data.countdownTimer) {
          clearInterval(this.data.countdownTimer);
        }
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      let countdownText = '';
      if (days > 0) {
        countdownText = `${days}天${hours}小时`;
      } else if (hours > 0) {
        countdownText = `${hours}小时${minutes}分钟`;
      } else {
        countdownText = `${minutes}分钟`;
      }
      
      this.setData({ countdown: countdownText });
    };
    
    updateCountdown();
    const timer = setInterval(updateCountdown, 60000); // 每分钟更新一次
    this.setData({ countdownTimer: timer });
  },

  /**
   * 拨打电话
   */
  onCallPhone() {
    const contact = this.data.activity.contact;
    if (!contact) {
      wx.showToast({
        title: '暂无联系方式',
        icon: 'none'
      });
      return;
    }
    
    // 提取电话号码
    const phone = contact.replace(/\D/g, '');
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
        fail: () => {
          // 如果拨打电话失败，复制到剪贴板
          this.onCopyContact();
        }
      });
    } else {
      this.onCopyContact();
    }
  },

  /**
   * 复制联系方式
   */
  onCopyContact() {
    const contact = this.data.activity.contact;
    if (!contact) {
      wx.showToast({
        title: '暂无联系方式',
        icon: 'none'
      });
      return;
    }
    
    wx.setClipboardData({
      data: contact,
      success: () => {
        wx.showToast({
          title: '已复制联系方式',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 复制活动信息
   */
  onCopyInfo() {
    const activity = this.data.activity;
    const info = `
活动名称：${activity.title}
活动类型：${activity.type}
适合年龄：${activity.ageGroup}
活动时间：${this.formatDate(activity.startDate)} - ${this.formatDate(activity.endDate)}
活动地点：${activity.region} ${activity.location}
报名截止：${this.formatDate(activity.deadline)}
联系方式：${activity.contact || '暂无'}
主办方：${activity.organizer || '暂无'}
    `.trim();
    
    wx.setClipboardData({
      data: info,
      success: () => {
        wx.showToast({
          title: '已复制活动信息',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 打开原文链接
   */
  onOpenSource() {
    const url = this.data.activity.sourceUrl;
    if (!url) {
      wx.showToast({
        title: '暂无原文链接',
        icon: 'none'
      });
      return;
    }
    
    // 复制链接到剪贴板
    wx.setClipboardData({
      data: url,
      success: () => {
        wx.showModal({
          title: '链接已复制',
          content: '原文链接已复制到剪贴板，请在浏览器中打开',
          showCancel: false
        });
      }
    });
  },

  /**
   * 格式化日期
   */
  formatDate(dateStr) {
    if (!dateStr) return '待定';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  },

  /**
   * 格式化日期时间
   */
  formatDateTime(dateStr) {
    if (!dateStr) return '待定';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
});
