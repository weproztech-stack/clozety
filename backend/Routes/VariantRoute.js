const express = require("express");
const router = express.Router();

const {
    getVariantsByProduct,
    getVariantById,
    createVariant,
    updateVariant,
    deleteVariant,
} = require("../Controllers/VariantController");

const { protect, adminOnly } = require("../Middleware/AuthMiddleware");

// @route GET    /api/products/:productId/variants
router.get("/product/:productId", getVariantsByProduct);

// @route GET    /api/variants/:id
router.get("/:id", getVariantById);

// @route POST   /api/variants/product/:productId
router.post("/product/:productId", protect, adminOnly, createVariant);

// @route PUT    /api/variants/:id
router.put("/:id", protect, adminOnly, updateVariant);

// @route DELETE /api/variants/:id
router.delete("/:id", protect, adminOnly, deleteVariant);

module.exports = router;
