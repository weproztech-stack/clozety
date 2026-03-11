const express = require("express");
const router = express.Router({ mergeParams: true }); // To access productId from parent route
const { protect, adminOnly } = require("../Middleware/AuthMiddleware");
const upload = require("../Middleware/Upload");
const {
  uploadProductImages,
  getProductImages,
  setPrimaryImage,
  deleteProductImage,
  updateImageDetails,
  reorderImages
} = require("../Controllers/ProductImageController");

// Public routes
router.get("/", getProductImages);

// Admin routes
router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 10),
  uploadProductImages
);

router.put("/reorder", protect, adminOnly, reorderImages);
router.put("/:imageId/primary", protect, adminOnly, setPrimaryImage);
router.put("/:imageId", protect, adminOnly, updateImageDetails);
router.delete("/:imageId", protect, adminOnly, deleteProductImage);

module.exports = router;