const User = require("../Models/User");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Get a single user by ID
// @route   GET /api/admin/users/:id
// @access  Admin

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


// @desc    Update user role (promote/demote)
// @route   PUT /api/admin/users/:id/role
// @access  Admin
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Use 'user' or 'admin'" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: `Role updated to '${role}'`, user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { getAllUsers, getUserById, updateUserRole, deleteUser };
