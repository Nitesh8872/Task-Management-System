import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { getTasks, createTask, deleteTask, updateTask } from "../../services/api";
import { logActivity } from "../../utils/activityLogger";
import { TASK_STATUS, TASK_STATUS_LABELS, TASK_STATUS_OPTIONS } from "../../utils/taskStatus";
import TaskCard from "../../components/TaskCard/TaskCard";
import TaskBoard from "../../components/TaskBoard/TaskBoard";
import TaskModal from "../../components/TaskModal/TaskModal";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import "./TasksPage.css";

const LIST_PAGE_SIZE = 9;
const BOARD_PAGE_SIZE = 1000;

function TasksPage() {
  const { token, user } = useAuth();
  const { addNotification, checkTasksForNotifications } = useNotifications();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("tasksViewMode") || "list";
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("work");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editCategory, setEditCategory] = useState("work");
  const [editStatus, setEditStatus] = useState("pending");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, categoryFilter, priorityFilter, sortOrder, viewMode]);

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const isBoard = viewMode === "board";
      const data = await getTasks(token, {
        page: isBoard ? 1 : page,
        limit: isBoard ? BOARD_PAGE_SIZE : LIST_PAGE_SIZE,
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        sort: sortOrder,
      });
      const taskList = data.tasks || [];
      setTasks(taskList);
      setTotalPages(data.totalPages || 1);
      setTotalTasks(data.totalTasks || 0);
      checkTasksForNotifications(taskList);
    } catch (err) {
      console.error(err);
      addNotification("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  }, [
    token,
    page,
    debouncedSearch,
    statusFilter,
    categoryFilter,
    priorityFilter,
    sortOrder,
    viewMode,
    checkTasksForNotifications,
    addNotification,
  ]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    localStorage.setItem("tasksViewMode", viewMode);
  }, [viewMode]);

  const openCreateModal = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setCategory("work");
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => setIsCreateModalOpen(false);
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleCreateTaskSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask(
        { title, description, dueDate: dueDate || null, priority, category },
        token
      );
      setIsCreateModalOpen(false);
      logActivity(user.id, `Created task "${title}"`);
      addNotification(`Task "${title}" created successfully!`, "success");
      fetchTasks();
    } catch (err) {
      console.error(err);
      addNotification("Failed to create task", "error");
    }
  };

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

  const handleSaveEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(
        editingTaskId,
        {
          title: editTitle,
          description: editDescription,
          dueDate: editDueDate || null,
          priority: editPriority,
          category: editCategory,
          status: editStatus,
        },
        token
      );
      setIsEditModalOpen(false);
      logActivity(user.id, `Updated task "${editTitle}"`);
      addNotification(`Task "${editTitle}" updated!`, "success");
      fetchTasks();
    } catch (err) {
      console.error(err);
      addNotification("Failed to update task", "error");
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const target = tasks.find((t) => t._id === taskId);
      await updateTask(taskId, { status: TASK_STATUS.COMPLETED }, token);
      logActivity(user.id, `Marked task "${target?.title}" Completed`);
      addNotification(`Task "${target?.title}" marked Completed!`, "success");
      fetchTasks();
    } catch (err) {
      console.error(err);
      addNotification("Failed to complete task", "error");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const target = tasks.find((t) => t._id === taskId);
      await updateTask(taskId, { status: newStatus }, token);
      const label = TASK_STATUS_LABELS[newStatus] || newStatus;
      logActivity(user.id, `Moved task "${target?.title}" to ${label}`);
      addNotification(`Task moved to ${label}`, "info");
      fetchTasks();
    } catch (err) {
      console.error(err);
      addNotification("Failed to drag and move task", "error");
    }
  };

  const handleDeleteRequest = (taskId) => {
    setTaskToDeleteId(taskId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setTaskToDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDeleteId || isDeleting) return;

    setIsDeleting(true);
    try {
      const target = tasks.find((t) => t._id === taskToDeleteId);
      await deleteTask(taskToDeleteId, token);
      logActivity(user.id, `Deleted task "${target?.title}"`);
      addNotification("Task deleted successfully.", "success");
      setIsDeleteModalOpen(false);
      setTaskToDeleteId(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
      addNotification("Failed to delete task", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="tasks-page">
      <div className="tasks-page-header">
        <div className="tasks-page-title">
          <h1>My Task Workspace</h1>
          <p>Organize, search, filter, and drag your milestones.</p>
        </div>

        <div className="tasks-header-actions">
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

          <button onClick={openCreateModal} className="add-task-primary-btn">
            + Create Task
          </button>
        </div>
      </div>

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
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="dueDate">Sort: Due Date</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>
        </div>

        <div className="filters-row">
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

      {loading ? (
        <p style={{ color: "var(--color-text-muted)" }}>Loading workspace tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="tasks-empty-state">
          <span>📝</span>
          <h3>No tasks matched filters</h3>
          <p>Create your first task or change search criteria to begin.</p>
          <button onClick={openCreateModal} className="add-task-primary-btn">
            Create Task
          </button>
        </div>
      ) : viewMode === "board" ? (
        <TaskBoard
          tasks={tasks}
          onEdit={handleEditClick}
          onComplete={handleCompleteTask}
          onDelete={handleDeleteRequest}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <>
          <div className="tasks-list-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditClick}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages} ({totalTasks} tasks)
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}

export default TasksPage;
