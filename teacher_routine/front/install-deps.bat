@echo off
echo Installing dependencies with --legacy-peer-deps flag...
cd /d "%~dp0"
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
  echo Trying with --force flag instead...
  npm install --force
)
echo.
echo Installation completed. Check the output for any errors.
pause
