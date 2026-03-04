const ProductVariant = require("../Models/ProductModel/ProductVariant");
const Product = require("../Models/ProductModel/Product");
const mongoose = require("mongoose");

// @desc    Get all variants for a product
// @route   GET /api/products/:productId/variants
// @access  Public
const getVariantsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const variants = await ProductVariant.find({ product: productId, isAvailable: true })
            .sort({ size: 1, color: 1 });

        res.status(200).json(variants);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get single variant
// @route   GET /api/variants/:id
// @access  Public
const getVariantById = async (req, res) => {
    try {
        const variant = await ProductVariant.findById(req.params.id).populate("product", "name price");
        if (!variant) return res.status(404).json({ message: "Variant not found" });

        res.status(200).json(variant);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Create variant for a product
// @route   POST /api/products/:productId/variants
// @access  Admin
const createVariant = async (req, res) => {
    try {
        const { productId } = req.params;
        const { size, color, colorCode, sku, stock, priceAdjustment, imageUrl } = req.body;

        const product = await Product.findById(productId);
        if (!product || product.isDeleted) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (!size || !color || !sku) {
            return res.status(400).json({ message: "Size, color, and SKU are required" });
        }

        const variant = await ProductVariant.create({
            product: productId,
            size: size.trim(),
            color: color.trim(),
            colorCode,
            sku,
            stock: stock || 0,
            priceAdjustment: priceAdjustment || 0,
            imageUrl: imageUrl || "",
        });

        res.status(201).json({ message: "Variant created", variant });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "This size/color combination or SKU already exists" });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Update a variant
// @route   PUT /api/variants/:id
// @access  Admin
const updateVariant = async (req, res) => {
    try {
        const variant = await ProductVariant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!variant) return res.status(404).json({ message: "Variant not found" });

        res.status(200).json({ message: "Variant updated", variant });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Duplicate size/color combination or SKU" });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Delete a variant
// @route   DELETE /api/variants/:id
// @access  Admin
const deleteVariant = async (req, res) => {
    try {
        const variant = await ProductVariant.findByIdAndDelete(req.params.id);
        if (!variant) return res.status(404).json({ message: "Variant not found" });

        res.status(200).json({ message: "Variant deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { getVariantsByProduct, getVariantById, createVariant, updateVariant, deleteVariant };
