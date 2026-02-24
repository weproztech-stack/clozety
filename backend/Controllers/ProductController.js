const Product = require("../Models/Product");
const ProductImage = require("../Models/ProductImage");
const Promotion = require("../Models/Promotion");
// const cloudinary = require("../config/cloudinary");

// Helper: format API response
const sendResponse = (res, success, message, data = null, status = 200) => {
  if (success) return res.status(status).json({ success, message, data });
  else return res.status(status).json({ success, error: message });
};

// ========================
// 1️⃣ CREATE PRODUCT
// ========================
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, stock, categories } = req.body;

    // SKU generate if not provided
    const sku = req.body.sku || `${name.substring(0, 3).toUpperCase()}-${Date.now()}`;

    // Create product document
    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      stock,
      sku,
      categories,
    });

    // Upload images to Cloudinary and save URLs
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map((file, index) => {
        return ProductImage.create({
          productId: product._id,
          imageUrl: file.path, // multer + cloudinary middleware returns path
          isPrimary: index === 0, // first image is primary
        });
      });
      await Promise.all(imagePromises);
    }

    sendResponse(res, true, "Product created successfully", product);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, err.message, null, 500);
  }
};

// ========================
// 2️⃣ GET ALL PRODUCTS
// Supports filters: promotion type, category, trending, offer, recent
// Pagination supported
// ========================
exports.getAllProducts = async (req, res) => {
  try {
    const { type, category, limit = 20, page = 1, sortBy = "createdAt", order = "desc" } = req.query;

    let filter = { status: "active" };

    // Category filter
    if (category) filter.categories = category;

    // Promotion filter
    if (type) {
      const now = new Date();
      const promotions = await Promotion.find({
        type: type.toUpperCase(),
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      });

      const productIds = promotions.map(p => p.productId);
      filter._id = { $in: productIds };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .populate("categories")
      .lean();

    // Populate images
    for (let product of products) {
      const images = await ProductImage.find({ productId: product._id });
      product.images = images;
    }

    sendResponse(res, true, "Products fetched successfully", products);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, err.message, null, 500);
  }
};

// ========================
// 3️⃣ GET SINGLE PRODUCT BY ID
// ========================
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categories")
      .lean();

    if (!product) return sendResponse(res, false, "Product not found", null, 404);

    const images = await ProductImage.find({ productId: product._id });
    const promotions = await Promotion.find({
      productId: product._id,
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    product.images = images;
    product.promotions = promotions;

    sendResponse(res, true, "Product fetched successfully", product);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, err.message, null, 500);
  }
};

// ========================
// 4️⃣ GET SINGLE PRODUCT BY SLUG (SEO Friendly)
// ========================
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, status: "active" })
      .populate("categories")
      .lean();

    if (!product) return sendResponse(res, false, "Product not found", null, 404);

    const images = await ProductImage.find({ productId: product._id });
    const promotions = await Promotion.find({
      productId: product._id,
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    product.images = images;
    product.promotions = promotions;

    sendResponse(res, true, "Product fetched successfully", product);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, err.message, null, 500);
  }
};

// ========================
// 5️⃣ UPDATE PRODUCT
// ========================
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(productId, updates, { new: true });

    if (!product) return sendResponse(res, false, "Product not found", null, 404);

    // Optional: handle new images upload
    if (req.files && req.files.length > 0) {
      // Delete old images logic (if needed)
      await ProductImage.deleteMany({ productId: product._id });

      const imagePromises = req.files.map((file, index) =>
        ProductImage.create({
          productId: product._id,
          imageUrl: file.path,
          isPrimary: index === 0,
        })
      );
      await Promise.all(imagePromises);
    }

    sendResponse(res, true, "Product updated successfully", product);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, err.message, null, 500);
  }
};

// ========================
// 6️⃣ DELETE PRODUCT
// ========================
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) return sendResponse(res, false, "Product not found", null, 404);

    // Delete images
    await ProductImage.deleteMany({ productId });

    // Delete promotions
    await Promotion.deleteMany({ productId });

    sendResponse(res, true, "Product and related data deleted successfully");
  } catch (err) {
    console.error(err);
    sendResponse(res, false, err.message, null, 500);
  }
};

// ========================
// 7️⃣ ADD PROMOTION TO PRODUCT
// ========================
exports.addPromotion = async (req, res) => {
  try {
    const { type, startDate, endDate, discountPercent = 0, priority = 1 } = req.body;
    const productId = req.params.id;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) return sendResponse(res, false, "Product not found", null, 404);

    const promotion = await Promotion.create({
      productId,
      type: type.toUpperCase(),
      startDate,
      endDate,
      discountPercent,
      priority,
      isActive: true,
    });

    sendResponse(res, true, "Promotion added successfully", promotion);
  } catch (err) {
    console.error(err);
    sendResponse(res, false, err.message, null, 500);
  }
};

// ========================
// 8️⃣ REMOVE PROMOTION
// ========================
exports.removePromotion = async (req, res) => {
  try {
    const { promoId } = req.params;

    const promotion = await Promotion.findByIdAndDelete(promoId);
    if (!promotion) return sendResponse(res, false, "Promotion not found", null, 404);

    sendResponse(res, true, "Promotion removed successfully");
  } catch (err) {
    console.error(err);
    sendResponse(res, false, err.message, null, 500);
  }
};




// ✅ CRUD for Products
// ✅ Cloudinary image upload (multiple images)
// ✅ Promotion add/remove (TRENDING, OFFER, RECENT, FEATURED)
// ✅ Time-bound promotion check (startDate / endDate)
// ✅ Fetch single/multiple products + filter + pagination
// ✅ Slug-based SEO-friendly fetching
// ✅ Auto API response handling
// ✅ Future scalability (categories, priority, discount, multiple promotions)