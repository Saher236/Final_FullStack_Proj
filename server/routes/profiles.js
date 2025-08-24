// server/routes/profiles.js
const express  = require('express');
const auth     = require('../middleware/auth');
const createDB = require('../db');
const pool     = createDB();
const router   = express.Router();

/**
 * Public: get a user's full profile (about, skills, avatar_url)
 * GET /api/profiles/user/:id
 */
router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT user_id, about, skills, avatar_url, updated_at FROM profiles WHERE user_id=$1 LIMIT 1',
      [id]
    );
    res.json(rows[0] || null);
  } catch (err) {
    console.error('profiles GET /user/:id error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Public: only the About field
 * GET /api/profiles/user/:id/about
 */
router.get('/user/:id/about', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT about FROM profiles WHERE user_id=$1 LIMIT 1',
      [id]
    );
    res.json({ about: rows[0]?.about || '' });
  } catch (err) {
    console.error('profiles GET /user/:id/about error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Public: only the Skills field (returns array)
 * GET /api/profiles/user/:id/skills
 */
router.get('/user/:id/skills', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT skills FROM profiles WHERE user_id=$1 LIMIT 1',
      [id]
    );
    const raw = rows[0]?.skills || '';
    const skills = raw
      ? raw.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    res.json({ skills });
  } catch (err) {
    console.error('profiles GET /user/:id/skills error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Protected: my profile
 */
router.use(auth);

router.get('/mine', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT user_id, about, skills, avatar_url, updated_at FROM profiles WHERE user_id=$1 LIMIT 1',
      [req.user.id]
    );
    res.json(rows[0] || null);
  } catch (err) {
    console.error('profiles GET /mine error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Protected: create/update my profile
 */
router.post('/mine', async (req, res) => {
  try {
    const { about, skills, avatar_url } = req.body;

    const upd = await pool.query(
      `UPDATE profiles
         SET about=$1, skills=$2, avatar_url=$3, updated_at=CURRENT_TIMESTAMP
       WHERE user_id=$4
       RETURNING *`,
      [about || null, skills || null, avatar_url || null, req.user.id]
    );
    if (upd.rows.length) return res.json(upd.rows[0]);

    const ins = await pool.query(
      `INSERT INTO profiles (user_id, about, skills, avatar_url)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.user.id, about || null, skills || null, avatar_url || null]
    );
    res.status(201).json(ins.rows[0]);
  } catch (err) {
    console.error('profiles POST /mine error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
