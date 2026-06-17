#!/bin/bash
# Zero-downtime deploy for sleepox-app-new
#
# This script is safe to run during active traffic (e.g. while a Facebook boost is live).
# It:
#   1) Pulls latest code
#   2) Installs deps
#   3) CLEARS stale build artifacts (.output, .vinxi, node_modules/.vite) so old chunk hashes
#      can't haunt the new build
#   4) Builds
#   5) PRE-FLIGHT: tests one fresh process on a scratch port BEFORE touching production —
#      catches ERR_MODULE_NOT_FOUND etc. without taking the site down
#   6) Rolls each PM2 process one at a time (stop+delete+start, NOT restart) so nginx upstream
#      keeps serving the other 7 processes throughout
#   7) Health-checks each port before moving on
#   8) Verifies Facebook bot can still see the public link
#
# Usage:  ./scripts/deploy-zero-downtime.sh
# Skip pre-flight (faster, riskier):  SKIP_PREFLIGHT=1 ./scripts/deploy-zero-downtime.sh

set -e

cd /opt/sleepox-app-new

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== 1/7 git pull ===${NC}"
git pull

echo ""
echo -e "${GREEN}=== 2/7 bun install ===${NC}"
bun install

echo ""
echo -e "${GREEN}=== 3/7 Clearing stale build artifacts ===${NC}"
# These are what cause ERR_MODULE_NOT_FOUND after restart — old chunk hashes
# pointing to files the new build won't produce.
rm -rf .output .vinxi .nitro node_modules/.vite dist 2>/dev/null || true
echo "✓ Cleared .output .vinxi .nitro node_modules/.vite dist"

echo ""
echo -e "${GREEN}=== 4/7 bun run build ===${NC}"
bun run build

# Sanity: make sure build actually produced output
if [ ! -d ".output/server" ]; then
  echo -e "${RED}❌ Build did not produce .output/server — aborting deploy${NC}"
  exit 1
fi
echo "✓ Build output present"

# ===== 5/7 PRE-FLIGHT: test the new build on a scratch port =====
if [ "${SKIP_PREFLIGHT:-0}" != "1" ]; then
  echo ""
  echo -e "${GREEN}=== 5/7 Pre-flight: testing new build on scratch port 4099 ===${NC}"
  set -a
  source .env 2>/dev/null || true
  set +a

  PORT=4099 node .output/server/index.mjs > /tmp/sleepox-preflight.log 2>&1 &
  PREFLIGHT_PID=$!

  # Wait up to 15s for it to come up
  PREFLIGHT_OK=0
  for try in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
    if curl -fsS -o /dev/null --max-time 2 "http://127.0.0.1:4099/" 2>/dev/null; then
      PREFLIGHT_OK=1
      break
    fi
    # Check if the process died
    if ! kill -0 $PREFLIGHT_PID 2>/dev/null; then
      break
    fi
    sleep 1
  done

  # Kill the pre-flight process
  kill $PREFLIGHT_PID 2>/dev/null || true
  wait $PREFLIGHT_PID 2>/dev/null || true

  if [ $PREFLIGHT_OK -eq 0 ]; then
    echo -e "${RED}❌ PRE-FLIGHT FAILED — new build can't even start. NOT touching production.${NC}"
    echo -e "${RED}   Last 40 lines of pre-flight log:${NC}"
    tail -40 /tmp/sleepox-preflight.log
    echo ""
    echo -e "${YELLOW}   Production is still serving the OLD build. Fix the error above and re-run.${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ Pre-flight OK — new build starts cleanly${NC}"
else
  echo ""
  echo -e "${YELLOW}=== 5/7 Skipping pre-flight (SKIP_PREFLIGHT=1) ===${NC}"
fi

# ===== 6/7 ROLLING RESTART =====
echo ""
echo -e "${GREEN}=== 6/7 Rolling restart (one process at a time) ===${NC}"
FAILED_PROCS=""
for i in 0 1 2 3 4 5 6 7; do
  name="sleepox-$i"
  port=$((4000 + i))
  echo "--- $name (port $port) ---"

  pm2 stop "$name" >/dev/null 2>&1 || true
  pm2 delete "$name" >/dev/null 2>&1 || true
  pm2 start ecosystem.config.cjs --only "$name" >/dev/null

  # Wait for health
  HEALTHY=0
  for try in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
    if curl -fsS -o /dev/null --max-time 2 "http://127.0.0.1:$port/" 2>/dev/null; then
      HEALTHY=1
      break
    fi
    sleep 1
  done

  if [ $HEALTHY -eq 1 ]; then
    echo -e "${GREEN}✓ $name healthy${NC}"
  else
    echo -e "${RED}✗ $name FAILED to come up on port $port${NC}"
    FAILED_PROCS="$FAILED_PROCS $name"
  fi
done

pm2 save >/dev/null 2>&1 || true

# ===== 7/7 POST-DEPLOY VERIFICATION =====
echo ""
echo -e "${GREEN}=== 7/7 Post-deploy verification ===${NC}"

echo "PM2 status:"
pm2 list

echo ""
echo "Facebook bot check (sleepox.com):"
FB1=$(curl -sI -o /dev/null -w "%{http_code}" --max-time 10 -A "facebookexternalhit/1.1" https://sleepox.com 2>/dev/null)
echo "  → HTTP $FB1"

echo "Facebook bot check (breezysocial.com):"
FB2=$(curl -sI -o /dev/null -w "%{http_code}" --max-time 10 -A "facebookexternalhit/1.1" https://breezysocial.com 2>/dev/null)
echo "  → HTTP $FB2"

# Optional: run OG tag verifier if present
if [ -x "./scripts/verify-og-tags.sh" ]; then
  echo ""
  echo "Running OG tag verifier on sleepox.com..."
  ./scripts/verify-og-tags.sh https://sleepox.com || echo -e "${YELLOW}⚠ OG verifier reported issues${NC}"
fi

echo ""
if [ -n "$FAILED_PROCS" ]; then
  echo -e "${RED}🚨 DEPLOY COMPLETED WITH ERRORS — failed processes:$FAILED_PROCS${NC}"
  echo "Check logs: pm2 logs --lines 50 --nostream"
  exit 1
else
  echo -e "${GREEN}✅ DEPLOY SUCCESSFUL — all 8 processes online${NC}"
fi
