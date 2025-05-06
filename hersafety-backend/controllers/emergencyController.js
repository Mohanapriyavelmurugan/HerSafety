import db from '../config/db.js';

export const addEmergencyContact = (req, res) => {
  const { user_id, name, phone, relation } = req.body;
  const sql = 'INSERT INTO emergency_contacts (user_id, name, phone, relation) VALUES (?, ?, ?, ?)';
  db.query(sql, [user_id, name, phone, relation], (err, result) => {
    if (err) return res.status(500).json({ error: 'Emergency contact failed' });
    res.status(201).json({ message: 'Emergency contact added', contactId: result.insertId });
  });
};
