# Skill: hana-noblegoose-anime-research

Research Noble Goose Anime's public YouTube channel and transform findings into original AFROMATIONS educational content.

## Trigger

Use this skill when:
- User asks Hana to research AI anime production techniques
- User wants to see what Noble Goose Anime has been publishing
- User wants to generate blog posts, lessons, or social content from anime AI research
- Cron jobs trigger Noble Goose channel checks

## Steps

1. **Crawl** Noble Goose Anime channel via `POST /api/hana/research/noblegoose/latest`
2. **Extract concepts** from each video via `POST /api/hana/research/videos/:id/extract-concepts`
3. **Generate content briefs** for blog/social/tutorial content
4. **Apply Ralphy QA** to ensure originality and compliance
5. **Queue for approval** — never auto-publish

## Rules

- Use public metadata only (title, description, hashtags)
- Rewrite all content in Hana's original voice
- Always include source citations internally
- Tag all generated content as "Agent Hana studied public AI anime workflows..."
- Require human approval before any publishing

## APIs

```
POST /api/hana/research/noblegoose/latest     # Crawl channel
GET  /api/hana/research/noblegoose/summary    # Intelligence summary
GET  /api/hana/research/videos                # All researched videos
POST /api/hana/research/videos/:id/extract-concepts
POST /api/hana/content/generate-blog          # Generate blog post
POST /api/hana/content/generate-social-pack  # Generate social posts
```

## Source

Noble Goose Anime: https://www.youtube.com/@noblegooseanime
