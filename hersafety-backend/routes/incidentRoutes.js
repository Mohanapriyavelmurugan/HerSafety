import express from 'express';
import { reportIncident } from '../controllers/incidentController.js';
const router = express.Router();

console.log('incidentRoutes loaded');

router.post('/report', (req, res, next) => {
  console.log('POST /api/incidents/report hit');
  next();
}, reportIncident);

export default router;
