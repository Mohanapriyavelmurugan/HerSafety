import express from 'express';
import { addPolice } from '../controllers/policeController.js';
const router = express.Router();

router.post('/add', addPolice);

export default router;
