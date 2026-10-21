@echo off
cd /d "%~dp0"
py -3 --version >nul 2>&1
if not errorlevel 1 (
    py -3 server.py
    pause
    exit /b
)
python --version >nul 2>&1
if not errorlevel 1 (
    python server.py
    pause
    exit /b
)
echo Python was not found. Opening the offline website directly instead.
echo You can use all conversion and printing features without Python.
start "" "%~dp0index.html"
pause
