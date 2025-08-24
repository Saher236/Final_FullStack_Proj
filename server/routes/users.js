// server/routes/users.js
const express = require('express');
const createDB = require('../db');
const pool     = createDB();
const router   = express.Router();

// List all admins
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, username, first_name, last_name FROM users WHERE role='admin'"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;