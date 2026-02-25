const express = require("express");
const router = express.Router();

const { register, login, logout, getMe } = require("../Controllers/AuthController");
const { protect } = require("../Middleware/AuthMiddleware");

// Register
router.post("/register", register);

// Login (sets cookie)
router.post("/login", login);

// Logout (clears cookie)
router.post("/logout", logout);

// Get logged-in user
router.get("/me", protect, getMe);

module.exports = router;