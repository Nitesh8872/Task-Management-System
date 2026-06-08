import { useEffect, useRef } from "react";
import { TASK_STATUS_OPTIONS } from "../../utils/taskStatus";
import "./TaskModal.css";

/*TaskModal — shared premium modal for Create & Edit task flows.*/

function TaskModal({
    mode = "create",
    isOpen,
    onClose,
    onSubmit,
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    priority,
    setPriority,
    category,
    setCategory,
    status,
    setStatus,
    loading = false,
}) {
    const firstInputRef = useRef(null);
    const isEdit = mode === "edit";

    /* ── Lock body scroll ── */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // Focus first input when modal opens
            setTimeout(() => firstInputRef.current?.focus(), 80);
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    /* ── ESC to close ── */
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className={`tm-backdrop ${isOpen ? "tm-backdrop--visible" : ""}`}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={isEdit ? "Edit Task" : "Create New Task"}
        >
            <div
                className="tm-card"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="tm-header">
                    <div className="tm-header-left">
                        <div className="tm-header-icon">{isEdit ? "✏️" : "✨"}</div>
                        <div>
                            <h2 className="tm-title">
                                {isEdit ? "Edit Task" : "Create New Task"}
                            </h2>
                            <p className="tm-subtitle">
                                {isEdit
                                    ? "Update the details below and save your changes."
                                    : "Fill in the details below to add a new task to your workspace."}
                            </p>
                        </div>
                    </div>
                    <button
                        className="tm-close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                        type="button"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="tm-divider" />

                {/* ── Form ── */}
                <form onSubmit={onSubmit} className="tm-form">
                    {/* Task Title — full width */}
                    <div className="tm-field-group tm-field-full">
                        <label className="tm-label" htmlFor="tm-task-title">
                            Task Title <span className="tm-required">*</span>
                        </label>
                        <input
                            id="tm-task-title"
                            ref={firstInputRef}
                            type="text"
                            className="tm-input"
                            placeholder="e.g. Complete the project proposal"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Description — full width */}
                    <div className="tm-field-group tm-field-full">
                        <label className="tm-label" htmlFor="tm-task-desc">
                            Description
                        </label>
                        <textarea
                            id="tm-task-desc"
                            className="tm-textarea"
                            placeholder="Add more context or notes about this task..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* 2-col row: Category + Priority */}
                    <div className="tm-grid-2">
                        <div className="tm-field-group">
                            <label className="tm-label" htmlFor="tm-category">
                                Category
                            </label>
                            <div className="tm-select-wrapper">
                                <select
                                    id="tm-category"
                                    className="tm-select"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="work">💼 Work</option>
                                    <option value="study">📚 Study</option>
                                    <option value="personal">🏠 Personal</option>
                                </select>
                                <span className="tm-select-arrow">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div className="tm-field-group">
                            <label className="tm-label" htmlFor="tm-priority">
                                Priority
                            </label>
                            <div className="tm-select-wrapper">
                                <select
                                    id="tm-priority"
                                    className="tm-select"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                >
                                    <option value="high">🔴 High</option>
                                    <option value="medium">🟡 Medium</option>
                                    <option value="low">🟢 Low</option>
                                </select>
                                <span className="tm-select-arrow">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 2-col row: Due Date + Status (edit only) */}
                    <div className="tm-grid-2">
                        <div className="tm-field-group">
                            <label className="tm-label" htmlFor="tm-due-date">
                                Due Date
                            </label>
                            <input
                                id="tm-due-date"
                                type="date"
                                className="tm-input tm-input-date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>

                        {isEdit && (
                            <div className="tm-field-group">
                                <label className="tm-label" htmlFor="tm-status">
                                    Status
                                </label>
                                <div className="tm-select-wrapper">
                                    <select
                                        id="tm-status"
                                        className="tm-select"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        {TASK_STATUS_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="tm-select-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* On create mode — fill the second column with a helper hint */}
                        {!isEdit && (
                            <div className="tm-field-group tm-hint-box">
                                <span className="tm-hint-icon">💡</span>
                                <p className="tm-hint-text">
                                    Status will default to <strong>Pending</strong>. You can change it later.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="tm-divider tm-divider--footer" />

                    {/* ── Footer Actions ── */}
                    <div className="tm-footer">
                        <button
                            type="button"
                            className="tm-btn tm-btn-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="tm-btn tm-btn-primary" disabled={loading}>
                            {loading ? "Saving..." : isEdit ? (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="tm-btn-icon">
                                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                        <polyline points="17 21 17 13 7 13 7 21" />
                                        <polyline points="7 3 7 8 15 8" />
                                    </svg>
                                    Save Changes
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="tm-btn-icon">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    Create Task
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;
