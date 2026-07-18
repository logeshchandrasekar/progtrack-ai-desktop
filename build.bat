@echo off
title ProgTrack AI — Build Script
color 0A

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║     ProgTrack AI — Desktop Builder       ║
echo  ║     Building your .exe, please wait...   ║
echo  ╚══════════════════════════════════════════╝
echo.

:: Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js not found!
    echo  Please download from: https://nodejs.org
    echo  Install Node.js LTS, then run this script again.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo  [OK] Node.js found: %NODE_VER%

:: Check npm
where npm >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] npm not found. Reinstall Node.js.
    pause
    exit /b 1
)

echo  [OK] npm found
echo.
echo  [1/3] Installing dependencies...
echo  (This downloads ~150MB on first run — normal!)
echo.

call npm install
if errorlevel 1 (
    echo.
    echo  [ERROR] npm install failed. Check your internet connection.
    pause
    exit /b 1
)

echo.
echo  [2/3] Dependencies installed!
echo.
echo  [3/3] Building ProgTrack AI.exe...
echo  (This takes 1-3 minutes)
echo.

call npm run build
if errorlevel 1 (
    echo.
    echo  [ERROR] Build failed. See error above.
    pause
    exit /b 1
)

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║   BUILD COMPLETE!                        ║
echo  ║                                          ║
echo  ║   Your .exe is in the /dist folder:      ║
echo  ║   dist\ProgTrackAI-Portable.exe          ║
echo  ║                                          ║
echo  ║   Double-click it to launch the app!     ║
echo  ╚══════════════════════════════════════════╝
echo.

:: Open the dist folder
explorer dist 2>nul

pause
