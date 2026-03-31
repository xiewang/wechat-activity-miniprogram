const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * 管理员模型
 * 用于后台审核和管理
 */
const adminSchema = new mongoose.Schema({
  // 用户名
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少3个字符'],
    maxlength: [20, '用户名最多20个字符']
  },
  
  // 密码哈希
  passwordHash: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码至少6个字符']
  },
  
  // 角色
  role: {
    type: String,
    enum: ['admin', 'moderator'],
    default: 'moderator'
  },
  
  // 最后登录时间
  lastLoginAt: {
    type: Date
  },
  
  // 是否启用
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 索引
adminSchema.index({ username: 1 });

/**
 * 验证密码
 * @param {string} password - 明文密码
 * @returns {Promise<boolean>} - 是否匹配
 */
adminSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

/**
 * 静态方法：创建管理员时自动哈希密码
 */
adminSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Admin', adminSchema);
