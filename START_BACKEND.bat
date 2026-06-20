@echo off
title PopEyez Backend
cd /d "%~dp0backend"
echo Installing backend dependencies...
call npm install
echo Seeding database...
call npm run seed
echo Starting backend on http://localhost:5000 ...
call npm start
pause
