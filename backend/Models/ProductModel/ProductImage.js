const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,  // ✅ WHY: Faster queries
  },
  imageUrl: {
    type: String,
    required: true,
  },
  altText: {  // ✅ WHY: Accessibility and SEO
    type: String,
    default: "Product image"
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
  sortOrder: {  // ✅ WHY: Control image display order
    type: Number,
    default: 0
  }
}, { timestamps: true });

// ✅ WHY: Ensure only one primary image per product
productImageSchema.index({ productId: 1, isPrimary: 1 }, { 
  unique: true, 
  partialFilterExpression: { isPrimary: true } 
});

module.exports = mongoose.model("ProductImage", productImageSchema);