import { createContext, useContext, useState, useEffect } from "react";
import { TASK_STATUS } from "../utils/taskStatus";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

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

  const addNotification = (text, type = "info") => {
    setNotifications((prev) => [
      {
        id: `custom-${Date.now()}`,
        text,
        type,
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...prev.slice(0, 49),
    ]);
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
        unreadCount,
        checkTasksForNotifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
      }}
    >
      {children}
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
