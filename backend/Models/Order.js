const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: { type: String, required: true },   // snapshot
    price: { type: Number, required: true },  // snapshot
    quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [orderItemSchema],

        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String },
            zip: { type: String, required: true },
            country: { type: String, required: true },
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        orderStatus: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending",
        },

        paidAt: { type: Date },
        deliveredAt: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
