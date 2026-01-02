import express from 'express';
const router = express.Router();
import { getChatHistory, clearChat } from '../controllers/chatController.js';

router.get('/history', getChatHistory);
router.delete('/clear', clearChat);

export default router;
