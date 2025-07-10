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

# 🔍 Check what changed before resetting
CHANGED=$(git diff HEAD origin/main --name-only)

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

# 🚫 No file changes
if [[ -z "$CHANGED" ]]; then
  echo "✅ No changes detected. Skipping Docker restart."
  exit 0
fi

# 🛠 Critical file changes
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
  # 🔁 Just restart for API/component/page changes
  echo "🔄 Non-critical changes: Restarting containers..."
  if sudo docker-compose down && sudo docker-compose up -d; then
    echo "✅ Docker restarted successfully."
  else
    echo "❌ Docker restart failed. Check logs."
    exit 1
  fi
fi

echo "🎉 Deployment completed at $(date)"
