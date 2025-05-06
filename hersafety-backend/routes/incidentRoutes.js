import express from 'express';
import { reportIncident } from '../controllers/incidentController.js';
const router = express.Router();

console.log('incidentRoutes loaded');

router.post('/report', async (req, res) => {
  try {
    console.log('POST /api/incidents/report hit');
    await reportIncident(req, res);
  } catch (error) {
    console.error('Error in incident route:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

export default router;
