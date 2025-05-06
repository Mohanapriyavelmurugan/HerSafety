import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import policeRoutes from './routes/policeRoutes.js';
import caseRoutes from './routes/caseRoutes.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/emergency-contacts', emergencyRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/police', policeRoutes);
app.use('/api/cases', caseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
