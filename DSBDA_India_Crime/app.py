import pandas as pd
import streamlit as st
import plotly.express as px
from statsmodels.tsa.arima.model import ARIMA
import numpy as np

# =========================
# LOAD DATA
# =========================
df = pd.read_csv("crime_dataset_india.csv")

# Clean column names
df.columns = df.columns.str.strip()

# =========================
# PREPROCESSING
# =========================

# Convert date column
df["Date Reported"] = pd.to_datetime(df["Date Reported"], errors='coerce')

# Remove invalid dates
df = df.dropna(subset=["Date Reported"])

# Extract Year
df["Year"] = df["Date Reported"].dt.year

# Rename columns for easier use
df.rename(columns={
    "City": "State",
    "Crime Description": "Crime_Type"
}, inplace=True)

# Create Cases column
df["Cases"] = 1

# Group data (for dashboard)
df_grouped = df.groupby(["Year", "State", "Crime_Type"])["Cases"].sum().reset_index()

# =========================
# STREAMLIT UI
# =========================

st.title("Crime Analysis Dashboard")

# Show raw data
if st.checkbox("Show Raw Data"):
    st.write(df.head())

# Sidebar filters
state = st.sidebar.selectbox("Select City", df_grouped["State"].unique())
crime = st.sidebar.selectbox("Select Crime Type", df_grouped["Crime_Type"].unique())

# Filtered data
filtered_df = df_grouped[
    (df_grouped["State"] == state) &
    (df_grouped["Crime_Type"] == crime)
]

# =========================
# VISUALIZATION
# =========================

st.subheader("Crime Trend")
fig = px.line(filtered_df, x="Year", y="Cases", markers=True)
st.plotly_chart(fig)

st.subheader("Crime Distribution")
fig2 = px.bar(filtered_df, x="Year", y="Cases")
st.plotly_chart(fig2)

st.subheader("City Comparison")
fig3 = px.bar(df_grouped, x="State", y="Cases", color="Crime_Type")
st.plotly_chart(fig3)

# =========================
# TIME SERIES 
# =========================

st.subheader("Overall Crime Forecast (Time Series - ARIMA)")

# Create yearly total data 
ts_data = df.groupby("Year")["Cases"].sum().reset_index()
ts_data = ts_data.sort_values("Year")

# Show actual trend
fig_ts = px.line(ts_data, x="Year", y="Cases", title="Actual Crime Trend", markers=True)
st.plotly_chart(fig_ts)

# Apply ARIMA
data = ts_data["Cases"]

if len(data) > 3:
    try:
        model = ARIMA(data, order=(1,1,1))
        model_fit = model.fit()

        forecast = model_fit.forecast(steps=3)

        # Future years
        future_years = np.arange(ts_data["Year"].max()+1, ts_data["Year"].max()+4)

        forecast_df = pd.DataFrame({
            "Year": future_years,
            "Cases": forecast
        })

        st.write("Predicted Future Crime Cases:")
        st.write(forecast_df)

        # Combine graph
        fig_forecast = px.line(ts_data, x="Year", y="Cases", markers=True, title="Actual vs Forecast")

        fig_forecast.add_scatter(
            x=forecast_df["Year"],
            y=forecast_df["Cases"],
            mode='lines+markers',
            name="Forecast"
        )

        st.plotly_chart(fig_forecast)

    except Exception as e:
        st.write("Error in forecasting:", e)
else:
    st.write("Not enough data for time series (need at least 4 years)")


