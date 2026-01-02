import express from 'express';
import { submitReviews, getReviewAnalytics } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', submitReviews);
router.get('/analytics', getReviewAnalytics);

export default router;
