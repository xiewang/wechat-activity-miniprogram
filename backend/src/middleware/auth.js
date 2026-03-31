const jwt = require('jsonwebtoken');

/**
 * JWT认证中间件
 * 验证请求中的JWT令牌
 */

/**
 * 验证JWT令牌中间件
 * 从请求头中提取并验证token
 */
function authenticateToken(req, res, next) {
  // 从请求头获取token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未提供认证令牌'
    });
  }
  
  try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    
    // 将解码后的用户信息附加到请求对象
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Token验证失败:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '令牌已过期，请重新登录'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: '无效的认证令牌'
    });
  }
}

/**
 * 可选认证中间件
 * 验证token但不强制要求
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
      req.user = decoded;
    } catch (error) {
      // 验证失败但不阻止请求
      req.user = null;
    }
  }
  
  next();
}

/**
 * 生成JWT令牌
 * @param {Object} payload - 要编码的数据
 * @param {string} expiresIn - 过期时间，默认7天
 * @returns {string} - JWT令牌
 */
function generateToken(payload, expiresIn = '7d') {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your-secret-key-here',
    { expiresIn }
  );
}

module.exports = {
  authenticateToken,
  optionalAuth,
  generateToken
};
