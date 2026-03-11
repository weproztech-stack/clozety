const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../Middleware/AuthMiddleware");
const upload = require("../Middleware/Upload");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAdminStats,
  addPromotion,
  removePromotion,
  bulkUpdateProducts,
  getProductBySlug
} = require("../Controllers/ProductController");

// Import image routes
const imageRoutes = require("./ProductImageRoute");

// Mount image routes
router.use("/:productId/images", imageRoutes);

// Public routes
router.get("/", getAllProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

// Admin routes with Cloudinary upload
router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 10),
  (req, res, next) => {
    if (req.fileError) {
      return res.status(400).json({ success: false, error: req.fileError });
    }
    next();
  },
  createProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 10),
  (req, res, next) => {
    if (req.fileError) {
      return res.status(400).json({ success: false, error: req.fileError });
    }
    next();
  },
  updateProduct
);

router.delete("/:id", protect, adminOnly, deleteProduct);

// Admin stats
router.get("/admin/stats", protect, adminOnly, getAdminStats);

// Promotions
router.post("/:id/promotions", protect, adminOnly, addPromotion);
router.delete("/:id/promotions/:promoId", protect, adminOnly, removePromotion);

// Bulk operations
router.post("/bulk/update", protect, adminOnly, bulkUpdateProducts);

module.exports = router;