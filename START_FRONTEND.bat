@echo off
title PopEyez Frontend
cd /d "%~dp0frontend"
echo Installing frontend dependencies...
call npm install
echo Starting frontend. Open the Vite URL shown below, usually http://localhost:5173 ...
call npm run dev
pause
