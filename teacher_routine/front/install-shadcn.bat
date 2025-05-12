@echo off
echo Installing shadcn/ui dependencies using PowerShell script...
powershell -ExecutionPolicy Bypass -File "%~dp0install-shadcn.ps1"
pause
