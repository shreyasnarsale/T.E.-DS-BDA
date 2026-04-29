import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, "..", "dataset", "campus.csv");

export const getDatasetAnalytics = () => {
  return new Promise((resolve) => {
    const rows = [];

    if (!fs.existsSync(datasetPath)) {
      console.error("Dataset file not found:", datasetPath);
      return resolve({
        placementData: [],
        avgData: [],
        scatterData: [],
      });
    }

    fs.createReadStream(datasetPath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => {
        try {
          if (!rows.length) {
            return resolve({
              placementData: [],
              avgData: [],
              scatterData: [],
            });
          }

          let placed = 0;
          let notPlaced = 0;
          let totalCGPA = 0;
          let totalIQ = 0;
          let totalComm = 0;
          let totalProjects = 0;

          const scatterData = [];

          for (const row of rows) {
            const cgpa = Number(row.CGPA) || 0;
            const iq = Number(row.IQ) || 0;
            const comm = Number(row.Communication_Skills) || 0;
            const projects = Number(row.Projects_Completed) || 0;
            const isPlaced =
              String(row.Placement).trim().toLowerCase() === "yes";

            if (isPlaced) placed++;
            else notPlaced++;

            totalCGPA += cgpa;
            totalIQ += iq;
            totalComm += comm;
            totalProjects += projects;

            scatterData.push({
              cgpa,
              placement: isPlaced ? 1 : 0,
            });
          }

          const count = rows.length || 1;

          resolve({
            placementData: [
              { name: "Placed", value: placed },
              { name: "Not Placed", value: notPlaced },
            ],
            avgData: [
              { feature: "CGPA", value: Number((totalCGPA / count).toFixed(2)) },
              { feature: "IQ", value: Number((totalIQ / count).toFixed(2)) },
              {
                feature: "Communication",
                value: Number((totalComm / count).toFixed(2)),
              },
              {
                feature: "Projects",
                value: Number((totalProjects / count).toFixed(2)),
              },
            ],
            scatterData,
          });
        } catch (error) {
          console.error("Dataset analytics processing error:", error);
          resolve({
            placementData: [],
            avgData: [],
            scatterData: [],
          });
        }
      })
      .on("error", (error) => {
        console.error("CSV read error:", error);
        resolve({
          placementData: [],
          avgData: [],
          scatterData: [],
        });
      });
  });
};