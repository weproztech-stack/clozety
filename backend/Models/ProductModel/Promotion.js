const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
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
    validate: {
      validator: function(value) {
        return value > this.startDate;  // ✅ WHY: End date after start date
      },
      message: 'End date must be after start date'
    }
  },
  discountPercent: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    required: function() {
      return this.type === "OFFER";  // ✅ WHY: Required only for OFFER type
    }
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

// ✅ WHY: Auto-deactivate expired promotions
promotionSchema.pre('save', function(next) {
  if (this.endDate < new Date()) {
    this.isActive = false;
  }
  next();
});

module.exports = mongoose.model("Promotion", promotionSchema);