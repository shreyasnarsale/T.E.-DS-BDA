import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5000";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
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
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
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
          <p className="badge">Get started</p>
          <h1>Create your account and unlock smarter placement insights.</h1>
          <p>
            Join the platform to generate predictions, review model metrics,
            and build a more interview-ready student profile.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">Modern premium UI</div>
            <div className="auth-feature-item">Protected prediction workflow</div>
            <div className="auth-feature-item">Placement-ready full-stack demo</div>
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

          <h2>Create account</h2>
          <p className="muted">Start using PlacementAI in a few seconds.</p>

          <input
            name="name"
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
          />

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
            Create Account
          </button>

          <p className="muted auth-switch-text">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}