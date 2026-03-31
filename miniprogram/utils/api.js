// utils/api.js
// API请求封装

const app = getApp();

// API基础地址
const BASE_URL = 'http://localhost:3000/api';

/**
 * 封装wx.request
 * @param {string} url - 请求地址
 * @param {string} method - 请求方法
 * @param {object} data - 请求数据
 * @param {object} header - 请求头
 * @returns {Promise} - 请求Promise
 */
function request(url, method = 'GET', data = {}, header = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          console.error('请求失败:', res);
          reject(new Error(res.data.message || '请求失败'));
        }
      },
      fail(err) {
        console.error('网络请求失败:', err);
        reject(new Error('网络请求失败，请检查网络连接'));
      }
    });
  });
}

/**
 * GET请求
 * @param {string} url - 请求地址
 * @param {object} params - 查询参数
 * @returns {Promise}
 */
function get(url, params = {}) {
  // 构建查询字符串
  const queryString = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  return request(fullUrl, 'GET');
}

/**
 * POST请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求数据
 * @returns {Promise}
 */
function post(url, data = {}) {
  return request(url, 'POST', data);
}

/**
 * PUT请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求数据
 * @returns {Promise}
 */
function put(url, data = {}) {
  return request(url, 'PUT', data);
}

/**
 * DELETE请求
 * @param {string} url - 请求地址
 * @returns {Promise}
 */
function del(url) {
  return request(url, 'DELETE');
}

// API接口集合
const api = {
  // 活动相关
  activities: {
    // 获取活动列表
    getList: (params) => get('/activities', params),
    // 获取活动详情
    getDetail: (id) => get(`/activities/${id}`),
    // 搜索活动
    search: (params) => get('/activities/search', params),
    // 获取活动类型统计
    getTypes: () => get('/activities/types')
  },
  
  // 法律相关
  legal: {
    // 获取免责声明
    getDisclaimer: () => get('/legal/disclaimer'),
    // 获取服务条款
    getTerms: () => get('/legal/terms')
  },
  
  // 管理员相关（需要登录）
  admin: {
    // 获取待审核列表
    getPending: () => get('/admin/pending'),
    // 审核通过
    approve: (id) => put(`/admin/approve/${id}`),
    // 审核拒绝
    reject: (id) => put(`/admin/reject/${id}`),
    // 获取统计数据
    getStats: () => get('/admin/stats')
  }
};

module.exports = {
  request,
  get,
  post,
  put,
  del,
  api,
  BASE_URL
};
