const express = require("express");
const router = express.Router();
const productController = require("../Controllers/ProductController");
const upload = require("../Middleware/Upload"); // multer + cloudinary


router.post(
  "/",
  upload.array("images", 3),
  productController.createProduct
);

router.get("/", productController.getAllProducts);


router.get("/:id", productController.getProductById);
router.get("/slug/:slug", productController.getProductBySlug);
router.put(
  "/:id",
  upload.array("images", 3),
  productController.updateProduct
);

router.delete("/:id", productController.deleteProduct);
router.post("/:id/promotion", productController.addPromotion);
router.delete("/:id/promotion/:promoId", productController.removePromotion);
module.exports = router;