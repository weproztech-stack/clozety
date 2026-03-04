const Product = require("../Models/ProductModel/Product");
const ProductImage = require("../Models/ProductModel/ProductImage");
const Promotion = require("../Models/ProductModel/Promotion");
const Category = require("../Models/ProductModel/Category");
const cloudinary = require("../Config/cloudinary");
const mongoose = require("mongoose");
// Helper: format API response
const sendResponse = (res, success, message, data = null, status = 200) => {
  const response = { success, message: success ? message : undefined };
  if (success) {
    if (data) response.data = data;
  } else {
    response.error = message;
  }
  return res.status(status).json(response);
};

// ✅ WHY: Validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ========================
// 1️⃣ CREATE PRODUCT
// ========================
exports.createProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      name,
      description,
      shortDescription,
      price,
      discountPrice,
      stock,
      categories,
      tags,
      metaTitle,
      metaDescription
    } = req.body;

    // ✅ WHY: Comprehensive validation
    if (!name?.trim()) {
      return sendResponse(res, false, "Product name is required", null, 400);
    }

    if (!price || price <= 0) {
      return sendResponse(res, false, "Valid price is required", null, 400);
    }

    if (discountPrice && discountPrice >= price) {
      return sendResponse(res, false, "Discount price must be less than regular price", null, 400);
    }

    // ✅ WHY: Validate categories exist
    if (categories?.length) {
      const validCategories = await Category.find({
        _id: { $in: categories },
        status: "active"
      }).session(session);

      if (validCategories.length !== categories.length) {
        return sendResponse(res, false, "One or more categories are invalid", null, 400);
      }
    }

    // Generate SKU if not provided
    const sku = req.body.sku ||
      `${name.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;

    const existingSku = await Product.findOne({ sku }).session(session);
    if (existingSku) {
      return sendResponse(res, false, "SKU already exists", null, 400);
    }

    const productData = {
      name: name.trim(),
      description: description?.trim(),
      shortDescription: shortDescription?.trim(),
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: stock ? Number(stock) : 0,
      sku,
      categories: categories || [],
      tags: tags || [],
      metaTitle: metaTitle || name.substring(0, 60),
      metaDescription: metaDescription || description?.substring(0, 160),
      status: "draft" // ✅ WHY: Start as draft until images added
    };

    const [product] = await Product.create([productData], { session });

    // Handle images
    if (req.files?.length > 0) {
      const images = req.files.map((file, index) => ({
        productId: product._id,
        imageUrl: file.path,
        altText: `${product.name} - Image ${index + 1}`,
        isPrimary: index === 0,
        sortOrder: index
      }));

      await ProductImage.insertMany(images, { session });

      // ✅ WHY: Auto-publish if images added
      product.status = "active";
      await product.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    // Populate for response
    await product.populate("categories");

    return sendResponse(res, true, "Product created successfully", product, 201);

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Create product error:", err);
    return sendResponse(res, false, "Failed to create product", null, 500);
  }
};

// ========================
// 2️⃣ GET ALL PRODUCTS (Admin View)
// ========================
exports.getAllProducts = async (req, res) => {
  try {
    const {
      type,
      category,
      status,
      search,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
      limit = 20,
      page = 1
    } = req.query;

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Math.max(1, Number(limit))); // ✅ WHY: Limit max items
    const skip = (pageNumber - 1) * limitNumber;

    let filter = { isDeleted: false };

    // Status filter (for admin)
    if (status) {
      filter.status = status;
    }

    // Category filter
    if (category) {
      if (isValidObjectId(category)) {
        filter.categories = category;
      }
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } }
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Promotion type filter
    if (type) {
      const now = new Date();
      const promotions = await Promotion.find({
        type: type.toUpperCase(),
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      }).lean();

      const productIds = promotions.map(p => p.productId);
      if (productIds.length) {
        filter._id = { $in: productIds };
      } else {
        // ✅ WHY: Return empty if no products with this promotion
        return sendResponse(res, true, "Products fetched", {
          data: [],
          pagination: {
            total: 0,
            page: pageNumber,
            limit: limitNumber,
            totalPages: 0
          }
        });
      }
    }

    // Build sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber)
      .populate("categories")
      .lean();

    // Get images efficiently
    const productIds = products.map(p => p._id);
    const images = await ProductImage.find({
      productId: { $in: productIds }
    }).sort({ isPrimary: -1, sortOrder: 1 }).lean();

    // Group images by product
    const imageMap = images.reduce((acc, img) => {
      const key = img.productId.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(img);
      return acc;
    }, {});

    products.forEach(p => {
      p.images = imageMap[p._id.toString()] || [];
      // ✅ WHY: Add computed price
      p.finalPrice = p.discountPrice > 0 ? p.discountPrice : p.price;
    });

    return sendResponse(res, true, "Products fetched", {
      data: products,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
        hasNextPage: pageNumber < Math.ceil(total / limitNumber),
        hasPrevPage: pageNumber > 1
      }
    });

  } catch (err) {
    console.error("Get products error:", err);
    return sendResponse(res, false, "Failed to fetch products", null, 500);
  }
};

// ========================
// 3️⃣ GET PRODUCT BY ID (with all details)
// ========================
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendResponse(res, false, "Invalid product ID", null, 400);
    }

    const product = await Product.findById(id)
      .populate("categories")
      .lean();

    if (!product || product.isDeleted) {
      return sendResponse(res, false, "Product not found", null, 404);
    }

    // Increment view count (async, don't await)
    Product.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();

    const [images, promotions] = await Promise.all([
      ProductImage.find({ productId: product._id })
        .sort({ isPrimary: -1, sortOrder: 1 })
        .lean(),
      Promotion.find({
        productId: product._id,
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      }).sort({ priority: -1 }).lean()
    ]);

    product.images = images;
    product.promotions = promotions;
    product.finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

    // ✅ WHY: Check if in stock
    product.inStock = product.stock > 0;

    sendResponse(res, true, "Product fetched successfully", product);
  } catch (err) {
    console.error("Get product error:", err);
    sendResponse(res, false, "Failed to fetch product", null, 500);
  }
};

// ========================
// 4️⃣ UPDATE PRODUCT
// ========================
exports.updateProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendResponse(res, false, "Invalid product ID", null, 400);
    }

    const product = await Product.findById(id).session(session);
    if (!product || product.isDeleted) {
      return sendResponse(res, false, "Product not found", null, 404);
    }

    const updates = req.body;

    // ✅ WHY: Validate price if updating
    if (updates.price && updates.price <= 0) {
      return sendResponse(res, false, "Price must be greater than 0", null, 400);
    }

    // ✅ WHY: Validate discount price
    if (updates.discountPrice !== undefined) {
      const finalPrice = updates.price || product.price;
      if (updates.discountPrice >= finalPrice) {
        return sendResponse(res, false, "Discount price must be less than regular price", null, 400);
      }
    }

    // ✅ WHY: Check SKU uniqueness if updating
    if (updates.sku && updates.sku !== product.sku) {
      const existingSku = await Product.findOne({
        sku: updates.sku,
        _id: { $ne: id }
      }).session(session);

      if (existingSku) {
        return sendResponse(res, false, "SKU already exists", null, 400);
      }
    }

    // Handle categories update
    if (updates.categories) {
      const validCategories = await Category.find({
        _id: { $in: updates.categories },
        status: "active"
      }).session(session);

      if (validCategories.length !== updates.categories.length) {
        return sendResponse(res, false, "One or more categories are invalid", null, 400);
      }
    }

    // Update product
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        product[key] = updates[key];
      }
    });

    await product.save({ session });

    // Handle new images if provided
    if (req.files?.length > 0) {
      // ✅ WHY: Option to replace or add images
      if (req.body.replaceImages === "true") {
        await ProductImage.deleteMany({ productId: product._id }, { session });
      }

      const currentImageCount = await ProductImage.countDocuments({ productId: product._id });

      const images = req.files.map((file, index) => ({
        productId: product._id,
        imageUrl: file.path,
        altText: `${product.name} - Image ${currentImageCount + index + 1}`,
        isPrimary: currentImageCount === 0 && index === 0, // First image becomes primary if no images exist
        sortOrder: currentImageCount + index
      }));

      await ProductImage.insertMany(images, { session });
    }

    await session.commitTransaction();
    session.endSession();

    // Fetch updated product with relations
    const updatedProduct = await Product.findById(id)
      .populate("categories")
      .lean();

    const images = await ProductImage.find({ productId: id })
      .sort({ isPrimary: -1, sortOrder: 1 })
      .lean();

    updatedProduct.images = images;

    sendResponse(res, true, "Product updated successfully", updatedProduct);

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Update product error:", err);
    return sendResponse(res, false, "Failed to update product", null, 500);
  }
};

// ========================
// 5️⃣ DELETE PRODUCT (Soft Delete with Cascade)
// ========================
exports.deleteProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendResponse(res, false, "Invalid product ID", null, 400);
    }

    const product = await Product.findById(id).session(session);
    if (!product || product.isDeleted) {
      return sendResponse(res, false, "Product not found", null, 404);
    }

    // Soft delete product
    product.isDeleted = true;
    product.status = "inactive";
    await product.save({ session });

    // ✅ WHY: Deactivate all active promotions
    await Promotion.updateMany(
      { productId: id, isActive: true },
      { isActive: false },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return sendResponse(res, true, "Product deleted successfully");

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Delete product error:", err);
    return sendResponse(res, false, "Failed to delete product", null, 500);
  }
};

// ========================
// 6️⃣ ADMIN STATS
// ========================
exports.getAdminStats = async (req, res) => {
  try {
    const now = new Date();
    const last7Days = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      draftProducts,
      totalPromotions,
      lowStockProducts,
      recentProducts,
      outOfStock,
      totalCategories,
      totalRevenue  // ✅ WHY: Basic business metrics
    ] = await Promise.all([
      Product.countDocuments({ isDeleted: false }),
      Product.countDocuments({ status: "active", isDeleted: false }),
      Product.countDocuments({ status: "inactive", isDeleted: false }),
      Product.countDocuments({ status: "draft", isDeleted: false }),
      Promotion.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: { $lt: 5, $gt: 0 }, isDeleted: false }),
      Product.countDocuments({ createdAt: { $gte: last7Days } }),
      Product.countDocuments({ stock: 0, isDeleted: false }),
      Category.countDocuments({ status: "active" }),
      // Calculate approximate revenue (price * totalSold)
      Product.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: null, total: { $sum: { $multiply: ["$price", "$totalSold"] } } } }
      ])
    ]);

    return sendResponse(res, true, "Admin statistics fetched", {
      products: {
        total: totalProducts,
        active: activeProducts,
        inactive: inactiveProducts,
        draft: draftProducts,
        outOfStock,
        lowStock: lowStockProducts
      },
      promotions: totalPromotions,
      categories: totalCategories,
      recent: {
        products: recentProducts
      },
      revenue: totalRevenue[0]?.total || 0,
      lastUpdated: now
    });

  } catch (err) {
    console.error("Admin stats error:", err);
    return sendResponse(res, false, "Failed to fetch statistics", null, 500);
  }
};

// ========================
// 7️⃣ ADD PROMOTION
// ========================
exports.addPromotion = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { type, startDate, endDate, discountPercent = 0, priority = 1 } = req.body;
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendResponse(res, false, "Invalid product ID", null, 400);
    }

    const product = await Product.findById(id).session(session);
    if (!product || product.isDeleted) {
      return sendResponse(res, false, "Product not found", null, 404);
    }

    // Validation
    if (!type || !startDate || !endDate) {
      return sendResponse(res, false, "Type, startDate and endDate are required", null, 400);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return sendResponse(res, false, "End date must be after start date", null, 400);
    }

    if (start < new Date()) {
      return sendResponse(res, false, "Start date cannot be in the past", null, 400);
    }

    if (type.toUpperCase() === "OFFER") {
      if (!discountPercent || discountPercent <= 0 || discountPercent > 100) {
        return sendResponse(res, false, "Valid discount percent (1-100) required for OFFER type", null, 400);
      }
    }

    // ✅ WHY: Check for overlapping promotions
    const existingPromotion = await Promotion.findOne({
      productId: id,
      type: type.toUpperCase(),
      isActive: true,
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    }).session(session);

    if (existingPromotion) {
      return sendResponse(res, false, "An active promotion of this type already exists for this period", null, 400);
    }

    const [promotion] = await Promotion.create([{
      productId: id,
      type: type.toUpperCase(),
      startDate: start,
      endDate: end,
      discountPercent,
      priority,
      isActive: true,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    sendResponse(res, true, "Promotion added successfully", promotion);

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Add promotion error:", err);
    sendResponse(res, false, "Failed to add promotion", null, 500);
  }
};


// ========================
// REMOVE PROMOTION
// ========================
exports.removePromotion = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { promoId } = req.params;
    const { id } = req.params; // productId

    if (!isValidObjectId(promoId)) {
      return sendResponse(res, false, "Invalid promotion ID", null, 400);
    }

    const promotion = await Promotion.findById(promoId).session(session);

    if (!promotion) {
      return sendResponse(res, false, "Promotion not found", null, 404);
    }

    // Verify this promotion belongs to the product
    if (promotion.productId.toString() !== id) {
      return sendResponse(res, false, "Promotion does not belong to this product", null, 400);
    }

    await promotion.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    sendResponse(res, true, "Promotion removed successfully");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Remove promotion error:", err);
    sendResponse(res, false, "Failed to remove promotion", null, 500);
  }
};
// ========================
// 8️⃣ BULK OPERATIONS (For admin convenience)
// ========================
exports.bulkUpdateProducts = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productIds, operation, data } = req.body;

    if (!productIds?.length || !operation) {
      return sendResponse(res, false, "Product IDs and operation are required", null, 400);
    }

    let updateData = {};

    switch (operation) {
      case "updateStatus":
        if (!data.status) {
          return sendResponse(res, false, "Status is required", null, 400);
        }
        updateData.status = data.status;
        break;

      case "updateCategory":
        if (!data.categoryId) {
          return sendResponse(res, false, "Category ID is required", null, 400);
        }
        updateData.$addToSet = { categories: data.categoryId };
        break;

      case "removeCategory":
        if (!data.categoryId) {
          return sendResponse(res, false, "Category ID is required", null, 400);
        }
        updateData.$pull = { categories: data.categoryId };
        break;

      case "delete":
        updateData = { isDeleted: true, status: "inactive" };
        break;

      default:
        return sendResponse(res, false, "Invalid operation", null, 400);
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds }, isDeleted: false },
      updateData,
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    sendResponse(res, true, "Bulk update completed", {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Bulk update error:", err);
    sendResponse(res, false, "Failed to perform bulk update", null, 500);
  }
};


// ========================
// GET PRODUCT BY SLUG (SEO Friendly)
// ========================
exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug, status: "active", isDeleted: false })
      .populate("categories")
      .lean();

    if (!product) {
      return sendResponse(res, false, "Product not found", null, 404);
    }

    // Increment view count (async)
    Product.findOneAndUpdate({ slug }, { $inc: { views: 1 } }).exec();

    const [images, promotions] = await Promise.all([
      ProductImage.find({ productId: product._id })
        .sort({ isPrimary: -1, sortOrder: 1 })
        .lean(),
      Promotion.find({
        productId: product._id,
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      }).sort({ priority: -1 }).lean()
    ]);

    product.images = images;
    product.promotions = promotions;
    product.finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
    product.inStock = product.stock > 0;

    sendResponse(res, true, "Product fetched successfully", product);
  } catch (err) {
    console.error("Get product by slug error:", err);
    sendResponse(res, false, "Failed to fetch product", null, 500);
  }
};


module.exports = exports;