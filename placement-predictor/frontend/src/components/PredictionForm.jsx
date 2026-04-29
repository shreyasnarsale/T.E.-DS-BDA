import { useState } from "react";
import { motion } from "framer-motion";

const initialState = {
  IQ: "",
  Prev_Sem_Result: "",
  CGPA: "",
  Internship_Experience: "No",
  Extra_Curricular_Score: "",
  Communication_Skills: "",
  Projects_Completed: "",
};

export default function PredictionForm({ onPredict, loading }) {
  const [formData, setFormData] = useState(initialState);

  const numericFields = [
    "IQ",
    "Prev_Sem_Result",
    "CGPA",
    "Extra_Curricular_Score",
    "Communication_Skills",
    "Projects_Completed",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict(formData);
  };

  return (
    <motion.section
      className="card prediction-card"
      id="predict"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div className="section-head">
        <span className="mini-badge">Student Input</span>
        <h2>Enter Student Details</h2>
        <p className="section-subtext">
          Fill the academic and profile information to generate a placement
          prediction.
        </p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          IQ
          <input
            type="number"
            name="IQ"
            min="70"
            max="160"
            step="1"
            placeholder="Enter IQ"
            value={formData.IQ}
            onChange={handleChange}
            required
          />
          <span className="input-hint">Range: 70 - 160</span>
        </label>

        <label>
          Previous Semester Result
          <input
            type="number"
            name="Prev_Sem_Result"
            min="0"
            max="100"
            step="0.01"
            placeholder="Enter percentage"
            value={formData.Prev_Sem_Result}
            onChange={handleChange}
            required
          />
          <span className="input-hint">Range: 0 - 100</span>
        </label>

        <label>
          CGPA
          <input
            type="number"
            name="CGPA"
            min="0"
            max="10"
            step="0.01"
            placeholder="Enter CGPA"
            value={formData.CGPA}
            onChange={handleChange}
            required
          />
          <span className="input-hint">Range: 0 - 10</span>
        </label>

        <label>
          Internship Experience
          <select
            name="Internship_Experience"
            value={formData.Internship_Experience}
            onChange={handleChange}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
          <span className="input-hint">Select Yes or No</span>
        </label>

        <label>
          Extra Curricular Score
          <input
            type="number"
            name="Extra_Curricular_Score"
            min="0"
            max="10"
            step="1"
            placeholder="Enter score"
            value={formData.Extra_Curricular_Score}
            onChange={handleChange}
            required
          />
          <span className="input-hint">Range: 0 - 10</span>
        </label>

        <label>
          Communication Skills
          <input
            type="number"
            name="Communication_Skills"
            min="0"
            max="10"
            step="1"
            placeholder="Enter score"
            value={formData.Communication_Skills}
            onChange={handleChange}
            required
          />
          <span className="input-hint">Range: 0 - 10</span>
        </label>

        <label>
          Projects Completed
          <input
            type="number"
            name="Projects_Completed"
            min="0"
            max="10"
            step="1"
            placeholder="Enter number of projects"
            value={formData.Projects_Completed}
            onChange={handleChange}
            required
          />
          <span className="input-hint">Range: 0 - 10</span>
        </label>

        <button
          type="submit"
          className="primary-btn premium-predict-btn"
          disabled={loading}
        >
          {loading ? (
            <span className="btn-loading-content">
              <span className="btn-spinner" />
              <span>Analyzing Profile...</span>
            </span>
          ) : (
            "Predict Placement"
          )}
        </button>
      </form>
    </motion.section>
  );
}