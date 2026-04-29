import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import Prediction from "../models/Prediction.js";
import { protect } from "../middleware/authMiddleware.js";
import { getDatasetAnalytics } from "../utils/datasetAnalytics.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.join(__dirname, "..");

const metricsPath = path.join(backendRoot, "model", "model_metrics.json");
const featureNamesPath = path.join(backendRoot, "model", "feature_names.json");
const featureImportancePath = path.join(
  backendRoot,
  "model",
  "feature_importance.json"
);

// ================= ANALYTICS =================
router.get("/analytics", async (req, res) => {
  try {
    const metrics = fs.existsSync(metricsPath)
      ? JSON.parse(fs.readFileSync(metricsPath, "utf-8"))
      : {
          bestModel: "N/A",
          bestAccuracy: 0,
          bestCvMeanAccuracy: 0,
          bestCvStdAccuracy: 0,
          models: [],
          confusionMatrix: [
            [0, 0],
            [0, 0],
          ],
        };

    const features = fs.existsSync(featureNamesPath)
      ? JSON.parse(fs.readFileSync(featureNamesPath, "utf-8"))
      : [];

    const featureImportance = fs.existsSync(featureImportancePath)
      ? JSON.parse(fs.readFileSync(featureImportancePath, "utf-8"))
      : [];

    const datasetStats = await getDatasetAnalytics();

    return res.json({
      metrics,
      features,
      featureImportance,
      datasetStats,
    });
  } catch (error) {
    console.error("Analytics route error:", error);
    return res.status(500).json({
      error: "Failed to load analytics",
      details: error.message,
    });
  }
});

// ================= PREDICT =================
router.post("/predict", protect, async (req, res) => {
  try {
    const inputData = req.body;

    const pythonCommand = process.platform === "win32" ? "py" : "python3";

    const python = spawn(pythonCommand, [
      path.join(backendRoot, "ml", "predict_once.py"),
      JSON.stringify(inputData),
    ]);

    let result = "";
    let err = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      err += data.toString();
    });

    python.on("close", async (code) => {
      if (code !== 0) {
        console.error("Python prediction failed:", err || result);
        return res.status(500).json({
          error: "Prediction failed",
          details: err || result || "Python process failed",
        });
      }

      try {
        const parsed = JSON.parse(result);

        if (parsed.error) {
          return res.status(400).json({
            error: parsed.error,
          });
        }

        const cgpa = Number(inputData.CGPA || 0);
        const projects = Number(inputData.Projects_Completed || 0);
        const communication = Number(inputData.Communication_Skills || 0);
        const prevSem = Number(inputData.Prev_Sem_Result || 0);
        const extra = Number(inputData.Extra_Curricular_Score || 0);
        const iq = Number(inputData.IQ || 0);
        const internship = String(
          inputData.Internship_Experience || ""
        ).toLowerCase();

        const weakSignals = [];
        const topFactors = [];

        if (cgpa >= 7.5) {
          topFactors.push({
            feature: "CGPA",
            impact: "Strong academic signal",
          });
        } else if (cgpa >= 6) {
          topFactors.push({
            feature: "CGPA",
            impact: "Average academic signal",
          });
        } else {
          topFactors.push({
            feature: "CGPA",
            impact: "Needs improvement",
          });
          weakSignals.push("low CGPA");
        }

        if (projects >= 3) {
          topFactors.push({
            feature: "Projects",
            impact: "Strong practical profile",
          });
        } else if (projects >= 1) {
          topFactors.push({
            feature: "Projects",
            impact: "Average contribution",
          });
        } else {
          topFactors.push({
            feature: "Projects",
            impact: "Weak profile signal",
          });
          weakSignals.push("few projects");
        }

        if (communication >= 7) {
          topFactors.push({
            feature: "Communication",
            impact: "Good communication",
          });
        } else if (communication >= 5) {
          topFactors.push({
            feature: "Communication",
            impact: "Average communication",
          });
        } else {
          topFactors.push({
            feature: "Communication",
            impact: "Needs improvement",
          });
          weakSignals.push("low communication");
        }

        if (internship === "yes") {
          topFactors.push({
            feature: "Internship",
            impact: "Practical experience advantage",
          });
        } else {
          topFactors.push({
            feature: "Internship",
            impact: "No internship advantage",
          });
          weakSignals.push("no internship");
        }

        if (prevSem < 60) weakSignals.push("low semester score");
        if (extra < 4) weakSignals.push("low extra-curricular score");
        if (iq < 85) weakSignals.push("low IQ range");

        let finalPrediction = parsed.prediction;
        let finalConfidence = parsed.confidence ?? 70;

        const veryWeakProfile =
          cgpa < 5.5 &&
          prevSem < 60 &&
          communication < 5 &&
          projects < 1 &&
          internship === "no";

        if (veryWeakProfile) {
          finalPrediction = "No";
          finalConfidence = 86;
        }

        let summary = "";
        const predictionLabel = String(finalPrediction).toLowerCase();

        if (predictionLabel === "yes") {
          if (weakSignals.length >= 3) {
            summary =
              "The model predicts a possible placement outcome, but the profile still shows weaker areas in academics, communication, projects, or internship exposure.";
          } else {
            summary =
              "The model found a reasonably strong placement profile based on academics, communication, and practical readiness.";
          }
        } else {
          summary =
            "The model found weaker readiness signals. Improving academics, projects, communication, and internship exposure can strengthen the profile.";
        }

        const saved = await Prediction.create({
          user: req.user._id,
          inputData,
          prediction: finalPrediction,
          confidence: finalConfidence,
        });

        const explanation = {
          topFactors,
          summary,
        };

        return res.json({
          prediction: finalPrediction,
          confidence: finalConfidence,
          historyId: saved._id,
          explanation,
        });
      } catch (parseError) {
        console.error("Prediction parse error:", parseError);
        return res.status(500).json({
          error: "Invalid prediction response",
          details: result,
        });
      }
    });
  } catch (error) {
    console.error("Predict route error:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

// ================= HISTORY =================
router.get("/history", protect, async (req, res) => {
  try {
    const history = await Prediction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json(history);
  } catch (error) {
    console.error("History fetch error:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
});

// ================= DELETE HISTORY =================
router.delete("/history/:id", protect, async (req, res) => {
  try {
    console.log("Delete request received for history id:", req.params.id);
    console.log("Delete request user id:", req.user._id.toString());

    const existing = await Prediction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!existing) {
      console.log("History item not found for this user.");
      return res.status(404).json({
        error: "History item not found",
      });
    }

    await Prediction.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });

    console.log("History item deleted successfully.");

    return res.json({
      message: "History item deleted successfully",
      deletedId: req.params.id,
    });
  } catch (error) {
    console.error("Delete route error:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
});

export default router;