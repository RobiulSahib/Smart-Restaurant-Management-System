import express from 'express';
import { getCustomerByPhone, createCustomer, updateCustomerPoints, toggleFavorite, getFavorites } from '../controllers/customerController.js';

const router = express.Router();

router.get('/', getCustomerByPhone);
router.post('/', createCustomer);
router.patch('/', updateCustomerPoints);
router.post('/favorites/toggle', toggleFavorite);
router.get('/favorites/:phone', getFavorites);

export default router;
