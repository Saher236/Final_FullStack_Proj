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
    const result = await pool.query(
      `INSERT INTO comments (post_id, user_name, content, approved)
       VALUES ($1, $2, $3, false)
       RETURNING *`,
      [post_id, user_name, content]
    );

    console.log("✅ Insert result:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment", details: err.message });
  }
});


// GET /api/comments/all
// Fetch all comments (approved + pending) for admin
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM comments ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// GET /api/comments/:postId
// Fetch only approved comments for a single post (public)
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const result = await pool.query(
      "SELECT * FROM comments WHERE post_id=$1 AND approved=true ORDER BY created_at DESC",
      [postId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
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
    res.status(500).json({ error: 'DB delete failed', details: err.message });
  }
});

module.exports = router;
