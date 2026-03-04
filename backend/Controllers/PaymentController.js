const Payment = require("../Models/Payment");
const Order = require("../Models/Order");

// @desc    Create payment record for an order
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res) => {
    try {
        const { orderId, method } = req.body;

        if (!orderId || !method) {
            return res.status(400).json({ message: "Order ID and payment method are required" });
        }

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Verify the order belongs to this user
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Check if payment already exists for this order
        const existingPayment = await Payment.findOne({ order: orderId });
        if (existingPayment) {
            return res.status(400).json({ message: "Payment already exists for this order" });
        }

        const payment = await Payment.create({
            order: orderId,
            user: req.user.id,
            amount: order.totalPrice,
            method,
            status: method === "cod" ? "pending" : "pending",
        });

        // Update order payment status
        if (method === "cod") {
            order.paymentStatus = "pending";
        }
        await order.save();

        res.status(201).json({ message: "Payment created", payment });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get payment for an order
// @route   GET /api/payments/order/:orderId
// @access  Private
const getPaymentByOrder = async (req, res) => {
    try {
        const payment = await Payment.findOne({ order: req.params.orderId })
            .populate("order", "totalPrice orderStatus");

        if (!payment) return res.status(404).json({ message: "Payment not found" });

        // Verify ownership
        if (payment.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.status(200).json(payment);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ─── ADMIN ───────────────────────────────────────────────

// @desc    Get all payments
// @route   GET /api/payments
// @access  Admin
const getAllPayments = async (req, res) => {
    try {
        const { status, method } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (method) filter.method = method;

        const payments = await Payment.find(filter)
            .populate("order", "totalPrice orderStatus")
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(payments);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Update payment status (mark as paid, refund, etc.)
// @route   PUT /api/payments/:id
// @access  Admin
const updatePayment = async (req, res) => {
    try {
        const { status, transactionId, refundAmount } = req.body;

        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ message: "Payment not found" });

        if (status) payment.status = status;
        if (transactionId) payment.transactionId = transactionId;
        if (refundAmount) payment.refundAmount = refundAmount;

        if (status === "completed") payment.paidAt = new Date();
        if (status === "refunded") payment.refundedAt = new Date();

        await payment.save();

        // Sync order payment status
        const order = await Order.findById(payment.order);
        if (order) {
            if (status === "completed") order.paymentStatus = "paid";
            if (status === "failed") order.paymentStatus = "failed";
            if (status === "refunded") order.paymentStatus = "pending";
            await order.save();
        }

        res.status(200).json({ message: "Payment updated", payment });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { createPayment, getPaymentByOrder, getAllPayments, updatePayment };
