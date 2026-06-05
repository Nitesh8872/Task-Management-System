const express = require("express");
const router = express.Router();

const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

// Create Task & Get Tasks
router.route("/")
    .post(protect, createTask)
    .get(protect, getTasks);

// Update Task & Delete Task
router.route("/:id")
    .put(protect, updateTask)
    .delete(protect, deleteTask);

module.exports = router;