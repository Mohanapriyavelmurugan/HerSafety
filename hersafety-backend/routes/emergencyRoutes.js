
import express from 'express';
import { addEmergencyContact } from '../controllers/emergencyController.js';
const router = express.Router();

router.post('/add', addEmergencyContact);

export default router;
