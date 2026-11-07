#!/usr/bin/env bash
# ==============================================================================
# ISURU SERVICE CENTER POS: AUTOMATED POSTGRESQL BACKUP SCRIPT
# ==============================================================================
# Performs logical backups of the PostgreSQL database using pg_dump.
# Compatible with standalone PostgreSQL or Dockerized PostgreSQL container.
# Includes compression, checksum generation, retention cleanup, and validation.
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Load environment configuration if available
if [[ -f "${PROJECT_ROOT}/.env" ]]; then
  # shellcheck disable=SC1091
  source "${PROJECT_ROOT}/.env"
fi

BACKUP_DIR="${BACKUP_DIR:-${PROJECT_ROOT}/backups}"
CONTAINER_NAME="${CONTAINER_NAME:-isuru-pos-postgres}"
POSTGRES_DB="${POSTGRES_DB:-isuru_pos}"
POSTGRES_USER="${POSTGRES_USER:-isuru_pos_user}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"

TIMESTAMP="$(date +"%Y%m%d_%H%M%S")"
BACKUP_FILENAME="${POSTGRES_DB}_backup_${TIMESTAMP}.sql.gz"
BACKUP_FILEPATH="${BACKUP_DIR}/${BACKUP_FILENAME}"
CHECKSUM_FILEPATH="${BACKUP_FILEPATH}.sha256"

mkdir -p "${BACKUP_DIR}"

echo "================================================================="
echo "   ISURU SERVICE CENTER: POSTGRESQL BACKUP"
echo "================================================================="
echo "Timestamp:    ${TIMESTAMP}"
echo "Database:     ${POSTGRES_DB}"
echo "Target File:  ${BACKUP_FILEPATH}"
echo "-----------------------------------------------------------------"

# Check if running via Docker container or host pg_dump
if command -v docker >/dev/null 2>&1 && docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "-> Dumping database from running Docker container: ${CONTAINER_NAME}..."
  docker exec -t "${CONTAINER_NAME}" pg_dump -U "${POSTGRES_USER}" --clean --if-exists --no-owner "${POSTGRES_DB}" | gzip -9 > "${BACKUP_FILEPATH}"
elif command -v pg_dump >/dev/null 2>&1; then
  echo "-> Dumping database using local pg_dump..."
  PGPASSWORD="${POSTGRES_PASSWORD:-}" pg_dump -h "${POSTGRES_HOST:-localhost}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER}" --clean --if-exists --no-owner "${POSTGRES_DB}" | gzip -9 > "${BACKUP_FILEPATH}"
else
  echo "ERROR: Neither running Docker container '${CONTAINER_NAME}' nor local 'pg_dump' utility found."
  exit 1
fi

# Verify the backup archive integrity
echo "-> Verifying archive integrity..."
if ! gzip -t "${BACKUP_FILEPATH}"; then
  echo "ERROR: Backup archive verification failed! File is corrupted."
  rm -f "${BACKUP_FILEPATH}"
  exit 1
fi

FILE_SIZE="$(du -h "${BACKUP_FILEPATH}" | cut -f1)"
echo "✔ Archive verified. Compressed backup size: ${FILE_SIZE}"

# Generate SHA256 checksum for tamper and corruption detection
if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "${BACKUP_FILEPATH}" > "${CHECKSUM_FILEPATH}"
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 "${BACKUP_FILEPATH}" > "${CHECKSUM_FILEPATH}"
fi
echo "✔ Checksum generated: $(cat "${CHECKSUM_FILEPATH}")"

# Prune old backups past the retention window
echo "-> Applying retention policy (cleaning backups older than ${RETENTION_DAYS} days)..."
find "${BACKUP_DIR}" -name "${POSTGRES_DB}_backup_*.sql.gz*" -type f -mtime "+${RETENTION_DAYS}" -exec rm -v {} \;

echo "-----------------------------------------------------------------"
echo "✔ Backup completed successfully: ${BACKUP_FILENAME}"
echo "================================================================="
