const express = require("express");
const router = express.Router();

const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} = require("../Controllers/CartController");

const { protect } = require("../Middleware/AuthMiddleware");

// All cart routes require login
router.use(protect);

// @route GET    /api/cart
router.get("/", getCart);

// @route POST   /api/cart
router.post("/", addToCart);

// @route PUT    /api/cart/:productId
router.put("/:productId", updateCartItem);

// @route DELETE /api/cart  (clear all) — must come BEFORE /:productId
router.delete("/", clearCart);

// @route DELETE /api/cart/:productId
router.delete("/:productId", removeCartItem);

module.exports = router;
