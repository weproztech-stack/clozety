const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
} = require("../Controllers/AdminController");

const { protect, adminOnly } = require("../Middleware/AuthMiddleware");

// All admin routes require login + admin role
router.use(protect, adminOnly);

// @route GET    /api/admin/users
router.get("/users", getAllUsers);

// @route GET    /api/admin/users/:id
router.get("/users/:id", getUserById);

// @route PUT    /api/admin/users/:id/role
router.put("/users/:id/role", updateUserRole);

// @route DELETE /api/admin/users/:id
router.delete("/users/:id", deleteUser);

module.exports = router;
