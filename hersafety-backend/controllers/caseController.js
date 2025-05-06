import db from '../config/db.js';

export const assignCase = (req, res) => {
  const { incident_id, police_id, status } = req.body;
  const sql = 'INSERT INTO case_tracking (incident_id, police_id, status) VALUES (?, ?, ?)';
  db.query(sql, [incident_id, police_id, status], (err, result) => {
    if (err) return res.status(500).json({ error: 'Case assignment failed' });
    res.status(201).json({ message: 'Case assigned', trackingId: result.insertId });
  });
};
