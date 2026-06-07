#!/usr/bin/env bash
set -euo pipefail

# 1. Update source code
cd /opt/sleepox-app-new
git fetch origin
git reset --hard origin/main
git pull origin main

# 2. Update .env with ALL keys
cat <<'ENV' > .env
SUPABASE_URL="https://supabase.sleepox.com"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc5NTI3MzM4LCJleHAiOjIwOTQ4ODczMzh9.URbRlYz0AjLehmGhVH7dnsfwJPUY_zgYC4hodpxeHW8"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3Nzk1MjczMzgsImV4cCI6MjA5NDg4NzMzOH0.HitgT1rO3FH8h4jNpbvhaBfrLFkGz_JN91c1caB2O_8"
SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc5NTI3MzM4LCJleHAiOjIwOTQ4ODczMzh9.URbRlYz0AjLehmGhVH7dnsfwJPUY_zgYC4hodpxeHW8"
VITE_SUPABASE_URL="https://supabase.sleepox.com"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc5NTI3MzM4LCJleHAiOjIwOTQ4ODczMzh9.URbRlYz0AjLehmGhVH7dnsfwJPUY_zgYC4hodpxeHW8"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc5NTI3MzM4LCJleHAiOjIwOTQ4ODczMzh9.URbRlYz0AjLehmGhVH7dnsfwJPUY_zgYC4hodpxeHW8"
PLISIO_API_KEY="SkkZKl5C_QLes32hefTT3xokoeSrgf1CWc2SUn5C8u4GioW88bgPvxoLxXZV1ORb"
PORT=4000
# Supabase Backend Internal Keys (Reference Only)
# JWT_SECRET=18a2a6262cfb62820f9c5ed7452809ed3469ba0b814b9884417f3bd83889a594
# POSTGRES_PASSWORD=d628c0fc3707abe6c56ed2db5c584b89f83475a199476f34
# DASHBOARD_PASSWORD=7a045062ea340b6b1f5f6dea4a5e86ac
# SECRET_KEY_BASE=01f2fe3a7043d2eacc6537bde67aeb427dd51d3a2d249e4f9e41edc89b1151e2
# VAULT_ENC_KEY=241ec31985b4abe024e103241dec9357
ENV

# 3. Clean build
rm -rf .output dist
bun install
bun run build

# 4. Restart PM2
pm2 restart all || npx pm2 start .output/server/index.mjs --name "sleepox"
pm2 save

echo "✅ VPS Deployment complete at /opt/sleepox-app-new"
