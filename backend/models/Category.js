// models/Category.js — Blog category schema
const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    // Icon name (e.g. emoji or icon class) for display
    icon: {
      type: String,
      default: "🎮",
    },
    color: {
      type: String,
      default: "#6366f1",
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name before saving
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
