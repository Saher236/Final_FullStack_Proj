// server/routes/contacts.js

const express = require('express');
const auth    = require('../middleware/auth');  // 👈 זה ה-middleware שלך
const createDB = require('../db');
const pool     = createDB();
const router   = express.Router();

// Public: anyone can submit
router.post('/', async (req, res) => {

  const { name, email, message } = req.body;
  const user_id = Number(req.body.user_id);

  if (!name || !email || !message || !user_id) {
    return res.status(400).json({ error: 'name, email, message and user_id are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO contacts (name,email,message,user_id) VALUES($1,$2,$3,$4) RETURNING *',
      [name, email, message, user_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("CONTACT INSERT ERROR:", err);
    res.status(500).json({ error: 'DB insert failed', details: err.message });
  }
});

// Protected: only logged-in admin can see their own contacts
router.get('/mine', auth, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM contacts WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  );
  res.json(result.rows);
});


// Delete a contact (protected)
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    'DELETE FROM contacts WHERE id=$1 AND user_id=$2 RETURNING *',
    [id, req.user.id]
  );
  if (!rows.length) return res.status(404).json({ error:'Not found' });
  res.status(204).send();
});

module.exports = router;
