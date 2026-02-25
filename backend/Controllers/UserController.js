const User = require("../Models/User");

// @desc    Update own profile (name, avatar, addresses)
// @route   PUT /api/users/me
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { name, avatar, addresses } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (avatar) user.avatar = avatar;
        if (addresses) user.addresses = addresses;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                addresses: user.addresses,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Change password
// @route   PUT /api/users/me/password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Both old and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await user.matchPassword(oldPassword);

        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        user.password = newPassword; // will be hashed by pre-save hook
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { updateProfile, changePassword };
