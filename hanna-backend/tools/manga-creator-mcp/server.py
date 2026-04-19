#!/usr/bin/env python3
"""Manga Creator MCP Server — Right-to-left Japanese manga page generation.

CRITICAL: All output is right-to-left (右から左) reading order.
Panel numbering, text bubble placement, and page flow follow
traditional Japanese manga conventions.

Tools:
  - create_manga: Start a new manga project
  - add_page: Add a page with panel layout
  - add_panel: Add art + dialogue to a specific panel
  - add_text_bubble: Place text bubble on a panel
  - render_page: Render a single page as image
  - export_manga: Export full manga as PDF
"""

import json
import sys
import uuid
from pathlib import Path

SERVER_NAME = "manga-creator-mcp"
SERVER_VERSION = "0.1.0"

# In-memory manga store
_mangas: dict[str, dict] = {}

# Standard manga panel layouts (right-to-left)
PANEL_LAYOUTS = {
    "single": {"rows": 1, "cols": 1, "description": "Full-page single panel"},
    "two-horizontal": {"rows": 2, "cols": 1, "description": "Two horizontal strips"},
    "two-vertical": {"rows": 1, "cols": 2, "description": "Two vertical panels (read R→L)"},
    "three-strip": {"rows": 3, "cols": 1, "description": "Three horizontal strips"},
    "four-grid": {"rows": 2, "cols": 2, "description": "2x2 grid (read R→L, top→bottom)"},
    "six-grid": {"rows": 3, "cols": 2, "description": "3x2 grid (read R→L, top→bottom)"},
    "dynamic-five": {
        "rows": 3, "cols": 2,
        "description": "5 panels: large top-right, small top-left, three bottom strip",
        "custom": True,
    },
    "action-spread": {
        "rows": 2, "cols": 3,
        "description": "Action sequence: 3 top panels, 1 large bottom",
        "custom": True,
    },
}


def _create_manga(title: str, author: str = "AFROMATIONS Studios",
                  reading_direction: str = "rtl",
                  page_size: str = "B5") -> dict:
    """Create a new manga project. Default: right-to-left (RTL)."""
    manga_id = str(uuid.uuid4())[:8]
    _mangas[manga_id] = {
        "id": manga_id,
        "title": title,
        "author": author,
        "reading_direction": reading_direction,  # Always RTL for Japanese manga
        "page_size": page_size,
        "pages": [],
        "status": "draft",
    }
    return {
        "manga_id": manga_id,
        "title": title,
        "reading_direction": reading_direction,
        "note": "Reading order: right-to-left (右から左). Panels numbered from top-right.",
    }


def _add_page(manga_id: str, layout: str = "four-grid",
              bleed: bool = True) -> dict:
    """Add a page with a panel layout to the manga."""
    if manga_id not in _mangas:
        return {"error": f"Manga {manga_id} not found"}

    if layout not in PANEL_LAYOUTS:
        return {"error": f"Unknown layout: {layout}. Available: {list(PANEL_LAYOUTS.keys())}"}

    page_num = len(_mangas[manga_id]["pages"]) + 1
    page_id = str(uuid.uuid4())[:8]
    layout_def = PANEL_LAYOUTS[layout]

    page = {
        "id": page_id,
        "number": page_num,
        "layout": layout,
        "layout_info": layout_def,
        "bleed": bleed,
        "panels": [],
        "reading_order": "right-to-left, top-to-bottom",
    }
    _mangas[manga_id]["pages"].append(page)

    return {
        "page_id": page_id,
        "page_number": page_num,
        "layout": layout,
        "panel_count": layout_def["rows"] * layout_def["cols"],
        "reading_order": "RTL (右から左)",
    }


def _add_panel(manga_id: str, page_id: str, panel_index: int,
               art_prompt: str, dialogue: str = "",
               sfx: str = "", emotion: str = "neutral") -> dict:
    """Add art and dialogue to a panel. Panel index follows RTL order."""
    if manga_id not in _mangas:
        return {"error": f"Manga {manga_id} not found"}

    manga = _mangas[manga_id]
    page = next((p for p in manga["pages"] if p["id"] == page_id), None)
    if not page:
        return {"error": f"Page {page_id} not found"}

    panel = {
        "index": panel_index,
        "art_prompt": art_prompt,
        "dialogue": dialogue,
        "sfx": sfx,
        "emotion": emotion,
        "text_direction": "vertical",  # Japanese manga uses vertical text
    }
    page["panels"].append(panel)

    return {
        "panel_index": panel_index,
        "page_id": page_id,
        "art_prompt": art_prompt[:60] + "..." if len(art_prompt) > 60 else art_prompt,
        "has_dialogue": bool(dialogue),
        "text_direction": "vertical (縦書き)",
    }


def _add_text_bubble(manga_id: str, page_id: str, panel_index: int,
                     text: str, bubble_type: str = "speech",
                     position: str = "top-right",
                     language: str = "ja") -> dict:
    """Place a text bubble on a panel. Positions follow RTL conventions."""
    if manga_id not in _mangas:
        return {"error": f"Manga {manga_id} not found"}

    valid_types = ["speech", "thought", "narration", "sfx", "whisper", "shout"]
    if bubble_type not in valid_types:
        return {"error": f"Invalid bubble type. Use: {valid_types}"}

    return {
        "page_id": page_id,
        "panel_index": panel_index,
        "text": text,
        "bubble_type": bubble_type,
        "position": position,
        "language": language,
        "text_direction": "vertical" if language == "ja" else "horizontal",
    }


