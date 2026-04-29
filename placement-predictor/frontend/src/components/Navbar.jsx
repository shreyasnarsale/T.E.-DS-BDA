import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      {/* Logo */}
      <Link to="/" className="brand-wrap">
        <div className="brand-logo">P</div>
        <div className="brand-text">PlacementAI</div>
      </Link>

      {/* Nav Links */}
      <nav className="nav-links">
        <a href="#predict" className="nav-link">Predict</a>
        <a href="#dashboard" className="nav-link">Dashboard</a>

        {!user ? (
          <>
            <Link to="/login" className="nav-login">
              Log in
            </Link>
            <Link to="/signup" className="nav-pill">
              Get Started
            </Link>
          </>
        ) : (
          <>
            <div className="user-chip">
              👋 {user?.name?.split(" ")[0]}
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}