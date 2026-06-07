import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { getTasks, createTask, updateTask } from "../../services/api";
import { logActivity } from "../../utils/activityLogger";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatters";
import StatCard from "../../components/StatCard/StatCard";
import ActivityList from "../../components/ActivityList/ActivityList";
import "./Dashboard.css";

function Dashboard() {
  const { token, user } = useAuth();
  const { addNotification, checkTasksForNotifications } = useNotifications();

  // Tasks State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("personal");
  const [status, setStatus] = useState("pending");

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
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Quick Add handler
  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newTask = await createTask(
        { title, description, dueDate, priority, category, status },
        token
      );
      setTasks((prev) => [...prev, newTask]);

      logActivity(user?.id, `Created task "${title}" via dashboard quick-add`);
      addNotification(`Quick-added task "${title}"!`, "success");

      // Reset
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setCategory("personal");
      setStatus("pending");
    } catch (err) {
      console.error(err);
      addNotification("Failed to quick-add task", "error");
    }
  };

  const handleQuickComplete = async (taskId, taskTitle) => {
    try {
      const updated = await updateTask(taskId, { status: "completed" }, token);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));

      logActivity(user?.id, `Completed task "${taskTitle}"`);
      addNotification(`Task "${taskTitle}" completed!`, "success");
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
  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isSameDate = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Overdue: dueDate in the past, status is not completed
  const overdueTasks = tasks.filter((t) => {
    if (t.status === "completed" || !t.dueDate) return false;
    const dDate = new Date(t.dueDate);
    dDate.setHours(0, 0, 0, 0);
    return dDate < today;
  }).length;

  // Due today: dueDate is today, status is not completed
  const dueTodayTasks = tasks.filter((t) => {
    if (t.status === "completed" || !t.dueDate) return false;
    const dDate = new Date(t.dueDate);
    dDate.setHours(0, 0, 0, 0);
    return isSameDate(dDate, today);
  }).length;

  const pendingTasks = tasks.filter((t) => t.status !== "completed").length;

  const completionPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Get next 3 upcoming pending tasks
  const upcomingTasks = tasks
    .filter((t) => t.status !== "completed" && t.dueDate)
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
          title="Total Registered"
          value={totalTasks}
          icon="📋"
          type="primary"
          description="Total tasks on record"
        />
        <StatCard
          title="Due Today"
          value={dueTodayTasks}
          icon="📅"
          type="warning"
          description="Tasks due today"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueTasks}
          icon="⚠️"
          type="danger"
          description="Tasks past their due date"
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          icon="🏆"
          type="success"
          description="Tasks marked finished"
        />
      </div>

      {/* Progress & Split Sections */}
      <div className="dashboard-main-split">
        {/* Left Area: Quick Add & Upcoming checklist */}
        <div className="dashboard-left-panel">

          {/* Productivity progress */}
          <div className="productivity-card">
            <div className="productivity-header">
              <h3>Workspace Completion Progress</h3>
              <span className="completion-lbl">{completionPercent}% Completed</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Create Task */}
          <div className="quick-add-card">
            <h2>Quick Add Task</h2>
            <form className="quick-add-form" onSubmit={handleQuickAdd}>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <div className="quick-add-row">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="work">Work</option>
                  <option value="study">Study</option>
                  <option value="personal">Personal</option>
                </select>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Todo</option>
                  <option value="in-progress">Active</option>
                  <option value="completed">Done</option>
                </select>
              </div>
              <button type="submit" className="quick-add-submit-btn">
                + Add Task
              </button>
            </form>
          </div>

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
    </div>
  );
}

export default Dashboard;