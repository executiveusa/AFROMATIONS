# Anime Trends

Monitor Google Trends for current anime topics and surface content opportunities.

## When to use
- Triggered by "what's trending in anime", "trending topics", "anime trends"
- Scheduled daily at 9 AM (cron-registry.json)
- Beta agent routing: Content tasks

## Steps

1. Fetch current trends via `/api/trends`
2. Filter to anime/manga/Japanese culture topics
3. Score topics by:
   - Search volume (last 7 days)
   - Relevance to AFROMATIONS brand
   - Content gap (not already covered)
4. Return top 5 topics with metadata
5. If requested, trigger blog generation for top topic

## API Reference

```
GET /api/trends
Response: { topics: [{title, volume, trend_score, category}] }

GET /api/trends/topics
Response: { curated_topics: [...] }

POST /api/trends/scan
Body: { force: boolean }
Response: { status, topics_found, timestamp }
```

## Scoring Rubric
```
relevance: 0-10 (anime/Japanese culture alignment)
volume: 0-10 (normalized search volume)
opportunity: 0-10 (low competition + high interest)
final_score: avg(relevance, volume, opportunity)
```

## Output
List top 5 topics with title, score, and recommended content angle.
