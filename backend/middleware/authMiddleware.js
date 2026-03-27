// middleware/authMiddleware.js — JWT protection middleware
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes: verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Expect token in Authorization header: "Bearer <token>"
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin-only guard (currently all users are admin)
const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ message: "Admin access required" });
};

module.exports = { protect, adminOnly };
