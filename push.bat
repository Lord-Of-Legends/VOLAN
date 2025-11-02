@echo off
setlocal

:: === CONFIGURATION ===
set "REPO_URL=https://github.com/Lord-Of-Legends/VOLAN.git"
set "COMMIT_MSG=Auto deploy: push from current folder"

echo.
echo ============================================
echo   VOLAN Auto Push (Direct to Remote Repo)
echo ============================================
echo.

:: --- Step 1: If no .git folder, initialize repo ---
if not exist ".git" (
    echo Initializing new git repository...
    git init
    git remote add origin %REPO_URL%
) else (
    echo Git repository already exists.
)

:: --- Step 2: Ensure main branch exists ---
git checkout -B main

:: --- Step 3: Add, commit, and push all files ---
git add .
git commit -m "%COMMIT_MSG%"
git branch -M main
git push -f origin main

echo.
echo ✅ All files in this folder have been pushed to %REPO_URL%.
pause
