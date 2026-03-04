const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        trim: true,
    },
    imageUrl: {
        type: String,
        required: true,    // Cloudinary URL
    },
    linkUrl: {
        type: String,      // where the banner links to (e.g. /products?category=shoes)
        trim: true,
        default: "",
    },
    buttonText: {
        type: String,      // CTA button text (e.g. "Shop Now")
        trim: true,
        default: "",
    },
    position: {
        type: String,
        enum: ["hero", "sidebar", "promo", "footer"],
        default: "hero",
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        default: null,     // null = no expiry
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Banner", bannerSchema);
