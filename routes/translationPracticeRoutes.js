import express from 'express';
import {
  getSentences,
  getSentenceById,
  submitTranslation,
  getUserAttempts,
  bookmarkSentence
} from '../controllers/translationPracticeController.js';

import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// ✅ GET /api/translation/sentences?page=1&pageSize=10&difficulty=medium
router.get('/sentences', authenticateToken, getSentences);

// ✅ GET /api/translation/sentences/:id
router.get('/sentences/:id', authenticateToken, getSentenceById);

// ✅ POST /api/translation/submit
router.post('/submit', authenticateToken, submitTranslation);

// ✅ GET /api/translation/user/:userId/attempts
router.get('/user/:userId/attempts', authenticateToken, getUserAttempts);

// ✅ POST /api/translation/bookmark
router.post('/bookmark', authenticateToken, bookmarkSentence);

export default router;
