// models/Comment.js — Comment schema for posts
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    approved: {
      type: Boolean,
      default: true, // Auto-approve; set false for moderation
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
