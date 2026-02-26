const express = require("express");
const router = express.Router();
const productController = require("../Controllers/ProductController");
const upload = require("../Middleware/Upload"); // multer + cloudinary
const productImageRoutes = require("./ProductImageRoute");
const { protect, adminOnly } = require("../Middleware/AuthMiddleware");

router.post(
  "/add",
  protect,
  adminOnly,
  upload.array("images", 3),
  productController.createProduct
);

router.get("/", productController.getAllProducts);

router.get("/slug/:slug", productController.getProductBySlug); // before /:id
router.get("/:id", productController.getProductById);
// router.put(
//   "/:id",
//   upload.array("images", 3),
//   productController.updateProduct
// );

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 3),
  productController.updateProduct
);

router.delete(
  "/delete/:id",
  protect,
  adminOnly,
  productController.deleteProduct
);

// Promotion routes (ADMIN ONLY)
router.post(
  "/:id/promotion",
  protect,
  adminOnly,
  productController.addPromotion
);

router.delete(
  "/:id/promotion/:promoId",
  protect,
  adminOnly,
  productController.removePromotion
);



// Mount image routes — /:productId/images/**
router.use("/:productId/images", productImageRoutes);

module.exports = router;