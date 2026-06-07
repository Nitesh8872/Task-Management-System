import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/api";
import "./Register.css";

function Register() {
  //hooks must be called unconditionally (before any return)
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Route guard — after hooks
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData); //removed unused variable
      alert("Registration Successful! Please log in.");
      navigate("/login"); //removed duplicate navigate call
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration Failed. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-header">
          <span className="register-icon">🚀</span>
          <h1>Create Account</h1>
          <p>Join SmartDesk and boost your productivity</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-submit-btn">
            Create Account
          </button>

        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;