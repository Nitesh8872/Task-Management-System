const mongoose = require("mongoose");
const Task = require("../models/task");

const escapeRegex = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const handleTaskError = (error, res) => {
    if (error.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: Object.values(error.errors).map((e) => e.message).join(", "),
        });
    }
    console.error(error);
    return res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
    });
};

// Create new task — POST /api/tasks
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
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const task = await Task.create({
            title: title.trim(),
            description,
            status,
            dueDate: dueDate || null,
            priority,
            category,
            user: req.user.id,
        });

        res.status(201).json({ success: true, ...task.toObject() });
    } catch (error) {
        handleTaskError(error, res);
    }
};

// Get tasks for logged-in user — GET /api/tasks
const getTasks = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 9));
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

        let sortOption = { createdAt: -1 };

        if (req.query.sort === "oldest") {
            sortOption = { createdAt: 1 };
        }

        if (req.query.sort === "dueDate") {
            sortOption = { dueDate: 1 };
        }

        if (req.query.sort === "status") {
            sortOption = { status: 1 };
        }

        const tasks = await Task.find(query).sort(sortOption).skip(skip).limit(limit);
        const totalTasks = await Task.countDocuments(query);

        res.status(200).json({
            success: true,
            tasks,
            page,
            limit,
            totalTasks,
            totalPages: Math.ceil(totalTasks / limit),
        });

    } catch (error) {
        handleTaskError(error, res);
    }
};

// Update a task — PUT /api/tasks/:id
const updateTask = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid Task ID" });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to modify this task",
            });
        }

        const {
            title,
            description,
            status,
            dueDate,
            priority,
            category,
        } = req.body;

        if (title !== undefined) {
            if (!title || !title.trim()) {
                return res.status(400).json({ success: false, message: "Title cannot be empty" });
            }
            task.title = title.trim();
        }

        task.description = description ?? task.description;
        task.status = status ?? task.status;
        task.priority = priority ?? task.priority;
        task.category = category ?? task.category;
        if (dueDate !== undefined) {
            task.dueDate = dueDate || null;
        }

        const updatedTask = await task.save();
        res.status(200).json({ success: true, ...updatedTask.toObject() });
    } catch (error) {
        handleTaskError(error, res);
    }
};


// Delete a task — DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Task ID",
            });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this task",
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: "Task removed successfully",
        });

    } catch (error) {
        console.error("Delete Task Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};
