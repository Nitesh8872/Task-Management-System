import { formatDate, capitalise } from "../../utils/formatters";
import { TASK_STATUS, TASK_STATUS_LABELS, DUE_STATE } from "../../utils/taskStatus";
import "./TaskCard.css";

function TaskCard({ task, onEdit, onComplete, onDelete }) {
  // ── Status badge (Pending / In Progress / Completed) ──
  const getStatusBadge = () => {
    switch (task.status) {
      case TASK_STATUS.COMPLETED:
        return { label: TASK_STATUS_LABELS[TASK_STATUS.COMPLETED], cls: "status-completed" };
      case TASK_STATUS.IN_PROGRESS:
        return { label: TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS], cls: "status-in-progress" };
      case TASK_STATUS.PENDING:
      default:
        return { label: TASK_STATUS_LABELS[TASK_STATUS.PENDING], cls: "status-pending" };
    }
  };

  // ── Due-date indicator (Overdue / Due Today / Upcoming) — separate from status ──
  const getDueIndicator = () => {
    if (!task.dueDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const isSameDate = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    if (task.status === TASK_STATUS.COMPLETED) return null; // no due indicator for completed

    if (dueDate < today) {
      return { text: `⚠ ${DUE_STATE.OVERDUE}`, cls: "due-indicator overdue" };
    } else if (isSameDate(dueDate, today)) {
      return { text: `🕒 ${DUE_STATE.DUE_TODAY}`, cls: "due-indicator due-today" };
    } else {
      return { text: `📅 ${DUE_STATE.UPCOMING}`, cls: "due-indicator upcoming" };
    }
  };

  const statusBadge = getStatusBadge();
  const dueIndicator = getDueIndicator();

  return (
    <div className={`task-card-item priority-${task.priority} ${task.status === TASK_STATUS.COMPLETED ? "completed" : ""}`}>
      {/* Header: title + status badge */}
      <div className="task-card-header">
        <h3 className="task-title" title={task.title}>{task.title}</h3>
        <span className={`status-badge ${statusBadge.cls}`}>
          {statusBadge.label}
        </span>
      </div>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      {/* Details: priority + category badges, due date, due indicator */}
      <div className="task-card-details">
        <div className="details-badges">
          {/* Priority Badge */}
          <span className={`badge-pill priority-tag priority-${task.priority}`}>
            {capitalise(task.priority)}
          </span>

          {/* Category Badge */}
          <span className={`badge-pill category-tag category-${task.category || "personal"}`}>
            {capitalise(task.category || "personal")}
          </span>
        </div>

        {/* Due Date + due indicator below */}
        <div className="due-date-section">
          <div className="due-date-display">
            📅 {formatDate(task.dueDate)}
          </div>
          {dueIndicator && (
            <span className={dueIndicator.cls}>{dueIndicator.text}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="task-card-actions">
        <button className="card-action-btn edit-btn" onClick={() => onEdit(task)}>
          ✏️ Edit
        </button>
        {task.status !== TASK_STATUS.COMPLETED && (
          <button className="card-action-btn complete-btn" onClick={() => onComplete(task._id)}>
            ✅ Complete
          </button>
        )}
        <button
          className="card-action-btn delete-btn"
          onClick={() => onDelete(task._id)}
          aria-label={`Delete task: ${task.title}`}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
