const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        index: true,
    },
    size: {
        type: String,
        required: true,
        trim: true,       // e.g. "S", "M", "L", "XL", "42", "10"
    },
    color: {
        type: String,
        required: true,
        trim: true,        // e.g. "Red", "Black", "Navy Blue"
    },
    colorCode: {
        type: String,       // hex code e.g. "#FF0000"
        trim: true,
    },
    sku: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,   // e.g. "TSH-RED-M-001"
    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
    },
    priceAdjustment: {
        type: Number,       // e.g. +50 for XL sizes
        default: 0,
    },
    imageUrl: {
        type: String,       // variant-specific image (e.g. red version)
        default: "",
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Prevent duplicate size+color combos for same product
productVariantSchema.index({ product: 1, size: 1, color: 1 }, { unique: true });

module.exports = mongoose.model("ProductVariant", productVariantSchema);
