const express = require("express");
const router = express.Router();

const {
    getShippingByOrder,
    trackShipment,
    getAllShipments,
    createShipping,
    updateShipping,
} = require("../Controllers/ShippingController");

const { protect, adminOnly } = require("../Middleware/AuthMiddleware");

// ─── Public ──────────────────────────────────────────────

// @route GET    /api/shipping/track/:trackingNumber
router.get("/track/:trackingNumber", trackShipment);

// ─── User routes ─────────────────────────────────────────

// @route GET    /api/shipping/order/:orderId
router.get("/order/:orderId", protect, getShippingByOrder);

// ─── Admin routes ────────────────────────────────────────

// @route GET    /api/shipping
router.get("/", protect, adminOnly, getAllShipments);

// @route POST   /api/shipping
router.post("/", protect, adminOnly, createShipping);

// @route PUT    /api/shipping/:id
router.put("/:id", protect, adminOnly, updateShipping);

module.exports = router;