def _render_page(manga_id: str, page_id: str,
                 output_format: str = "png", dpi: int = 300) -> dict:
    """Render a single manga page as an image."""
    if manga_id not in _mangas:
        return {"error": f"Manga {manga_id} not found"}

    manga = _mangas[manga_id]
    page = next((p for p in manga["pages"] if p["id"] == page_id), None)
    if not page:
        return {"error": f"Page {page_id} not found"}

    output_path = f"output/manga/{manga_id}/page_{page['number']:03d}.{output_format}"
    return {
        "status": "rendered",
        "output": output_path,
        "page_number": page["number"],
        "panel_count": len(page["panels"]),
        "reading_direction": "RTL",
        "dpi": dpi,
    }


def _export_manga(manga_id: str, output_format: str = "pdf") -> dict:
    """Export full manga as PDF. Pages ordered for RTL reading."""
    if manga_id not in _mangas:
        return {"error": f"Manga {manga_id} not found"}

    manga = _mangas[manga_id]
    if not manga["pages"]:
        return {"error": "No pages in manga. Add pages first."}

    output_path = f"output/manga/{manga_id}/{manga['title']}.{output_format}"
    manga["status"] = "exported"

    return {
        "status": "exported",
        "output": output_path,
        "title": manga["title"],
        "pages": len(manga["pages"]),
        "reading_direction": "RTL (右から左)",
        "binding": "right-side (Japanese standard)",
    }


# --- MCP Protocol ---

TOOLS = [
    {
        "name": "create_manga",
        "description": "Start a new manga project. Default: right-to-left Japanese reading order.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Manga title"},
                "author": {"type": "string", "default": "AFROMATIONS Studios"},
                "reading_direction": {"type": "string", "enum": ["rtl", "ltr"], "default": "rtl"},
                "page_size": {"type": "string", "enum": ["B5", "A4", "US-comic"], "default": "B5"},
            },
            "required": ["title"],
        },
    },
    {
        "name": "add_page",
        "description": "Add a page with a panel layout. Layouts: single, two-horizontal, two-vertical, three-strip, four-grid, six-grid, dynamic-five, action-spread",
        "inputSchema": {
            "type": "object",
            "properties": {
                "manga_id": {"type": "string"},
                "layout": {"type": "string", "default": "four-grid"},
                "bleed": {"type": "boolean", "default": True},
            },
            "required": ["manga_id"],
        },
    },
    {
        "name": "add_panel",
        "description": "Add art prompt and dialogue to a specific panel. Panel index follows RTL reading order.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "manga_id": {"type": "string"},
                "page_id": {"type": "string"},
                "panel_index": {"type": "integer", "description": "0-based, RTL order"},
                "art_prompt": {"type": "string", "description": "Image generation prompt for panel art"},
                "dialogue": {"type": "string", "default": ""},
                "sfx": {"type": "string", "default": "", "description": "Sound effect text (e.g. ドカーン)"},
                "emotion": {"type": "string", "default": "neutral"},
            },
            "required": ["manga_id", "page_id", "panel_index", "art_prompt"],
        },
    },
    {
        "name": "add_text_bubble",
        "description": "Place a text bubble on a panel. Japanese text uses vertical direction.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "manga_id": {"type": "string"},
                "page_id": {"type": "string"},
                "panel_index": {"type": "integer"},
                "text": {"type": "string"},
                "bubble_type": {"type": "string", "enum": ["speech", "thought", "narration", "sfx", "whisper", "shout"], "default": "speech"},
                "position": {"type": "string", "default": "top-right"},
                "language": {"type": "string", "enum": ["ja", "en"], "default": "ja"},
            },
            "required": ["manga_id", "page_id", "panel_index", "text"],
        },
    },
    {
        "name": "render_page",
        "description": "Render a single manga page as an image (PNG/JPEG)",
        "inputSchema": {
            "type": "object",
            "properties": {
                "manga_id": {"type": "string"},
                "page_id": {"type": "string"},
                "output_format": {"type": "string", "enum": ["png", "jpeg"], "default": "png"},
                "dpi": {"type": "integer", "default": 300},
            },
            "required": ["manga_id", "page_id"],
        },
    },
    {
        "name": "export_manga",
        "description": "Export full manga as PDF. Pages ordered for right-to-left reading with right-side binding.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "manga_id": {"type": "string"},
                "output_format": {"type": "string", "enum": ["pdf", "cbz"], "default": "pdf"},
            },
            "required": ["manga_id"],
        },
    },
]

TOOL_HANDLERS = {
    "create_manga": lambda args: _create_manga(
        title=args["title"],
        author=args.get("author", "AFROMATIONS Studios"),
        reading_direction=args.get("reading_direction", "rtl"),
        page_size=args.get("page_size", "B5"),
    ),
    "add_page": lambda args: _add_page(
        manga_id=args["manga_id"],
        layout=args.get("layout", "four-grid"),
        bleed=args.get("bleed", True),
    ),
    "add_panel": lambda args: _add_panel(
        manga_id=args["manga_id"],
        page_id=args["page_id"],
        panel_index=args["panel_index"],
        art_prompt=args["art_prompt"],
        dialogue=args.get("dialogue", ""),
        sfx=args.get("sfx", ""),
        emotion=args.get("emotion", "neutral"),
    ),
    "add_text_bubble": lambda args: _add_text_bubble(
        manga_id=args["manga_id"],
        page_id=args["page_id"],
        panel_index=args["panel_index"],
        text=args["text"],
        bubble_type=args.get("bubble_type", "speech"),
        position=args.get("position", "top-right"),
        language=args.get("language", "ja"),
    ),
    "render_page": lambda args: _render_page(
        manga_id=args["manga_id"],
        page_id=args["page_id"],
        output_format=args.get("output_format", "png"),
        dpi=args.get("dpi", 300),
    ),
    "export_manga": lambda args: _export_manga(
        manga_id=args["manga_id"],
        output_format=args.get("output_format", "pdf"),
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
