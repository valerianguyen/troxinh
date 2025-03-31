@echo off
set "projectDir=%~dp0"

REM Install package dependencies
echo Installing package dependencies...
echo Installing client dependencies...

REM Run the project
echo Running the project...
start "Client" cmd /k "cd "%projectDir%\client\"& npm run dev"
start "Server" cmd /k "cd "%projectDir%\server\"& npm run dev"
start "Server AI" cmd /k "cd "%projectDir%\server_ai\"& venn\Scripts\activate.bat & python main.py"