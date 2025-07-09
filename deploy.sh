#!/bin/bash

cd ~/fixkaput
git fetch origin main
CHANGED=$(git diff HEAD origin/main --name-only)

if [[ -z "$CHANGED" ]]; then
  echo "No changes. Skipping deploy."
  exit 0
fi

git pull origin main

if echo "$CHANGED" | grep -qE "package.json|Dockerfile"; then
  echo "Rebuilding Docker image..."
  sudo docker-compose down
  sudo docker-compose build --no-cache
  sudo docker-compose up -d
else
  echo "Just restarting Docker..."
  sudo docker-compose down
  sudo docker-compose up -d
fi
