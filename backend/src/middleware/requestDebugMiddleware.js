/**
 * Logs incoming API request metadata and raw JSON body before parsing.
 * Helps diagnose entity.parse.failed / malformed JSON errors in production.
 */
const requestDebugMiddleware = (req, res, next) => {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
        return next();
    }

    console.log("[API Request]", {
        method: req.method,
        path: req.originalUrl,
        contentType: req.headers["content-type"],
        contentLength: req.headers["content-length"],
        origin: req.headers.origin,
        userAgent: req.headers["user-agent"],
    });

    next();
};

module.exports = { requestDebugMiddleware };
