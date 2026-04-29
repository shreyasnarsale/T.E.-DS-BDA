import json
import os
import sys
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "..", "model")

MODEL_PATH = os.path.join(MODEL_DIR, "placement_model.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

REQUIRED_FIELDS = [
    "IQ",
    "Prev_Sem_Result",
    "CGPA",
    "Internship_Experience",
    "Extra_Curricular_Score",
    "Communication_Skills",
    "Projects_Completed",
]

NUMERIC_FIELDS = [
    "IQ",
    "Prev_Sem_Result",
    "CGPA",
    "Extra_Curricular_Score",
    "Communication_Skills",
    "Projects_Completed",
]


def fail(message: str):
    print(json.dumps({"error": message}))
    sys.exit(1)


def main():
    if not os.path.exists(MODEL_PATH):
        fail(f"Model file not found: {MODEL_PATH}")

    if not os.path.exists(ENCODER_PATH):
        fail(f"Label encoder file not found: {ENCODER_PATH}")

    if len(sys.argv) < 2:
        fail("No input data provided to prediction script.")

    try:
        raw_input = sys.argv[1]
        data = json.loads(raw_input)
    except json.JSONDecodeError:
        fail("Invalid JSON input provided.")

    if not isinstance(data, dict):
        fail("Input must be a JSON object.")

    for field in REQUIRED_FIELDS:
        if field not in data:
            fail(f"Missing required field: {field}")

    cleaned_data = {}

    try:
        for field in NUMERIC_FIELDS:
            cleaned_data[field] = float(data[field])

        cleaned_data["Internship_Experience"] = str(
            data["Internship_Experience"]
        ).strip().title()

        if cleaned_data["Internship_Experience"] not in ["Yes", "No"]:
            fail("Internship_Experience must be 'Yes' or 'No'.")
    except ValueError:
        fail("One or more numeric fields contain invalid values.")

    try:
        model = joblib.load(MODEL_PATH)
        label_encoder = joblib.load(ENCODER_PATH)
    except Exception as error:
        fail(f"Failed to load model files: {str(error)}")

    try:
        input_df = pd.DataFrame([cleaned_data])

        pred = model.predict(input_df)[0]
        label = label_encoder.inverse_transform([pred])[0]

        confidence = None
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(input_df)[0]
            raw_confidence = float(max(proba)) * 100
            confidence = round(min(max(raw_confidence, 58), 91), 2)

        print(json.dumps({
            "prediction": str(label),
            "confidence": confidence
        }))
    except Exception as error:
        fail(f"Prediction pipeline failed: {str(error)}")


if __name__ == "__main__":
    main()