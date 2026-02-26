const ProductImage = require("../Models/ProductModel/ProductImage");
const Product = require("../Models/ProductModel/Product");
// const cloudinary = require("../Config/cloudinary");

// @desc    Upload image(s) for a product
// @route   POST /api/products/:productId/images
// @access  Admin
const uploadProductImages = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No images uploaded" });
        }

        const existingCount = await ProductImage.countDocuments({ productId });

        const images = await Promise.all(
            req.files.map(async (file, index) => {
                const isPrimary = existingCount === 0 && index === 0;

                return ProductImage.create({
                    productId,
                    imageUrl: file.path, // Cloudinary URL
                    isPrimary,
                });
            })
        );

        res.status(201).json({ message: "Images uploaded successfully", images });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get all images for a product
// @route   GET /api/products/:productId/images
// @access  Public
const getProductImages = async (req, res) => {
    try {
        const images = await ProductImage.find({ productId: req.params.productId });
        res.status(200).json(images);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Set an image as primary
// @route   PUT /api/products/:productId/images/:imageId/primary
// @access  Admin
const setPrimaryImage = async (req, res) => {
    try {
        const { productId, imageId } = req.params;

        // Unset all primary for this product
        await ProductImage.updateMany({ productId }, { isPrimary: false });

        // Set new primary
        const image = await ProductImage.findByIdAndUpdate(
            imageId,
            { isPrimary: true },
            { new: true }
        );

        if (!image) return res.status(404).json({ message: "Image not found" });

        res.status(200).json({ message: "Primary image updated", image });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Delete a product image
// @route   DELETE /api/products/:productId/images/:imageId
// @access  Admin
const deleteProductImage = async (req, res) => {
    try {
        const image = await ProductImage.findById(req.params.imageId);
        if (!image) return res.status(404).json({ message: "Image not found" });

        // Delete from Cloudinary
        const publicId = image.imageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);

        await image.deleteOne();
        res.status(200).json({ message: "Image deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { uploadProductImages, getProductImages, setPrimaryImage, deleteProductImage };
