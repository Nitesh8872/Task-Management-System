import { useEffect, useRef, useCallback } from "react";
import "./ConfirmationModal.css";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Task?",
  message = "Are you sure you want to delete this task? This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  variant = "danger",
}) {
  const modalRef = useRef(null);
  const cancelBtnRef = useRef(null);
  const previousActiveElement = useRef(null);

  const handleClose = useCallback(() => {
    if (loading) return;
    onClose();
  }, [loading, onClose]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = "hidden";
      setTimeout(() => cancelBtnRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "";
      previousActiveElement.current?.focus?.();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      if (e.key !== "Tab" || !modalRef.current) return;

      const focusable = Array.from(
        modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const titleId = "confirmation-modal-title";
  const messageId = "confirmation-modal-message";

  return (
    <div
      className="cm-backdrop"
      onClick={handleClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="cm-card"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
      >
        <div className={`cm-icon-wrap cm-icon-wrap--${variant}`} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cm-icon"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h2 id={titleId} className="cm-title">
          {title}
        </h2>
        <p id={messageId} className="cm-message">
          {message}
        </p>

        <div className="cm-actions">
          <button
            ref={cancelBtnRef}
            type="button"
            className="cm-btn cm-btn-cancel"
            onClick={handleClose}
            disabled={loading}
            aria-label={`${cancelLabel} and close dialog`}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`cm-btn cm-btn-confirm cm-btn-confirm--${variant}`}
            onClick={onConfirm}
            disabled={loading}
            aria-label={loading ? "Deleting, please wait" : confirmLabel}
          >
            {loading ? (
              <>
                <span className="cm-spinner" aria-hidden="true" />
                Deleting...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
