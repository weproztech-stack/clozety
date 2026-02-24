require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Routes
const productRoutes = require("./Routes/ProductRoute");

// Apis
app.use("/api/products", productRoutes);




mongoose.connect(MONGO_URI)
.then(() => {
  console.log("✅ MongoDB connected successfully");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
});


// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});