# Student Placement Prediction System
A full stack machine learning application using React, Node.js, Express, Python,
and scikit-learn.
## Features
- Predict placement status
- Compare multiple ML algorithms
- Show graphs in frontend dashboard
- Export metrics for Tableau dashboard
## Dataset setup
Copy your campus recruitment CSV to:
backend/dataset/campus.csv
## Backend setup
```bash
cd backend
npm install
cd ml
pip install -r requirements.txt
python train_model.py
cd ..
node server.js