import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="hero-content">
        <p className="badge">AI-powered placement intelligence</p>

        <h1>
          Predict student placement
          <span> with a modern ML dashboard</span>
        </h1>

        <p className="hero-text">
          Evaluate placement readiness using machine learning, visualize model
          performance, and explore feature importance through a premium,
          recruiter-ready interface.
        </p>

        <div className="hero-actions">
          <a href="#predict" className="hero-primary">
            Try Prediction
          </a>
          <a href="#dashboard" className="hero-secondary">
            Explore Analytics
          </a>
        </div>
      </div>

      <div className="hero-glow hero-glow-1"></div>
      <div className="hero-glow hero-glow-2"></div>
    </motion.section>
  );
}