const Order = require("../Models/Order");
const Cart = require("../Models/Cart");
const Product = require("../Models/ProductModel/Product");

// @desc    Place a new order from cart
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;

        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city ||
            !shippingAddress.zip || !shippingAddress.country) {
            return res.status(400).json({ message: "Complete shipping address is required" });
        }

        const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        // Build order items with product name snapshot & validate stock
        const orderItems = [];
        let totalPrice = 0;

        for (const item of cart.items) {
            const product = item.product;

            if (!product) {
                return res.status(400).json({ message: "A product in your cart no longer exists" });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for "${product.name}"`,
                });
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                price: item.price,
                quantity: item.quantity,
            });

            totalPrice += item.price * item.quantity;

            // Deduct stock
            product.stock -= item.quantity;
            await product.save();
        }

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            totalPrice,
        });

        // Clear cart after order
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get single order by ID (owner or admin)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");

        if (!order) return res.status(404).json({ message: "Order not found" });

        // Only owner or admin can view
        if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to view this order" });
        }

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Cancel an order (user — only if pending)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (order.orderStatus !== "pending") {
            return res.status(400).json({
                message: `Cannot cancel an order that is already "${order.orderStatus}"`,
            });
        }

        // Restore stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity },
            });
        }

        order.orderStatus = "cancelled";
        await order.save();

        res.status(200).json({ message: "Order cancelled", order });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ─── ADMIN ───────────────────────────────────────────────

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const validOrderStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
        const validPaymentStatuses = ["pending", "paid", "failed"];

        if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: "Invalid order status" });
        }
        if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
            return res.status(400).json({ message: "Invalid payment status" });
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        if (orderStatus === "delivered") order.deliveredAt = new Date();
        if (paymentStatus === "paid") order.paidAt = new Date();

        await order.save();

        res.status(200).json({ message: "Order updated", order });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
};
