const express = require("express");
const router = express.Router();
const upload = require("../Middleware/Upload");
const { protect, adminOnly } = require("../Middleware/AuthMiddleware");
const path = require("path");

// Image upload API
router.post("/image", protect, adminOnly, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "No file uploaded" });
        }
        res.json({
            success: true,
            url: req.file.path,
            publicId: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve upload page
router.get("/page", protect, adminOnly, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/upload.html"));
});

module.exports = router;