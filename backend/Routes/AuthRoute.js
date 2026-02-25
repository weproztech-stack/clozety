const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../Controllers/AuthController");
const { protect } = require("../Middleware/AuthMiddleware");

// @route POST /api/auth/register
router.post("/register", register);

// @route POST /api/auth/login
router.post("/login", login);

// @route GET /api/auth/me  (protected)
router.get("/me", protect, getMe);

module.exports = router;
