const express = require("express");
const router = express.Router();

const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../Controllers/CategoryController");

const { protect, adminOnly } = require("../Middleware/AuthMiddleware");

// @route GET    /api/categories
router.get("/", getAllCategories);

// @route GET    /api/categories/:id
router.get("/:id", getCategoryById);

// @route POST   /api/categories
router.post("/", protect, adminOnly, createCategory);

// @route PUT    /api/categories/:id
router.put("/:id", protect, adminOnly, updateCategory);

// @route DELETE /api/categories/:id
router.delete("/:id", protect, adminOnly, deleteCategory);

module.exports = router;
