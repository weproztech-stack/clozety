const express = require("express");
const router = express.Router();

const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
} = require("../Controllers/WishlistController");

const { protect } = require("../Middleware/AuthMiddleware");

// All wishlist routes require login
router.use(protect);

// @route GET    /api/wishlist
router.get("/", getWishlist);

// @route POST   /api/wishlist
router.post("/", addToWishlist);

// @route DELETE /api/wishlist  (clear all)
router.delete("/", clearWishlist);

// @route DELETE /api/wishlist/:productId
router.delete("/:productId", removeFromWishlist);

module.exports = router;
