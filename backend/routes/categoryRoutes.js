// routes/categoryRoutes.js — Category CRUD endpoints
const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Post = require("../models/Post");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── GET /api/categories ───────────────────────────────────────
// Public: list all categories with post counts
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Attach post count to each category
    const withCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Post.countDocuments({ category: cat._id, published: true });
        return { ...cat.toJSON(), postCount: count };
      })
    );

    res.json(withCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/categories/:slug ─────────────────────────────────
// Public: get single category by slug
router.get("/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/categories ──────────────────────────────────────
// Admin: create a new category
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;
    const category = await Category.create({ name, description, icon, color });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Category already exists" });
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/categories/:id ───────────────────────────────────
// Admin: update a category
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/categories/:id ────────────────────────────────
// Admin: delete a category
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    // Check if any posts use this category
    const postCount = await Post.countDocuments({ category: req.params.id });
    if (postCount > 0)
      return res.status(400).json({
        message: `Cannot delete: ${postCount} post(s) are using this category`,
      });

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
