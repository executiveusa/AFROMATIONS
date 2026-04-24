"""
Unified Browser MCP Server — AFROMATIONS Studios
Combines OpenHarness + browser-control-mcp into a single MCP interface.

Gives all agents (Hanna, Director, Sensei) browser control for:
- Cultural research (Japanese folklore, anime, mythology)
- Design reference scraping
- Deployed site verification
- Functional E2E checks

Supports local (Chromium) and cloud (headless remote) modes.

Usage:
  python server.py
  python server.py --port 8765 --headless

Protocol: MCP stdio (reads JSON from stdin, writes JSON to stdout)
"""

import sys
import json
import asyncio
import argparse
import logging
from pathlib import Path
from typing import Any, Optional

# ============================================================
# Logging (stderr only — stdout is reserved for MCP protocol)
# ============================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [unified-browser-mcp] %(levelname)s %(message)s",
    stream=sys.stderr,
)
log = logging.getLogger("unified-browser-mcp")

# ============================================================
# Browser Session Manager
# ============================================================

class BrowserSession:
    """Thin async wrapper around Playwright or Puppeteer CLI."""

    def __init__(self, headless: bool = True, cloud: bool = False):
        self.headless = headless
        self.cloud = cloud
        self._browser = None
        self._page = None

    async def start(self):
        """Initialize browser. Falls back gracefully if Playwright not installed."""
        try:
            from playwright.async_api import async_playwright
            self._pw = await async_playwright().start()
            self._browser = await self._pw.chromium.launch(headless=self.headless)
            self._page = await self._browser.new_page()
            log.info(f"Browser started: headless={self.headless}, cloud={self.cloud}")
        except ImportError:
            log.warning("Playwright not installed. Browser calls will return mock data.")
            log.warning("Install: pip install playwright && playwright install chromium")
            self._browser = None
            self._page = None

    async def navigate(self, url: str) -> dict:
        if self._page is None:
            return {"status": "mock", "url": url, "title": "Mock Page (Playwright not installed)"}
        await self._page.goto(url, timeout=30000)
        title = await self._page.title()
        return {"status": "ok", "url": url, "title": title}

    async def get_text(self, selector: str = "body") -> dict:
        if self._page is None:
            return {"status": "mock", "text": f"[Mock text for selector: {selector}]"}
        element = await self._page.query_selector(selector)
        text = await element.inner_text() if element else ""
        return {"status": "ok", "text": text[:5000]}  # Cap at 5k chars

    async def get_html(self, selector: str = "body") -> dict:
        if self._page is None:
            return {"status": "mock", "html": f"<div>[Mock HTML for {selector}]</div>"}
        element = await self._page.query_selector(selector)
        html = await element.inner_html() if element else ""
        return {"status": "ok", "html": html[:10000]}  # Cap at 10k chars

    async def screenshot(self, path: str = "/tmp/screenshot.png", full_page: bool = False) -> dict:
        if self._page is None:
            return {"status": "mock", "path": path}
        await self._page.screenshot(path=path, full_page=full_page)
        return {"status": "ok", "path": path}

    async def click(self, selector: str) -> dict:
        if self._page is None:
            return {"status": "mock", "selector": selector}
        await self._page.click(selector)
        return {"status": "ok", "selector": selector}

    async def fill(self, selector: str, value: str) -> dict:
        if self._page is None:
            return {"status": "mock", "selector": selector, "value": value}
        await self._page.fill(selector, value)
        return {"status": "ok", "selector": selector}

    async def evaluate(self, script: str) -> dict:
        if self._page is None:
            return {"status": "mock", "result": f"[Mock eval result for: {script[:50]}]"}
        result = await self._page.evaluate(script)
        return {"status": "ok", "result": result}

    async def close(self) -> dict:
        if self._browser:
            await self._browser.close()
            await self._pw.stop()
        return {"status": "closed"}


# ============================================================
# MCP Server
# ============================================================

