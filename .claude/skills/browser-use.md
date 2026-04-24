# Browser Use — Unified Browser Control

Control a real browser (Chromium) for research, scraping, testing, and verification.

## Source
`vendors/browser-control-mcp/` + `vendors/openharness/`
MCP server: `hanna-backend/tools/unified-browser-mcp/server.py`

## When to use
- Triggered by "open browser", "search the web", "scrape", "go to [URL]", "research [topic]"
- When verifying cultural accuracy (Japanese anime, folklore)
- When finding design inspiration
- For E2E testing of deployed pages

## Capabilities (per agent personality)

### Hanna (Learning OS)
- Research Japanese cultural references
- Find authentic folklore/mythology sources
- Verify anime-specific claims
- Find vocabulary usage in real-world context

### Director
- Study anime cinematography and shot composition
- Find color palette references
- Research scene composition

### Sensei (Teaching mode)
- Pull authentic Japanese language examples
- Research idiom origins
- Find episode-specific content

## Usage

```
# Navigate
browser.navigate("https://example.com")

# Scrape text
browser.scrape_text("article.content")

# Take screenshot
browser.screenshot("full")

# Click element
browser.click("button#submit")

# Fill form
browser.fill("input[name='search']", "妖怪")
```

## Local vs Cloud
- LOCAL (default): Fast, private, uses Chromium on host
- CLOUD: Set `cloud=True` for scalable, stateless sessions

## Error Handling
- Navigation failure: retry once with 5s delay
- Scraping timeout: fall back to text summary
- Always log URL visited to session memory

## Output
Report: URL, action taken, content returned or screenshot saved.
