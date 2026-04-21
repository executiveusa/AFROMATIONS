# Blog Generate

Generate a complete anime/culture blog article from a trend topic or brief.

## When to use
- Triggered by "write a blog post", "generate article", "write about [topic]"
- After anime-trends identifies a high-score topic
- Scheduled Wed/Sat 12 PM (cron-registry.json)
- Beta agent routing: Content tasks

## Steps

1. Identify topic (from trends or explicit user request)
2. Generate article structure:
   - Headline (compelling, not clickbait)
   - Intro (hook in first sentence, no filler)
   - 3-4 body sections with subheadings
   - Cultural context (Japanese source, not Western interpretation)
   - Closing/CTA
3. Post via `/api/blog/generate`
4. Return slug, preview, estimated reading time

## API Reference

```
POST /api/blog/generate
Body: {
  topic: string,
  angle: string,         // e.g. "historical context", "character analysis"
  tone: "analytical" | "accessible" | "technical",
  target_length: "short" | "medium" | "long"  // 500 / 1000 / 2000 words
}
Response: { slug, title, word_count, status, preview_url }
```

## Content Standards
- Japanese-first: use Japanese concepts with English explanations
- No cultural flattening: kami ≠ "like gods", yōkai ≠ "like demons"
- No hype words: no "amazing", "incredible", "epic fail"
- Cite sources when referencing historical claims
- Pass AFROMATIONS brand voice check before publishing

## Output
Confirm with: headline, slug, word count, publish URL.
