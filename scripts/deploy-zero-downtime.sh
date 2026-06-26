#!/bin/bash
# Zero-downtime deploy for Sleepox (8-process PM2 cluster)
# Builds FIRST, then restarts processes 1-by-1 with health wait between each.
# Nginx upstream stays alive because at least 7 backends are always responding.

set -e
cd /opt/sleepox-app-new

echo "===== [1/4] git pull ====="
git pull

echo "===== [2/4] bun install ====="
bun install

echo "===== [3/4] bun run build (processes still serving old code) ====="
bun run build

echo "===== [4/4] rolling restart (1 process at a time, 3s wait each) ====="
for i in 0 1 2 3 4 5 6 7; do
  echo "--- restarting sleepox-$i ---"
  pm2 restart sleepox-$i --update-env
  # wait for the worker to come back before touching the next one
  for try in 1 2 3 4 5 6 7 8 9 10; do
    sleep 1
    if curl -sf -o /dev/null "http://127.0.0.1:400$i/" 2>/dev/null \
       || curl -sf -o /dev/null "http://127.0.0.1:400$i/favicon.ico" 2>/dev/null; then
      echo "  sleepox-$i healthy (try $try)"
      break
    fi
  done
  sleep 1
done

echo "===== ✅ deploy complete — checking logs ====="
sleep 3
pm2 logs --lines 30 --nostream
pm2 status
