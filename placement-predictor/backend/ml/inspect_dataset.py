import pandas as pd

DATASET_PATH = "../dataset/campus.csv"

df = pd.read_csv(DATASET_PATH)

print("Columns:")
for col in df.columns:
    print(col)

print("\nHead:")
print(df.head())