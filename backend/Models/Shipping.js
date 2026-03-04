const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        index: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    carrier: {
        type: String,       // e.g. "TCS", "Leopards", "Pakistan Post", "M&P"
        trim: true,
        default: "",
    },
    trackingNumber: {
        type: String,
        trim: true,
        default: "",
    },
    trackingUrl: {
        type: String,
        trim: true,
        default: "",
    },
    status: {
        type: String,
        enum: ["processing", "packed", "shipped", "in_transit", "out_for_delivery", "delivered", "returned"],
        default: "processing",
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        zip: { type: String, required: true },
        country: { type: String, default: "Pakistan" },
    },
    shippingCost: {
        type: Number,
        default: 0,
        min: 0,
    },
    estimatedDelivery: {
        type: Date,
        default: null,
    },
    shippedAt: {
        type: Date,
        default: null,
    },
    deliveredAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

module.exports = mongoose.model("Shipping", shippingSchema);
