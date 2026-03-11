const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  cloudinaryId: {  // ✅ Store Cloudinary public ID for easy deletion
    type: String,
    required: true,
  },
  altText: {
    type: String,
    default: "Product image"
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Ensure only one primary image per product
productImageSchema.index({ productId: 1, isPrimary: 1 }, { 
  unique: true, 
  partialFilterExpression: { isPrimary: true } 
});

// Compound index for efficient queries
productImageSchema.index({ productId: 1, sortOrder: 1 });

module.exports = mongoose.model("ProductImage", productImageSchema);