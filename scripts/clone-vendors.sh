#!/usr/bin/env bash
# Clone all vendor dependencies for AFROMATIONS
# Usage: ./scripts/clone-vendors.sh
set -euo pipefail

VENDORS_DIR="$(cd "$(dirname "$0")/.." && pwd)/vendors"
mkdir -p "$VENDORS_DIR"
cd "$VENDORS_DIR"

clone_if_missing() {
  local name="$1" url="$2" shallow="${3:-}"
  if [ -d "$name" ]; then
    echo "✓ $name (exists)"
  else
    echo "⏳ Cloning $name..."
    if [ "$shallow" = "--shallow" ]; then
      git clone --depth 1 "$url" "$name"
    else
      git clone "$url" "$name"
    fi
    echo "✓ $name (cloned)"
  fi
}

echo "=== Core Infrastructure ==="
clone_if_missing hermes-agent     https://github.com/NousResearch/hermes-agent.git
clone_if_missing hermes-webui     https://github.com/nesquena/hermes-webui.git
clone_if_missing synthia-gateway  https://github.com/executiveusa/synthia-gateway.git
clone_if_missing browser-harness  https://github.com/browser-use/browser-harness.git
clone_if_missing paperclip        https://github.com/paperclipai/paperclip.git --shallow

echo ""
echo "=== MCP & Tools ==="
clone_if_missing openmontage      https://github.com/calesthio/OpenMontage.git
clone_if_missing supabase-mcp     https://github.com/supabase-community/supabase-mcp.git
clone_if_missing mcp-ext-apps     https://github.com/modelcontextprotocol/ext-apps.git
clone_if_missing jcodemunch-mcp   https://github.com/jgravelle/jcodemunch-mcp.git
clone_if_missing mcp2cli          https://github.com/knowsuchagency/mcp2cli.git

echo ""
echo "=== Skills & Reference ==="
clone_if_missing mattpocock-skills https://github.com/mattpocock/skills.git
clone_if_missing gbrain           https://github.com/garrytan/gbrain.git
clone_if_missing tegaki           https://github.com/KurtGokhan/tegaki.git
clone_if_missing ralphy           https://github.com/michaelshimeles/ralphy.git

echo ""
echo "=== Pauli Ecosystem ==="
clone_if_missing pauli-Uncodixfy       https://github.com/executiveusa/pauli-Uncodixfy.git
clone_if_missing pauli-taste-skill     git@github.com:executiveusa/pauli-taste-skill.git
clone_if_missing pauli-blog            git@github.com:executiveusa/pauli-blog.git
clone_if_missing paulsuperpowers       git@github.com:executiveusa/paulsuperpowers.git
clone_if_missing pauli-impeccable-design- git@github.com:executiveusa/pauli-impeccable-design-.git

echo ""
echo "=== Done! $(ls -d */ 2>/dev/null | wc -l) vendor repos ready ==="
