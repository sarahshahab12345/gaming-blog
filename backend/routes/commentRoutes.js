// routes/commentRoutes.js — Comment endpoints
const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── GET /api/comments?postId=xxx ──────────────────────────────
// Public: get all approved comments for a post
router.get("/", async (req, res) => {
  try {
    const { postId } = req.query;
    if (!postId) return res.status(400).json({ message: "postId is required" });

    const comments = await Comment.find({ post: postId, approved: true }).sort({
      createdAt: -1,
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/comments ────────────────────────────────────────
// Public: add a new comment
router.post("/", async (req, res) => {
  try {
    const { postId, name, email, content } = req.body;
    if (!postId || !name || !email || !content)
      return res.status(400).json({ message: "All fields are required" });

    const comment = await Comment.create({ post: postId, name, email, content });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/comments/:id ──────────────────────────────────
// Admin: delete a comment
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
