const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  type: {
    type: String,
    enum: ["TRENDING", "OFFER", "RECENT", "FEATURED"],
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  discountPercent: { // only for OFFER type
    type: Number,
    default: 0,
  },

  priority: {
    type: Number,
    default: 1, // higher priority shows first
  },

  isActive: {
    type: Boolean,
    default: true,
  }

}, { timestamps: true });

module.exports = mongoose.model("Promotion", promotionSchema);