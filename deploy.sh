#!/bin/bash

cd ~/fixkaput || { echo "❌ Directory ~/fixkaput not found"; exit 1; }

echo "📅 $(date) - Starting deployment process..."

# 📦 Backup .env if it exists
if [ -f .env ]; then
  cp .env /tmp/fixkaput.env.bak
  echo "📦 Backed up .env file"
fi

echo "📥 Fetching latest code from GitHub..."
git fetch origin main

echo "🧨 Resetting local repo to match GitHub (force overwrite)..."
git reset --hard origin/main

# ♻️ Restore .env after reset
if [ -f /tmp/fixkaput.env.bak ]; then
  mv /tmp/fixkaput.env.bak .env
  echo "♻️ Restored .env file"
fi

# ✅ Check if .env exists before continuing
if [ ! -f .env ]; then
  echo "❌ ERROR: .env file not found. Aborting deploy."
  exit 1
fi

# 🔍 Check what changed (from previous HEAD to new HEAD after reset)
CHANGED=$(git diff HEAD@{1} HEAD --name-only)

if [[ -z "$CHANGED" ]]; then
  echo "✅ No changes detected. Skipping Docker restart."
  exit 0
fi

# 🔍 Check for critical files that require rebuild
if echo "$CHANGED" | grep -qE "package.json|Dockerfile|docker-compose.yml|next.config.js"; then
  echo "♻️ Critical file(s) changed: Rebuilding Docker image..."
  sudo docker-compose down
  if sudo docker-compose build --no-cache && sudo docker-compose up -d; then
    echo "✅ Docker rebuild and restart successful."
  else
    echo "❌ Docker build or up failed. Check logs."
    exit 1
  fi
else
  echo "🔄 Non-critical changes: Restarting containers..."
  if sudo docker-compose down && sudo docker-compose up -d; then
    echo "✅ Docker restarted successfully."
  else
    echo "❌ Docker restart failed. Check logs."
    exit 1
  fi
fi

echo "🎉 Deployment completed at $(date)"
