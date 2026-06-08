const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
    let token;

    // 1. Check if Authorization header exists and starts with "Bearer"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // 2. Get token from header
            token = req.headers.authorization.split(" ")[1];

            // 3. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Get user from token and attach to req.user (exclude password)
            req.user = await User.findById(decoded.id).select("-password");

            // 5. Check if user still exists in database
            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }

            // 6. Proceed
            return next();
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    // No token present at all
    return res.status(401).json({ message: "Not authorized, no token" });
};

module.exports = { protect };