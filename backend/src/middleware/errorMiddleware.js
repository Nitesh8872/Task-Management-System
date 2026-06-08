const notFound = (req, res, next) => {
    const error = new Error(`API route not found — ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON in request body",
        });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: Object.values(err.errors).map((e) => e.message).join(", "),
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format",
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "Duplicate entry — record already exists",
        });
    }

    const statusCode = err.status || res.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: statusCode === 500
            ? "Server error. Please try again later."
            : (err.message || "Request failed"),
    });
};

module.exports = { notFound, errorHandler };
