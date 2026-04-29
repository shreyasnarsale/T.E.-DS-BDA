import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data);
      navigate("/");
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-showcase">
        <div className="auth-showcase-inner">
          <p className="badge">Welcome back</p>
          <h1>Sign in to continue your placement analysis.</h1>
          <p>
            Access predictions, analytics, and student performance insights in a
            clean SaaS-grade dashboard.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">Real-time ML predictions</div>
            <div className="auth-feature-item">Interactive analytics dashboard</div>
            <div className="auth-feature-item">Secure JWT authentication</div>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <form className="auth-card premium-auth-card" onSubmit={handleSubmit}>
          <div className="auth-topbar">
            <Link to="/" className="back-home">
              ← Back to Home
            </Link>
          </div>

          <h2>Log in</h2>
          <p className="muted">Enter your account details to continue.</p>

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button className="primary-btn auth-submit-btn" type="submit">
            Log in
          </button>

          <p className="muted auth-switch-text">
            Don’t have an account? <Link to="/signup">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}