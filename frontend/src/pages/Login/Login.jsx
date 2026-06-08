import { useState, useEffect } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import { loginUser } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { getErrorMessage } from "../../utils/getErrorMessage";
import "./Login.css";

function Login() {
  const { token, login } = useAuth();
  const { addNotification } = useNotifications();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [sessionNotice, setSessionNotice] = useState(
    () => (location.state?.registered ? "Account created successfully! Please sign in." : "")
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("showSessionExpired") === "true") {
      const msg = "Session expired. Please log in again.";
      setSessionNotice(msg);
      addNotification(msg, "warning");
      localStorage.removeItem("showSessionExpired");
    }
  }, [addNotification]);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const normalizedData = {
        ...formData,
        email: formData.email.toLowerCase().trim(),
      };
      const data = await loginUser(normalizedData);
      login(data.token, data.user || null);
    } catch (err) {
      const msg = getErrorMessage(err, "Login failed. Please check your credentials.");
      setError(msg);
      addNotification(msg, "error");
    } finally {
      setSubmitting(false);
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

        {sessionNotice && (
          <div
            className={`auth-alert ${location.state?.registered ? "auth-alert--success" : "auth-alert--warning"}`}
            role="status"
          >
            {sessionNotice}
          </div>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="auth-alert auth-alert--error" role="alert">
              {error}
            </div>
          )}

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
              disabled={submitting}
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
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign In"}
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
