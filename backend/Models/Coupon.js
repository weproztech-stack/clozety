const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,       // e.g. "SAVE20", "WELCOME10"
    },
    description: {
        type: String,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ["percentage", "fixed"],   // 20% off vs ₹200 off
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0,
    },
    minOrderAmount: {
        type: Number,       // minimum cart value to apply coupon
        default: 0,
    },
    maxDiscount: {
        type: Number,       // cap on percentage discounts
        default: null,
    },
    usageLimit: {
        type: Number,       // total times this coupon can be used
        default: null,      // null = unlimited
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    perUserLimit: {
        type: Number,       // times a single user can use it
        default: 1,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: "End date must be after start date",
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    applicableCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    }],
}, { timestamps: true });

// Auto-deactivate expired coupons
couponSchema.pre("save", function (next) {
    if (this.endDate < new Date()) {
        this.isActive = false;
    }
    next();
});

module.exports = mongoose.model("Coupon", couponSchema);
