#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# land-the-plane.sh
#
# AFROMATIONS Studios — CLI trigger for the "Land the Plane" deployment.
#
# Usage:
#   ./scripts/land-the-plane.sh                     # standard deploy
#   ./scripts/land-the-plane.sh "hotfix for gallery" # deploy with reason
#
# Prerequisites:
#   • GitHub CLI installed: https://cli.github.com
#   • Authenticated: gh auth login
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="executiveusa/AFROMATIONS"
WORKFLOW="land-the-plane.yml"
REASON="${1:-Landing the plane — standard deployment}"

# ── Verify gh CLI is available ───────────────────────────────────────────────
if ! command -v gh &>/dev/null; then
  echo "❌ GitHub CLI not found. Install it: https://cli.github.com"
  exit 1
fi

# ── Verify auth ──────────────────────────────────────────────────────────────
if ! gh auth status &>/dev/null; then
  echo "❌ Not authenticated. Run: gh auth login"
  exit 1
fi

echo ""
echo "  🛬  Landing the Plane"
echo "  ─────────────────────────────"
echo "  Repo   : $REPO"
echo "  Reason : $REASON"
echo ""

# ── Trigger the workflow ──────────────────────────────────────────────────────
gh workflow run "$WORKFLOW" \
  --repo "$REPO" \
  --field reason="$REASON"

echo "✅ Workflow triggered."
echo ""
echo "  Monitor at:"
echo "  https://github.com/$REPO/actions/workflows/$WORKFLOW"
echo ""
echo "  Or watch live:"
echo "  gh run watch --repo $REPO"
echo ""
