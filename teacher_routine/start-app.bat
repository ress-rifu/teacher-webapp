@echo off
echo Starting Teacher Webapp...

echo Starting Backend Server...
start cmd /k "cd c:\Users\RIFU\Documents\GitHub\teacher-webapp\teacher_routine\back && npm start"

echo Starting Frontend Server...
cd c:\Users\RIFU\Documents\GitHub\teacher-webapp\teacher_routine\front
npm run dev

pause
