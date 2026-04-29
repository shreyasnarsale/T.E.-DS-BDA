import { motion } from "framer-motion";
import Loader from "./Loader.jsx";

export default function ResultCard({ result, loading }) {
  const isYes = String(result?.prediction || "").toLowerCase() === "yes";

  return (
    <motion.section
      className="card result-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div className="section-head">
        <span className="mini-badge">Prediction Output</span>
        <h2>Prediction Result</h2>
        <p className="section-subtext">
          Review the model result and confidence score instantly.
        </p>
      </div>

{loading && (
  <div className="result-loading-shell">
    <Loader text="Running ML model..." />
    <div className="result-skeleton">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
      <div className="skeleton-chip-row">
        <span className="skeleton-chip" />
        <span className="skeleton-chip" />
        <span className="skeleton-chip" />
      </div>
    </div>
  </div>
)}
      {!loading && !result && (
        <p className="muted">Submit the form to view the prediction.</p>
      )}

      {!loading && result?.error && (
        <p className="error-text">{result.error}</p>
      )}

      {!loading && result?.prediction && (
        <motion.div
          className={`result-box ${isYes ? "result-success" : "result-warning"}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3>{result.prediction}</h3>

          <p>
            <strong>Confidence:</strong> {result.confidence ?? "N/A"}%
          </p>

          <p>
            {result?.explanation?.summary ||
              (isYes
                ? "The model predicts a positive placement outcome."
                : "The model predicts that the profile currently needs improvement for better placement readiness.")}
          </p>

          {result?.explanation && (
            <div className="explanation-box">
              <h4>Why this prediction?</h4>

              {result.explanation.summary && (
                <p className="explanation-summary">
                  {result.explanation.summary}
                </p>
              )}

              <div className="explanation-list">
                {result.explanation.topFactors?.map((item, index) => (
                  <div key={index} className="explanation-item">
                    <span className="explanation-feature">{item.feature}</span>
                    <span className="explanation-impact">{item.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.section>
  );
}