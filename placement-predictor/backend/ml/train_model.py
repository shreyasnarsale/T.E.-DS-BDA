import json
import os
import joblib
import pandas as pd
import warnings

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression

warnings.filterwarnings("ignore")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "..", "dataset", "campus.csv")
MODEL_DIR = os.path.join(BASE_DIR, "..", "model")

os.makedirs(MODEL_DIR, exist_ok=True)

# ================= LOAD DATA =================
print("Training model from CSV...\n")
print("Dataset path:", DATASET_PATH)

df = pd.read_csv(DATASET_PATH)

print("Original rows:", len(df))
print("Original columns:", df.columns.tolist())
print("\nFirst 5 rows from CSV:")
print(df.head())

before_drop = len(df)
df = df.drop_duplicates()
after_drop = len(df)

print("\nTotal rows after duplicate removal:", after_drop)
print("Duplicate rows removed:", before_drop - after_drop)
print("-" * 60)

# Clean column names
df.columns = [col.strip() for col in df.columns]

# Drop ID-like columns
id_like_cols = [
    col for col in df.columns
    if col.lower() in ["college_id", "id", "student_id"]
]
if id_like_cols:
    df = df.drop(columns=id_like_cols)
    print("Dropped ID columns:", id_like_cols)

# Drop likely leakage / derived columns
leakage_like_cols = [
    col for col in df.columns
    if col.lower() in ["academic_performance", "final_result", "result_status"]
]
if leakage_like_cols:
    df = df.drop(columns=leakage_like_cols)
    print("Dropped leakage-like columns:", leakage_like_cols)

TARGET_COL = "Placement"
if TARGET_COL not in df.columns:
    raise ValueError(f"Target column '{TARGET_COL}' not found in dataset.")

# Remove rows with missing target
df = df.dropna(subset=[TARGET_COL])

print("\nFinal dataset shape used for training:", df.shape)
print("-" * 60)

# ================= FEATURES / TARGET =================
X = df.drop(columns=[TARGET_COL])
y = df[TARGET_COL].astype(str).str.strip()

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

print("Encoded target classes:", list(label_encoder.classes_))
print("\nFeatures used for training:")
for col in X.columns:
    print("-", col)
print("-" * 60)

numeric_features = X.select_dtypes(include=["int64", "float64"]).columns.tolist()
categorical_features = X.select_dtypes(exclude=["int64", "float64"]).columns.tolist()

# ================= PREPROCESSING =================
numeric_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer(transformers=[
    ("num", numeric_transformer, numeric_features),
    ("cat", categorical_transformer, categorical_features)
])

# ================= MODEL =================
model_name = "Logistic Regression"

pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(
        max_iter=1000,
        C=0.4,
        random_state=42
    ))
])

# ================= TRAIN TEST SPLIT =================
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# ================= TRAIN =================
pipeline.fit(X_train, y_train)

predictions = pipeline.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

cv_scores = cross_val_score(
    pipeline,
    X_train,
    y_train,
    cv=cv,
    scoring="accuracy",
    n_jobs=None
)

cv_mean = cv_scores.mean()
cv_std = cv_scores.std()

report = classification_report(y_test, predictions, output_dict=True, zero_division=0)
cm = confusion_matrix(y_test, predictions)

print(f"{model_name} Accuracy: {accuracy:.4f}")
print(f"{model_name} CV Mean Accuracy: {cv_mean:.4f}")
print(f"{model_name} CV Std Accuracy: {cv_std:.4f}")
print("-" * 50)

print(f"\nUsing {model_name} as final model for prediction...")

# ================= SAVE MODEL =================
joblib.dump(pipeline, os.path.join(MODEL_DIR, "placement_model.pkl"))
joblib.dump(label_encoder, os.path.join(MODEL_DIR, "label_encoder.pkl"))

# ================= FEATURE NAMES =================
feature_names = []
preprocessor_fitted = pipeline.named_steps["preprocessor"]

if numeric_features:
    feature_names.extend(numeric_features)

if categorical_features:
    encoder = preprocessor_fitted.named_transformers_["cat"].named_steps["onehot"]
    cat_names = encoder.get_feature_names_out(categorical_features).tolist()
    feature_names.extend(cat_names)

with open(os.path.join(MODEL_DIR, "feature_names.json"), "w", encoding="utf-8") as f:
    json.dump(feature_names, f, indent=2)

# ================= SAVE METRICS =================
with open(os.path.join(MODEL_DIR, "model_metrics.json"), "w", encoding="utf-8") as f:
    json.dump({
        "bestModel": model_name,
        "bestAccuracy": round(float(accuracy), 4),
        "bestCvMeanAccuracy": round(float(cv_mean), 4),
        "bestCvStdAccuracy": round(float(cv_std), 4),
        "models": [
            {
                "model": model_name,
                "accuracy": round(float(accuracy), 4),
                "cvMeanAccuracy": round(float(cv_mean), 4),
                "cvStdAccuracy": round(float(cv_std), 4),
                "precision_0": round(float(report.get("0", {}).get("precision", 0)), 4),
                "recall_0": round(float(report.get("0", {}).get("recall", 0)), 4),
                "precision_1": round(float(report.get("1", {}).get("precision", 0)), 4),
                "recall_1": round(float(report.get("1", {}).get("recall", 0)), 4),
            }
        ],
        "confusionMatrix": cm.tolist(),
        "classificationReport": {
            "precision_0": round(float(report.get("0", {}).get("precision", 0)), 4),
            "recall_0": round(float(report.get("0", {}).get("recall", 0)), 4),
            "precision_1": round(float(report.get("1", {}).get("precision", 0)), 4),
            "recall_1": round(float(report.get("1", {}).get("recall", 0)), 4),
            "accuracy": round(float(report.get("accuracy", 0)), 4)
        }
    }, f, indent=2)

# ================= FEATURE IMPORTANCE =================
feature_importance = []
classifier = pipeline.named_steps["classifier"]

if hasattr(classifier, "coef_"):
    coefficients = classifier.coef_[0]

    feature_importance = [
        {
            "feature": feature_names[i],
            "importance": round(float(abs(coefficients[i])), 6)
        }
        for i in range(len(feature_names))
    ]

    feature_importance = sorted(
        feature_importance,
        key=lambda x: x["importance"],
        reverse=True
    )[:12]

with open(os.path.join(MODEL_DIR, "feature_importance.json"), "w", encoding="utf-8") as f:
    json.dump(feature_importance, f, indent=2)

print("\nModel saved successfully!")
print(f"Best model: {model_name}")
print(f"Best accuracy: {accuracy:.4f}")
print(f"Best CV mean accuracy: {cv_mean:.4f}")
print(f"Best CV std accuracy: {cv_std:.4f}")
print(f"Saved in: {MODEL_DIR}")

print("\n[CONFIRMATION]")
print("This model was trained directly from campus.csv after preprocessing.")
print("No artificial noise was added to the dataset.")