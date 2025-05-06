import db from '../config/db.js';

export const addPolice = (req, res) => {
  const { name, badge_number, phone, station } = req.body;
  const sql = 'INSERT INTO police (name, badge_number, phone, station) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, badge_number, phone, station], (err, result) => {
    if (err) return res.status(500).json({ error: 'Police registration failed' });
    res.status(201).json({ message: 'Police officer added', policeId: result.insertId });
  });
};

