import { formatDate, capitalise } from "../../utils/formatters";
import "./TaskCard.css";

function TaskCard({ task, onEdit, onComplete, onDelete }) {
  // Calculate due date status
  const getDueStatus = () => {
    if (!task.dueDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const isSameDate = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    if (task.status === "completed") {
      return { text: "Completed", type: "success" };
    }

    if (isSameDate(dueDate, today)) {
      return { text: "Due Today", type: "warning" };
    } else if (dueDate < today) {
      return { text: "Overdue", type: "danger" };
    } else {
      return { text: "Upcoming", type: "info" };
    }
  };

  const dueStatus = getDueStatus();

  return (
    <div className={`task-card-item priority-${task.priority} ${task.status === "completed" ? "completed" : ""}`}>
      <div className="task-card-header">
        <h3 className="task-title" title={task.title}>{task.title}</h3>
        {dueStatus && (
          <span className={`due-badge due-${dueStatus.type}`}>
            {dueStatus.text}
          </span>
        )}
      </div>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

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

        <div className="due-date-display">
          📅 {formatDate(task.dueDate)}
        </div>
      </div>

      <div className="task-card-actions">
        <button className="card-action-btn edit-btn" onClick={() => onEdit(task)}>
          ✏️ Edit
        </button>
        {task.status !== "completed" && (
          <button className="card-action-btn complete-btn" onClick={() => onComplete(task._id)}>
            ✅ Done
          </button>
        )}
        <button className="card-action-btn delete-btn" onClick={() => onDelete(task._id)}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
