import express from 'express';
import {
  getSentences,
  getSentenceById,
  submitTranslation,
  getUserAttempts,
  bookmarkSentence
} from '../controllers/translationPracticeController.js';

const router = express.Router();

// ✅ GET /api/translation/sentences?page=1&pageSize=10&difficulty=medium
router.get('/sentences', getSentences);

// ✅ GET /api/translation/sentences/:id
router.get('/sentences/:id', getSentenceById);

// ✅ POST /api/translation/submit
router.post('/submit', submitTranslation);

// ✅ GET /api/translation/user/:userId/attempts
router.get('/user/:userId/attempts', getUserAttempts);

// ✅ POST /api/translation/bookmark
router.post('/bookmark', bookmarkSentence);

export default router;
