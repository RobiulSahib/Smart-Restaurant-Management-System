import express from 'express';
import { getAllPromos, createPromo, updatePromo, deletePromo, validatePromo } from '../controllers/promoController.js';

const router = express.Router();

router.get('/', getAllPromos);
router.post('/', createPromo);
router.patch('/:id', updatePromo);
router.delete('/:id', deletePromo);
router.post('/validate', validatePromo);

export default router;
