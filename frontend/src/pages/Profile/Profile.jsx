import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { updateUserProfile, getCurrentUser } from "../../services/api";
import { formatDate } from "../../utils/formatters";
import { logActivity } from "../../utils/activityLogger";
import "./Profile.css";

function Profile() {
  const { user, setUser, token } = useAuth();
  const { addNotification } = useNotifications();

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sync latest details
    const refreshUser = async () => {
      if (!token) return;
      try {
        const freshUser = await getCurrentUser(token);
        setUser(freshUser);
        setName(freshUser.name);
      } catch (err) {
        console.error("Error refreshing profile user details:", err);
      }
    };
    refreshUser();
  }, [token, setUser]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      const data = await updateUserProfile({ name }, token);
      setUser({ ...user, name: data.name });
      addNotification("Name updated successfully!", "success");
      logActivity(user.id, `Updated profile name to "${data.name}"`);
    } catch (err) {
      console.error(err);
      addNotification("Failed to update name.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!password) return;
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({ password }, token);
      setPassword("");
      setConfirmPassword("");
      addNotification("Password changed successfully!", "success");
      logActivity(user.id, "Changed profile password");
    } catch (err) {
      console.error(err);
      addNotification("Failed to update password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Left Card: Summary */}
        <div className="profile-sidebar-card">
          <div className="profile-avatar-large">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2>{user?.name}</h2>
          <p className="profile-email-text">{user?.email}</p>
          
          <div className="profile-meta-info">
            <div className="meta-item">
              <span className="meta-label">Member Since</span>
              <span className="meta-value">
                {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Account Status</span>
              <span className="meta-value" style={{ color: "var(--color-success)" }}>Active</span>
            </div>
          </div>
        </div>

        {/* Right Card: Forms */}
        <div className="profile-content-card">
          <h1>Profile Settings</h1>
          <p className="profile-subtitle">Update your personal account settings and security.</p>
          
          {/* Form 1: Profile Info */}
          <div className="profile-form-section">
            <h3>Account Details</h3>
            <form onSubmit={handleUpdateName} className="profile-form">
              <div className="form-group">
                <label htmlFor="profile-name">Full Name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="profile-save-btn" 
                disabled={loading || name === user?.name}
              >
                {loading ? "Saving..." : "Save Details"}
              </button>
            </form>
          </div>

          {/* Form 2: Password */}
          <div className="profile-form-section">
            <h3>Change Password</h3>
            <form onSubmit={handleUpdatePassword} className="profile-form">
              <div className="profile-form-row">
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="profile-save-btn" 
                disabled={loading || !password}
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;
