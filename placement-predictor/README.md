# 🎓 Student Placement Prediction System

A **full-stack machine learning web application** that predicts student placement status using multiple ML algorithms.
Built with **React (Vite), Node.js, Express, Python, and scikit-learn**.

---

## 🚀 Features

* 🔮 Predict student placement status
* 📊 Compare multiple ML algorithms
* 📈 Interactive dashboard with graphs
* 📤 Export metrics for Tableau
* ⚙️ Full-stack integration (Frontend + Backend + ML)

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* HTML, CSS, JavaScript
* Chart libraries

### Backend

* Node.js
* Express.js

### Machine Learning

* Python
* scikit-learn
* Pandas, NumPy

---

## 📂 Project Structure

```bash
placement-predictor/
│
├── backend/
│   ├── dataset/
│   ├── middleware/
│   ├── ml/
│   ├── model/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
```

---

## 📊 Dataset Setup

Place your dataset file here:

```bash
backend/dataset/campus.csv
```

---

# ⚙️ Backend Setup

### 1️⃣ Go to backend folder

```bash
cd backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Install Python requirements

```bash
cd ml
pip install -r requirements.txt
```

### 4️⃣ Train ML model

```bash
python train_model.py
```

### 5️⃣ Start backend server

```bash
cd ..
node server.js
```

✅ Backend will run on:

```
http://localhost:5000
```

---

# 🌐 Frontend Setup

### 1️⃣ Go to frontend folder

```bash
cd frontend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Start frontend

```bash
npm run dev
```

✅ Frontend will run on:

```
http://localhost:5173
```

---

## 🔗 How It Works

1. Frontend (React) sends user input
2. Backend (Node.js) processes request
3. Python ML model predicts result
4. Backend sends response
5. Frontend displays prediction + graphs

---

## 🔐 Environment Variables

Create `.env` file inside `backend/`:

```bash
PORT=5000
MONGO_URI=your_database_url
```

---

## 📈 Output

* Placement Prediction (Placed / Not Placed)
* Model Accuracy & Metrics
* Graphical Dashboard
* Exportable data for Tableau

---

## 📌 Future Improvements

* Add authentication system
* Deploy on cloud (AWS / Render / Vercel)
* Add more ML models
* Improve UI/UX

---

## 👨‍💻 Author

**Shreyas Narsale**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
