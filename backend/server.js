require("dotenv").config();

// Express 5 + AdminJS workaround: set tmp dir before importing AdminJS
process.env.ADMIN_JS_TMP_DIR = process.env.ADMIN_JS_TMP_DIR || "dist/adminjs";

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.static('public'));
// ===== Middleware =====
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (origin.includes(".ngrok-free.dev")) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ===== API Routes =====
const productRoutes = require("./Routes/ProductRoute");
const authRoutes = require("./Routes/AuthRoute");
const adminRoutes = require("./Routes/AdminRoute");
const cartRoutes = require("./Routes/CartRoute");
const orderRoutes = require("./Routes/OrderRoute");
const userRoutes = require("./Routes/UserRoute");
const categoryRoutes = require("./Routes/CategoryRoute");
const variantRoutes = require("./Routes/VariantRoute");
const wishlistRoutes = require("./Routes/WishlistRoute");
const couponRoutes = require("./Routes/CouponRoute");
const bannerRoutes = require("./Routes/BannerRoute");
const contactRoutes = require("./Routes/ContactRoute");
const paymentRoutes = require("./Routes/PaymentRoute");
const shippingRoutes = require("./Routes/ShippingRoute");
const statsRoutes = require("./Routes/StatsRoute");
const uploadRoutes = require("./Routes/UploadRoute");
app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/shipping", shippingRoutes);

// Stats page & JSON API (must be before AdminJS mount)
app.use("/admin/stats", statsRoutes);
app.use("/admin-api/stats", statsRoutes);

// ===== MongoDB =====
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ===== AdminJS + Start Server =====
const setupAdminJS = require("./Config/adminSetup");

setupAdminJS(app)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ AdminJS setup error:", err);
    // Start server without AdminJS if it fails
    app.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT} (AdminJS failed to load)`);
    });
  });