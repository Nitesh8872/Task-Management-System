const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getCurrentUser, updateUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Get current logged-in user
router.get("/me", protect, getCurrentUser);

// Update user profile
router.put("/profile", protect, updateUserProfile);

module.exports = router;
