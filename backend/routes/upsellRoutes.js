import express from 'express';
const router = express.Router();
import { getUpsellSuggestions } from '../controllers/upsellController.js';

router.post('/suggestions', getUpsellSuggestions);

export default router;
