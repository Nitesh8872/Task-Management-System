import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import {
  updateUserProfile,
  getCurrentUser,
  getTasks,
  deleteUserAccount,
} from "../../services/api";
import { formatDate } from "../../utils/formatters";
import { logActivity, getActivities } from "../../utils/activityLogger";
import { getAllTasks } from "../../services/api";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { user, setUser, token, logout } = useAuth();
  const { addNotification } = useNotifications();

  // Tasks & Activities for productivity metrics
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  // Account Info form
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(
    user?.name ? user.name.toLowerCase().replace(/\s+/g, "") : ""
  );

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Avatar
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  // Modal / Toast / Loader
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ──────────────── Initialise page data ──────────────── */
  useEffect(() => {
    const init = async () => {
      if (!token) return;
      try {
        const freshUser = await getCurrentUser(token);
        setUser(freshUser);
        setName(freshUser.name);
        setUsername(freshUser.name.toLowerCase().replace(/\s+/g, ""));

        const fetchedTasks = await getAllTasks(token);
        setTasks(fetchedTasks.tasks || []);

        setActivities(getActivities(freshUser.id));
        setAvatar(localStorage.getItem(`avatar_${freshUser.id}`));
      } catch (err) {
        console.error("Account center init error:", err);
      }
    };
    init();
  }, [token, setUser]);

  /* ──────────────── Toast helper ──────────────── */
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  /* ──────────────── Avatar upload ──────────────── */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      addNotification("Image must be smaller than 1.5 MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result;
      setAvatar(b64);
      if (user?.id) {
        localStorage.setItem(`avatar_${user.id}`, b64);
      }
      window.dispatchEvent(new Event("avatar-updated"));
      logActivity(user?.id, "Updated profile photo");
      showToast("Avatar updated successfully!");
    };
    reader.readAsDataURL(file);
  };

  /* ──────────────── Save account info ──────────────── */
  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const data = await updateUserProfile({ name }, token);
      setUser({ ...user, name: data.name });
      logActivity(user?.id, `Updated name to "${data.name}"`);
      showToast("Account details saved!");
    } catch (err) {
      console.error(err);
      addNotification("Failed to update account details.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ──────────────── Update password ──────────────── */
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return;
    if (newPassword !== confirmPassword) {
      addNotification("Passwords do not match!", "error");
      return;
    }
    if (newPassword.length < 6) {
      addNotification("Password must be at least 6 characters.", "error");
      return;
    }
    setLoading(true);
    try {
      await updateUserProfile({ currentPassword, password: newPassword }, token);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      logActivity(user?.id, "Changed account password");
      showToast("Password updated successfully!");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to update password.";
      addNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  /* ──────────────── Delete account ──────────────── */
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (deleteConfirmText !== "DELETE") return;
    setLoading(true);
    try {
      await deleteUserAccount(token);
      localStorage.removeItem("token");
      if (user?.id) {
        localStorage.removeItem(`avatar_${user.id}`);
        localStorage.removeItem(`activities_${user.id}`);
      }
      logout();
      navigate("/register");
    } catch (err) {
      console.error(err);
      addNotification("Failed to delete account.", "error");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeleteConfirmText("");
    }
  };

  /* ──────────────── Password strength ──────────────── */
  const getStrength = (pwd) => {
    if (!pwd) return { label: "", score: 0, cls: "" };
    if (pwd.length < 6) return { label: "Weak", score: 33, cls: "str-weak" };
    const hasNum = /\d/.test(pwd);
    const hasSpc = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    if (pwd.length >= 8 && hasNum && hasSpc)
      return { label: "Strong", score: 100, cls: "str-strong" };
    if (hasNum || hasSpc) return { label: "Medium", score: 66, cls: "str-medium" };
    return { label: "Weak", score: 33, cls: "str-weak" };
  };
  const strength = getStrength(newPassword);

  // Handle API response
  const tasksList = Array.isArray(tasks) ? tasks : [];

  /* ──────────────── Derived metrics ──────────────── */
  const totalTasks = tasksList.length;
  const completed = tasksList.filter((t) => t.status === "completed").length;
  const pending = totalTasks - completed;
  const rate = totalTasks === 0 ? 0 : Math.round((completed / totalTasks) * 100);

  let completionPct = 0;
  if (name.trim()) completionPct += 30;
  if (user?.email) completionPct += 30;
  if (avatar) completionPct += 40;

  /* ══════════════════════════ RENDER ══════════════════════════ */
  return (
    <div className="acc-page fade-in-page">

      {/* ── Success Toast ── */}
      {toastMessage && (
        <div className="acc-toast">
          <span className="acc-toast-icon">✓</span>
          <p>{toastMessage}</p>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="acc-page-header">
        <h1>Account Center</h1>
        <p>Manage your identity, security, and track your workspace productivity.</p>
      </div>

      {/* ── Two-column Grid ── */}
      <div className="acc-grid">

        {/* ════════════════ LEFT COLUMN ════════════════ */}
        <div className="acc-left-col">

          {/* ── Profile Card ── */}
          <div className="acc-card profile-identity-card">
            <div className="ava-wrap" onClick={() => fileInputRef.current.click()}>
              {avatar ? (
                <img src={avatar} alt="Avatar" className="ava-img" />
              ) : (
                <div className="ava-initials">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div className="ava-hover-overlay">
                <span>📷</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <button
              className="change-ava-btn"
              onClick={() => fileInputRef.current.click()}
            >
              Change Avatar
            </button>

            <h2 className="identity-name">{user?.name || "User"}</h2>
            <p className="identity-email">{user?.email}</p>

            <div className="identity-meta">
              <div className="id-meta-row">
                <span className="id-meta-label">Member Since</span>
                <span className="id-meta-val">
                  {user?.createdAt ? formatDate(user.createdAt) : "—"}
                </span>
              </div>
              <div className="id-meta-row">
                <span className="id-meta-label">Account Status</span>
                <span className="id-meta-val">
                  <span className="active-badge">● Active</span>
                </span>
              </div>
            </div>
          </div>

          {/* ── Productivity Stats Card ── */}
          <div className="acc-card">
            <h3 className="acc-card-title">Productivity Stats</h3>
            <div className="stats-rows">
              <div className="stat-data-row">
                <span className="stat-data-label">📋 Tasks Created</span>
                <span className="stat-data-val">{totalTasks}</span>
              </div>
              <div className="stat-data-row">
                <span className="stat-data-label">✅ Completed</span>
                <span className="stat-data-val val-green">{completed}</span>
              </div>
              <div className="stat-data-row">
                <span className="stat-data-label">🕐 Pending</span>
                <span className="stat-data-val val-amber">{pending}</span>
              </div>
              <div className="stats-divider" />
              <div className="stat-data-row stat-rate-row">
                <span className="stat-data-label">🎯 Completion Rate</span>
                <span className="stat-data-val val-blue">{rate}%</span>
              </div>
            </div>
          </div>

          {/* ── Profile Completion Card ── */}
          <div className="acc-card">
            <h3 className="acc-card-title">Profile Completion</h3>
            <div className="completion-header-row">
              <span className="completion-pct-label">{completionPct}% Complete</span>
            </div>
            <div className="completion-track">
              <div
                className="completion-fill"
                style={{ "--cp": `${completionPct}%` }}
              />
            </div>
            <ul className="completion-list">
              <li className="cp-item cp-done">
                <span className="cp-check">✔</span> Name
              </li>
              <li className="cp-item cp-done">
                <span className="cp-check">✔</span> Email
              </li>
              <li className="cp-item cp-done">
                <span className="cp-check">✔</span> Password Set
              </li>
              <li className={`cp-item ${avatar ? "cp-done" : "cp-miss"}`}>
                <span className="cp-check">{avatar ? "✔" : "○"}</span> Profile Photo
              </li>
            </ul>
          </div>
        </div>

        {/* ════════════════ RIGHT COLUMN ════════════════ */}
        <div className="acc-right-col">

          {/* ── Account Information Card ── */}
          <div className="acc-card">
            <h3 className="acc-card-title">Account Information</h3>
            <form onSubmit={handleUpdateName} className="acc-form">
              <div className="acc-form-grid-2">
                <div className="acc-field">
                  <label htmlFor="acct-name">Full Name</label>
                  <input
                    id="acct-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="acc-field">
                  <label htmlFor="acct-user">Username</label>
                  <div className="prefix-input-wrap">
                    <span className="prefix-at">@</span>
                    <input
                      id="acct-user"
                      type="text"
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))
                      }
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>

              <div className="acc-field acc-field-disabled">
                <label htmlFor="acct-email">Email Address</label>
                <div className="disabled-input-row">
                  <input
                    id="acct-email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    readOnly
                  />
                  <span className="lock-icon">🔒</span>
                </div>
                <p className="field-note">
                  Email is linked to your account and cannot be changed.
                </p>
              </div>

              <button
                type="submit"
                className="acc-save-btn"
                disabled={loading || name === user?.name}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* ── Security Card ── */}
          <div className="acc-card">
            <h3 className="acc-card-title">Security Settings</h3>
            <form onSubmit={handleUpdatePassword} className="acc-form">
              <div className="acc-field">
                <label htmlFor="sec-cur">Current Password</label>
                <input
                  id="sec-cur"
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div className="acc-form-grid-2">
                <div className="acc-field">
                  <label htmlFor="sec-new">New Password</label>
                  <input
                    id="sec-new"
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    minLength={6}
                  />
                </div>
                <div className="acc-field">
                  <label htmlFor="sec-conf">Confirm Password</label>
                  <input
                    id="sec-conf"
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="button"
                className="visibility-toggle-btn"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? "🙈 Hide Passwords" : "👁️ Show Passwords"}
              </button>

              {/* Strength meter */}
              {newPassword && (
                <div className="pwd-strength-block">
                  <div className="pwd-strength-labels">
                    <span>Password Strength:</span>
                    <span className={`str-badge ${strength.cls}`}>{strength.label}</span>
                  </div>
                  <div className="str-track">
                    <div
                      className={`str-fill ${strength.cls}`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="acc-save-btn"
                disabled={
                  loading ||
                  !newPassword ||
                  newPassword !== confirmPassword
                }
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* ── Recent Activity Card ── */}
          <div className="acc-card">
            <h3 className="acc-card-title">Recent Activity</h3>
            {activities.length === 0 ? (
              <div className="acc-activities-empty">
                <span>📜</span>
                <p>No activity logs yet.</p>
              </div>
            ) : (
              <ul className="acc-timeline">
                {activities.slice(0, 5).map((act) => (
                  <li key={act.id} className="acc-tl-item">
                    <div className="acc-tl-dot" />
                    <div className="acc-tl-body">
                      <p className="acc-tl-text">{act.text}</p>
                      <span className="acc-tl-time">
                        {new Date(act.timestamp).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Danger Zone Card ── */}
          <div className="acc-card danger-zone-card">
            <div className="dz-header">
              <span className="dz-badge">⚠️ Danger Zone</span>
              <h3 className="acc-card-title" style={{ margin: 0 }}>
                Delete Account
              </h3>
            </div>
            <p className="dz-description">
              Once you delete your account, all your tasks, history, and settings
              will be permanently erased. <strong>This cannot be undone.</strong>
            </p>
            <button
              className="dz-trigger-btn"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════ DELETE CONFIRMATION MODAL ══════════════ */}
      {showDeleteModal && (
        <div
          className="acc-modal-backdrop"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="acc-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="acc-modal-header">
              <div className="modal-header-left">
                <span className="modal-danger-icon">⚠️</span>
                <div>
                  <h2>Permanently Delete Account?</h2>
                  <p>This action cannot be reversed.</p>
                </div>
              </div>
              <button
                className="modal-x-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>

            <p className="modal-body-text">
              All your tasks, settings, and activity history will be deleted
              forever. To confirm, type <strong>DELETE</strong> in the field below.
            </p>

            <form onSubmit={handleDeleteAccount} className="modal-form">
              <input
                type="text"
                className="modal-verify-input"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                required
                autoFocus
              />
              <div className="modal-action-row">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-destroy-btn"
                  disabled={loading || deleteConfirmText !== "DELETE"}
                >
                  {loading ? "Deleting..." : "Permanently Delete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
