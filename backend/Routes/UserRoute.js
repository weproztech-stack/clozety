const express = require("express");
const router = express.Router();

const { updateProfile, changePassword } = require("../Controllers/UserController");
const { protect } = require("../Middleware/AuthMiddleware");

// All user routes require login
router.use(protect);

// @route PUT /api/users/me
router.put("/me", updateProfile);

// @route PUT /api/users/me/password
router.put("/me/password", changePassword);

module.exports = router;
