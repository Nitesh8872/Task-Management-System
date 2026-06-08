const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
for (const key of requiredEnv) {
    if (!process.env[key]) {
        console.error(`Missing required environment variable: ${key}`);
        process.exit(1);
    }
}

connectDB();

const app = express();

// CORS — open policy (verified: Netlify → Railway preflight returns Access-Control-Allow-Origin: *)
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Connect user routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Task Management API");
});

app.use("/api", notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
});