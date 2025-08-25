// server/routes/users.js
// User routes: public admin listing + private user profile management
const express = require("express");
const createDB = require("../db");
const pool = createDB();
const router = express.Router();
const auth = require("../middleware/auth");

// Public: return all admins (used in homepage/team section)
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, username, first_name, last_name, email,
              github_url, linkedin_url, avatar_url
       FROM users
       WHERE role='admin'`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Protected: return logged-in user's info
router.get("/me", auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, username, first_name, last_name, email,
              github_url, linkedin_url, avatar_url
       FROM users
       WHERE id=$1`,
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Protected: update logged-in user's profile
router.put("/me", auth, async (req, res) => {
  try {
    const { github_url, linkedin_url, avatar_url } = req.body;
    const { rows } = await pool.query(
      `UPDATE users
       SET github_url=$1,
           linkedin_url=$2,
           avatar_url=$3
       WHERE id=$4
       RETURNING id, username, first_name, last_name, email,
                 github_url, linkedin_url, avatar_url`,
      [github_url || null, linkedin_url || null, avatar_url || null, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
