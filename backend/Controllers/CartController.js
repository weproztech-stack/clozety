const Cart = require("../Models/Cart");
const Product = require("../Models/ProductModel/Product");

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate(
            "items.product",
            "name price discountPrice images slug"
        );

        if (!cart) {
            return res.status(200).json({ items: [], totalPrice: 0 });
        }

        const totalPrice = cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        res.status(200).json({ items: cart.items, totalPrice });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Add item to cart (or increase qty if already exists)
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "productId is required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        const price = product.discountPrice > 0 ? product.discountPrice : product.price;

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            // Create new cart
            cart = await Cart.create({
                user: req.user.id,
                items: [{ product: productId, quantity, price }],
            });
        } else {
            const existingItem = cart.items.find(
                (item) => item.product.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity, price });
            }

            await cart.save();
        }

        res.status(200).json({ message: "Item added to cart", cart });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(
            (item) => item.product.toString() === req.params.productId
        );

        if (!item) return res.status(404).json({ message: "Item not in cart" });

        item.quantity = quantity;
        await cart.save();

        res.status(200).json({ message: "Cart updated", cart });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Remove a single item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeCartItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== req.params.productId
        );

        await cart.save();
        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = [];
        await cart.save();

        res.status(200).json({ message: "Cart cleared" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
