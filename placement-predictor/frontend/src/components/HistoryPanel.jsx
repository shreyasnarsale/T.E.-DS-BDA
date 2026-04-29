import { motion } from "framer-motion";

export default function HistoryPanel({
  history,
  loadingHistory,
  onDeleteHistory,
  deletingId,
}) {
  return (
    <motion.section
      className="card history-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div className="section-head">
        <span className="mini-badge">User History</span>
        <h2>Recent Predictions</h2>
        <p className="section-subtext">
          Your latest placement predictions are saved here securely per account.
        </p>
      </div>

      {loadingHistory ? (
        <p className="muted">Loading prediction history...</p>
      ) : history?.length > 0 ? (
        <div className="history-list">
          {history.map((item) => (
            <div className="history-item" key={item._id}>
              <div className="history-top">
                <span className="history-prediction">{item.prediction}</span>
                <span className="history-confidence">
                  {item.confidence ?? "N/A"}%
                </span>
              </div>

              <div className="history-meta">
                <span>CGPA: {item.inputData?.CGPA ?? "-"}</span>
                <span>Projects: {item.inputData?.Projects_Completed ?? "-"}</span>
                <span>
                  Internship: {item.inputData?.Internship_Experience ?? "-"}
                </span>
              </div>

              <div className="history-bottom">
                <div className="history-date">
                  {new Date(item.createdAt).toLocaleString()}
                </div>

               <button
                 type="button"
                 className="delete-history-btn"
                 onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 onDeleteHistory(item._id);
                 }}
                disabled={deletingId === item._id}
                 >
  {deletingId === item._id ? "Deleting..." : "Delete"}
</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-history">
          <p className="muted">No predictions yet for this account.</p>
        </div>
      )}
    </motion.section>
  );
}