#!/bin/bash

# Configurable: DEPLOY_ROOT, BRANCH, DOCKER_CMD (e.g. DOCKER_CMD="sudo docker-compose")
DEPLOY_ROOT="${DEPLOY_ROOT:-$HOME/fixkaput}"
BRANCH="${DEPLOY_BRANCH:-main}"
DOCKER_CMD="${DOCKER_CMD:-docker-compose}"

cd "$DEPLOY_ROOT" || { echo "❌ Directory $DEPLOY_ROOT not found"; exit 1; }

echo "📅 $(date) - Starting deployment process..."
echo "📂 Deploy root: $DEPLOY_ROOT | Branch: $BRANCH"

# 📦 Backup .env if it exists
if [ -f .env ]; then
  cp .env /tmp/fixkaput.env.bak
  echo "📦 Backed up .env file"
fi

echo "📥 Fetching latest code from GitHub..."
git fetch origin "$BRANCH"

# 🔍 Check what changed before resetting
CHANGED=$(git diff HEAD origin/"$BRANCH" --name-only)

echo "🧨 Resetting local repo to match GitHub (force overwrite)..."
git reset --hard origin/"$BRANCH"

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

# 🛠 Critical file changes (require full rebuild)
if echo "$CHANGED" | grep -qE "package(-lock)?\.json|Dockerfile|docker-compose\.yml|next\.config\.(js|mjs)|middleware\.(js|ts)"; then
  echo "♻️ Critical file(s) changed: Rebuilding Docker image..."
  $DOCKER_CMD down
  if $DOCKER_CMD build --no-cache && $DOCKER_CMD up -d; then
    echo "✅ Docker rebuild and restart successful."
  else
    echo "❌ Docker build or up failed. Check logs."
    exit 1
  fi
else
  # 🔁 Just restart for API/component/page changes
  echo "🔄 Non-critical changes: Restarting containers..."
  if $DOCKER_CMD down && $DOCKER_CMD up -d; then
    echo "✅ Docker restarted successfully."
  else
    echo "❌ Docker restart failed. Check logs."
    exit 1
  fi
fi

echo "🎉 Deployment completed at $(date)"
