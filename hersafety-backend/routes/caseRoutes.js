import express from 'express';
import { assignCase } from '../controllers/caseController.js';
const router = express.Router();

router.post('/assign', assignCase);

export default router;
