// server/routes/resumes.js
const express = require('express');
const auth    = require('../middleware/auth');
const createDB = require('../db');
const pool     = createDB();
const router   = express.Router();

// Public
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT r.*,u.username FROM resumes r JOIN users u ON r.user_id=u.id'
  );
  res.json(rows);
});
// Public by user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { rows } = await pool.query(
    'SELECT * FROM resumes WHERE user_id=$1',[userId]
  );
  res.json(rows[0]||null);
});
// Protected
router.use(auth);
// Mine
router.get('/mine', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM resumes WHERE user_id=$1',[req.user.id]);
  res.json(rows[0]||null);
});

router.get('/user/:id', async (req,res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM resumes WHERE user_id=$1 LIMIT 1',[id]);
  res.json(rows[0] || null);
});

// PDF ציבורי למשתמש מסוים
const PDFDocument = require('pdfkit');
router.get('/user/:id/pdf', async (req,res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT content FROM resumes WHERE user_id=$1 LIMIT 1',[id]);
  res.setHeader('Content-Type','application/pdf');
  res.setHeader('Content-Disposition','inline; filename="resume.pdf"');
  const doc = new PDFDocument(); doc.pipe(res);
  doc.fontSize(18).text('Resume', { underline:true });
  doc.moveDown().fontSize(12).text(rows[0]?.content || '—'); doc.end();
});


// Create/update
router.post('/', async (req, res) => {
  const { content } = req.body;
  const upd = await pool.query(
    'UPDATE resumes SET content=$1,updated_at=CURRENT_TIMESTAMP WHERE user_id=$2 RETURNING *',
    [content,req.user.id]
  );
  if (upd.rows.length) return res.json(upd.rows[0]);
  const ins = await pool.query(
    'INSERT INTO resumes (user_id,content) VALUES($1,$2) RETURNING *',
    [req.user.id,content]
  );
  res.status(201).json(ins.rows[0]);
});
// Delete
router.delete('/', async (req, res) => {
  const del = await pool.query('DELETE FROM resumes WHERE user_id=$1 RETURNING *',[req.user.id]);
  if (!del.rows.length) return res.status(404).json({ error:'Not found' });
  res.status(204).send();
});

module.exports = router;