// server/routes/projects.js
const express = require('express');
const auth    = require('../middleware/auth');
const createDB = require('../db');
const pool     = createDB();
const router   = express.Router();

// Public: list all
router.get('/', async (req, res) => {
  const result = await pool.query(
    'SELECT p.*, u.username FROM projects p JOIN users u ON p.user_id=u.id ORDER BY p.created_at DESC'
  );
  res.json(result.rows);
});

// Public by user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const result = await pool.query(
    'SELECT * FROM projects WHERE user_id=$1 ORDER BY created_at DESC',
    [userId]
  );
  res.json(result.rows);
});

// Protected
router.use(auth);
// Get mine
router.get('/mine', async (req, res) => {
  const result = await pool.query('SELECT * FROM projects WHERE user_id=$1', [req.user.id]);
  res.json(result.rows);
});
// Create
router.post('/', async (req, res) => {
  const { title, description, github_link, demo_link, image_url } = req.body;
  const result = await pool.query(
    'INSERT INTO projects (title,description,github_link,demo_link,image_url,user_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
    [title,description,github_link,demo_link,image_url,req.user.id]
  );
  res.status(201).json(result.rows[0]);
});
// Update
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  // ensure owner
  const own = await pool.query('SELECT 1 FROM projects WHERE id=$1 AND user_id=$2',[id,req.user.id]);
  if (!own.rows.length) return res.status(403).json({ error:'Not allowed' });
  const fields = ['title','description','github_link','demo_link','image_url'].map(f => req.body[f]);
  const q = `UPDATE projects SET title=$1,description=$2,github_link=$3,demo_link=$4,image_url=$5,updated_at=CURRENT_TIMESTAMP WHERE id=$6 RETURNING *`;
  const result = await pool.query(q,[...fields,id]);
  res.json(result.rows[0]);
});
// Delete
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'DELETE FROM projects WHERE id=$1 AND user_id=$2 RETURNING *',
    [id,req.user.id]
  );
  if (!result.rows.length) return res.status(403).json({ error:'Not allowed' });
  res.status(204).send();
});

module.exports = router;