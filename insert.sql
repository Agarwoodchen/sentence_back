INSERT INTO sentences (english, chinese, explanation, hint, difficulty, topic, tags)
VALUES
-- Easy sentence
('How are you?', '你好吗？', '常用于日常打招呼，属于基础问候语。', '打招呼，疑问句', 'easy', '日常对话', '["问候", "初级", "疑问句"]'),

-- Medium sentence
('I’d rather stay at home than go out tonight.', '我今晚宁愿待在家里也不愿外出。', '使用了 “would rather... than...” 的句型，表示偏好。', 'would rather... than...', 'medium', '生活方式', '["比较句", "中级", "情态动词"]'),

-- Hard sentence
('Had I known about the meeting, I would have attended.', '要是我早知道有会议，我本来会去参加的。', '这是倒装句，用于虚拟语气，表示对过去的假设。', '虚拟语气，倒装', 'hard', '职场', '["虚拟语气", "高级", "倒装句"]'),

-- Travel topic
('Where is the nearest subway station?', '最近的地铁站在哪里？', '用于询问位置，是出行常用句。', '问路，where引导特殊疑问句', 'easy', '旅游', '["问路", "初级", "疑问句"]'),

-- Shopping topic
('Do you have this in a larger size?', '这件有大一码的吗？', '常见购物用语，使用 “do you have...” 提问。', '购物，商品规格', 'medium', '购物', '["购物", "中级", "疑问句"]');
