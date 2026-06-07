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

# 3. Restart PM2
echo "--- Restarting PM2 ---"
pm2 restart all

echo "✅ Deployment complete"
