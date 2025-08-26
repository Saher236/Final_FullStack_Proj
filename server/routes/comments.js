// server/routes/comments.js
const express  = require('express');
const auth     = require('../middleware/auth');
const createDB = require('../db');
const pool     = createDB();
const router   = express.Router();

/**
 * Public: Add new comment
 */
router.post("/", async (req, res) => {
  try {
    const { post_id, user_name, content } = req.body;
    if (!post_id || !user_name || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("📥 New comment payload:", req.body);

    const result = await pool.query(
      `INSERT INTO comments (post_id, user_name, content, approved)
       VALUES ($1, $2, $3, false)
       RETURNING *`,
      [post_id, user_name, content]
    );

    console.log("✅ Insert result:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ COMMENT INSERT ERROR:", err); // 🔥 חשוב להדפיס את כל האובייקט
    res.status(500).json({ error: "Failed to add comment", details: err.message });
  }
});


/**
 * Public: Get comments for a post
 */
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM comments WHERE post_id = $1 AND approved = true ORDER BY created_at DESC`,
      [postId]
    );
    res.json(rows);
  } catch (err) {
    console.error("COMMENT FETCH ERROR:", err);
    res.status(500).json({ error: 'DB fetch failed', details: err.message });
  }
});

/**
 * Protected: Admin – see all comments of his posts
 */
router.get('/mine', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.* 
         FROM comments c
         JOIN posts p ON c.post_id = p.id
        WHERE p.user_id = $1
        ORDER BY c.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("ADMIN FETCH ERROR:", err);
    res.status(500).json({ error: 'DB fetch failed', details: err.message });
  }
});

/**
 * Protected: Approve a comment
 */
router.put('/:id/approve', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `UPDATE comments SET approved=true WHERE id=$1 RETURNING *`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error("COMMENT APPROVE ERROR:", err);
    res.status(500).json({ error: 'DB update failed', details: err.message });
  }
});

/**
 * Protected: Delete a comment
 */
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `DELETE FROM comments WHERE id=$1 RETURNING *`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error:'Not found' });
    res.status(204).send();
  } catch (err) {
    console.error("COMMENT DELETE ERROR:", err);
    res.status(500).json({ error: 'DB delete failed', details: err.message });
  }
});

module.exports = router;
