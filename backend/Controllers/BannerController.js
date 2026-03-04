const Banner = require("../Models/Banner");

// @desc    Get all active banners (for frontend)
// @route   GET /api/banners
// @access  Public
const getActiveBanners = async (req, res) => {
    try {
        const { position } = req.query;
        const now = new Date();

        const filter = {
            isActive: true,
            startDate: { $lte: now },
            $or: [
                { endDate: null },
                { endDate: { $gte: now } },
            ],
        };

        if (position) filter.position = position;

        const banners = await Banner.find(filter).sort({ sortOrder: 1 });
        res.status(200).json(banners);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ─── ADMIN ───────────────────────────────────────────────

// @desc    Get all banners (including inactive)
// @route   GET /api/banners/all
// @access  Admin
const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ sortOrder: 1, createdAt: -1 });
        res.status(200).json(banners);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Create banner
// @route   POST /api/banners
// @access  Admin
const createBanner = async (req, res) => {
    try {
        const banner = await Banner.create(req.body);
        res.status(201).json({ message: "Banner created", banner });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Admin
const updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!banner) return res.status(404).json({ message: "Banner not found" });

        res.status(200).json({ message: "Banner updated", banner });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Admin
const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) return res.status(404).json({ message: "Banner not found" });

        res.status(200).json({ message: "Banner deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { getActiveBanners, getAllBanners, createBanner, updateBanner, deleteBanner };
