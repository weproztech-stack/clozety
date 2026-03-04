const express = require("express");
const router = express.Router();

const {
    createPayment,
    getPaymentByOrder,
    getAllPayments,
    updatePayment,
} = require("../Controllers/PaymentController");

const { protect, adminOnly } = require("../Middleware/AuthMiddleware");

// ─── User routes ─────────────────────────────────────────

// @route POST   /api/payments
router.post("/", protect, createPayment);

// @route GET    /api/payments/order/:orderId
router.get("/order/:orderId", protect, getPaymentByOrder);

// ─── Admin routes ────────────────────────────────────────

// @route GET    /api/payments
router.get("/", protect, adminOnly, getAllPayments);

// @route PUT    /api/payments/:id
router.put("/:id", protect, adminOnly, updatePayment);

module.exports = router;
