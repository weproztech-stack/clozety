const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,  // ✅ WHY: Faster search by name
  },
  description: {
    type: String,
    trim: true,
  },
  shortDescription: {  // ✅ WHY: For product cards/listings
    type: String,
    trim: true,
    maxlength: 200
  },
  price: {
    type: Number,
    required: true,
    min: 0,  // ✅ WHY: Prevent negative prices
  },
  discountPrice: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: function(value) {
        return value < this.price;  // ✅ WHY: Discount can't be more than price
      },
      message: 'Discount price must be less than regular price'
    }
  },
  sku: {
    type: String,
    unique: true,
    required: true,
    uppercase: true,  // ✅ WHY: Standardize SKU format
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  slug: {
    type: String,
    unique: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true  // ✅ For faster queries
  },
  status: {
    type: String,
    enum: ["active", "inactive", "draft"],  // ✅ WHY: Draft for unpublished products
    default: "draft",
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }],
  tags: [String],  // ✅ WHY: Additional search keywords
  metaTitle: String,  // ✅ WHY: SEO optimization
  metaDescription: String,  // ✅ WHY: SEO optimization
  views: {  // ✅ WHY: Track popularity
    type: Number,
    default: 0
  },
  totalSold: {  // ✅ WHY: Track bestsellers
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Auto-generate slug before save
productSchema.pre("save", async function () {
   if (this.isModified("name")) {
      this.slug = this.name
         .toLowerCase()
         .trim()
         .replace(/\s+/g, "-");
   }
});

// ✅ WHY: Virtual for discounted price calculation
productSchema.virtual('finalPrice').get(function() {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

module.exports = mongoose.model("Product", productSchema);