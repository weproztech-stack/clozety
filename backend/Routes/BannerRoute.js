const express = require("express");
const router = express.Router();

const {
    getActiveBanners,
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner,
} = require("../Controllers/BannerController");

const { protect, adminOnly } = require("../Middleware/AuthMiddleware");

// ─── Public ──────────────────────────────────────────────

// @route GET    /api/banners
router.get("/", getActiveBanners);

// ─── Admin ───────────────────────────────────────────────

// @route GET    /api/banners/all
router.get("/all", protect, adminOnly, getAllBanners);

// @route POST   /api/banners
router.post("/", protect, adminOnly, createBanner);

// @route PUT    /api/banners/:id
router.put("/:id", protect, adminOnly, updateBanner);

// @route DELETE /api/banners/:id
router.delete("/:id", protect, adminOnly, deleteBanner);

module.exports = router;
