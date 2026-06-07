/*
 * Single source of truth for task status values — backend side.
 * These must match the Mongoose enum in models/task.js exactly.
 */

const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
};

const TASK_STATUS_VALUES = Object.values(TASK_STATUS);

module.exports = { TASK_STATUS, TASK_STATUS_VALUES };
