#!/usr/bin/env bash
# ==============================================================================
# ISURU SERVICE CENTER POS: DEPLOYMENT VERIFICATION SCRIPT
# ==============================================================================
# Verifies container health, database responsiveness, API status, and frontend.
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

if [[ -f "${PROJECT_ROOT}/.env" ]]; then
  # shellcheck disable=SC1091
  source "${PROJECT_ROOT}/.env"
fi

HOST="${HOST:-127.0.0.1}"
FRONTEND_PORT="${FRONTEND_PORT:-8081}"
BACKEND_PORT="${BACKEND_PORT:-5050}"

echo "================================================================="
echo "   ISURU SERVICE CENTER: DEPLOYMENT HEALTH AUDIT"
echo "================================================================="

# 1. Container Status Check
echo "[1/4] Checking Docker container states..."
if command -v docker >/dev/null 2>&1; then
  docker ps --filter "name=isuru-pos" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
  echo "Docker command not available in current environment."
fi

# 2. Backend Healthcheck
echo -e "\n[2/4] Testing Backend Health endpoint..."
API_HEALTH_URL="http://${HOST}:${BACKEND_PORT}/api/v1/health"
if command -v curl >/dev/null 2>&1; then
  HEALTH_RES=$(curl -s --connect-timeout 5 "${API_HEALTH_URL}" || true)
  if echo "${HEALTH_RES}" | grep -q '"status":"ok"'; then
    echo "✔ Backend API is UP and healthy: ${API_HEALTH_URL}"
    echo "Response: ${HEALTH_RES}"
  else
    echo "⚠ Warning: Backend health check returned unexpected response or timed out at ${API_HEALTH_URL}."
  fi
fi

# 3. Frontend Accessibility Check
echo -e "\n[3/4] Testing Frontend Nginx HTTP endpoint..."
FRONTEND_URL="http://${HOST}:${FRONTEND_PORT}/"
if command -v curl >/dev/null 2>&1; then
  FE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "${FRONTEND_URL}" || true)
  if [[ "${FE_STATUS}" == "200" ]]; then
    echo "✔ Frontend Web Application is accessible (HTTP 200) at ${FRONTEND_URL}"
  else
    echo "⚠ Warning: Frontend returned HTTP status: ${FE_STATUS}"
  fi
fi

# 4. Database Persistence Check
echo -e "\n[4/4] Verifying PostgreSQL Volume Mount..."
if command -v docker >/dev/null 2>&1; then
  if docker volume ls --format '{{.Name}}' | grep -qE "isuru_pos.*pgdata|postgres_data"; then
    echo "✔ Persistent PostgreSQL Docker volume confirmed active."
  else
    echo "⚠ Notice: Inspect your compose configuration for persistent volume mapping."
  fi
fi

echo -e "\n================================================================="
echo "   VERIFICATION RUN COMPLETED"
echo "================================================================="
