@echo off
echo Starting both frontend and backend servers

REM Start backend in a new window
start cmd /k "cd /d %~dp0back && npm start"

REM Wait for a moment to allow backend to start
timeout /t 5

REM Start frontend in the current window
cd /d %~dp0front
npm run dev

pause
