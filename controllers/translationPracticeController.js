import db from '../config/db.js';

// ✅ 1. 分页获取句子列表（支持筛选）
export const getSentences = async (req, res) => {
  const { page = 1, pageSize = 10, difficulty, topic } = req.query;
  const offset = (page - 1) * pageSize;

  let baseQuery = `SELECT * FROM sentences WHERE is_active = 1`;
  const params = [];

  if (difficulty) {
    baseQuery += ` AND difficulty = ?`;
    params.push(difficulty);
  }

  if (topic) {
    baseQuery += ` AND topic = ?`;
    params.push(topic);
  }

  baseQuery += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(Number(pageSize), Number(offset));

  db.query(baseQuery, params, (err, results) => {
    if (err) return res.status(500).json({ message: '数据库查询失败' });
    res.json({ data: results });
  });
};

// ✅ 2. 获取某个句子的详细内容
export const getSentenceById = (req, res) => {
  const { id } = req.params;

  db.query(`SELECT * FROM sentences WHERE id = ?`, [id], (err, results) => {
    if (err) return res.status(500).json({ message: '查询失败' });
    if (results.length === 0) return res.status(404).json({ message: '句子不存在' });
    res.json({ data: results[0] });
  });
};

// ✅ 3. 提交翻译（练习）
export const submitTranslation = (req, res) => {
  const { user_id, sentence_id, user_translation, is_correct, similarity_score, feedback } = req.body;

  if (!user_id || !sentence_id || !user_translation)
    return res.status(400).json({ message: '缺少必要字段' });

  const query = `
    INSERT INTO sentence_attempts 
    (user_id, sentence_id, user_translation, is_correct, similarity_score, feedback) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [user_id, sentence_id, user_translation, is_correct, similarity_score, feedback], (err) => {
    if (err) return res.status(500).json({ message: '提交失败' });
    res.json({ message: '提交成功' });
  });
};

// ✅ 4. 获取用户练习记录
export const getUserAttempts = (req, res) => {
  const { userId } = req.params;

  db.query(
    `SELECT sa.*, s.english, s.chinese FROM sentence_attempts sa 
     JOIN sentences s ON sa.sentence_id = s.id 
     WHERE sa.user_id = ? ORDER BY sa.attempt_time DESC`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: '获取记录失败' });
      res.json({ data: results });
    }
  );
};

// ✅ 5. 收藏/标记句子
export const bookmarkSentence = (req, res) => {
  const { user_id, sentence_id, type, note } = req.body;

  if (!user_id || !sentence_id || !type)
    return res.status(400).json({ message: '字段不全' });

  const query = `
    INSERT INTO sentence_bookmarks (user_id, sentence_id, type, note)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE note = VALUES(note)
  `;

  db.query(query, [user_id, sentence_id, type, note || null], (err) => {
    if (err) return res.status(500).json({ message: '收藏失败' });
    res.json({ message: '操作成功' });
  });
};
