@echo off
cd %~dp0
echo Installing dependencies with legacy-peer-deps...
npm install --legacy-peer-deps
echo Dependencies installed successfully!
