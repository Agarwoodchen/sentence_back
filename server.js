import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import translationPracticeRoutes from './routes/translationPracticeRoutes.js'
import './config/db.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 使用 morgan 打印 HTTP 请求日志，集成 winston
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/translationPractice', translationPracticeRoutes)
// 全局错误处理中间件，记录错误日志
app.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`);
  res.status(500).json({ message: '服务器内部错误' });
});

app.listen(PORT, () => {
  logger.info(`🚀 服务器运行在 http://localhost:${PORT}`);
});
