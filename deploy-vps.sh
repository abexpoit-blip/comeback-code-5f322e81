#!/usr/bin/env bash
set -euo pipefail

# 1. Update source code
cd /opt/sleepox-app-new
git fetch origin
git reset --hard origin/main
git pull origin main

# 2. Build
echo "--- Building ---"
bun install
bun run build

# 3. Restart PM2 (Ensuring Cluster Mode for 8 cores)
echo "--- Restarting PM2 ---"
# Deleting and restarting with ecosystem config ensures 'instances: max' is applied
pm2 delete sleepox || true
pm2 start ecosystem.config.cjs --env production
pm2 save

echo "✅ Deployment complete with 8 cores"

