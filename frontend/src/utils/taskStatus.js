/**
 * utils/taskStatus.js
 * Single source of truth for all task status values.
 * Import this everywhere statuses are referenced — never use raw strings.
 */

export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
};

/** Human-readable labels for each status value */
export const TASK_STATUS_LABELS = {
  [TASK_STATUS.PENDING]: "Pending",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.COMPLETED]: "Completed",
};

/** Ordered list used in dropdowns, filters, and board columns */
export const TASK_STATUS_OPTIONS = [
  { value: TASK_STATUS.PENDING, label: "Pending" },
  { value: TASK_STATUS.IN_PROGRESS, label: "In Progress" },
  { value: TASK_STATUS.COMPLETED, label: "Completed" },
];

/** Due-date indicator labels (separate from task status) */
export const DUE_STATE = {
  OVERDUE: "Overdue",
  DUE_TODAY: "Due Today",
  UPCOMING: "Upcoming",
};
