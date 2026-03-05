const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
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
        index: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        default: "INR",
        uppercase: true,
    },
    method: {
        type: String,
        enum: ["cod", "card", "bank_transfer", "easypaisa", "jazzcash", "other"],
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded", "cancelled"],
        default: "pending",
    },
    transactionId: {
        type: String,       // payment gateway reference
        default: "",
    },
    gatewayResponse: {
        type: mongoose.Schema.Types.Mixed,  // raw response from payment gateway
        default: null,
    },
    paidAt: {
        type: Date,
        default: null,
    },
    refundedAt: {
        type: Date,
        default: null,
    },
    refundAmount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
