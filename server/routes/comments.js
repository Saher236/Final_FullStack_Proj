// server/routes/comments.js

const express = require("express");
const pool = require("../db"); // Database connection (PostgreSQL)
const router = express.Router();

/**
 * COMMENTS ROUTES
 * Provides CRUD operations for blog post comments.
 * 
 * Features:
 * - Fetch approved comments for a post
 * - Add a new comment
 * - Delete a comment (admin only)
 * - Approve a comment (admin only)
 */

/**
 * GET /api/comments/all
 * Fetch all comments (approved + pending) for admin management.
 */
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM comments ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching all comments:", err.message);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

/**
 * GET /api/comments/:postId
 * Fetch all approved comments for a specific blog post.
 */

router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const result = await pool.query(
      "SELECT * FROM comments WHERE post_id=$1 AND approved=true ORDER BY created_at DESC",
      [postId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

/**
 * POST /api/comments
 * Add a new comment (pending approval).
 */
router.post("/", async (req, res) => {
  try {
    const { post_id, user_name, content } = req.body;
    if (!post_id || !user_name || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      "INSERT INTO comments (post_id, user_name, content, approved) VALUES ($1, $2, $3, false) RETURNING *",
      [post_id, user_name, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

/**
 * PUT /api/comments/:id/approve
 * Approve a comment (admin action).
 */
router.put("/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE comments SET approved=true WHERE id=$1 RETURNING *",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error approving comment:", err.message);
    res.status(500).json({ error: "Failed to approve comment" });
  }
});

/**
 * DELETE /api/comments/:id
 * Delete a comment (admin action).
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM comments WHERE id=$1 RETURNING *",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err.message);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

module.exports = router;
