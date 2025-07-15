import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: '用户名、邮箱和密码不能为空' });

  db.query(
    'SELECT id FROM users WHERE username = ? OR email = ?',
    [username, email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: '数据库错误' });
      if (results.length > 0)
        return res.status(409).json({ message: '用户名或邮箱已存在' });

      const hash = await bcrypt.hash(password, 10);
      db.query(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, hash],
        (err) => {
          if (err) return res.status(500).json({ message: '注册失败' });
          return res.status(201).json({ message: '注册成功' });
        }
      );
    }
  );
};

export const login = (req, res) => {
  const { email, password } = req.body;

  console.log(email, password)
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  if (!email || !password)
    return res.status(400).json({ message: '邮箱和密码不能为空' });

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: '数据库错误' });
      if (results.length === 0)
        return res.status(401).json({ message: '用户不存在' });

      const user = results[0];

      if (user.lock_until && new Date(user.lock_until) > new Date())
        return res.status(403).json({ message: '账户已锁定，请稍后重试' });

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        const failed = user.failed_attempts + 1;
        const lockUntil = failed >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

        db.query(
          'UPDATE users SET failed_attempts = ?, lock_until = ? WHERE id = ?',
          [failed, lockUntil, user.id]
        );

        db.query(
          'INSERT INTO login_logs (user_id, ip_address, user_agent, success, failure_reason) VALUES (?, ?, ?, 0, ?)',
          [user.id, ip, userAgent, '密码错误']
        );

        return res.status(401).json({ message: '密码错误' });
      }

      // 登录成功
      db.query(
        'UPDATE users SET failed_attempts = 0, lock_until = NULL, last_login = NOW(), login_ip = ?, login_device = ? WHERE id = ?',
        [ip, userAgent, user.id]
      );

      db.query(
        'INSERT INTO login_logs (user_id, ip_address, user_agent, success) VALUES (?, ?, ?, 1)',
        [user.id, ip, userAgent]
      );

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        message: '登录成功',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    }
  );
};
