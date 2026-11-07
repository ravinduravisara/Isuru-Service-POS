#!/usr/bin/env bash
# ==============================================================================
# ISURU SERVICE CENTER POS: POSTGRESQL RESTORE SCRIPT
# ==============================================================================
# Restores a logical backup into PostgreSQL.
# Supports Dockerized PostgreSQL container or local psql.
# Guarded against accidental destruction of production databases.
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Load environment configuration if available
if [[ -f "${PROJECT_ROOT}/.env" ]]; then
  # shellcheck disable=SC1091
  source "${PROJECT_ROOT}/.env"
fi

CONTAINER_NAME="${CONTAINER_NAME:-isuru-pos-postgres}"
POSTGRES_DB="${POSTGRES_DB:-isuru_pos}"
POSTGRES_USER="${POSTGRES_USER:-isuru_pos_user}"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <path_to_backup_file.sql.gz> [--force]"
  echo "Example: $0 ./backups/isuru_pos_backup_20261107_120000.sql.gz"
  exit 1
fi

BACKUP_FILE="$1"
FORCE="${2:-}"

if [[ ! -f "${BACKUP_FILE}" ]]; then
  echo "ERROR: Backup file not found: ${BACKUP_FILE}"
  exit 1
fi

echo "================================================================="
echo "   ISURU SERVICE CENTER: POSTGRESQL DATABASE RESTORE"
echo "================================================================="
echo "Target Database:   ${POSTGRES_DB}"
echo "Source Backup:     ${BACKUP_FILE}"
echo "Container:         ${CONTAINER_NAME}"
echo "-----------------------------------------------------------------"

# Verify checksum if present
CHECKSUM_FILE="${BACKUP_FILE}.sha256"
if [[ -f "${CHECKSUM_FILE}" ]]; then
  echo "-> Verifying SHA256 checksum..."
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum -c "${CHECKSUM_FILE}"
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 -c "${CHECKSUM_FILE}"
  fi
  echo "✔ Checksum verified."
fi

# Guard prompt
if [[ "${FORCE}" != "--force" ]]; then
  echo "WARNING: Restoring will overwrite existing tables in '${POSTGRES_DB}'."
  read -r -p "Are you sure you want to proceed with restore? [y/N]: " CONFIRM
  if [[ "${CONFIRM}" != "y" && "${CONFIRM}" != "Y" ]]; then
    echo "Restore aborted by user."
    exit 0
  fi
fi

echo "-> Executing restore..."

if command -v docker >/dev/null 2>&1 && docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "-> Restoring into Docker container: ${CONTAINER_NAME}..."
  gunzip -c "${BACKUP_FILE}" | docker exec -i "${CONTAINER_NAME}" psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"
elif command -v psql >/dev/null 2>&1; then
  echo "-> Restoring using local psql client..."
  gunzip -c "${BACKUP_FILE}" | PGPASSWORD="${POSTGRES_PASSWORD:-}" psql -h "${POSTGRES_HOST:-localhost}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"
else
  echo "ERROR: Neither running Docker container '${CONTAINER_NAME}' nor local 'psql' utility found."
  exit 1
fi

echo "-----------------------------------------------------------------"
echo "✔ Database restoration completed successfully!"
echo "================================================================="
