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

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },

}, { timestamps: true });

categorySchema.pre("save", function(next){
  if(!this.slug){
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);