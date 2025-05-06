import db from '../config/db.js';

export const registerUser = (req, res) => {
  const { name, email, password, phone, address } = req.body;
  const sql = 'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, password, phone, address], (err, result) => {
    if (err) return res.status(500).json({ error: 'User registration failed' });
    res.status(201).json({ message: 'User registered', userId: result.insertId });
  });
};
