const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Account no longer exists. Please log in again.",
                });
            }

            return next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Your session has expired. Please log in again.",
                });
            }
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({
                    success: false,
                    message: "Invalid session. Please log in again.",
                });
            }
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }
    }

    return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
    });
};

module.exports = { protect };
