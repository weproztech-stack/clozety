const ProductImage = require("../Models/ProductModel/ProductImage");
const Product = require("../Models/ProductModel/Product");
const cloudinary = require("../Config/cloudinary");

// Helper: Extract Cloudinary public ID from URL
const extractCloudinaryPublicId = (url) => {
  if (!url) return null;
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const pathPart = url.substring(uploadIndex + 8);
      const folderPath = pathPart.substring(0, pathPart.lastIndexOf('/'));
      return `${folderPath}/${publicId}`;
    }
    return `products/${publicId}`;
  } catch (error) {
    console.error("Error extracting publicId:", error);
    return null;
  }
};

// @desc    Upload image(s) for a product
// @route   POST /api/products/:productId/images
// @access  Admin
const uploadProductImages = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const existingCount = await ProductImage.countDocuments({ productId });

    const images = await Promise.all(
      req.files.map(async (file, index) => {
        const isPrimary = existingCount === 0 && index === 0;
        
        const cloudinaryId = file.filename || extractCloudinaryPublicId(file.path);

        return ProductImage.create({
          productId,
          imageUrl: file.path,
          cloudinaryId,
          altText: `${product.name} - Image ${existingCount + index + 1}`,
          isPrimary,
          sortOrder: existingCount + index
        });
      })
    );

    // If product was draft, make it active now that it has images
    if (product.status === "draft") {
      product.status = "active";
      await product.save();
    }

    res.status(201).json({ 
      message: "Images uploaded successfully", 
      count: images.length,
      images 
    });
  } catch (err) {
    console.error("Upload images error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get all images for a product
// @route   GET /api/products/:productId/images
// @access  Public
const getProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const images = await ProductImage.find({ productId })
      .sort({ isPrimary: -1, sortOrder: 1 });
      
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

    // Verify image exists and belongs to product
    const image = await ProductImage.findById(imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });
    
    if (image.productId.toString() !== productId) {
      return res.status(400).json({ message: "Image does not belong to this product" });
    }

    // Unset all primary for this product
    await ProductImage.updateMany({ productId }, { isPrimary: false });

    // Set new primary
    image.isPrimary = true;
    await image.save();

    res.status(200).json({ message: "Primary image updated", image });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Delete a product image (from both DB and Cloudinary)
// @route   DELETE /api/products/:productId/images/:imageId
// @access  Admin
const deleteProductImage = async (req, res) => {
  try {
    const { productId, imageId } = req.params;

    const image = await ProductImage.findById(imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });
    
    if (image.productId.toString() !== productId) {
      return res.status(400).json({ message: "Image does not belong to this product" });
    }

    // Check if this is the primary image
    const wasPrimary = image.isPrimary;

    // Delete from Cloudinary
    if (image.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(image.cloudinaryId);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError);
        // Continue with DB deletion even if Cloudinary fails
      }
    }

    // Delete from database
    await image.deleteOne();

    // If this was the primary image, set another image as primary if available
    if (wasPrimary) {
      const nextImage = await ProductImage.findOne({ productId }).sort({ sortOrder: 1 });
      if (nextImage) {
        nextImage.isPrimary = true;
        await nextImage.save();
      }
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Delete image error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Update image details (alt text, sort order)
// @route   PUT /api/products/:productId/images/:imageId
// @access  Admin
const updateImageDetails = async (req, res) => {
  try {
    const { productId, imageId } = req.params;
    const { altText, sortOrder } = req.body;

    const image = await ProductImage.findById(imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });
    
    if (image.productId.toString() !== productId) {
      return res.status(400).json({ message: "Image does not belong to this product" });
    }

    if (altText !== undefined) image.altText = altText;
    if (sortOrder !== undefined) image.sortOrder = sortOrder;

    await image.save();

    res.status(200).json({ message: "Image updated", image });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Reorder images
// @route   POST /api/products/:productId/images/reorder
// @access  Admin
const reorderImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const { imageOrders } = req.body; // Array of { imageId, sortOrder }

    if (!Array.isArray(imageOrders)) {
      return res.status(400).json({ message: "imageOrders must be an array" });
    }

    const operations = imageOrders.map(({ imageId, sortOrder }) => ({
      updateOne: {
        filter: { _id: imageId, productId },
        update: { $set: { sortOrder } }
      }
    }));

    await ProductImage.bulkWrite(operations);

    const updatedImages = await ProductImage.find({ productId })
      .sort({ sortOrder: 1 });

    res.status(200).json({ message: "Images reordered", images: updatedImages });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { 
  uploadProductImages, 
  getProductImages, 
  setPrimaryImage, 
  deleteProductImage,
  updateImageDetails,
  reorderImages
};