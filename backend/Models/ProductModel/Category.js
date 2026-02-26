const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  slug: {
    type: String,
    unique: true,
  },
  parentCategory: {  // ✅ WHY: For nested categories (Men -> Shoes -> Running)
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null
  },
  imageUrl: String,  // ✅ WHY: Visual representation in admin panel
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  sortOrder: {  // ✅ WHY: Control display order in menu
    type: Number,
    default: 0
  }
}, { timestamps: true });

categorySchema.pre("save", function(next){
  if(!this.slug){
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);