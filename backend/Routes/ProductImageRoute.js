const express = require("express");
const router = express.Router({ mergeParams: true }); // to access :productId from parent

const {
    uploadProductImages,
    getProductImages,
    setPrimaryImage,
    deleteProductImage,
} = require("../Controllers/ProductImageController");

const { protect, adminOnly } = require("../Middleware/AuthMiddleware");
const upload = require("../Middleware/Upload");

// @route GET    /api/products/:productId/images
router.get("/", getProductImages);

// @route POST   /api/products/:productId/images  (upload multiple)
router.post("/", protect, adminOnly, upload.array("images", 5), uploadProductImages);

// @route PUT    /api/products/:productId/images/:imageId/primary
router.put("/:imageId/primary", protect, adminOnly, setPrimaryImage);

// @route DELETE /api/products/:productId/images/:imageId
router.delete("/:imageId", protect, adminOnly, deleteProductImage);

module.exports = router;
