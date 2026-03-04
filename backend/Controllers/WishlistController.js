const Wishlist = require("../Models/Wishlist");
const Product = require("../Models/ProductModel/Product");

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id })
            .populate("products.product", "name price discountPrice slug status");

        if (!wishlist) {
            return res.status(200).json({ products: [] });
        }

        res.status(200).json(wishlist);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "productId is required" });
        }

        const product = await Product.findById(productId);
        if (!product || product.isDeleted) {
            return res.status(404).json({ message: "Product not found" });
        }

        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.id,
                products: [{ product: productId }],
            });
        } else {
            const exists = wishlist.products.find(
                (item) => item.product.toString() === productId
            );

            if (exists) {
                return res.status(400).json({ message: "Product already in wishlist" });
            }

            wishlist.products.push({ product: productId });
            await wishlist.save();
        }

        res.status(200).json({ message: "Added to wishlist", wishlist });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

        wishlist.products = wishlist.products.filter(
            (item) => item.product.toString() !== req.params.productId
        );

        await wishlist.save();
        res.status(200).json({ message: "Removed from wishlist", wishlist });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

        wishlist.products = [];
        await wishlist.save();

        res.status(200).json({ message: "Wishlist cleared" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };
