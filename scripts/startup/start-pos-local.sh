#!/usr/bin/env bash
# ==============================================================================
# ISURU SERVICE CENTER POS: LOCAL APPLICATION LAUNCHER
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "================================================================="
echo "   ISURU SERVICE CENTER: STARTING LOCAL POS TERMINAL"
echo "================================================================="

cd "${PROJECT_ROOT}"

# Check Docker availability
if ! command -v docker &> /dev/null; then
  echo "❌ Error: Docker is not installed or not in PATH."
  echo "Please start Docker Desktop and retry."
  exit 1
fi

if ! docker info &> /dev/null; then
  echo "❌ Error: Docker daemon is not running."
  echo "Please launch Docker Desktop and retry."
  exit 1
fi

echo "-> Starting local PostgreSQL, Express Backend, and Frontend containers..."
docker compose -f compose.yaml up -d

echo "-> Waiting for local services to report healthy..."
ATTEMPTS=0
MAX_ATTEMPTS=30

until curl -s -f http://localhost:5050/api/v1/health &> /dev/null || [ $ATTEMPTS -eq $MAX_ATTEMPTS ]; do
  sleep 1
  ATTEMPTS=$((ATTEMPTS + 1))
done

if [ $ATTEMPTS -eq $MAX_ATTEMPTS ]; then
  echo "⚠ Warning: Backend took longer than expected to initialize. Check logs with 'docker compose logs'."
else
  echo "✔ Local POS Backend & PostgreSQL are healthy and ready."
fi

URL="http://localhost:8081"
echo "-> Opening ISURU Service POS in browser: ${URL}"

if [[ "$OSTYPE" == "darwin"* ]]; then
  open "${URL}"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  xdg-open "${URL}" &> /dev/null || true
fi

echo "================================================================="
echo "✔ POS is running locally. Billing functions without internet."
echo "================================================================="
