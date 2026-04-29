import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <div className="brand-logo">P</div>
            <div>
              <h3>PlacementAI</h3>
              <p className="muted">
                Smart placement prediction with machine learning, analytics, and
                a premium full-stack experience.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4>Platform</h4>
          <div className="footer-links">
            <a href="#predict">Predict</a>
            <a href="#dashboard">Dashboard</a>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        </div>

        <div>
          <h4>Features</h4>
          <div className="footer-links">
            <span>JWT Authentication</span>
            <span>Prediction History</span>
            <span>ML Analytics</span>
            <span>Interactive Charts</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 PlacementAI. Built for placement-ready full-stack demos.</p>
      </div>
    </footer>
  );
}