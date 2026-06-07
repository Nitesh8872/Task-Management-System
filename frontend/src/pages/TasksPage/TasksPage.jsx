import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { getTasks, createTask, deleteTask, updateTask } from "../../services/api";
import { logActivity } from "../../utils/activityLogger";
import { TASK_STATUS, TASK_STATUS_LABELS, TASK_STATUS_OPTIONS } from "../../utils/taskStatus";
import TaskCard from "../../components/TaskCard/TaskCard";
import TaskBoard from "../../components/TaskBoard/TaskBoard";
import TaskModal from "../../components/TaskModal/TaskModal";
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

  // ── Create Modal State ──
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("work");

  // ── Edit Modal State ──
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

  // ── Open / Close helpers ──
  const openCreateModal = () => {
    // Reset form fields
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setCategory("work");
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => setIsCreateModalOpen(false);

  const closeEditModal = () => setIsEditModalOpen(false);

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

      logActivity(user.id, `Created task "${title}"`);
      addNotification(`Task "${title}" created successfully!`, "success");
    } catch (err) {
      console.error(err);
      addNotification("Failed to create task", "error");
    }
  };

  // Handle Edit Click — pre-fills the modal
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
      const updated = await updateTask(taskId, { status: TASK_STATUS.COMPLETED }, token);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));

      logActivity(user.id, `Marked task "${target.title}" Completed`);
      addNotification(`Task "${target.title}" marked Completed!`, "success");
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

      const label = TASK_STATUS_LABELS[newStatus] || newStatus;
      logActivity(user.id, `Moved task "${target.title}" to ${label}`);
      addNotification(`Task moved to ${label}`, "info");
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
            onClick={openCreateModal}
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
              {[{ value: "all", label: "All" }, ...TASK_STATUS_OPTIONS].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`filter-chip ${statusFilter === opt.value ? "active" : ""}`}
                >
                  {opt.label}
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
            onClick={openCreateModal}
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

      {/* ── Create Task Modal ── */}
      <TaskModal
        mode="create"
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateTaskSubmit}
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

      {/* ── Edit Task Modal ── */}
      <TaskModal
        mode="edit"
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleSaveEditSubmit}
        title={editTitle}
        setTitle={setEditTitle}
        description={editDescription}
        setDescription={setEditDescription}
        dueDate={editDueDate}
        setDueDate={setEditDueDate}
        priority={editPriority}
        setPriority={setEditPriority}
        category={editCategory}
        setCategory={setEditCategory}
        status={editStatus}
        setStatus={setEditStatus}
      />
    </div>
  );
}

export default TasksPage;
