#!/usr/bin/env bash
set -euo pipefail

# 1. Source verification
# git fetch origin
# git reset --hard origin/main

# 2. Hardcode configuration into .env immediately
# This ensures that even if 'export' doesn't propagate, the file is there.
SUPABASE_URL="https://supabase.sleepox.com"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc5NTI3MzM4LCJleHAiOjIwOTQ4ODczMzh9.URbRlYz0AjLehmGhVH7dnsfwJPUY_zgYC4hodpxeHW8"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3Nzk1MjczMzgsImV4cCI6MjA5NDg4NzMzOH0.HitgT1rO3FH8h4jNpbvhaBfrLFkGz_JN91c1caB2O_8"

echo "Creating .env file..."
cat <<ENV > .env
PORT=4000
SUPABASE_URL="$SUPABASE_URL"
VITE_SUPABASE_URL="$SUPABASE_URL"
SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"
VITE_SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"
SUPABASE_PUBLISHABLE_KEY="$SUPABASE_ANON_KEY"
VITE_SUPABASE_PUBLISHABLE_KEY="$SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"
PLISIO_API_KEY="SkkZKl5C_QLes32hefTT3xokoeSrgf1CWc2SUn5C8u4GioW88bgPvxoLxXZV1ORb"
NODE_ENV="production"
ENV

# Export for the current shell session (used by bun/vite)
export SUPABASE_URL="$SUPABASE_URL"
export VITE_SUPABASE_URL="$SUPABASE_URL"
export SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"
export VITE_SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"
export SUPABASE_PUBLISHABLE_KEY="$SUPABASE_ANON_KEY"
export VITE_SUPABASE_PUBLISHABLE_KEY="$SUPABASE_ANON_KEY"
export SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

# 3. Clean and Build
echo "--- Cleaning and Building ---"
rm -rf dist .output
bun install
# We run vite build directly to bypass any script-level environment stripping
NODE_ENV=production bun x vite build

# 4. Data Integrity Check
echo "--- Verifying Database Connection ---"
bun run scripts/check-external-db.ts || { echo "❌ Database connection check failed!"; exit 1; }

# 5. Restart PM2 in 8-Core Cluster Mode
echo "--- Restarting PM2 in Cluster Mode (8 Cores) ---"
pm2 delete sleepox || true

# Explicitly pass all variables to PM2
PORT=4000 \
NODE_ENV=production \
SUPABASE_URL="$SUPABASE_URL" \
SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
SUPABASE_PUBLISHABLE_KEY="$SUPABASE_ANON_KEY" \
VITE_SUPABASE_URL="$SUPABASE_URL" \
VITE_SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
VITE_SUPABASE_PUBLISHABLE_KEY="$SUPABASE_ANON_KEY" \
pm2 start dist/server/index.mjs --name "sleepox" -i max

pm2 save
echo "✅ Deployment Complete! 8 cores are now active and data is verified."
