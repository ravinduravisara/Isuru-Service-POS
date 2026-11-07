#!/usr/bin/env bash
# ==============================================================================
# ISURU SERVICE CENTER POS: POSTGRESQL RESTORE & DISASTER RECOVERY SCRIPT
# ==============================================================================
# - Restores logical PostgreSQL backups from gzip or AES-256-CBC encrypted dumps
# - Container auto-detection (production: isuru-pos-prod-postgres, dev: isuru-pos-postgres)
# - Isolated test restoration support (--target-db <test_db>)
# - Cryptographic SHA256 verification before restoration
# - Guarded against accidental destruction of production data
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

if [[ -f "${PROJECT_ROOT}/.env" ]]; then
  # shellcheck disable=SC1091
  source "${PROJECT_ROOT}/.env"
elif [[ -f "${PROJECT_ROOT}/backend/.env" ]]; then
  # shellcheck disable=SC1091
  source "${PROJECT_ROOT}/backend/.env"
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
UPLOAD_DIR="${UPLOAD_DIR:-${PROJECT_ROOT}/backend/uploads}"
ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY:-}"

usage() {
  echo "Usage: $0 <backup_file.sql.gz[.enc]> [--force] [--target-db <db_name>] [--restore-uploads <uploads.tar.gz[.enc]>]"
  echo "Example (Isolated Test): $0 ./backups/isuru_pos_backup_xxxx.sql.gz --target-db isuru_test_restore --force"
  exit 1
}

if [[ $# -lt 1 ]]; then
  usage
fi

BACKUP_FILE="$1"
shift

FORCE="false"
TARGET_DB="${POSTGRES_DB}"
UPLOADS_ARCHIVE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force)
      FORCE="true"
      shift
      ;;
    --target-db)
      TARGET_DB="$2"
      shift 2
      ;;
    --restore-uploads)
      UPLOADS_ARCHIVE="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1"
      usage
      ;;
  esac
done

if [[ ! -f "${BACKUP_FILE}" ]]; then
  echo "ERROR: Database backup file not found: ${BACKUP_FILE}"
  exit 1
fi

echo "================================================================="
echo "   ISURU SERVICE CENTER: POSTGRESQL DATABASE RESTORE"
echo "================================================================="
echo "Source Backup:   ${BACKUP_FILE}"
echo "Target Database: ${TARGET_DB}"
echo "Force Mode:      ${FORCE}"
echo "-----------------------------------------------------------------"

# Auto-detect running PostgreSQL container
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

# 1. VERIFY CHECKSUM
CHECKSUM_FILE="${BACKUP_FILE}.sha256"
if [[ -f "${CHECKSUM_FILE}" ]]; then
  echo "-> [1/4] Verifying SHA256 integrity checksum..."
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum -c "${CHECKSUM_FILE}"
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 -c "${CHECKSUM_FILE}"
  fi
  echo "✔ Checksum verified successfully."
fi

# 2. DECRYPT IF ENCRYPTED
WORK_FILE="${BACKUP_FILE}"
TMP_DECRYPTED=""
if [[ "${BACKUP_FILE}" == *.enc ]]; then
  echo "-> [2/4] Decrypting AES-256-CBC encrypted backup..."
  if [[ -z "${ENCRYPTION_KEY}" ]]; then
    read -r -s -p "Enter backup decryption passphrase: " ENCRYPTION_KEY
    echo ""
  fi
  TMP_DECRYPTED="$(mktemp -t isuru_restore_XXXXXX.sql.gz)"
  openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -pass "pass:${ENCRYPTION_KEY}" -in "${BACKUP_FILE}" -out "${TMP_DECRYPTED}"
  WORK_FILE="${TMP_DECRYPTED}"
  echo "✔ Decryption successful."
fi

# 3. SAFETY CONFIRMATION (Prevent accidental live DB overwrite)
if [[ "${FORCE}" != "true" ]]; then
  echo "WARNING: Restoring will overwrite existing data in '${TARGET_DB}'."
  read -r -p "Type 'RESTORE' to proceed with overwrite: " CONFIRM
  if [[ "${CONFIRM}" != "RESTORE" ]]; then
    echo "Restore aborted by user."
    [[ -n "${TMP_DECRYPTED}" ]] && rm -f "${TMP_DECRYPTED}"
    exit 0
  fi
fi

