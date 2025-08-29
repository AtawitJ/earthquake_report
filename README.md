# 🚨 Earthquake Reporting

Visualize daily earthquake data in Thailand using React and Leaflet with live data from TMD API.

## 🛠 Features

- Interactive map with earthquake markers
- Pulse animation for markers based on magnitude
- Filter by month and date
- Magnitude chart using Chart.js
- Dark/Light mode toggle
- Auto-refresh data

## ⚡ Setup

### Backend (Flask)
1. Create a `.env` file:
   ```bash
   TMD_UID=your_uid
   TMD_UKEY=your_ukey

2. Install dependencies:
   ```bash
   pip install -r requirements.txt

3. Run backend:
   ```bash
   python app.py
   
### Frontend (React)
1. Install dependencies:
     ```bash
     npm install

2. Start app:
    ```bash
    npm start

## Running the Project

This project provides a `run.bat` script to start both the backend (Flask API) and frontend (React app) simultaneously on Windows.



## 🔗 Credits

Created by AtawitJ

Data from Thailand Meteorological Department (TMD)

## 📄 License
MIT License
