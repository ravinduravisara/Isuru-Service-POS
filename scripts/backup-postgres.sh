#!/usr/bin/env bash
# ==============================================================================
# ISURU SERVICE CENTER POS: AUTOMATED BACKUP & DISASTER RECOVERY SUITE
# ==============================================================================
# - Automated logical PostgreSQL dumps using pg_dump
# - Automated user-uploaded media backup (workshop logos, invoice assets)
# - Container auto-detection (production: isuru-pos-prod-postgres, dev: isuru-pos-postgres)
# - Gzip maximum compression + SHA256 cryptographic checksums
# - Optional OpenSSL AES-256-CBC encryption for offsite transmission
# - Automated 14-day retention window pruning
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Load environment configuration if available
if [[ -f "${PROJECT_ROOT}/.env" ]]; then
  # shellcheck disable=SC1091
  source "${PROJECT_ROOT}/.env"
elif [[ -f "${PROJECT_ROOT}/backend/.env" ]]; then
  # shellcheck disable=SC1091
  source "${PROJECT_ROOT}/backend/.env"
fi

BACKUP_DIR="${BACKUP_DIR:-${PROJECT_ROOT}/backups}"
if ! mkdir -p "${BACKUP_DIR}" 2>/dev/null || [[ ! -w "${BACKUP_DIR}" ]]; then
  echo "ℹ Target BACKUP_DIR '${BACKUP_DIR}' is not writable. Falling back to '${PROJECT_ROOT}/backups'..."
  BACKUP_DIR="${PROJECT_ROOT}/backups"
  mkdir -p "${BACKUP_DIR}"
fi
POSTGRES_DB="${POSTGRES_DB:-isuru_pos}"
POSTGRES_USER="${POSTGRES_USER:-isuru_pos_user}"

# Extract credentials from DATABASE_URL if provided
if [[ -n "${DATABASE_URL:-}" ]]; then
  EXTRACTED_USER="$(echo "${DATABASE_URL}" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')"
  EXTRACTED_DB="$(echo "${DATABASE_URL}" | sed -n 's/.*\/\([^?]*\).*/\1/p')"
  [[ -n "${EXTRACTED_USER}" ]] && POSTGRES_USER="${EXTRACTED_USER}"
  [[ -n "${EXTRACTED_DB}" ]] && POSTGRES_DB="${EXTRACTED_DB}"
fi
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
UPLOAD_DIR="${UPLOAD_DIR:-${PROJECT_ROOT}/backend/uploads}"
ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY:-}"

TIMESTAMP="$(date +"%Y%m%d_%H%M%S")"
DB_BACKUP_FILENAME="${POSTGRES_DB}_backup_${TIMESTAMP}.sql.gz"
DB_BACKUP_PATH="${BACKUP_DIR}/${DB_BACKUP_FILENAME}"
UPLOADS_BACKUP_FILENAME="isuru_uploads_backup_${TIMESTAMP}.tar.gz"
UPLOADS_BACKUP_PATH="${BACKUP_DIR}/${UPLOADS_BACKUP_FILENAME}"

mkdir -p "${BACKUP_DIR}"

echo "================================================================="
echo "   ISURU SERVICE CENTER: COMPREHENSIVE SYSTEM BACKUP"
echo "================================================================="
echo "Timestamp:        ${TIMESTAMP}"
echo "Database:         ${POSTGRES_DB}"
echo "Target Directory: ${BACKUP_DIR}"
echo "Retention Days:   ${RETENTION_DAYS}"
echo "-----------------------------------------------------------------"

# Auto-detect running PostgreSQL container (production or local)
DETECTED_CONTAINER=""
if command -v docker >/dev/null 2>&1; then
  for candidate in "${CONTAINER_NAME:-}" "isuru-pos-prod-postgres" "isuru-pos-postgres"; do
    if [[ -n "${candidate}" ]] && docker ps --format '{{.Names}}' | grep -q "^${candidate}$"; then
      DETECTED_CONTAINER="${candidate}"
      CONTAINER_USER="$(docker exec "${DETECTED_CONTAINER}" printenv POSTGRES_USER 2>/dev/null || true)"
      [[ -n "${CONTAINER_USER}" ]] && POSTGRES_USER="${CONTAINER_USER}"
      break
    fi
  done
fi

# 1. DATABASE DUMP
echo "-> [1/4] Performing PostgreSQL database backup..."
TARGET_CONN_URL="${DIRECT_DATABASE_URL:-${DATABASE_URL:-}}"

if [[ -n "${TARGET_CONN_URL}" && "${TARGET_CONN_URL}" =~ ^postgres(ql)?:\/\/ ]] && command -v pg_dump >/dev/null 2>&1; then
  echo "   Dumping directly from configured database URL using host pg_dump..."
  pg_dump "${TARGET_CONN_URL}" --clean --if-exists --no-owner | gzip -9 > "${DB_BACKUP_PATH}"
