const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  price: {
    type: Number,
    required: true,
  },

  discountPrice: {
    type: Number,
    default: 0,
  },

  sku: {
    type: String,
    unique: true,
    required: true,
  },

//   Stock Keeping Unit=Unique identifier for products 

  stock: {
    type: Number,
    default: 0,
  },

  slug: {
    type: String,
    unique: true, // SEO friendly URLs
  },

//   Product name: "Nike Running Shoes Red"
// Slug: "nike-running-shoes-red"

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },

  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }],

}, { timestamps: true });

// Auto-generate slug before save
productSchema.pre("save", function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);