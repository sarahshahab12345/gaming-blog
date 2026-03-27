// routes/postRoutes.js — Blog post CRUD endpoints
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ── GET /api/posts ────────────────────────────────────────────
// Public: list all published posts with pagination, search, category filter
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    // Build dynamic filter
    const filter = { published: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { tags: { $regex: req.query.search, $options: "i" } },
        { excerpt: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("category", "name slug icon color")
        .populate("author", "username avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.json({
      posts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/posts/admin/all ──────────────────────────────────
// Admin: all posts (including drafts)
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("category", "name slug")
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/posts/:slug ──────────────────────────────────────
// Public: get single post by slug; increment view count
router.get("/:slug", async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("category", "name slug icon color")
      .populate("author", "username avatar");

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/posts ───────────────────────────────────────────
// Admin: create a new post
router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, published, metaTitle, metaDescription } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || "";

    const post = await Post.create({
      title,
      content,
      excerpt,
      category,
      tags: tags ? JSON.parse(tags) : [],
      published: published !== undefined ? published : true,
      image,
      author: req.user._id,
      metaTitle,
      metaDescription,
    });

    const populated = await post.populate([
      { path: "category", select: "name slug" },
      { path: "author", select: "username" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/posts/:id ────────────────────────────────────────
// Admin: update a post
router.put("/:id", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    if (updates.tags && typeof updates.tags === "string") {
      updates.tags = JSON.parse(updates.tags);
    }

    Object.assign(post, updates);
    await post.save();

    const populated = await post.populate([
      { path: "category", select: "name slug" },
      { path: "author", select: "username" },
    ]);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/posts/:id ─────────────────────────────────────
// Admin: delete a post
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/posts/:id/like ──────────────────────────────────
// Public: toggle like on a post (uses IP or userId)
router.post("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Simple like: track by a session ID sent from the client
    const { sessionId } = req.body;
    const alreadyLiked = post.likes.some((id) => id.toString() === sessionId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== sessionId);
    } else {
      post.likes.push(sessionId);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
