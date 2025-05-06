import db from '../config/db.js';

export const reportIncident = (req, res) => {
  const { user_id, description, location } = req.body;
  const sql = 'INSERT INTO incidents (user_id, description, location) VALUES (?, ?, ?)';
  db.query(sql, [user_id, description, location], (err, result) => {
    if (err) return res.status(500).json({ error: 'Incident report failed' });
    res.status(201).json({ message: 'Incident reported', incidentId: result.insertId });
  });
};
