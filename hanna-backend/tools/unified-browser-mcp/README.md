# Unified Browser MCP

Gives all AFROMATIONS agents (Hanna, Director, Sensei) browser control.

## Install

```bash
pip install playwright
playwright install chromium
```

## Run

```bash
python server.py
```

## Methods

| Method | Params | Description |
|--------|--------|-------------|
| `create_session` | session_id, headless, cloud | Start browser session |
| `navigate` | url, session_id | Go to URL |
| `get_text` | selector, session_id | Extract text from element |
| `get_html` | selector, session_id | Extract HTML from element |
| `screenshot` | path, full_page, session_id | Take screenshot |
| `click` | selector, session_id | Click element |
| `fill` | selector, value, session_id | Fill input |
| `evaluate` | script, session_id | Run JavaScript |
| `close_session` | session_id | End session |
| `list_sessions` | — | List active sessions |

## Example

```json
{"id": 1, "method": "create_session", "params": {"session_id": "research", "headless": true}}
{"id": 2, "method": "navigate", "params": {"url": "https://en.wikipedia.org/wiki/Yokai"}}
{"id": 3, "method": "get_text", "params": {"selector": ".mw-content-text p"}}
```

## Personality Wiring

All 3 agent personalities have browser access:
- **Hanna**: Japanese culture research, anime verification
- **Director**: Cinematography reference, color palette research
- **Sensei**: Language examples, idiom research, episode lookup
