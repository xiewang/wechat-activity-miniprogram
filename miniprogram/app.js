// app.js
// 小程序入口文件

App({
  // 全局数据
  globalData: {
    // API基础地址，根据环境配置
    apiBaseUrl: 'http://localhost:3000/api',
    // 用户系统信息
    systemInfo: null,
    // 用户信息
    userInfo: null
  },

  // 小程序启动时执行
  onLaunch() {
    console.log('小程序启动');
    
    // 获取系统信息
    this.getSystemInfo();
    
    // 检查更新
    this.checkForUpdate();
  },

  // 获取系统信息
  getSystemInfo() {
    const that = this;
    wx.getSystemInfo({
      success(res) {
        that.globalData.systemInfo = res;
        console.log('系统信息:', res);
      }
    });
  },

  // 检查小程序更新
  checkForUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        console.log('检查更新结果:', res.hasUpdate);
      });
      
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });
      
      updateManager.onUpdateFailed(() => {
        console.error('新版本下载失败');
      });
    }
  },

  // 显示错误提示
  showError(message) {
    wx.showToast({
      title: message,
      icon: 'error',
      duration: 2000
    });
  },

  // 显示成功提示
  showSuccess(message) {
    wx.showToast({
      title: message,
      icon: 'success',
      duration: 2000
    });
  }
});
