# Community Digest

Compile and send a weekly community digest highlighting studio activity, content, and wins.

## When to use
- Triggered by "send digest", "weekly digest", "community update"
- Scheduled Friday 6 PM EST (cron-registry.json)
- Beta agent routing: Content/Community tasks

## Steps

1. Gather this week's content:
   - Published blog posts (from /api/blog/posts)
   - Trending topics covered
   - New assets created (from /api/gallery)
   - Community milestones
2. Compile digest sections:
   - **This Week's Highlights** (3-5 bullet points)
   - **New Content** (links, brief descriptions)
   - **Upcoming** (next week preview)
3. Format as email-ready or Discord-ready markdown
4. Send via configured channel (Discord webhook or email)
5. Log in shared/memory/community-log.md

## Format

```
# AFROMATIONS Weekly — [Date]

## This Week
- [Win 1]
- [Win 2]
- [Win 3]

## New Content
- [Post title] → [link]
- [Asset name] → [link]

## Coming Up
- [Preview of next week]
```

## Output
Confirm digest sent with: date, channel, post count, link to archive.
