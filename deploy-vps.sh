#!/usr/bin/env bash
set -euo pipefail

# 1. Update source code (already in repo root)
# git fetch origin
# git reset --hard origin/main
# git pull origin main


# 2. Setup Environment Variables
# These keys are verified to connect to the database with 500k+ clicks.
SUPABASE_URL="https://supabase.sleepox.com"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc5NTI3MzM4LCJleHAiOjIwOTQ4ODczMzh9.URbRlYz0AjLehmGhVH7dnsfwJPUY_zgYC4hodpxeHW8"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3Nzk1MjczMzgsImV4cCI6MjA5NDg4NzMzOH0.HitgT1rO3FH8h4jNpbvhaBfrLFkGz_JN91c1caB2O_8"

cat <<ENV > .env
PORT=4000
SUPABASE_URL="$SUPABASE_URL"
SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"
SUPABASE_PUBLISHABLE_KEY="$SUPABASE_ANON_KEY"
VITE_SUPABASE_URL="$SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"
VITE_SUPABASE_PUBLISHABLE_KEY="$SUPABASE_ANON_KEY"
PLISIO_API_KEY="SkkZKl5C_QLes32hefTT3xokoeSrgf1CWc2SUn5C8u4GioW88bgPvxoLxXZV1ORb"
NODE_ENV="production"
ENV


# 3. Clean and Build
echo "--- Cleaning and Building ---"
rm -rf dist .output
bun install
bun run build

# 4. Data Integrity Check
echo "--- Verifying Database Connection ---"
bun run scripts/check-external-db.ts || { echo "❌ Database connection check failed! Stopping deployment to protect data."; exit 1; }

# 5. Restart PM2 (Corrected Path: dist/server/index.mjs)
echo "--- Restarting PM2 in 8-Core Cluster Mode ---"
pm2 delete sleepox || true

# Explicitly use --instances max to trigger Cluster Mode
PORT=4000 \
NODE_ENV=production \
SUPABASE_URL="$SUPABASE_URL" \
SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
pm2 start dist/server/index.mjs --name "sleepox" --instances max

pm2 save
echo "✅ Deployment Complete! 8 cores are now active in cluster mode."


