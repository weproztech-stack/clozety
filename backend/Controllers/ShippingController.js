const Shipping = require("../Models/Shipping");
const Order = require("../Models/Order");

// @desc    Get shipping info for an order
// @route   GET /api/shipping/order/:orderId
// @access  Private
const getShippingByOrder = async (req, res) => {
    try {
        const shipping = await Shipping.findOne({ order: req.params.orderId })
            .populate("order", "totalPrice orderStatus items");

        if (!shipping) return res.status(404).json({ message: "Shipping info not found" });

        // Verify ownership
        if (shipping.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.status(200).json(shipping);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Track shipment (public with tracking number)
// @route   GET /api/shipping/track/:trackingNumber
// @access  Public
const trackShipment = async (req, res) => {
    try {
        const shipping = await Shipping.findOne({ trackingNumber: req.params.trackingNumber })
            .select("carrier trackingNumber trackingUrl status estimatedDelivery shippedAt deliveredAt shippingAddress");

        if (!shipping) return res.status(404).json({ message: "Tracking number not found" });

        res.status(200).json(shipping);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ─── ADMIN ───────────────────────────────────────────────

// @desc    Get all shipments
// @route   GET /api/shipping
// @access  Admin
const getAllShipments = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};
        if (status) filter.status = status;

        const shipments = await Shipping.find(filter)
            .populate("order", "totalPrice orderStatus")
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(shipments);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Create shipping record for an order
// @route   POST /api/shipping
// @access  Admin
const createShipping = async (req, res) => {
    try {
        const { orderId, carrier, trackingNumber, trackingUrl, shippingCost, estimatedDelivery } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        const order = await Order.findById(orderId).populate("user", "name");
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Check if shipping already exists
        const existing = await Shipping.findOne({ order: orderId });
        if (existing) {
            return res.status(400).json({ message: "Shipping record already exists for this order" });
        }

        const shipping = await Shipping.create({
            order: orderId,
            user: order.user._id || order.user,
            carrier: carrier || "",
            trackingNumber: trackingNumber || "",
            trackingUrl: trackingUrl || "",
            shippingAddress: order.shippingAddress,
            shippingCost: shippingCost || 0,
            estimatedDelivery: estimatedDelivery || null,
        });

        // Update order status to confirmed
        if (order.orderStatus === "pending") {
            order.orderStatus = "confirmed";
            await order.save();
        }

        res.status(201).json({ message: "Shipping created", shipping });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Update shipping status
// @route   PUT /api/shipping/:id
// @access  Admin
const updateShipping = async (req, res) => {
    try {
        const { status, carrier, trackingNumber, trackingUrl, estimatedDelivery } = req.body;

        const shipping = await Shipping.findById(req.params.id);
        if (!shipping) return res.status(404).json({ message: "Shipping not found" });

        if (status) shipping.status = status;
        if (carrier) shipping.carrier = carrier;
        if (trackingNumber) shipping.trackingNumber = trackingNumber;
        if (trackingUrl) shipping.trackingUrl = trackingUrl;
        if (estimatedDelivery) shipping.estimatedDelivery = estimatedDelivery;

        if (status === "shipped") shipping.shippedAt = new Date();
        if (status === "delivered") shipping.deliveredAt = new Date();

        await shipping.save();

        // Sync order status
        const order = await Order.findById(shipping.order);
        if (order) {
            if (status === "shipped") order.orderStatus = "shipped";
            if (status === "delivered") {
                order.orderStatus = "delivered";
                order.deliveredAt = new Date();
            }
            await order.save();
        }

        res.status(200).json({ message: "Shipping updated", shipping });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { getShippingByOrder, trackShipment, getAllShipments, createShipping, updateShipping };
