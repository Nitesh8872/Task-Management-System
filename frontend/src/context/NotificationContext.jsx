import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { TASK_STATUS } from "../utils/taskStatus";
import ToastContainer from "../components/Toast/ToastContainer";

const NotificationContext = createContext(null);

const TOAST_DURATION_MS = 4000;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("notifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      localStorage.removeItem("notifications");
      return [];
    }
  });

  const [toasts, setToasts] = useState([]);
  const toastTimers = useRef(new Map());

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const timers = toastTimers.current;
    return () => {
      timers.forEach((timerId) => clearTimeout(timerId));
      timers.clear();
    };
  }, []);

  const dismissToast = useCallback((id) => {
    const timerId = toastTimers.current.get(id);
    if (timerId) {
      clearTimeout(timerId);
      toastTimers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addNotification = useCallback((text, type = "info") => {
    const inboxId = `custom-${Date.now()}`;
    setNotifications((prev) => [
      {
        id: inboxId,
        text,
        type,
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...prev.slice(0, 49),
    ]);

    const toastId = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id: toastId, text, type }]);

    const timerId = setTimeout(() => dismissToast(toastId), TOAST_DURATION_MS);
    toastTimers.current.set(toastId, timerId);
  }, [dismissToast]);

  const checkTasksForNotifications = (tasks) => {
    if (!tasks || tasks.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isSameDate = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    setNotifications((prev) => {
      const newNotifications = [...prev];
      let changed = false;

      tasks.forEach((task) => {
        if (task.status === TASK_STATUS.COMPLETED || !task.dueDate) return;

        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        let text = "";
        let type = "";

        if (isSameDate(dueDate, today)) {
          text = `Task "${task.title}" is due today!`;
          type = "info";
        } else if (isSameDate(dueDate, tomorrow)) {
          text = `Task "${task.title}" is due tomorrow.`;
          type = "warning";
        } else if (dueDate < today) {
          text = `Task "${task.title}" is overdue!`;
          type = "error";
        }

        if (text) {
          const exists = newNotifications.some(
            (n) => n.taskId === task._id && n.type === type
          );

          if (!exists) {
            newNotifications.unshift({
              id: `${task._id}-${type}-${Date.now()}`,
              taskId: task._id,
              text,
              type,
              read: false,
              createdAt: new Date().toISOString(),
            });
            changed = true;
          }
        }
      });

      return changed ? newNotifications.slice(0, 50) : prev;
    });
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toasts,
        unreadCount,
        checkTasksForNotifications,
        addNotification,
        dismissToast,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
      }}
    >
      {children}
      <ToastContainer />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

export default NotificationContext;
