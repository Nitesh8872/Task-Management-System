import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import "../styles/App.css";

/**
 * DashboardLayout — wraps any page that needs the sidebar and navbar.
 */
function DashboardLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="content-layout" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "hidden" }}>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