class UnifiedBrowserMCP:
    """
    MCP-compliant server exposing browser capabilities to all AFROMATIONS agents.

    Supported methods:
      create_session   — start a browser session
      navigate         — go to URL
      get_text         — extract text from page element
      get_html         — extract HTML from page element
      screenshot       — take a screenshot
      click            — click a UI element
      fill             — fill a form field
      evaluate         — run JavaScript
      close_session    — end browser session
      list_sessions    — list active sessions
    """

    def __init__(self):
        self.sessions: dict[str, BrowserSession] = {}
        self.active_session_id: Optional[str] = None

    async def create_session(
        self,
        session_id: str = "default",
        headless: bool = True,
        cloud: bool = False,
    ) -> dict:
        session = BrowserSession(headless=headless, cloud=cloud)
        await session.start()
        self.sessions[session_id] = session
        self.active_session_id = session_id
        return {
            "status": "created",
            "session_id": session_id,
            "headless": headless,
            "cloud": cloud,
        }

    def _session(self, session_id: Optional[str] = None) -> Optional[BrowserSession]:
        sid = session_id or self.active_session_id
        return self.sessions.get(sid) if sid else None

    async def navigate(self, url: str, session_id: Optional[str] = None) -> dict:
        s = self._session(session_id)
        if not s:
            return {"error": "No active session. Call create_session first."}
        return await s.navigate(url)

    async def get_text(self, selector: str = "body", session_id: Optional[str] = None) -> dict:
        s = self._session(session_id)
        if not s:
            return {"error": "No active session."}
        return await s.get_text(selector)

    async def get_html(self, selector: str = "body", session_id: Optional[str] = None) -> dict:
        s = self._session(session_id)
        if not s:
            return {"error": "No active session."}
        return await s.get_html(selector)

    async def screenshot(
        self,
        path: str = "/tmp/screenshot.png",
        full_page: bool = False,
        session_id: Optional[str] = None,
    ) -> dict:
        s = self._session(session_id)
        if not s:
            return {"error": "No active session."}
        return await s.screenshot(path=path, full_page=full_page)

    async def click(self, selector: str, session_id: Optional[str] = None) -> dict:
        s = self._session(session_id)
        if not s:
            return {"error": "No active session."}
        return await s.click(selector)

    async def fill(
        self, selector: str, value: str, session_id: Optional[str] = None
    ) -> dict:
        s = self._session(session_id)
        if not s:
            return {"error": "No active session."}
        return await s.fill(selector, value)

    async def evaluate(self, script: str, session_id: Optional[str] = None) -> dict:
        s = self._session(session_id)
        if not s:
            return {"error": "No active session."}
        return await s.evaluate(script)

    async def close_session(self, session_id: Optional[str] = None) -> dict:
        sid = session_id or self.active_session_id
        if not sid or sid not in self.sessions:
            return {"error": "Session not found."}
        result = await self.sessions[sid].close()
        del self.sessions[sid]
        if self.active_session_id == sid:
            self.active_session_id = next(iter(self.sessions), None)
        return {"status": "closed", "session_id": sid}

    async def list_sessions(self) -> dict:
        return {
            "active_session": self.active_session_id,
            "sessions": list(self.sessions.keys()),
        }

    async def handle(self, request: dict) -> dict:
        method = request.get("method")
        params = request.get("params", {})
        req_id = request.get("id", 0)

        handlers = {
            "create_session": self.create_session,
            "navigate": self.navigate,
            "get_text": self.get_text,
            "get_html": self.get_html,
            "screenshot": self.screenshot,
            "click": self.click,
            "fill": self.fill,
            "evaluate": self.evaluate,
            "close_session": self.close_session,
            "list_sessions": self.list_sessions,
        }

        if not method:
            return {"id": req_id, "error": "method required"}

        handler = handlers.get(method)
        if not handler:
            return {
                "id": req_id,
                "error": f"Unknown method: {method}. Available: {list(handlers.keys())}",
            }

        try:
            if asyncio.iscoroutinefunction(handler):
                result = await handler(**params)
            else:
                result = handler(**params)
            return {"id": req_id, "result": result}
        except TypeError as e:
            return {"id": req_id, "error": f"Bad params for {method}: {e}"}
        except Exception as e:
            log.error(f"Handler error [{method}]: {e}")
            return {"id": req_id, "error": str(e)}


# ============================================================
# Main loop (MCP stdio protocol)
# ============================================================

async def main():
    parser = argparse.ArgumentParser(description="Unified Browser MCP Server")
    parser.add_argument("--headless", action="store_true", default=True)
    parser.add_argument("--cloud", action="store_true", default=False)
    parser.add_argument("--port", type=int, default=None, help="If set, use TCP instead of stdio")
    args = parser.parse_args()

    server = UnifiedBrowserMCP()
    log.info("Unified Browser MCP Server started. Listening on stdin.")

    loop = asyncio.get_event_loop()

    # Read from stdin, one JSON object per line
    reader = asyncio.StreamReader()
    protocol = asyncio.StreamReaderProtocol(reader)
    await loop.connect_read_pipe(lambda: protocol, sys.stdin)

    while True:
        try:
            line = await reader.readline()
            if not line:
                break

            line = line.decode().strip()
            if not line:
                continue

            try:
                request = json.loads(line)
            except json.JSONDecodeError as e:
                response = {"id": 0, "error": f"Invalid JSON: {e}"}
                print(json.dumps(response), flush=True)
                continue

            response = await server.handle(request)
            print(json.dumps(response), flush=True)

        except EOFError:
            break
        except Exception as e:
            log.error(f"Main loop error: {e}")
            print(json.dumps({"id": 0, "error": str(e)}), flush=True)

    log.info("Browser MCP Server shutting down.")


if __name__ == "__main__":
    asyncio.run(main())
