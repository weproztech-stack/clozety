const Category = require("../Models/ProductModel/Category");

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ status: "active" }).sort({ name: 1 });
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Admin
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) return res.status(400).json({ message: "Category name is required" });

        const existing = await Category.findOne({ name });
        if (existing) return res.status(409).json({ message: "Category already exists" });

        const category = await Category.create({ name, description });
        res.status(201).json({ message: "Category created", category });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        if (name) { category.name = name; category.slug = null; } // reset slug
        if (description !== undefined) category.description = description;
        if (status) category.status = status;

        await category.save();
        res.status(200).json({ message: "Category updated", category });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
