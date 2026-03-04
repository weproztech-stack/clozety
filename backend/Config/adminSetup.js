// AdminJS v7 is ESM-only — use dynamic import() for CommonJS compatibility

async function setupAdminJS(app) {
    const { default: AdminJS } = await import("adminjs");
    const AdminJSExpress = await import("@adminjs/express");
    const AdminJSMongoose = await import("@adminjs/mongoose");

    // Models
    const Product = require("../Models/ProductModel/Product");
    const ProductImage = require("../Models/ProductModel/ProductImage");
    const ProductVariant = require("../Models/ProductModel/ProductVariant");
    const Category = require("../Models/ProductModel/Category");
    const Promotion = require("../Models/ProductModel/Promotion");
    const Review = require("../Models/ProductModel/Review");
    const User = require("../Models/User");
    const Order = require("../Models/Order");
    const Cart = require("../Models/Cart");
    const Wishlist = require("../Models/Wishlist");
    const Coupon = require("../Models/Coupon");
    const Banner = require("../Models/Banner");
    const Contact = require("../Models/Contact");
    const Payment = require("../Models/Payment");
    const Shipping = require("../Models/Shipping");

    // Register adapter
    AdminJS.registerAdapter(AdminJSMongoose);

    // Navigation groups
    const productNav = { name: "Products", icon: "ShoppingBag" };
    const userNav = { name: "Users", icon: "User" };
    const orderNav = { name: "Orders", icon: "Package" };
    const marketingNav = { name: "Marketing", icon: "Star" };
    const supportNav = { name: "Support", icon: "MessageCircle" };

    const adminJs = new AdminJS({
        resources: [
            // ─── Products ──────────────────────────────────
            {
                resource: Product,
                options: {
                    navigation: productNav,
                    listProperties: ["name", "price", "discountPrice", "stock", "status", "createdAt"],
                    editProperties: ["name", "description", "shortDescription", "price", "discountPrice", "sku", "stock", "status", "categories", "tags", "metaTitle", "metaDescription"],
                    showProperties: ["name", "description", "shortDescription", "price", "discountPrice", "sku", "stock", "slug", "status", "categories", "tags", "metaTitle", "metaDescription", "views", "totalSold", "isDeleted", "createdAt", "updatedAt"],
                    properties: {
                        description: { type: "textarea" },
                        metaDescription: { type: "textarea" },
                        status: {
                            availableValues: [
                                { value: "active", label: "Active" },
                                { value: "inactive", label: "Inactive" },
                                { value: "draft", label: "Draft" },
                            ],
                        },
                    },
                },
            },
            {
                resource: ProductImage,
                options: {
                    navigation: productNav,
                    listProperties: ["productId", "imageUrl", "isPrimary", "sortOrder"],
                    properties: { altText: { type: "textarea" } },
                },
            },
            {
                resource: ProductVariant,
                options: {
                    navigation: productNav,
                    listProperties: ["product", "size", "color", "sku", "stock", "priceAdjustment", "isAvailable"],
                },
            },
            {
                resource: Category,
                options: {
                    navigation: productNav,
                    listProperties: ["name", "slug", "parentCategory", "status", "sortOrder"],
                    properties: {
                        status: {
                            availableValues: [
                                { value: "active", label: "Active" },
                                { value: "inactive", label: "Inactive" },
                            ],
                        },
                    },
                },
            },
            {
                resource: Review,
                options: {
                    navigation: productNav,
                    listProperties: ["productId", "userId", "rating", "comment", "status", "createdAt"],
                },
            },

            // ─── Users ─────────────────────────────────────
            {
                resource: User,
                options: {
                    navigation: userNav,
                    listProperties: ["name", "email", "role", "createdAt"],
                    editProperties: ["name", "email", "role", "avatar"],
                    properties: {
                        password: { isVisible: { list: false, show: false, edit: false, filter: false } },
                        role: {
                            availableValues: [
                                { value: "user", label: "User" },
                                { value: "admin", label: "Admin" },
                            ],
                        },
                    },
                },
            },
            {
                resource: Wishlist,
                options: {
                    navigation: userNav,
                    listProperties: ["user", "createdAt", "updatedAt"],
                },
            },

            // ─── Orders ────────────────────────────────────
            {
                resource: Order,
                options: {
                    navigation: orderNav,
                    listProperties: ["user", "totalPrice", "orderStatus", "paymentStatus", "createdAt"],
                    properties: {
                        orderStatus: {
                            availableValues: [
                                { value: "pending", label: "Pending" },
                                { value: "confirmed", label: "Confirmed" },
                                { value: "shipped", label: "Shipped" },
                                { value: "delivered", label: "Delivered" },
                                { value: "cancelled", label: "Cancelled" },
                            ],
                        },
                        paymentStatus: {
                            availableValues: [
                                { value: "pending", label: "Pending" },
                                { value: "paid", label: "Paid" },
                                { value: "failed", label: "Failed" },
                            ],
                        },
                    },
                },
            },
            {
                resource: Cart,
                options: {
                    navigation: orderNav,
                    listProperties: ["user", "createdAt", "updatedAt"],
                },
            },
            {
                resource: Payment,
                options: {
                    navigation: orderNav,
                    listProperties: ["order", "user", "amount", "method", "status", "createdAt"],
                    properties: {
                        method: {
                            availableValues: [
                                { value: "cod", label: "Cash on Delivery" },
                                { value: "card", label: "Card" },
                                { value: "bank_transfer", label: "Bank Transfer" },
                                { value: "easypaisa", label: "EasyPaisa" },
                                { value: "jazzcash", label: "JazzCash" },
                                { value: "other", label: "Other" },
                            ],
                        },
                        status: {
                            availableValues: [
                                { value: "pending", label: "Pending" },
                                { value: "completed", label: "Completed" },
                                { value: "failed", label: "Failed" },
                                { value: "refunded", label: "Refunded" },
                                { value: "cancelled", label: "Cancelled" },
                            ],
                        },
                    },
                },
            },
            {
                resource: Shipping,
                options: {
                    navigation: orderNav,
                    listProperties: ["order", "carrier", "trackingNumber", "status", "createdAt"],
                    properties: {
                        status: {
                            availableValues: [
                                { value: "processing", label: "Processing" },
                                { value: "packed", label: "Packed" },
                                { value: "shipped", label: "Shipped" },
                                { value: "in_transit", label: "In Transit" },
                                { value: "out_for_delivery", label: "Out for Delivery" },
                                { value: "delivered", label: "Delivered" },
                                { value: "returned", label: "Returned" },
                            ],
                        },
                    },
                },
            },

            // ─── Marketing ─────────────────────────────────
            {
                resource: Promotion,
                options: {
                    navigation: marketingNav,
                    listProperties: ["productId", "type", "startDate", "endDate", "discountPercent", "isActive"],
                    properties: {
                        type: {
                            availableValues: [
                                { value: "TRENDING", label: "Trending" },
                                { value: "OFFER", label: "Offer" },
                                { value: "RECENT", label: "Recent" },
                                { value: "FEATURED", label: "Featured" },
                            ],
                        },
                    },
                },
            },
            {
                resource: Coupon,
                options: {
                    navigation: marketingNav,
                    listProperties: ["code", "discountType", "discountValue", "usedCount", "isActive", "endDate"],
                    properties: {
                        discountType: {
                            availableValues: [
                                { value: "percentage", label: "Percentage (%)" },
                                { value: "fixed", label: "Fixed Amount" },
                            ],
                        },
                        description: { type: "textarea" },
                    },
                },
            },
            {
                resource: Banner,
                options: {
                    navigation: marketingNav,
                    listProperties: ["title", "position", "isActive", "sortOrder", "startDate", "endDate"],
                    properties: {
                        position: {
                            availableValues: [
                                { value: "hero", label: "Hero Banner" },
                                { value: "sidebar", label: "Sidebar" },
                                { value: "promo", label: "Promotion" },
                                { value: "footer", label: "Footer" },
                            ],
                        },
                        subtitle: { type: "textarea" },
                    },
                },
            },

            // ─── Support ───────────────────────────────────
            {
                resource: Contact,
                options: {
                    navigation: supportNav,
                    listProperties: ["name", "email", "subject", "status", "createdAt"],
                    properties: {
                        message: { type: "textarea" },
                        adminNotes: { type: "textarea" },
                        status: {
                            availableValues: [
                                { value: "new", label: "New" },
                                { value: "in_progress", label: "In Progress" },
                                { value: "resolved", label: "Resolved" },
                                { value: "closed", label: "Closed" },
                            ],
                        },
                    },
                },
            },
        ],
        branding: {
            companyName: "Clozety Admin",
            softwareBrothers: false,
            logo: false,
        },
        rootPath: "/admin",
    });

    // Authentication
    const authenticate = async (email, password) => {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@clozety.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

        if (email === adminEmail && password === adminPassword) {
            return { email: adminEmail, role: "admin" };
        }
        return null;
    };

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        adminJs,
        {
            authenticate,
            cookieName: "adminjs",
            cookiePassword: process.env.SESSION_SECRET || "clozety-admin-session-secret",
        },
        null,
        {
            resave: false,
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET || "clozety-admin-session-secret",
        }
    );

    app.use(adminJs.options.rootPath, adminRouter);
    console.log(`📊 Admin panel: http://localhost:${process.env.PORT || 5000}${adminJs.options.rootPath}`);
}

module.exports = setupAdminJS;