# 4. DATABASE RESTORATION
echo "-> [3/4] Executing database restoration into '${TARGET_DB}'..."
TARGET_CONN_URL="${DIRECT_DATABASE_URL:-${DATABASE_URL:-}}"

# Ensure target database exists if restoring into an isolated test database
if [[ "${TARGET_DB}" != "${POSTGRES_DB}" ]]; then
  echo "   Preparing isolated test database '${TARGET_DB}'..."
  if [[ -n "${DETECTED_CONTAINER}" ]]; then
    docker exec -i "${DETECTED_CONTAINER}" psql -U "${POSTGRES_USER}" -d postgres -c "DROP DATABASE IF EXISTS ${TARGET_DB};"
    docker exec -i "${DETECTED_CONTAINER}" psql -U "${POSTGRES_USER}" -d postgres -c "CREATE DATABASE ${TARGET_DB};"
  elif command -v psql >/dev/null 2>&1; then
    PGPASSWORD="${POSTGRES_PASSWORD:-}" psql -h "${POSTGRES_HOST:-localhost}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER}" -d postgres -c "DROP DATABASE IF EXISTS ${TARGET_DB};"
    PGPASSWORD="${POSTGRES_PASSWORD:-}" psql -h "${POSTGRES_HOST:-localhost}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER}" -d postgres -c "CREATE DATABASE ${TARGET_DB};"
  fi
fi

if [[ -n "${TARGET_CONN_URL}" && "${TARGET_CONN_URL}" =~ ^postgres(ql)?:\/\/ ]] && command -v psql >/dev/null 2>&1; then
  echo "   Restoring directly into configured database URL using host psql..."
  gunzip -c "${WORK_FILE}" | psql "${TARGET_CONN_URL}" >/dev/null
elif [[ -n "${TARGET_CONN_URL}" && "${TARGET_CONN_URL}" =~ ^postgres(ql)?:\/\/ ]] && command -v docker >/dev/null 2>&1; then
  echo "   Restoring directly into configured database URL using ephemeral docker container..."
  gunzip -c "${WORK_FILE}" | docker run --rm --net=host -i postgres:16-alpine psql "${TARGET_CONN_URL}" >/dev/null
elif [[ -n "${DETECTED_CONTAINER}" ]]; then
  echo "   Restoring into container: ${DETECTED_CONTAINER}..."
  gunzip -c "${WORK_FILE}" | docker exec -i "${DETECTED_CONTAINER}" psql -U "${POSTGRES_USER}" -d "${TARGET_DB}" >/dev/null
elif command -v psql >/dev/null 2>&1; then
  echo "   Restoring via local psql client..."
  gunzip -c "${WORK_FILE}" | PGPASSWORD="${POSTGRES_PASSWORD:-}" psql -h "${POSTGRES_HOST:-localhost}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER}" -d "${TARGET_DB}" >/dev/null
else
  echo "ERROR: Neither configured database URL, running Docker container, nor host 'psql' client found."
  [[ -n "${TMP_DECRYPTED}" ]] && rm -f "${TMP_DECRYPTED}"
  exit 1
fi
[[ -n "${TMP_DECRYPTED}" ]] && rm -f "${TMP_DECRYPTED}"
echo "✔ Database restoration completed."

# 5. UPLOADS RESTORATION (IF SPECIFIED)
if [[ -n "${UPLOADS_ARCHIVE}" ]] && [[ -f "${UPLOADS_ARCHIVE}" ]]; then
  echo "-> [4/4] Restoring user uploaded media..."
  WORK_UPLOADS="${UPLOADS_ARCHIVE}"
  TMP_UPLOADS=""
  if [[ "${UPLOADS_ARCHIVE}" == *.enc ]]; then
    TMP_UPLOADS="$(mktemp -t isuru_uploads_XXXXXX.tar.gz)"
    openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -pass "pass:${ENCRYPTION_KEY}" -in "${UPLOADS_ARCHIVE}" -out "${TMP_UPLOADS}"
    WORK_UPLOADS="${TMP_UPLOADS}"
  fi
  mkdir -p "${UPLOAD_DIR}"
  tar -xzf "${WORK_UPLOADS}" -C "${UPLOAD_DIR}"
  [[ -n "${TMP_UPLOADS}" ]] && rm -f "${TMP_UPLOADS}"
  echo "✔ Uploads media restored to: ${UPLOAD_DIR}"
fi

echo "-----------------------------------------------------------------"
echo "✔ Restoration completed successfully into '${TARGET_DB}'!"
echo "================================================================="
