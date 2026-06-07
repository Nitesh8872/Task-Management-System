import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { getTasks, createTask, deleteTask, updateTask } from "../../services/api";
import { logActivity } from "../../utils/activityLogger";
import TaskCard from "../../components/TaskCard/TaskCard";
import TaskBoard from "../../components/TaskBoard/TaskBoard";
import "./TasksPage.css";

function TasksPage() {
  const { token, user } = useAuth();
  const { addNotification, checkTasksForNotifications } = useNotifications();

  // Tasks State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Layout View State: list or board
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("tasksViewMode") || "list";
  });

  // Controls State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("work");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editCategory, setEditCategory] = useState("work");
  const [editStatus, setEditStatus] = useState("pending");

  // API Callbacks
  const fetchTasks = async () => {
    try {
      const data = await getTasks(token);
      setTasks(data);
      checkTasksForNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    localStorage.setItem("tasksViewMode", viewMode);
  }, [viewMode]);

  // Handle Create Task
  const handleCreateTaskSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newTask = await createTask(
        { title, description, dueDate, priority, category },
        token
      );
      setTasks((prev) => [...prev, newTask]);
      setIsCreateModalOpen(false);

      // Log activity and notify
      logActivity(user.id, `Created task "${title}"`);
      addNotification(`Task "${title}" created successfully!`, "success");
      
      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setCategory("work");
    } catch (err) {
      console.error(err);
      addNotification("Failed to create task", "error");
    }
  };

  // Handle Edit Click
  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setEditPriority(task.priority || "medium");
    setEditCategory(task.category || "work");
    setEditStatus(task.status || "pending");
    setIsEditModalOpen(true);
  };

  // Handle Save Edit
  const handleSaveEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateTask(
        editingTaskId,
        {
          title: editTitle,
          description: editDescription,
          dueDate: editDueDate,
          priority: editPriority,
          category: editCategory,
          status: editStatus,
        },
        token
      );
      setTasks((prev) => prev.map((t) => (t._id === editingTaskId ? updated : t)));
      setIsEditModalOpen(false);

      logActivity(user.id, `Updated task "${editTitle}"`);
      addNotification(`Task "${editTitle}" updated!`, "success");
    } catch (err) {
      console.error(err);
      addNotification("Failed to update task", "error");
    }
  };

  // Handle Complete Task
  const handleCompleteTask = async (taskId) => {
    try {
      const target = tasks.find((t) => t._id === taskId);
      const updated = await updateTask(taskId, { status: "completed" }, token);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
      
      logActivity(user.id, `Completed task "${target.title}"`);
      addNotification(`Task "${target.title}" marked completed!`, "success");
    } catch (err) {
      console.error(err);
      addNotification("Failed to complete task", "error");
    }
  };

  // Handle Kanban Column Change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const target = tasks.find((t) => t._id === taskId);
      const updated = await updateTask(taskId, { status: newStatus }, token);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));

      logActivity(user.id, `Moved "${target.title}" to ${newStatus}`);
      addNotification(`Task status updated to ${newStatus}`, "info");
    } catch (err) {
      console.error(err);
      addNotification("Failed to drag and move task", "error");
    }
  };

  // Handle Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const target = tasks.find((t) => t._id === taskId);
      await deleteTask(taskId, token);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));

      logActivity(user.id, `Deleted task "${target.title}"`);
      addNotification("Task deleted successfully", "success");
    } catch (err) {
      console.error(err);
      addNotification("Failed to delete task", "error");
    }
  };

  // ── Derived State Filtering ──
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
      
    const matchesCategory =
      categoryFilter === "all" || task.category === categoryFilter;

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOrder === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortOrder === "status") {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  return (
    <div className="tasks-page">
      <div className="tasks-page-header">
        <div className="tasks-page-title">
          <h1>My Task Workspace</h1>
          <p>Organize, search, filter, and drag your milestones.</p>
        </div>

        <div className="tasks-header-actions">
          {/* List vs Board Toggle */}
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              📋 List
            </button>
            <button
              className={`view-toggle-btn ${viewMode === "board" ? "active" : ""}`}
              onClick={() => setViewMode("board")}
            >
              📊 Board
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="add-task-primary-btn"
          >
            + Create Task
          </button>
        </div>
      </div>

      {/* Control Panel (Search, Sort, Filters) */}
      <div className="tasks-control-panel">
        <div className="search-row">
          <div className="tasks-search-input-wrapper">
            <span className="search-icon-inside">🔍</span>
            <input
              type="text"
              placeholder="Search tasks by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="sort-select-wrapper">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="dueDate">Sort: Due Date</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>
        </div>

        <div className="filters-row">
          {/* Status Filter */}
          <div className="filter-group">
            <span className="filter-label">Status:</span>
            <div className="filter-chips">
              {["all", "pending", "in-progress", "completed"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`filter-chip ${statusFilter === st ? "active" : ""}`}
                >
                  {st === "all" ? "All" : st === "pending" ? "Todo" : st === "in-progress" ? "Active" : "Done"}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <span className="filter-label">Category:</span>
            <div className="filter-chips">
              {["all", "work", "study", "personal"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`filter-chip ${categoryFilter === cat ? "active" : ""}`}
                >
                  {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="filter-group">
            <span className="filter-label">Priority:</span>
            <div className="filter-chips">
              {["all", "high", "medium", "low"].map((prio) => (
                <button
                  key={prio}
                  onClick={() => setPriorityFilter(prio)}
                  className={`filter-chip ${priorityFilter === prio ? "active" : ""}`}
                >
                  {prio === "all" ? "All" : prio.charAt(0).toUpperCase() + prio.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {loading ? (
        <p style={{ color: "var(--color-text-muted)" }}>Loading workspace tasks...</p>
      ) : sortedTasks.length === 0 ? (
        <div className="tasks-empty-state">
          <span>📝</span>
          <h3>No tasks matched filters</h3>
          <p>Create your first task or change search criteria to begin.</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="add-task-primary-btn"
          >
            Create Task
          </button>
        </div>
      ) : viewMode === "board" ? (
        <TaskBoard
          tasks={sortedTasks}
          onEdit={handleEditClick}
          onComplete={handleCompleteTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="tasks-list-grid">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEditClick}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTaskSubmit} className="task-form">
              <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="form-group">
                  <label style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="work">Work</option>
                    <option value="study">Study</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "10px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="modal-actions" style={{ marginTop: "20px" }}>
                <button type="submit" className="save-btn">
                  Add Task
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Workspace Task</h2>
            <form onSubmit={handleSaveEditSubmit} className="task-form">
              <input
                type="text"
                placeholder="Task Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="form-group">
                  <label style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    <option value="work">Work</option>
                    <option value="study">Study</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                <div className="form-group">
                  <label style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Due Date</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="pending">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: "20px" }}>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksPage;
