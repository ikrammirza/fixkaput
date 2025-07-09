#!/bin/bash

cd ~/fixkaput
git fetch origin main
CHANGED=$(git diff HEAD origin/main --name-only)

if [[ -z "$CHANGED" ]]; then
  echo "✅ No changes detected. Skipping deploy."
  exit 0
fi

git pull origin main

# Check for files that require full rebuild
if echo "$CHANGED" | grep -qE "package.json|Dockerfile|docker-compose.yml|next.config.js"; then
  echo "♻️ Critical file(s) changed. Rebuilding Docker image..."
  sudo docker-compose down
  sudo docker-compose build --no-cache
  sudo docker-compose up -d
else
  echo "🔄 Non-critical changes. Restarting Docker containers..."
  sudo docker-compose down
  sudo docker-compose up -d
fi
