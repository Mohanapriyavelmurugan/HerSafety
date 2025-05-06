import db from '../config/db.js';

export const registerUser = (req, res) => {
  const { name, email, password, phone, address } = req.body;
  const sql = 'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, password, phone, address], (err, result) => {
    if (err) return res.status(500).json({ error: 'User registration failed' });
    res.status(201).json({ message: 'User registered', userId: result.insertId });
  });
};

export const loginUser = (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT id, name, email FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Login failed' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    // For now, just return user data (no JWT)
    res.status(200).json({ user: results[0], token: 'dummy-token' });
  });
};
