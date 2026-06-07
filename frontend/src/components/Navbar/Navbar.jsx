import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../context/NotificationContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Load avatar on user change or updates
  useEffect(() => {
    const loadAvatar = () => {
      if (user?.id) {
        setAvatar(localStorage.getItem(`avatar_${user.id}`));
      } else {
        setAvatar(null);
      }
    };
    loadAvatar();
    window.addEventListener("avatar-updated", loadAvatar);
    return () => window.removeEventListener("avatar-updated", loadAvatar);
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatNotifTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Side: Brand Logo */}
        <div className="navbar-left">
          <Link to="/dashboard" className="navbar-brand">
            ⚡ <span>TaskHub</span>
          </Link>
        </div>

        {/* Right Side Controls */}
        <div className="navbar-right">
          {isAuthenticated ? (
            <div className="navbar-actions">
              {/* Theme Toggle */}
              <button
                className="nav-btn theme-toggle-btn"
                onClick={toggleDarkMode}
                aria-label="Toggle Theme"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

              {/* Notification Bell */}
              <div className="nav-dropdown-wrapper" ref={notifRef}>
                <button
                  className="nav-btn notif-bell-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-label="Notifications"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount}</span>
                  )}
                </button>

                {showNotifications && (
                  <div className="nav-dropdown notif-dropdown">
                    <div className="dropdown-header">
                      <h3>Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="header-action-btn">
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="dropdown-body">
                      {notifications.length === 0 ? (
                        <div className="dropdown-empty">
                          <p>🎉 All caught up!</p>
                        </div>
                      ) : (
                        <ul className="notif-list">
                          {notifications.map((notif) => (
                            <li
                              key={notif.id}
                              className={`notif-item ${notif.read ? "read" : "unread"} type-${notif.type}`}
                              onClick={() => markAsRead(notif.id)}
                            >
                              <div className="notif-content">
                                <p className="notif-text">{notif.text}</p>
                                <span className="notif-time">
                                  {formatNotifTime(notif.createdAt)}
                                </span>
                              </div>
                              <button
                                className="notif-close-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearNotification(notif.id);
                                }}
                                aria-label="Clear alert"
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="nav-dropdown-wrapper" ref={userRef}>
                <button
                  className="nav-user-profile-btn"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <div className="user-avatar" style={{ overflow: "hidden", padding: 0 }}>
                    {avatar ? (
                      <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                    ) : (
                      user?.name ? user.name.charAt(0).toUpperCase() : "U"
                    )}
                  </div>
                  <span className="user-name-label">{user?.name || "Profile"}</span>
                </button>

                {showUserDropdown && (
                  <div className="nav-dropdown user-dropdown">
                    <div className="user-dropdown-info">
                      <p className="user-dropdown-name">{user?.name}</p>
                      <p className="user-dropdown-email">{user?.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      👤 My Profile
                    </Link>
                    <Link
                      to="/tasks"
                      className="dropdown-item"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      📋 My Tasks
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="navbar-links">
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;