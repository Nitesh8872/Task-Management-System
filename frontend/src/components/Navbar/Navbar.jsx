import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../context/NotificationContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotification, 
    clearAllNotifications 
  } = useNotifications();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [avatar, setAvatar] = useState(null);
  
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadAvatar = () => {
      if (user?.id) {
        setAvatar(localStorage.getItem(`avatar_${user.id}`));
      }
    };
    loadAvatar();
    window.addEventListener("avatar-updated", loadAvatar);
    return () => window.removeEventListener("avatar-updated", loadAvatar);
  }, [user?.id]);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on path changes
  useEffect(() => {
    setShowNotifications(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get active tab name or greeting
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Dashboard Overview";
    if (path.includes("tasks")) return "Task Workspace";
    if (path.includes("analytics")) return "Analytics Hub";
    if (path.includes("calendar")) return "Calendar Timeline";
    if (path.includes("profile")) return "User Settings";
    return "TaskHub Space";
  };

  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">{getPageTitle()}</h2>
        <span className="navbar-subtitle">
          {user ? `Welcome back, ${user.name}` : "Manage your projects efficiently"}
        </span>
      </div>

      <div className="navbar-right">
        {/* Theme Toggle */}
        <button 
          className="navbar-icon-btn theme-toggle" 
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Notifications Dropdown */}
        <div className="navbar-dropdown-container" ref={notifRef}>
          <button 
            className={`navbar-icon-btn notif-btn ${showNotifications ? "active" : ""}`}
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            aria-label="Notifications"
          >
            🔔
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>
          
          {showNotifications && (
            <div className="navbar-dropdown notif-dropdown">
              <div className="dropdown-header">
                <h3>Notifications ({unreadCount} unread)</h3>
                <div className="dropdown-header-actions">
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="dropdown-action-btn">
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button onClick={clearAllNotifications} className="dropdown-action-btn clear">
                      Clear all
                    </button>
                  )}
                </div>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-list notif-list">
                {notifications.length === 0 ? (
                  <div className="dropdown-empty">
                    <span>🎉</span>
                    <p>All caught up! No notifications.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`notif-item ${n.read ? "read" : "unread"} type-${n.type}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className="notif-dot-indicator" />
                      <div className="notif-content">
                        <p className="notif-text">{n.text}</p>
                        <span className="notif-time">
                          {new Date(n.createdAt).toLocaleTimeString([], { 
                            hour: "2-digit", 
                            minute: "2-digit" 
                          })}
                        </span>
                      </div>
                      <button 
                        className="notif-delete-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(n.id);
                        }}
                        title="Delete notification"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="navbar-divider" />

        {/* User Account Menu */}
        <div className="navbar-dropdown-container" ref={userRef}>
          <button 
            className="navbar-user-avatar"
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="Account Menu"
            aria-label="Account Settings"
            style={avatar ? { backgroundImage: `url(${avatar})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
          >
            {!avatar && getUserInitials()}
          </button>

          {showUserMenu && (
            <div className="navbar-dropdown user-dropdown">
              <div className="user-dropdown-info">
                <p className="user-name">{user?.name || "User"}</p>
                <p className="user-email">{user?.email || ""}</p>
              </div>
              <div className="dropdown-divider" />
              <Link to="/profile" className="dropdown-link-item">
                👤 My Profile
              </Link>
              <div className="dropdown-divider" />
              <button onClick={handleLogout} className="dropdown-action-item logout">
                🚪 Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
