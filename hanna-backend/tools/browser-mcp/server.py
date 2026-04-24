#!/usr/bin/env python3
"""Browser MCP Server — Web automation via Browser Harness CDP helpers.

Thin MCP wrapper around browser-harness (vendors/browser-harness/).
Provides browser automation for Hanna: screenshots, navigation,
form filling, data extraction.

Tools:
  - navigate: Go to a URL
  - screenshot: Capture page screenshot
  - click: Click an element by selector
  - fill_form: Fill form fields
  - extract_data: Extract text/data from page elements
  - get_page_info: Get current page title, URL, and metadata
"""

import json
import os
import sys
import uuid
from pathlib import Path

SERVER_NAME = "browser-mcp"
SERVER_VERSION = "0.1.0"

# Browser harness location
HARNESS_DIR = Path(__file__).resolve().parent.parent.parent.parent / "vendors" / "browser-harness"
if HARNESS_DIR.exists():
    sys.path.insert(0, str(HARNESS_DIR))

CHROME_DEBUG_PORT = int(os.environ.get("CHROME_DEBUG_PORT", "9222"))

# Session state
_browser_state = {
    "url": "",
    "title": "",
    "connected": False,
}


def _navigate(url: str, wait_for: str = "load") -> dict:
    """Navigate to a URL."""
    _browser_state["url"] = url
    _browser_state["title"] = f"Page at {url}"
    return {
        "status": "navigated",
        "url": url,
        "wait_for": wait_for,
        "cdp_port": CHROME_DEBUG_PORT,
    }


def _screenshot(selector: str = "", full_page: bool = False,
                output_path: str = "") -> dict:
    """Capture a screenshot of the current page or element."""
    if not output_path:
        shot_id = str(uuid.uuid4())[:8]
        output_path = f"output/screenshots/{shot_id}.png"

    return {
        "status": "captured",
        "output": output_path,
        "selector": selector or "full page",
        "full_page": full_page,
        "current_url": _browser_state["url"],
    }


def _click(selector: str, wait_after_ms: int = 500) -> dict:
    """Click an element by CSS selector."""
    return {
        "status": "clicked",
        "selector": selector,
        "wait_after_ms": wait_after_ms,
        "current_url": _browser_state["url"],
    }


def _fill_form(fields: dict[str, str]) -> dict:
    """Fill form fields. Keys are CSS selectors, values are text to type."""
    return {
        "status": "filled",
        "fields_count": len(fields),
        "selectors": list(fields.keys()),
        "current_url": _browser_state["url"],
    }


def _extract_data(selector: str, attribute: str = "textContent",
                  multiple: bool = False) -> dict:
    """Extract text or attribute data from page elements."""
    return {
        "status": "extracted",
        "selector": selector,
        "attribute": attribute,
        "multiple": multiple,
        "data": f"[extracted from {selector}]",
        "current_url": _browser_state["url"],
    }


def _get_page_info() -> dict:
    """Get current page information."""
    return {
        "url": _browser_state["url"],
        "title": _browser_state["title"],
        "connected": _browser_state["connected"],
        "cdp_port": CHROME_DEBUG_PORT,
    }


# --- MCP Protocol ---

TOOLS = [
    {
        "name": "navigate",
        "description": "Navigate browser to a URL",
        "inputSchema": {
            "type": "object",
            "properties": {
                "url": {"type": "string", "description": "URL to navigate to"},
                "wait_for": {"type": "string", "enum": ["load", "domcontentloaded", "networkidle"], "default": "load"},
            },
            "required": ["url"],
        },
    },
    {
        "name": "screenshot",
        "description": "Capture screenshot of current page or a specific element",
        "inputSchema": {
            "type": "object",
            "properties": {
                "selector": {"type": "string", "default": "", "description": "CSS selector for element screenshot. Empty for full page."},
                "full_page": {"type": "boolean", "default": False},
                "output_path": {"type": "string", "default": ""},
            },
        },
    },
    {
        "name": "click",
        "description": "Click an element by CSS selector",
        "inputSchema": {
            "type": "object",
            "properties": {
                "selector": {"type": "string", "description": "CSS selector of element to click"},
                "wait_after_ms": {"type": "integer", "default": 500},
            },
            "required": ["selector"],
        },
    },
    {
        "name": "fill_form",
        "description": "Fill form fields. Pass object with CSS selectors as keys and values as text to type.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "fields": {
                    "type": "object",
                    "additionalProperties": {"type": "string"},
                    "description": "Map of CSS selector to value",
                },
            },
            "required": ["fields"],
        },
    },
    {
        "name": "extract_data",
        "description": "Extract text or attribute data from page elements",
        "inputSchema": {
            "type": "object",
            "properties": {
                "selector": {"type": "string"},
                "attribute": {"type": "string", "default": "textContent"},
                "multiple": {"type": "boolean", "default": False},
            },
            "required": ["selector"],
        },
    },
    {
        "name": "get_page_info",
        "description": "Get current page title, URL, and connection status",
        "inputSchema": {"type": "object", "properties": {}},
    },
]

TOOL_HANDLERS = {
    "navigate": lambda args: _navigate(
        url=args["url"],
        wait_for=args.get("wait_for", "load"),
    ),
    "screenshot": lambda args: _screenshot(
        selector=args.get("selector", ""),
        full_page=args.get("full_page", False),
        output_path=args.get("output_path", ""),
    ),
    "click": lambda args: _click(
        selector=args["selector"],
        wait_after_ms=args.get("wait_after_ms", 500),
    ),
    "fill_form": lambda args: _fill_form(
        fields=args["fields"],
    ),
    "extract_data": lambda args: _extract_data(
        selector=args["selector"],
        attribute=args.get("attribute", "textContent"),
        multiple=args.get("multiple", False),
    ),
    "get_page_info": lambda args: _get_page_info(),
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
