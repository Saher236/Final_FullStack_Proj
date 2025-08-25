// server/routes/posts.js
// Blog posts routes: public browsing + admin-only management
const express = require('express');
const auth    = require('../middleware/auth');
const createDB = require('../db');
const pool     = createDB();
const router   = express.Router();

// Public: get all posts
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id,title,slug,thumbnail,content,created_at,user_id FROM posts ORDER BY created_at DESC'
  );
  res.json(rows);
});

// Public: posts of a specific user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { rows } = await pool.query(
    `SELECT id, title, slug, thumbnail,content, created_at, user_id
       FROM posts
      WHERE user_id = $1
      ORDER BY created_at DESC`,
    [userId]
  );
  res.json(rows);
});

// Public: get single post by slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  const { rows } = await pool.query('SELECT * FROM posts WHERE slug=$1',[slug]);
  if (!rows.length) return res.status(404).json({ error:'Not found' });
  res.json(rows[0]);
});

// Protected routes
router.use(auth);

// Get posts of the logged-in admin
router.get('/mine/list', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, title, slug, thumbnail,content, created_at, user_id
       FROM posts
      WHERE user_id = $1
      ORDER BY created_at DESC`,
    [req.user.id]
  );
  res.json(rows);
});

// Create new post
router.post('/', async (req, res) => {
  const { title, slug, content, thumbnail } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO posts (title,slug,content,thumbnail,user_id) VALUES($1,$2,$3,$4,$5) RETURNING *',
    [title,slug,content,thumbnail,req.user.id]
  );
  res.status(201).json(rows[0]);
});

// Update existing post
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, slug, content, thumbnail } = req.body;
  const { rows } = await pool.query(
    `UPDATE posts SET title=$1,slug=$2,content=$3,thumbnail=$4,updated_at=CURRENT_TIMESTAMP 
       WHERE id=$5 AND user_id=$6 
       RETURNING *`,
    [title,slug,content,thumbnail,id,req.user.id]
  );
  if (!rows.length) return res.status(404).json({ error:'Not found' });
  res.json(rows[0]);
});

// Delete post
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    'DELETE FROM posts WHERE id=$1 AND user_id=$2 RETURNING *',
    [id,req.user.id]
  );
  if (!rows.length) return res.status(404).json({ error:'Not found' });
  res.status(204).send();
});

module.exports = router;
