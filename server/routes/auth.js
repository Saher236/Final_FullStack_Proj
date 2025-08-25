// server/routes/auth.js

// Auth routes: login and (optional) registration
const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const createDB = require('../db');
const pool     = createDB();
const router   = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_in_prod';

// Register a new user (mainly for setup or testing)
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1,$2,$3)',
      [username, hash, role || 'admin']
    );

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user and return JWT
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const { rows } = await pool.query(
      'SELECT * FROM users WHERE username=$1',
      [username]
    );
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
