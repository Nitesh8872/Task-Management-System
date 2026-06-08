const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        dueDate: {
            type: Date,
            default: null,
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },

        category: {
            type: String,
            enum: ["work", "study", "personal"],
            default: "work",
        },

        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;