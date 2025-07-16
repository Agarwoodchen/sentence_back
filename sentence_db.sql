CREATE TABLE sentences (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '句子ID',
  english TEXT NOT NULL COMMENT '英文原句',
  chinese TEXT NOT NULL COMMENT '中文翻译',
  explanation TEXT COMMENT '句子语法或词汇讲解',
  hint TEXT COMMENT '提示（如关键词、语法结构）',
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'easy' COMMENT '难度等级',
  topic VARCHAR(100) COMMENT '主题/话题（如旅游、购物、日常对话等）',
  tags JSON COMMENT '标签数组（如 ["比较句", "初级", "副词"]）',
  is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用该句子',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间'
) COMMENT='英译汉句子库';

CREATE TABLE sentence_attempts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
  user_id BIGINT NOT NULL COMMENT '用户ID',
  sentence_id BIGINT NOT NULL COMMENT '练习的句子ID',
  user_translation TEXT COMMENT '用户提交的翻译',
  is_correct TINYINT(1) NOT NULL DEFAULT 0 COMMENT '系统判断是否正确（0=错误，1=正确）',
  similarity_score DECIMAL(5,2) COMMENT '与标准答案的相似度百分比（例如：87.50）',
  feedback TEXT COMMENT '系统/教师反馈（可选）',
  attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (sentence_id) REFERENCES sentences(id)
) COMMENT='用户句子练习记录';


CREATE TABLE sentence_bookmarks (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
  user_id BIGINT NOT NULL COMMENT '用户ID',
  sentence_id BIGINT NOT NULL COMMENT '句子ID',
  type ENUM('favorite', 'wrong', 'starred') NOT NULL COMMENT '类型（收藏、错题、标记）',
  note TEXT COMMENT '用户备注（选填）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY uniq_user_sentence_type (user_id, sentence_id, type),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (sentence_id) REFERENCES sentences(id)
) COMMENT='用户收藏/错题/标记句子表';
