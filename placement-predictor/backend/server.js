import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ SINGLE CORS (correct)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

// File paths
const modelPath = path.join(__dirname, "model", "placement_model.pkl");
const metricsPath = path.join(__dirname, "model", "model_metrics.json");

// Routes
app.get("/", (req, res) => {
  res.json({ message: "PlacementAI API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    modelExists: fs.existsSync(modelPath),
    metricsExists: fs.existsSync(metricsPath),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", predictionRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});