@echo off
title English Learn App

echo.
echo  Starting English Learn App dev server...
echo  (First launch may take 10-30 seconds. The browser opens automatically.)
echo.

rem Background helper: opens the browser once the server is ready
start "Browser Opener" /min cmd /c _open-browser.bat

rem Run the dev server in THIS window (errors stay visible; close window to stop)
wsl --cd "/mnt/d/workspace/english-learn-app" -e bash -lc "npm run dev -- --host"

echo.
echo  Server stopped. Press any key to close this window.
pause >nul
