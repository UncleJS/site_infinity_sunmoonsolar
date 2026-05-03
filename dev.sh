#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$REPO_DIR/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: .env not found in $REPO_DIR"
  echo "Run: cp .env.example .env"
  exit 1
fi

# Guard against stale host-level env file
HOST_ENV="$HOME/.config/containers/systemd/utility-sunmoonsolar.env"
if [[ -f "$HOST_ENV" ]]; then
  echo "ERROR: Stale host-level env file found at $HOST_ENV"
  echo "Remove it: rm $HOST_ENV"
  exit 1
fi

echo "==> Building dev image..."
podman build -t localhost/utility-sunmoonsolar-dev:latest -f Containerfile.dev "$REPO_DIR"

echo "==> Removing old dev container (if any)..."
podman rm -f utility-sunmoonsolar-dev 2>/dev/null || true

echo "==> Starting dev container..."
podman run -d \
  --name utility-sunmoonsolar-dev \
  -p 1026:1026 \
  localhost/utility-sunmoonsolar-dev:latest

echo ""
echo "==> Building production bundle..."
podman exec utility-sunmoonsolar-dev bun run build

echo "==> Syncing dist/ to host..."
rm -rf "$REPO_DIR/dist"
podman cp utility-sunmoonsolar-dev:/app/dist "$REPO_DIR/dist"
echo "dist/ updated at: $REPO_DIR/dist"

echo ""
echo "Dev server running at: http://localhost:1026"
echo "Logs: podman logs -f utility-sunmoonsolar-dev"
