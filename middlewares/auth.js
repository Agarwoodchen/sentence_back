// middlewares/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: '未提供 token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'token 无效或过期' });

    req.user = user; // 保存解码后的用户信息
    next(); // 继续执行下一个中间件或路由
  });
};
