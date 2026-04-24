# Supabase MCP — Database Tool

Direct database operations via Supabase MCP server without writing raw SQL.

## Source
`vendors/supabase-mcp/` — Official Supabase MCP integration.

## When to use
- Triggered by "query database", "insert data", "update table", "check DB"
- When verifying data integrity after operations
- When seeding initial content (lessons, wiki entries, manga issues)

## Connection
- Host: 31.220.58.212:8001 (self-hosted Supabase Kong API)
- Auth: SUPABASE_SERVICE_KEY (from wrangler secrets)
- Database: `second_brain` (postgres public schema)

## Core Operations

### Select
```
supabase.select("hana_learners", { eq: { status: "active" }, limit: 10 })
```

### Insert
```
supabase.insert("hana_lessons", {
  title_ja: "基本的な挨拶",
  title_en: "Basic Greetings",
  lesson_type: "vocabulary",
  difficulty: "n5"
})
```

### Update
```
supabase.update("hana_mastery",
  { score: 85 },
  { learner_id: "uuid", domain: "vocabulary" }
)
```

### RPC (Stored Procedures)
```
supabase.rpc("function_name", { params: {} })
```

## Tables Available (Hana OS)
- hana_learners, hana_consent_log, hana_wiki_entries
- hana_lessons, hana_sessions, hana_progress
- hana_mastery, hana_assessments
- hana_manga_issues, hana_unlocks
- hana_memory_graph, hana_memory_edges

## Safety Rules
- Never DELETE without explicit user confirmation
- Always use LIMIT on SELECT without WHERE
- Log all write operations to synthia_beads

## Output
Return row count + first 5 rows of result.
