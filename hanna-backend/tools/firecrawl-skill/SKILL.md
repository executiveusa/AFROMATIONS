# SKILL: Web Research & Scraping

**Skill ID:** `hana-web-research`  
**Agent:** Hanna (花)  
**Runtime:** Cloudflare Workers (Hono)  
**Powered by:** [Firecrawl](https://firecrawl.dev)

---

## What This Skill Does

Gives Hanna the ability to read the live web — scrape any page, search for current information, extract YouTube transcripts, and run compound research tasks with Gemini summarization.

---

## Endpoints

All endpoints mount under `/api/hana/` on the Hanna backend.

### `POST /api/hana/scrape`
Scrape any URL and return its Markdown content.

```json
{
  "url": "https://example.com/article",
  "formats": ["markdown"],
  "onlyMainContent": true,
  "timeout": 15000
}
```

**Response:**
```json
{
  "skill": "web-scrape",
  "url": "...",
  "success": true,
  "content": { "markdown": "...", "metadata": {} },
  "timestamp": "..."
}
```

---

### `POST /api/hana/search`
Search the web using Firecrawl's search API.

```json
{
  "query": "black-owned anime studios 2025",
  "limit": 5,
  "scrapeOptions": { "formats": ["markdown"] }
}
```

**Response:**
```json
{
  "skill": "web-search",
  "query": "...",
  "count": 5,
  "results": [{ "url": "...", "title": "...", "description": "...", "markdown": "..." }],
  "timestamp": "..."
}
```

---

### `POST /api/hana/youtube`
Get the transcript and metadata from a YouTube video.

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "skill": "youtube-transcript",
  "url": "...",
  "title": "Video Title",
  "description": "...",
  "transcript": "## Transcript\n...",
  "timestamp": "..."
}
```

If Firecrawl can't isolate a transcript block, `fullContent` contains the entire scraped markdown as a fallback.

---

### `POST /api/hana/research`
Compound research: search → optionally deep-scrape top pages → Gemini summary.

```json
{
  "query": "anime industry funding sources Japan vs US",
  "depth": "deep",
  "summarize": true
}
```

- `depth: "quick"` — search with inline markdown snippets only (fast, 1 API call)
- `depth: "deep"` — search + full scrape of top 3 results (thorough, 4 API calls)

**Response:**
```json
{
  "skill": "web-research",
  "query": "...",
  "depth": "deep",
  "searchResults": [{ "url": "...", "title": "...", "description": "..." }],
  "deepContent": [{ "url": "...", "preview": "first 500 chars..." }],
  "summary": "Gemini-written summary under 300 words...",
  "timestamp": "..."
}
```

---

## Configuration

### Required Secret
```bash
wrangler secret put FIRECRAWL_API_KEY
# paste your key from https://firecrawl.dev/app/api-keys
```

### wrangler.toml binding already documented
The `FIRECRAWL_API_KEY` binding is listed under secrets in `api/wrangler.toml`.

---

## Rate Limiting
All endpoints share the same `checkRateLimit(ip)` guardrail from `api/src/lib/guardrails.ts`.  
Search and research also run `checkGuardrails(query)` for content safety.

---

## Technical Notes

- **No npm package needed** — Firecrawl is called via its REST API using `fetch()`, which is fully supported in Cloudflare Workers edge runtime.
- **No LangChain / no bash** — The `just-bash` and `bashExec` utilities from the upstream `firecrawl/web-agent` repo are Node.js-only and excluded here.
- **YouTube transcripts** — Firecrawl scrapes the YouTube page and extracts the transcript section from the rendered Markdown. Works for most public videos with auto-generated or manual captions.

---

## Reference
Upstream source: https://github.com/firecrawl/web-agent  
Firecrawl API docs: https://docs.firecrawl.dev
