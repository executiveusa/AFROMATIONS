#!/usr/bin/env bash
# ============================================================
# AFROMATIONS Studios — VPS Deploy Script
# Target: 31.220.58.212 (co-located with Supabase)
#
# Usage:
#   ./scripts/deploy-vps.sh           # Full deploy
#   ./scripts/deploy-vps.sh --update  # Pull latest + restart
# ============================================================
set -euo pipefail

VPS_HOST="31.220.58.212"
VPS_USER="root"
REMOTE_DIR="/opt/afromations"
REPO_URL="git@github.com:executiveusa/AFROMATIONS.git"
BRANCH="main"
SSH_CMD="ssh ${VPS_USER}@${VPS_HOST}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err() { echo -e "${RED}[ERROR]${NC} $1" >&2; exit 1; }

# ---- Preflight checks ----
check_ssh() {
  log "Testing SSH connection to ${VPS_HOST}..."
  ${SSH_CMD} "echo 'SSH OK'" || err "Cannot SSH to ${VPS_HOST}. Check your SSH key."
}

check_docker() {
  log "Checking Docker on VPS..."
  ${SSH_CMD} "docker --version && docker compose version" || err "Docker/Docker Compose not installed on VPS."
}

check_env() {
  if [ ! -f ".env" ]; then
    err ".env file not found locally. Copy .env.example → .env and fill in your API keys."
  fi
  log ".env file found."
}

# ---- Deploy functions ----
initial_deploy() {
  log "=== INITIAL DEPLOY ==="

  # 1. Clone repo on VPS
  log "Cloning repository on VPS..."
  ${SSH_CMD} "
    if [ -d '${REMOTE_DIR}' ]; then
      echo 'Directory exists, pulling latest...'
      cd ${REMOTE_DIR} && git pull origin ${BRANCH}
    else
      git clone --branch ${BRANCH} ${REPO_URL} ${REMOTE_DIR}
    fi
  "

  # 2. Clone vendor submodules (the 5 core repos)
  log "Cloning vendor repos on VPS..."
  ${SSH_CMD} "
    cd ${REMOTE_DIR}/vendors
    [ -d hermes-agent ] || git clone https://github.com/NousResearch/hermes-agent.git
    [ -d browser-harness ] || git clone https://github.com/browser-use/browser-harness.git
    [ -d synthia-gateway ] || git clone https://github.com/executiveusa/synthia-gateway.git
    [ -d hermes-webui ] || git clone https://github.com/nesquena/hermes-webui.git
    [ -d paperclip ] || git clone https://github.com/paperclipai/paperclip.git
  "

  # 3. Upload .env
  log "Uploading .env to VPS..."
  scp .env "${VPS_USER}@${VPS_HOST}:${REMOTE_DIR}/.env"

  # 4. Build and start Docker stack
  log "Building and starting Docker stack..."
  ${SSH_CMD} "
    cd ${REMOTE_DIR}
    docker compose pull
    docker compose build --no-cache
    docker compose up -d
  "

  # 5. Verify
  verify_deploy
}

update_deploy() {
  log "=== UPDATE DEPLOY ==="

  # Pull latest code
  ${SSH_CMD} "cd ${REMOTE_DIR} && git pull origin ${BRANCH}"

  # Re-upload .env (in case keys changed)
  scp .env "${VPS_USER}@${VPS_HOST}:${REMOTE_DIR}/.env"

  # Rebuild and restart
  ${SSH_CMD} "
    cd ${REMOTE_DIR}
    docker compose pull
    docker compose build
    docker compose up -d --remove-orphans
  "

  verify_deploy
}

verify_deploy() {
  log "Verifying deployment..."
  ${SSH_CMD} "
    cd ${REMOTE_DIR}
    echo '--- Container Status ---'
    docker compose ps
    echo ''
    echo '--- Health Check ---'
    sleep 5
    curl -sf http://localhost:8787 > /dev/null && echo 'WebUI: OK (port 8787)' || echo 'WebUI: FAILED'
    curl -sf http://localhost:3000/v1/models > /dev/null && echo 'Gateway: OK (port 3000)' || echo 'Gateway: FAILED'
  "
  log "Deploy complete! WebUI: http://${VPS_HOST}:8787"
}

# ---- Main ----
check_ssh
check_docker
check_env

if [ "${1:-}" = "--update" ]; then
  update_deploy
else
  initial_deploy
fi
