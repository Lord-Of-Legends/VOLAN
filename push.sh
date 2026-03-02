#!/bin/bash

# ──────────────────────────────
# Force Push React Project to GitHub
# ──────────────────────────────

# Set your GitHub info
GIT_NAME="Simdi Chukwusimdi"
GIT_EMAIL="lordoflegends107@gmail.com"
REPO_URL="https://github.com/Lord-Of-Legends/VOLAN.git"

echo "Setting Git user..."
git config user.name "$GIT_NAME"
git config user.email "$GIT_EMAIL"

# Initialize Git if not already
if [ ! -d ".git" ]; then
  echo "Initializing new Git repository..."
  git init
fi

echo "Adding all files..."
git add .

echo "Committing changes..."
git commit -m "Force push: overwrite previous repo content"

echo "Setting branch to main..."
git branch -M main

echo "Adding remote..."
git remote remove origin 2> /dev/null
git remote add origin "$REPO_URL"

echo "⚠️ Warning: This will overwrite all content in the remote repository!"
echo "Pushing to GitHub..."
git push -f origin main

echo "✅ Done! All previous content has been replaced with your local project."