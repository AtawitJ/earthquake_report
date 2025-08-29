@echo off
CALL conda activate disaster

REM Start Flask
cd backend
start "Flask Server" cmd /c "python app.py"

REM Start React
cd ../frontend
start "React App" cmd /c "npm start"
