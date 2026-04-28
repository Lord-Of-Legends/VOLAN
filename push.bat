@echo off
set GIT_NAME=Simdi Chukwusimdi
set GIT_EMAIL=lordoflegends107@gmail.com
set REPO_URL=https://github.com/Lord-Of-Legends/VOLAN.git

echo ──────────────────────────────────────────
echo  VØLAN - GitHub Push Utility
echo ──────────────────────────────────────────

:: Set Git Identity
git config user.name "%GIT_NAME%"
git config user.email "%GIT_EMAIL%"

:: Check if git is initialized
if not exist .git (
    echo [!] Initializing new Git repository...
    git init
)

:: Add changes
echo [+] Adding changes...
git add .

:: Commit
set /p msg="Enter commit message (or press Enter for 'update'): "
if "%msg%"=="" set msg=update
echo [*] Committing: %msg%
git commit -m "%msg%"

:: Set Branch
git branch -M main

:: Remote setup
git remote remove origin >nul 2>&1
git remote add origin "%REPO_URL%"

:: Push
echo [^>] Pushing to GitHub...
git push -u origin main

echo ──────────────────────────────────────────
echo  SUCCESS: Your changes are live!
echo ──────────────────────────────────────────
pause
