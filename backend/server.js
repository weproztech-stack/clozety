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
const authRoutes = require("./Routes/AuthRoute");
const adminRoutes = require("./Routes/AdminRoute");
const cartRoutes = require("./Routes/CartRoute");
const orderRoutes = require("./Routes/OrderRoute");

// Apis
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);




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