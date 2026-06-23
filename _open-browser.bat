@echo off
rem Helper: wait until the dev server responds, then open the browser.
:loop
curl -s -o nul http://localhost:5173/
if %errorlevel%==0 goto open
timeout /t 1 /nobreak >nul
goto loop
:open
start "" http://localhost:5173/
exit /b 0
