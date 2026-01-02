import express from 'express';
import { getAllDishes, getRecommendations } from '../controllers/dishController.js';

const router = express.Router();

router.get('/', getAllDishes);
router.get('/recommendations', getRecommendations);

export default router;
