import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "..", "dataset", "campus.csv")

df = pd.read_csv(DATASET_PATH)

print("\n=== DATASET SHAPE ===")
print(df.shape)

print("\n=== COLUMNS ===")
print(df.columns.tolist())

if "College_ID" in df.columns:
    df = df.drop(columns=["College_ID"])

print("\n=== TARGET DISTRIBUTION ===")
print(df["Placement"].value_counts())

print("\n=== NUMERIC SUMMARY ===")
print(df.describe())

print("\n=== CORRELATION WITH NUMERIC FEATURES ===")
numeric_df = df.copy()

# Convert target to numeric temporarily
numeric_df["Placement"] = numeric_df["Placement"].map({"No": 0, "Yes": 1})

print(numeric_df.corr(numeric_only=True)["Placement"].sort_values(ascending=False))

print("\n=== GROUPED MEAN BY PLACEMENT ===")
print(df.groupby("Placement").mean(numeric_only=True))

print("\n=== UNIQUE VALUE COUNTS ===")
for col in df.columns:
    print(f"{col}: {df[col].nunique()}")

print("\n=== POSSIBLE LEAKAGE CHECK ===")
for col in df.columns:
    if col == "Placement":
        continue

    grouped = df.groupby(col)["Placement"].nunique()
    if (grouped == 1).all():
        print(f"Potential leakage-like feature: {col}")