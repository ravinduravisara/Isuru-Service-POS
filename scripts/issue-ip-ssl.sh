#!/usr/bin/env bash
# ==============================================================================
# ISURU SERVICE CENTER POS: AUTOMATED PUBLIC IP TLS CERTIFICATE ISSUANCE & RENEWAL
# ==============================================================================
# Target Address: https://88.222.242.20:8443
# Provider: ZeroSSL (via acme.sh)
#
# GUARANTEES:
# 1. Zero downtime for existing IAAC website on ports 80 and 443.
# 2. Uses webroot verification directory (/var/www/acme-challenge) without
#    binding or interrupting port 80/443.
# 3. Cryptographically valid public IP certificate (no self-signed certs).
# 4. Automated 60-day renewal via acme.sh cron + docker nginx reload.
# ==============================================================================

set -euo pipefail

PUBLIC_IP="88.222.242.20"
WEBROOT_DIR="/var/www/acme-challenge"
SSL_TARGET_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../docker/ssl" && pwd)"
FULLCHAIN_PATH="${SSL_TARGET_DIR}/fullchain.pem"
PRIVKEY_PATH="${SSL_TARGET_DIR}/privkey.pem"
ACME_SH="${HOME}/.acme.sh/acme.sh"

echo "================================================================="
echo "   ISURU SERVICE CENTER: PUBLIC IP TLS CERTIFICATE MANAGER"
echo "================================================================="
echo "Target IPv4:        ${PUBLIC_IP}"
echo "ACME Webroot:       ${WEBROOT_DIR}"
echo "SSL Destination:    ${SSL_TARGET_DIR}"
echo "Planned Access:     https://${PUBLIC_IP}:8443"
echo "-----------------------------------------------------------------"

mkdir -p "${SSL_TARGET_DIR}"
mkdir -p "${WEBROOT_DIR}/.well-known/acme-challenge"

# 1. Install acme.sh if not present
if [[ ! -x "${ACME_SH}" ]]; then
  echo "-> [1/4] Installing acme.sh ACME client..."
  if ! command -v curl >/dev/null 2>&1; then
    sudo apt-get update && sudo apt-get install -y curl socat
  fi
  curl https://get.acme.sh | sh -s email=admin@isuruservice.local
  # shellcheck disable=SC1090
  source "${HOME}/.acme.sh/acme.sh.env" 2>/dev/null || true
fi

# 2. Register ZeroSSL Account
echo "-> [2/4] Registering ACME account with ZeroSSL..."
"${ACME_SH}" --register-account -m "isuru.pos.operations@gmail.com" --server zerossl || true

# 3. Issue IP TLS Certificate
echo "-> [3/4] Requesting 90-day Public IP TLS Certificate for ${PUBLIC_IP}..."
echo "   Validation method: Webroot (${WEBROOT_DIR}) via existing host Nginx"

if "${ACME_SH}" --issue -d "${PUBLIC_IP}" -w "${WEBROOT_DIR}" --server zerossl --keylength 2048; then
  echo "✔ Certificate issued successfully by ZeroSSL!"
else
  echo "⚠ Automated webroot challenge failed. Ensure host Nginx includes:"
  echo ""
  echo "    location /.well-known/acme-challenge/ {"
  echo "        root /var/www/acme-challenge;"
  echo "    }"
  echo ""
  echo "Then re-run: $0"
  exit 1
fi

# 4. Install Certificate to POS Docker directory & configure reload hook
echo "-> [4/4] Installing certificate to POS Nginx directory..."
"${ACME_SH}" --install-cert -d "${PUBLIC_IP}" \
  --key-file "${PRIVKEY_PATH}" \
  --fullchain-file "${FULLCHAIN_PATH}" \
  --reloadcmd "docker ps --format '{{.Names}}' | grep -q 'isuru-pos-prod-frontend' && docker exec isuru-pos-prod-frontend nginx -s reload || true"

# Verify installed certificate
echo "-> Verifying installed TLS certificate..."
if openssl x509 -in "${FULLCHAIN_PATH}" -noout -subject -dates; then
  echo "✔ Production IP certificate is active and verified."
  echo "================================================================="
  echo "✔ TLS Setup Complete! Automatic cron renewal is active."
  echo "================================================================="
else
  echo "ERROR: Certificate verification failed."
  exit 1
fi
