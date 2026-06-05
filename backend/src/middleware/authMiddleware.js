const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
    let token;

    // 1️. Check if Authorization header exists and starts with "Bearer"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // 2️. Get token from header
            token = req.headers.authorization.split(" ")[1];

            // 3️. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4️. Get user from token and attach to req.user (exclude password)
            req.user = await User.findById(decoded.id).select("-password");

            // 5️. Call next middleware/controller
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protect };