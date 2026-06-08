import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { loginUser } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import "./Login.css";

function Login() {
  const { token, login } = useAuth();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("showSessionExpired") === "true") {
      addNotification("Session expired. Please log in again.", "warning");
      localStorage.removeItem("showSessionExpired");
    }
  }, [addNotification]);

  // Redirect authenticated users
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const normalizedData = {
        ...formData,
        email: formData.email.toLowerCase().trim(),
      };
      const data = await loginUser(normalizedData);

      // Store token through AuthContext
      login(data.token, data.user || null);

    } catch (error) {
      console.error("Login failed:", error);
      addNotification("Login Failed. Please check your credentials.", "error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <span className="login-icon">🔐</span>
          <h1>Welcome Back</h1>
          <p>Sign in to your SmartDesk account</p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="login-email">
              Email Address
            </label>

            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="login-submit-btn"
          >
            Sign In
          </button>
        </form>

        <p className="login-footer">
          Don&apos;t have an account?{" "}
          <Link to="/register">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;