@echo off
title PopEyez Project Launcher
start "PopEyez Backend" cmd /k "cd /d "%~dp0backend" && npm install && npm run seed && npm start"
timeout /t 4 /nobreak > nul
start "PopEyez Frontend" cmd /k "cd /d "%~dp0frontend" && npm install && npm run dev"
echo Backend and frontend windows opened.
echo Backend: http://localhost:5000/api/health
echo Frontend: usually http://localhost:5173
pause
