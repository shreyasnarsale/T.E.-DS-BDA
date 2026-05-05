# 🚔 Crime Analysis Dashboard (India)

## 📌 Overview

This project is a **Crime Analysis Dashboard** built using **Python, Streamlit, and Machine Learning (ARIMA Time Series)**.
It analyzes crime data based on **city, crime type, and time**, and predicts future crime trends.

---

## 🎯 Objectives

* Analyze crime trends over time
* Visualize crime distribution across cities
* Forecast future crime using Time Series (ARIMA)
* Build an interactive dashboard

---

## 🛠️ Technologies Used

* Python
* Pandas
* NumPy
* Streamlit
* Plotly
* Statsmodels (ARIMA)

---

## 📂 Dataset

The dataset contains crime-related information such as:

* Report Number
* Date Reported
* Date of Occurrence
* City
* Crime Description
* Victim Age & Gender
* Weapon Used
* Crime Domain
* Case Status

---

## ⚙️ Features

* 📊 Interactive Dashboard
* 📈 Crime Trend Visualization
* 🏙️ City-wise Crime Comparison
* 🔍 Filter by City & Crime Type
* 🔮 Time Series Forecasting (ARIMA)

---

## 🔄 Workflow

1. **Data Collection**

   * Crime dataset (CSV format)

2. **Data Preprocessing**

   * Convert dates to datetime format
   * Extract year
   * Handle missing values
   * Rename columns

3. **Data Analysis**

   * Group data by year, city, and crime type
   * Generate insights

4. **Visualization**

   * Line charts (trend analysis)
   * Bar charts (distribution)

5. **Time Series Forecasting**

   * Apply ARIMA model
   * Predict next 3 years of crime

---

## ▶️ How to Run

### Step 1: Install Dependencies

```bash
pip install pandas streamlit plotly statsmodels numpy
```

### Step 2: Run the App

```bash
streamlit run app.py
```

---

## 📊 Output

* Crime trends over years
* City-wise crime comparison
* Forecasted crime data for future years

---

## 🔮 Time Series Model

* Model Used: **ARIMA(1,1,1)**
* Purpose: Predict future crime trends based on historical data

---

## ⚠️ Limitations

* Dataset size may be limited
* Predictions depend on available historical data
* No real-time data integration

---

## 🚀 Future Scope

* Add real-time crime data
* Use advanced ML models (LSTM, Prophet)
* Deploy as a web application
* Add crime hotspot detection

---

## 👨‍💻 Author

Shreyas Narsale

---

## 📌 Conclusion

This project demonstrates how **data analytics and time series forecasting** can be used to understand and predict crime trends, helping in better decision-making and planning.