elif [[ -n "${TARGET_CONN_URL}" && "${TARGET_CONN_URL}" =~ ^postgres(ql)?:\/\/ ]] && command -v docker >/dev/null 2>&1; then
  echo "   Dumping directly from configured database URL using ephemeral docker container..."
  docker run --rm --net=host -i postgres:16-alpine pg_dump "${TARGET_CONN_URL}" --clean --if-exists --no-owner | gzip -9 > "${DB_BACKUP_PATH}"
elif [[ -n "${DETECTED_CONTAINER}" ]]; then
  echo "   Dumping from active Docker container: ${DETECTED_CONTAINER}..."
  docker exec -t "${DETECTED_CONTAINER}" pg_dump -U "${POSTGRES_USER}" --clean --if-exists --no-owner "${POSTGRES_DB}" | gzip -9 > "${DB_BACKUP_PATH}"
elif command -v pg_dump >/dev/null 2>&1; then
  echo "   Dumping using host pg_dump client..."
  PGPASSWORD="${POSTGRES_PASSWORD:-}" pg_dump -h "${POSTGRES_HOST:-localhost}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER}" --clean --if-exists --no-owner "${POSTGRES_DB}" | gzip -9 > "${DB_BACKUP_PATH}"
else
  echo "ERROR: Neither configured database URL, running Docker container, nor host 'pg_dump' utility found."
  exit 1
fi

# Verify gzip archive integrity
if ! gzip -t "${DB_BACKUP_PATH}"; then
  echo "ERROR: Database backup archive verification failed! File is corrupt."
  rm -f "${DB_BACKUP_PATH}"
  exit 1
fi
DB_SIZE="$(du -h "${DB_BACKUP_PATH}" | cut -f1)"
echo "✔ Database archive verified intact (${DB_SIZE})."

# 2. UPLOADS MEDIA BACKUP
echo "-> [2/4] Archiving user-uploaded media and workshop assets..."
if [[ -d "${UPLOAD_DIR}" ]] && [[ "$(ls -A "${UPLOAD_DIR}" 2>/dev/null)" ]]; then
  tar -czf "${UPLOADS_BACKUP_PATH}" -C "${UPLOAD_DIR}" .
  echo "✔ Uploads archive created: $(du -h "${UPLOADS_BACKUP_PATH}" | cut -f1)"
elif [[ -n "${DETECTED_CONTAINER}" ]] && docker volume inspect isuru_pos_prod_uploads >/dev/null 2>&1; then
  # Backup from production docker volume via ephemeral helper container
  docker run --rm -v isuru_pos_prod_uploads:/data:ro -v "${BACKUP_DIR}":/backup alpine tar -czf "/backup/${UPLOADS_BACKUP_FILENAME}" -C /data .
  echo "✔ Production uploads volume archive created: $(du -h "${UPLOADS_BACKUP_PATH}" | cut -f1)"
else
  echo "ℹ No custom uploads found to archive. Creating empty placeholder archive."
  tar -czf "${UPLOADS_BACKUP_PATH}" --files-from /dev/null
fi

# 3. OPTIONAL AES-256 ENCRYPTION
if [[ -n "${ENCRYPTION_KEY}" ]]; then
  echo "-> [3/4] Encrypting backups using OpenSSL AES-256-CBC..."
  openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 -pass "pass:${ENCRYPTION_KEY}" -in "${DB_BACKUP_PATH}" -out "${DB_BACKUP_PATH}.enc"
  rm -f "${DB_BACKUP_PATH}"
  DB_BACKUP_PATH="${DB_BACKUP_PATH}.enc"

  openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 -pass "pass:${ENCRYPTION_KEY}" -in "${UPLOADS_BACKUP_PATH}" -out "${UPLOADS_BACKUP_PATH}.enc"
  rm -f "${UPLOADS_BACKUP_PATH}"
  UPLOADS_BACKUP_PATH="${UPLOADS_BACKUP_PATH}.enc"
  echo "✔ Encrypted with AES-256-CBC."
else
  echo "-> [3/4] Encryption skipped (no BACKUP_ENCRYPTION_KEY configured)."
fi

# 4. CHECKSUM GENERATION
echo "-> [4/4] Generating SHA256 integrity checksums..."
generate_sha256() {
  local target="$1"
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "${target}" > "${target}.sha256"
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "${target}" > "${target}.sha256"
  fi
}
generate_sha256 "${DB_BACKUP_PATH}"
generate_sha256 "${UPLOADS_BACKUP_PATH}"
echo "✔ Checksums generated."

# 5. RETENTION POLICY CLEANUP
echo "-> Applying retention policy (cleaning files older than ${RETENTION_DAYS} days)..."
find "${BACKUP_DIR}" -type f \( -name "*_backup_*" -o -name "*.sha256" \) -mtime "+${RETENTION_DAYS}" -exec rm -v {} \;

echo "-----------------------------------------------------------------"
echo "✔ Backup completed successfully!"
echo "  Database Dump: $(basename "${DB_BACKUP_PATH}")"
echo "  Uploads Dump:  $(basename "${UPLOADS_BACKUP_PATH}")"
echo "================================================================="
