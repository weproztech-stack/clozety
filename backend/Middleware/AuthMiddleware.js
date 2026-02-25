const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// Protect route — must be logged in
const protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // read from cookie

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (err) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

// Admin-only route guard
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res.status(403).json({ message: "Access denied: Admins only" });
};

module.exports = { protect, adminOnly };