const Coupon = require("../Models/Coupon");

// @desc    Validate and apply a coupon code
// @route   POST /api/coupons/apply
// @access  Private
const applyCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;

        if (!code || !cartTotal) {
            return res.status(400).json({ message: "Coupon code and cart total are required" });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid or expired coupon code" });
        }

        const now = new Date();
        if (now < coupon.startDate || now > coupon.endDate) {
            return res.status(400).json({ message: "This coupon has expired" });
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: "This coupon has reached its usage limit" });
        }

        if (cartTotal < coupon.minOrderAmount) {
            return res.status(400).json({
                message: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
            });
        }

        let discount = 0;
        if (coupon.discountType === "percentage") {
            discount = (cartTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        if (discount > cartTotal) discount = cartTotal;

        res.status(200).json({
            message: "Coupon applied successfully",
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
            },
            discount: Math.round(discount * 100) / 100,
            finalTotal: Math.round((cartTotal - discount) * 100) / 100,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ─── ADMIN ───────────────────────────────────────────────

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Admin
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json(coupons);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Admin
const createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json({ message: "Coupon created", coupon });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Admin
const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!coupon) return res.status(404).json({ message: "Coupon not found" });

        res.status(200).json({ message: "Coupon updated", coupon });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ message: "Coupon not found" });

        res.status(200).json({ message: "Coupon deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { applyCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon };
