const express = require("express");
const router = express.Router();

const {
    submitInquiry,
    getAllInquiries,
    getInquiryById,
    updateInquiry,
    deleteInquiry,
} = require("../Controllers/ContactController");

const { protect, adminOnly } = require("../Middleware/AuthMiddleware");

// ─── Public ──────────────────────────────────────────────

// @route POST   /api/contact
router.post("/", submitInquiry);

// ─── Admin ───────────────────────────────────────────────

// @route GET    /api/contact
router.get("/", protect, adminOnly, getAllInquiries);

// @route GET    /api/contact/:id
router.get("/:id", protect, adminOnly, getInquiryById);

// @route PUT    /api/contact/:id
router.put("/:id", protect, adminOnly, updateInquiry);

// @route DELETE /api/contact/:id
router.delete("/:id", protect, adminOnly, deleteInquiry);

module.exports = router;
