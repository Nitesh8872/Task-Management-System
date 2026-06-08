import { useNotifications } from "../../context/NotificationContext";
import "./ToastContainer.css";

const TOAST_ICONS = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

function ToastContainer() {
  const { toasts, dismissToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
          role="status"
        >
          <span className="toast-icon" aria-hidden="true">
            {TOAST_ICONS[toast.type] || TOAST_ICONS.info}
          </span>
          <p className="toast-text">{toast.text}</p>
          <button
            type="button"
            className="toast-close"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
