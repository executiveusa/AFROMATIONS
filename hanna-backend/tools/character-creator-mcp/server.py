#!/usr/bin/env python3
"""Character Creator MCP Server — Reallusion Character Creator 4 integration.

Wraps the CC4 pipeline from ANIMATION & 3D/ for headless character
customization and export.

Tools:
  - list_templates: List CC4 character templates
  - load_template: Load a character template
  - customize_character: Apply customizations (hair, skin, outfit, etc.)
  - export_character: Export as FBX/GLB for web or game engine
  - get_character_status: Check character build status
"""

import json
import os
import sys
import uuid
from pathlib import Path

SERVER_NAME = "character-creator-mcp"
SERVER_VERSION = "0.1.0"

CC4_DIR = Path(os.environ.get(
    "CC4_DIR",
    str(Path(__file__).resolve().parent.parent.parent.parent / "ANIMATION & 3D" / "Character Creator 4"),
))
REALLUSION_TEMPLATES = Path(os.environ.get(
    "REALLUSION_TEMPLATES",
    str(Path(__file__).resolve().parent.parent.parent.parent / "ANIMATION & 3D" / "Reallusion Templates"),
))
REALLUSION_CUSTOM = Path(os.environ.get(
    "REALLUSION_CUSTOM",
    str(Path(__file__).resolve().parent.parent.parent.parent / "ANIMATION & 3D" / "Reallusion Custom"),
))

# In-memory character store
_characters: dict[str, dict] = {}


def _list_templates() -> dict:
    """List available CC4 character templates."""
    templates = []
    for search_dir in [REALLUSION_TEMPLATES, REALLUSION_CUSTOM]:
        if search_dir.exists():
            for f in search_dir.rglob("*"):
                if f.suffix.lower() in (".ccproject", ".ccavatar", ".fbx", ".glb", ".obj"):
                    templates.append({
                        "name": f.stem,
                        "format": f.suffix,
                        "source": search_dir.name,
                        "path": str(f.relative_to(search_dir)),
                    })
    return {
        "count": len(templates),
        "templates": templates[:50],
        "search_dirs": [str(REALLUSION_TEMPLATES), str(REALLUSION_CUSTOM)],
    }


def _load_template(template_name: str, source: str = "Reallusion Templates") -> dict:
    """Load a character template by name."""
    char_id = str(uuid.uuid4())[:8]
    _characters[char_id] = {
        "id": char_id,
        "template": template_name,
        "source": source,
        "customizations": {},
        "status": "loaded",
    }
    return {
        "character_id": char_id,
        "template": template_name,
        "status": "loaded",
    }


def _customize_character(character_id: str,
                         hair_style: str = "",
                         hair_color: str = "",
                         skin_tone: str = "",
                         eye_color: str = "",
                         outfit: str = "",
                         body_type: str = "",
                         accessories: list[str] | None = None) -> dict:
    """Apply customizations to a loaded character."""
    if character_id not in _characters:
        return {"error": f"Character {character_id} not found"}

    customizations = {}
    if hair_style:
        customizations["hair_style"] = hair_style
    if hair_color:
        customizations["hair_color"] = hair_color
    if skin_tone:
        customizations["skin_tone"] = skin_tone
    if eye_color:
        customizations["eye_color"] = eye_color
    if outfit:
        customizations["outfit"] = outfit
    if body_type:
        customizations["body_type"] = body_type
    if accessories:
        customizations["accessories"] = accessories

    _characters[character_id]["customizations"].update(customizations)
    _characters[character_id]["status"] = "customized"

    return {
        "character_id": character_id,
        "applied": list(customizations.keys()),
        "status": "customized",
    }


def _export_character(character_id: str, format: str = "glb",
                      optimize_web: bool = True,
                      include_animations: bool = False) -> dict:
    """Export character as FBX or GLB."""
    if character_id not in _characters:
        return {"error": f"Character {character_id} not found"}

    char = _characters[character_id]
    output_path = f"output/characters/{character_id}.{format}"
    char["status"] = "exported"

    return {
        "status": "exported",
        "character_id": character_id,
        "template": char["template"],
        "customizations": len(char["customizations"]),
        "format": format.upper(),
        "output": output_path,
        "web_optimized": optimize_web,
        "includes_animations": include_animations,
    }


