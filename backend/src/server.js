const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect user routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Task Management API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));