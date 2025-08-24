// server/routes/resumes.js
const express = require('express');
const auth    = require('../middleware/auth');
const createDB = require('../db');
const pool     = createDB();
const router   = express.Router();
const PDFDocument = require('pdfkit');

// 🔹 Public: רשימת כל הרזיומים
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT r.*,u.username FROM resumes r JOIN users u ON r.user_id=u.id'
  );
  res.json(rows);
});

// 🔹 Public: רזיומה לפי משתמש
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { rows } = await pool.query(
    'SELECT * FROM resumes WHERE user_id=$1',
    [userId]
  );
  res.json(rows[0] || null);
});

// 🔹 Public: הורדת PDF
router.get('/user/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT content FROM resumes WHERE user_id=$1 LIMIT 1',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');

    const doc = new PDFDocument();
    doc.pipe(res);
    doc.fontSize(18).text('Resume', { underline: true });
    doc.moveDown().fontSize(12).text(rows[0].content || '—');
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔒 Protected routes (after auth)
router.use(auth);

// שלי (האדמין המחובר)
router.get('/mine', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM resumes WHERE user_id=$1',
    [req.user.id]
  );
  res.json(rows[0] || null);
});

// Create/update resume
router.post('/', async (req, res) => {
  const { content } = req.body;

  const upd = await pool.query(
    'UPDATE resumes SET content=$1, updated_at=CURRENT_TIMESTAMP WHERE user_id=$2 RETURNING *',
    [content, req.user.id]
  );

  if (upd.rows.length) return res.json(upd.rows[0]);

  const ins = await pool.query(
    'INSERT INTO resumes (user_id, content) VALUES ($1, $2) RETURNING *',
    [req.user.id, content]
  );

  res.status(201).json(ins.rows[0]);
});

// Delete resume
router.delete('/', async (req, res) => {
  const del = await pool.query(
    'DELETE FROM resumes WHERE user_id=$1 RETURNING *',
    [req.user.id]
  );
  if (!del.rows.length) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

module.exports = router;
