#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-4000}"
HOST="${HOST:-127.0.0.1}"
WRANGLER_CLI="node_modules/wrangler/wrangler-dist/cli.js"
ENV_FILE=".env"

echo "🔍 Starting Sleepox diagnostic..."
pwd
ls -ld dist/server 2>/dev/null || echo "❌ dist/server folder missing"
ls -l dist/server/index.mjs 2>/dev/null || echo "❌ dist/server/index.mjs missing"

# Find whatever is in dist/server
echo "📁 Contents of dist/server:"
ls -F dist/server/

# Detect config
if [ -f "dist/server/wrangler.json" ]; then
  CONF="dist/server/wrangler.json"
else
  CONF="wrangler.jsonc"
fi

echo "🚀 Executing node $WRANGLER_CLI dev --port $PORT --local"

exec node "$WRANGLER_CLI" dev \
  --config "$CONF" \
  --env-file "$ENV_FILE" \
  --port "$PORT" \
  --ip "$HOST" \
  --local \
  --show-interactive-dev-session=false
