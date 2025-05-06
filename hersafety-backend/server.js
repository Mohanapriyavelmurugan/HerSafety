import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import policeRoutes from './routes/policeRoutes.js';
import caseRoutes from './routes/caseRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Backend server is running and ready to receive requests.');

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  next();
});

app.get('/api/test', (req, res) => res.send('API root works!'));
// Routes
app.use('/api/users', userRoutes);
app.use('/api/emergency-contacts', emergencyRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/police', policeRoutes);
app.use('/api/cases', caseRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
