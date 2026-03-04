const express = require("express");
const router = express.Router();

const {
    applyCoupon,
    getAllCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
} = require("../Controllers/CouponController");

const { protect, adminOnly } = require("../Middleware/AuthMiddleware");

// ─── User routes ─────────────────────────────────────────

// @route POST   /api/coupons/apply
router.post("/apply", protect, applyCoupon);

// ─── Admin routes ────────────────────────────────────────

// @route GET    /api/coupons
router.get("/", protect, adminOnly, getAllCoupons);

// @route POST   /api/coupons
router.post("/", protect, adminOnly, createCoupon);

// @route PUT    /api/coupons/:id
router.put("/:id", protect, adminOnly, updateCoupon);

// @route DELETE /api/coupons/:id
router.delete("/:id", protect, adminOnly, deleteCoupon);

module.exports = router;
