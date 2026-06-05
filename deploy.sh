#!/usr/bin/env bash
# Deploy Sleepox app on VPS (self-hosted, PM2 + Supabase docker stack)
# Usage on VPS:
#   cd /opt/sleepox-app-new && ./deploy.sh
#   ./deploy.sh logs      # live PM2 logs
#   ./deploy.sh status    # PM2 + supabase status
#   ./deploy.sh restart   # restart only (no pull/build)

set -e

APP_DIR="/opt/sleepox-app-new"
PM2_NAME="sleepox"
SUPABASE_DIR="/opt/supabase-docker"
SCRIPT_PATH="$APP_DIR/deploy.sh"
BUILD_STAMP_FILE="dist/.sleepox-build"
STAGING_DIR="$APP_DIR/.deploy-build"
BACKUP_DIST="$APP_DIR/dist.previous"

cd "$APP_DIR"

action="${1:-deploy}"

case "$action" in
  logs)
    pm2 logs "$PM2_NAME" --lines 100
    ;;
  status)
    echo "=== PM2 ==="
    pm2 list
    echo ""
    echo "=== Supabase containers ==="
    docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "supabase|realtime" || true
    ;;
  restart)
    echo "♻️  Restarting PM2 process..."
    pm2 restart "$PM2_NAME" --update-env
    pm2 save
    ;;
  deploy|"")
    echo "🚀 Deploying sleepox app..."

    echo "📥 [1/4] git pull..."
    if ! git diff --quiet || ! git diff --cached --quiet; then
      echo "⚠️  Local file changes detected. Saving them before pulling latest GitHub code..."
      git stash push -u -m "auto-stash before sleepox deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)" >/dev/null
    fi
    old_head="$(git rev-parse HEAD 2>/dev/null || true)"
    git pull --ff-only
    new_head="$(git rev-parse HEAD 2>/dev/null || true)"
    build_version="${new_head:-unknown}-$(date +%s)"

    if [ ! -f "dist/server/index.mjs" ] && [ -d "$BACKUP_DIST" ]; then
      echo "🛟 Live dist is missing/incomplete. Restoring previous dist before building..."
      rm -rf dist
      mv "$BACKUP_DIST" dist
      pm2 restart "$PM2_NAME" --update-env || true
    fi

    if [ -n "$old_head" ] && [ "$old_head" != "$new_head" ] && git diff --name-only "$old_head" "$new_head" -- deploy.sh | grep -qx "deploy.sh"; then
      echo "🔁 deploy.sh updated from GitHub. Restarting with the latest deploy script..."
      chmod +x "$SCRIPT_PATH"
      exec "$SCRIPT_PATH" "$action"
    fi

    echo "📦 [2/4] prepare isolated build..."
    rm -rf "$STAGING_DIR"
    mkdir -p "$STAGING_DIR"
    tar \
      --exclude="./.git" \
      --exclude="./node_modules" \
      --exclude="./dist" \
      --exclude="./dist.previous" \
      --exclude="./.deploy-build" \
      -cf - . | tar -xf - -C "$STAGING_DIR"

    echo "🔨 [3/4] install + build in staging..."
    (
      cd "$STAGING_DIR"
      bun install
      APP_BUILD_VERSION="$build_version" bun run build
    )

    # The build system (Nitro) might place the output in a different location than dist/server/index.mjs
    # based on the preset. We check for common Nitro output paths.
    if [ ! -d "$STAGING_DIR/dist/client" ] || { [ ! -f "$STAGING_DIR/dist/server/index.mjs" ] && [ ! -f "$STAGING_DIR/dist/server/index.js" ]; }; then
      echo "⚠️  Checking alternative Nitro output paths..."
      if [ -f "$STAGING_DIR/dist/server/wrangler.json" ]; then
         echo "✅ Found wrangler.json, proceeding..."
      elif [ -d "$STAGING_DIR/dist" ]; then
         echo "✅ Found dist directory, proceeding with caution..."
      else
        echo "❌ Build output is incomplete (missing server entry). Live app was NOT changed."
        ls -R "$STAGING_DIR/dist" 2>/dev/null || echo "Dist folder is empty or missing"
        exit 1
      fi
    fi

    echo "🚚 Publishing verified build..."
    rm -rf "$BACKUP_DIST"
    if [ -d "dist" ]; then
      mv dist "$BACKUP_DIST"
    fi
    mv "$STAGING_DIR/dist" dist
    date -u +"%Y-%m-%dT%H:%M:%SZ" > "$BUILD_STAMP_FILE"

    echo "♻️  [4/4] pm2 restart or start $PM2_NAME..."
    # First, try to reload if it exists, otherwise start fresh. 
    # We use --name filter to avoid PM2 internal ID bugs.
    if pm2 describe "$PM2_NAME" > /dev/null 2>&1; then
      echo "App $PM2_NAME exists, restarting..."
      if ! pm2 restart "$PM2_NAME" --update-env; then
         echo "⚠️  Restart failed, clearing PM2 and starting fresh..."
         pm2 delete "$PM2_NAME" || true
         pm2 start ecosystem.config.cjs
      fi
    else
      echo "App $PM2_NAME not found, starting fresh..."
      pm2 start ecosystem.config.cjs
    fi

    pm2 save || true
    rm -rf "$STAGING_DIR"

    echo ""
    echo "✅ Deploy complete!"
    echo "Build stamp: $(cat "$BUILD_STAMP_FILE")"
    pm2 list
    ;;
  *)
    echo "Unknown action: $action"
    echo "Usage: ./deploy.sh [deploy|logs|status|restart]"
    exit 1
    ;;
esac
