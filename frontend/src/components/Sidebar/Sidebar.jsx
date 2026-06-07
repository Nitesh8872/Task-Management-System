import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        TaskHub
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}
        >
          📊 Dashboard
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}
        >
          📋 All Tasks
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}
        >
          📈 Analytics
        </NavLink>
        <NavLink
          to="/calendar"
          className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}
        >
          📅 Calendar
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => isActive ? "menu-link active" : "menu-link"}
        >
          👤 Profile
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        © 2026 TaskHub
      </div>
    </aside>
  );
}

export default Sidebar;