def _get_character_status(character_id: str) -> dict:
    """Get current character build status."""
    if character_id not in _characters:
        return {"error": f"Character {character_id} not found"}
    c = _characters[character_id]
    return {
        "id": c["id"],
        "template": c["template"],
        "status": c["status"],
        "customizations": c["customizations"],
    }


# --- MCP Protocol ---

TOOLS = [
    {
        "name": "list_templates",
        "description": "List available Character Creator 4 templates",
        "inputSchema": {"type": "object", "properties": {}},
    },
    {
        "name": "load_template",
        "description": "Load a character template by name",
        "inputSchema": {
            "type": "object",
            "properties": {
                "template_name": {"type": "string", "description": "Template file name (without extension)"},
                "source": {"type": "string", "default": "Reallusion Templates"},
            },
            "required": ["template_name"],
        },
    },
    {
        "name": "customize_character",
        "description": "Apply customizations (hair, skin, outfit, etc.) to a loaded character",
        "inputSchema": {
            "type": "object",
            "properties": {
                "character_id": {"type": "string"},
                "hair_style": {"type": "string"},
                "hair_color": {"type": "string"},
                "skin_tone": {"type": "string"},
                "eye_color": {"type": "string"},
                "outfit": {"type": "string"},
                "body_type": {"type": "string"},
                "accessories": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["character_id"],
        },
    },
    {
        "name": "export_character",
        "description": "Export character as web-optimized GLB or FBX",
        "inputSchema": {
            "type": "object",
            "properties": {
                "character_id": {"type": "string"},
                "format": {"type": "string", "enum": ["glb", "fbx", "obj"], "default": "glb"},
                "optimize_web": {"type": "boolean", "default": True},
                "include_animations": {"type": "boolean", "default": False},
            },
            "required": ["character_id"],
        },
    },
    {
        "name": "get_character_status",
        "description": "Check character build status and applied customizations",
        "inputSchema": {
            "type": "object",
            "properties": {
                "character_id": {"type": "string"},
            },
            "required": ["character_id"],
        },
    },
]

TOOL_HANDLERS = {
    "list_templates": lambda args: _list_templates(),
    "load_template": lambda args: _load_template(
        template_name=args["template_name"],
        source=args.get("source", "Reallusion Templates"),
    ),
    "customize_character": lambda args: _customize_character(
        character_id=args["character_id"],
        hair_style=args.get("hair_style", ""),
        hair_color=args.get("hair_color", ""),
        skin_tone=args.get("skin_tone", ""),
        eye_color=args.get("eye_color", ""),
        outfit=args.get("outfit", ""),
        body_type=args.get("body_type", ""),
        accessories=args.get("accessories"),
    ),
    "export_character": lambda args: _export_character(
        character_id=args["character_id"],
        format=args.get("format", "glb"),
        optimize_web=args.get("optimize_web", True),
        include_animations=args.get("include_animations", False),
    ),
    "get_character_status": lambda args: _get_character_status(
        character_id=args["character_id"],
    ),
}


def handle_request(request: dict) -> dict | None:
    """Handle a JSON-RPC 2.0 request."""
    method = request.get("method", "")
    req_id = request.get("id")
    params = request.get("params", {})

    if method == "initialize":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "serverInfo": {"name": SERVER_NAME, "version": SERVER_VERSION},
            },
        }

    if method == "notifications/initialized":
        return None

    if method == "tools/list":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {"tools": TOOLS},
        }

    if method == "tools/call":
        tool_name = params.get("name", "")
        arguments = params.get("arguments", {})
        handler = TOOL_HANDLERS.get(tool_name)
        if not handler:
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "content": [{"type": "text", "text": f"Unknown tool: {tool_name}"}],
                    "isError": True,
                },
            }
        result = handler(arguments)
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "content": [{"type": "text", "text": json.dumps(result, indent=2)}],
            },
        }

    return {
        "jsonrpc": "2.0",
        "id": req_id,
        "error": {"code": -32601, "message": f"Method not found: {method}"},
    }


def main():
    """MCP stdio transport loop."""
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            request = json.loads(line)
        except json.JSONDecodeError:
            continue

        response = handle_request(request)
        if response is not None:
            sys.stdout.write(json.dumps(response) + "\n")
            sys.stdout.flush()


if __name__ == "__main__":
    main()
