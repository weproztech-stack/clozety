const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
} = require("../Controllers/OrderController");

const { protect, adminOnly } = require("../Middleware/AuthMiddleware");

// ─── Admin routes (before /:id to avoid conflicts) ───────────

// @route GET    /api/orders
router.get("/", protect, adminOnly, getAllOrders);

// ─── User routes ─────────────────────────────────────────────

// @route POST   /api/orders
router.post("/", protect, placeOrder);

// @route GET    /api/orders/my  ← before /:id
router.get("/my", protect, getMyOrders);

// @route GET    /api/orders/:id
router.get("/:id", protect, getOrderById);

// @route PUT    /api/orders/:id/cancel
router.put("/:id/cancel", protect, cancelOrder);

// @route PUT    /api/orders/:id/status
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
