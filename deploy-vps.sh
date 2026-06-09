#!/usr/bin/env bash
set -euo pipefail

# 1. Update source code
cd /opt/sleepox-app-new
git reset --hard origin/main
git pull origin main

# 2. Build
echo "--- Building ---"
bun install

# 2.5. Ensure self-hosted database maintenance objects exist
echo "--- Ensuring self-hosted DB maintenance objects ---"
bash scripts/vps-ensure-maintenance-db.sh

bun run build

# 3. Fix 8 core issues by ensuring ecosystem.config.cjs is used
echo "--- Ensuring 8 Cores (Cluster Mode) ---"
# We check if sleepox is running in fork mode; if so, we delete and start in cluster
if pm2 show sleepox | grep -q "mode: fork"; then
  echo "Detected fork mode, switching to cluster mode for 8 cores..."
  pm2 delete sleepox || true
  pm2 start ecosystem.config.cjs --env production
else
  # If already in cluster mode, restart all will maintain the 8 cores
  pm2 restart all
fi

pm2 save
echo "✅ Deployment complete"
