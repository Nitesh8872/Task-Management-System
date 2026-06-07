import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { getTasks, createTask, updateTask } from "../../services/api";
import { logActivity } from "../../utils/activityLogger";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatters";
import { TASK_STATUS } from "../../utils/taskStatus";
import StatCard from "../../components/StatCard/StatCard";
import ActivityList from "../../components/ActivityList/ActivityList";
import TaskModal from "../../components/TaskModal/TaskModal";
import "./Dashboard.css";

function Dashboard() {
  const { token, user } = useAuth();
  const { addNotification, checkTasksForNotifications } = useNotifications();

  // Tasks State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Create Modal State ──
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("personal");

  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const data = await getTasks(token);
      setTasks(data);
      checkTasksForNotifications(data);
    } catch (error) {
      console.error("Failed to fetch dashboard tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  // Open modal with reset fields
  const openCreateModal = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setCategory("personal");
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => setIsCreateModalOpen(false);

  // Create Task handler (from modal)
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newTask = await createTask(
        { title, description, dueDate, priority, category },
        token
      );
      setTasks((prev) => [...prev, newTask]);
      setIsCreateModalOpen(false);

      logActivity(user?.id, `Created task "${title}" via dashboard`);
      addNotification(`Task "${title}" created successfully!`, "success");
    } catch (err) {
      console.error(err);
      addNotification("Failed to create task", "error");
    }
  };

  const handleQuickComplete = async (taskId, taskTitle) => {
    try {
      const updated = await updateTask(taskId, { status: TASK_STATUS.COMPLETED }, token);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));

      logActivity(user?.id, `Marked task "${taskTitle}" Completed`);
      addNotification(`Task "${taskTitle}" marked Completed!`, "success");
    } catch (err) {
      console.error(err);
      addNotification("Failed to complete task", "error");
    }
  };

  // Route guard
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ── Metrics Calculations ──
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === TASK_STATUS.COMPLETED).length;
  const inProgressTasks = tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length;
  const pendingTasks = tasks.filter((t) => t.status === TASK_STATUS.PENDING).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isSameDate = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Overdue: dueDate in the past, status is not completed
  const overdueTasks = tasks.filter((t) => {
    if (t.status === TASK_STATUS.COMPLETED || !t.dueDate) return false;
    const dDate = new Date(t.dueDate);
    dDate.setHours(0, 0, 0, 0);
    return dDate < today;
  }).length;

  // Due today: dueDate is today, status is not completed
  const dueTodayTasks = tasks.filter((t) => {
    if (t.status === TASK_STATUS.COMPLETED || !t.dueDate) return false;
    const dDate = new Date(t.dueDate);
    dDate.setHours(0, 0, 0, 0);
    return isSameDate(dDate, today);
  }).length;

  // Productivity score: Completed / Total × 100
  const completionPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Get next 3 upcoming non-completed tasks
  const upcomingTasks = tasks
    .filter((t) => t.status !== TASK_STATUS.COMPLETED && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  return (
    <div className="dashboard">
      {/* Welcome Row */}
      <div className="dashboard-overview">
        <h1>Welcome Back, {user?.name || "User"} 👋</h1>
        <p>Here is an overview of your workspace productivity and timelines.</p>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-section-grid">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon="📋"
          type="primary"
          description="Total tasks on record"
        />
        <StatCard
          title="Pending"
          value={pendingTasks}
          icon="🕐"
          type="warning"
          description="Tasks not yet started"
        />
        <StatCard
          title="In Progress"
          value={inProgressTasks}
          icon="⏳"
          type="info"
          description="Tasks actively being worked on"
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          icon="🏆"
          type="success"
          description="Tasks marked finished"
        />
      </div>

      {/* Two-column split: Left panel + Right Activity */}
      <div className="dashboard-main-split">
        {/* Left Area: Progress + Quick Create CTA + Upcoming */}
        <div className="dashboard-left-panel">

          {/* Workspace Completion Progress Card */}
          <div className="workspace-progress-card">
            <div className="wpc-header">
              <div className="wpc-left">
                <h2 className="wpc-title">Workspace Completion Progress</h2>
                <p className="wpc-percent">{completionPercent}% Completed</p>
              </div>
              <div className="wpc-icon-badge">
                <span className="wpc-icon">📈</span>
              </div>
            </div>

            <div className="wpc-bar-track">
              <div
                className="wpc-bar-fill"
                style={{ "--fill-width": `${completionPercent}%` }}
              >
                <span className="wpc-bar-shine" />
              </div>
            </div>

            <p className="wpc-count-label">
              {totalTasks === 0
                ? "No tasks created yet."
                : `${completedTasks} of ${totalTasks} tasks completed`}
            </p>
          </div>

          {/* Quick Create Task CTA Card */}
          <div className="quick-create-cta-card">
            <div className="qc-cta-left">
              <div className="qc-cta-icon">✨</div>
              <div className="qc-cta-text">
                <h2>Create a New Task</h2>
                <p>Add tasks to your workspace to stay on track with your goals.</p>
              </div>
            </div>
            <button
              className="qc-cta-btn"
              onClick={openCreateModal}
            >
              + Create Task
            </button>
          </div>

          {/* Status Summary Pills */}
          {totalTasks > 0 && (
            <div className="dashboard-status-pills">
              {overdueTasks > 0 && (
                <div className="status-pill status-pill--danger">
                  <span className="status-pill-dot" />
                  <span>{overdueTasks} Overdue</span>
                </div>
              )}
              {dueTodayTasks > 0 && (
                <div className="status-pill status-pill--warning">
                  <span className="status-pill-dot" />
                  <span>{dueTodayTasks} Due Today</span>
                </div>
              )}
              {overdueTasks === 0 && dueTodayTasks === 0 && (
                <div className="status-pill status-pill--success">
                  <span className="status-pill-dot" />
                  <span>All caught up! No overdue tasks 🎉</span>
                </div>
              )}
            </div>
          )}

          {/* Upcoming Checklist summary */}
          <div className="upcoming-summary-card">
            <div className="upcoming-header">
              <h2>Upcoming Milestones</h2>
              <Link to="/tasks" className="view-all-link">
                View all tasks →
              </Link>
            </div>

            {loading ? (
              <p style={{ color: "var(--color-text-muted)" }}>Loading milestones...</p>
            ) : upcomingTasks.length === 0 ? (
              <div className="upcoming-empty">
                <span className="party-emoji">🎉</span>
                <p>No upcoming tasks left! Enjoy your day.</p>
              </div>
            ) : (
              <ul className="upcoming-checklist">
                {upcomingTasks.map((task) => (
                  <li key={task._id} className="upcoming-check-item">
                    <div className="check-item-info">
                      <button
                        className="check-circle-btn"
                        onClick={() => handleQuickComplete(task._id, task.title)}
                        title="Mark Complete"
                        aria-label="Complete task"
                      >
                        ◯
                      </button>
                      <div className="check-text-group">
                        <span className="check-title">{task.title}</span>
                        <span className="check-due-date">
                          📅 Due: {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                    <span className={`badge-pill priority-tag priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* Right Area: Activity Logger */}
        <div className="dashboard-right-panel">
          <ActivityList userId={user?.id} />
        </div>
      </div>

      {/* ── Create Task Modal ── */}
      <TaskModal
        mode="create"
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateTask}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        dueDate={dueDate}
        setDueDate={setDueDate}
        priority={priority}
        setPriority={setPriority}
        category={category}
        setCategory={setCategory}
      />
    </div>
  );
}

export default Dashboard;