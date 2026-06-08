const mongoose = require("mongoose");
const Task = require("../models/task");

// ── Helper: Escape Regex ──
const escapeRegex = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Create new task
// POST /api/tasks
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            dueDate,
            priority,
            category,
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }

        // 1️. Create a new task using Task model
        const task = await Task.create({
            title: title.trim(),
            description,
            status,
            dueDate: dueDate || null,
            priority,
            category,
            user: req.user.id, // This connects task to logged-in user and come from Middleware
        });

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get tasks for logged-in user
// GET /api/tasks
const getTasks = async (req, res) => {
    try {
        // 2️. Pagination logic here
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const query = {
            user: req.user.id,
        };

        if (req.query.search) {
            const escapedSearch = escapeRegex(req.query.search);
            query.title = {
                $regex: escapedSearch,
                $options: "i",
            };
        }

        if (req.query.status && req.query.status !== "all") {
            query.status = req.query.status;
        }

        if (req.query.priority && req.query.priority !== "all") {
            query.priority = req.query.priority;
        }

        if (req.query.category && req.query.category !== "all") {
            query.category = req.query.category;
        }

        let sortOption = {
            createdAt: -1,
        };

        if (req.query.sort === "oldest") {
            sortOption = {
                createdAt: 1,
            };
        }

        if (req.query.sort === "dueDate") {
            sortOption = {
                dueDate: 1,
            };
        }

        if (req.query.sort === "status") {
            sortOption = {
                status: 1,
            };
        }

        // 3️. Find tasks where user matches logged-in user's id
        const tasks = await Task.find(query).sort(sortOption).skip(skip).limit(limit);

        // 4️. Count total tasks
        const totalTasks = await Task.countDocuments(query);

        res.status(200).json({
            tasks,
            page,
            limit,
            totalTasks,
            totalPages: Math.ceil(totalTasks / limit),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update a task
// PUT /api/tasks/:id
const updateTask = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Task ID" });
        }

        const task = await Task.findById(req.params.id);

        // 3️. Check if task exists
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // 4️. Make sure logged-in user owns the task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        // 5️. Update task fields
        const {
            title,
            description,
            status,
            dueDate,
            priority,
            category,
        } = req.body;

        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.status = status ?? task.status;
        task.priority = priority ?? task.priority;
        task.category = category ?? task.category;
        if (dueDate !== undefined) {
            task.dueDate = dueDate || null;
        }

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


// Delete a task
// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
    try {
        // Check if ID format is valid
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid Task ID",
            });
        }

        const task = await Task.findById(req.params.id);

        // Check if task exists
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        // Check task ownership
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Not authorized",
            });
        }

        // Delete task
        await task.deleteOne();

        res.status(200).json({
            message: "Task removed successfully",
        });

    } catch (error) {
        console.error("Delete Task Error:", error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};