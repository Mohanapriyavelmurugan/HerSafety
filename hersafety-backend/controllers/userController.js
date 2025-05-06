import db from '../config/db.js';

export const registerUser = (req, res) => {
  const { name, email, password, phone, address } = req.body;
  const sql = 'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)';
  db.query(
    sql,
    [name, email, password, phone, address || null],
    (err, result) => {
      if (err) {
        console.error('User registration failed:', err);
        return res.status(500).json({ error: 'User registration failed' });
      }
      res.status(201).json({ message: 'User registered', userId: result.insertId });
    }
  );
};

export const loginUser = (req, res) => {
  let { email, password } = req.body;
  email = email ? email.trim() : '';
  password = password ? password.trim() : '';
  console.log('Login attempt:', email, password); // Debug log

  const sql = 'SELECT id, name, email, password FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Login failed:', err);
      return res.status(500).json({ error: 'Login failed' });
    }
    console.log('DB results:', results); // Add this line
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    if (results[0].password !== password) return res.status(401).json({ error: 'Invalid credentials' });
    res.status(200).json({ user: { id: results[0].id, name: results[0].name, email: results[0].email }, token: 'dummy-token' });
  });
};
