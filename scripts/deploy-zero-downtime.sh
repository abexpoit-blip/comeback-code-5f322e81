#!/bin/bash
# Zero-downtime deploy for sleepox-app-new
# Builds first, then rolls each PM2 process one at a time (stop + start, NOT restart).
# nginx upstream keeps serving traffic from the other 7 processes during each ~1s swap.
# This avoids both:
#   1) Facebook/bot getting 502 during deploy window
#   2) ERR_MODULE_NOT_FOUND from stale chunk hashes (which pm2 restart/reload causes)

set -e

cd /opt/sleepox-app-new

echo "=== 1/4 git pull ==="
git pull

echo ""
echo "=== 2/4 bun install ==="
bun install

echo ""
echo "=== 3/4 bun run build ==="
bun run build

echo ""
echo "=== 4/4 Rolling restart (one process at a time, ~2s each) ==="
for i in 0 1 2 3 4 5 6 7; do
  name="sleepox-$i"
  echo "--- $name ---"
  pm2 stop "$name" >/dev/null 2>&1 || true
  pm2 delete "$name" >/dev/null 2>&1 || true
  # Re-create from ecosystem (only this app id)
  pm2 start ecosystem.config.cjs --only "$name" >/dev/null
  # Wait for it to become healthy before moving to the next one
  port=$((4000 + i))
  for try in 1 2 3 4 5 6 7 8 9 10; do
    if curl -fsS -o /dev/null --max-time 2 "http://127.0.0.1:$port/" 2>/dev/null; then
      echo "✓ $name healthy on port $port"
      break
    fi
    sleep 1
  done
done

echo ""
echo "=== ✅ DONE — Checking errors (last 30 lines) ==="
pm2 logs --lines 30 --nostream 2>/dev/null | grep -iE "error|ERR_MODULE|listening" | tail -20 || echo "No errors found 🎉"

echo ""
echo "=== PM2 status ==="
pm2 list
