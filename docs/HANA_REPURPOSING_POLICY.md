# HANA REPURPOSING POLICY

**Studio:** AFROMATIONS Studios  
**Last Updated:** 2025-05-29  
**Owner:** Agent Hana + Studio Operator

---

## Core Principle

Hana repurposes **concepts**, not **protected expression**.

Public creators publish ideas. Those ideas exist in the public domain of discourse. AFROMATIONS can research those ideas, analyze them, and produce original educational content that teaches similar concepts from the AFROMATIONS perspective.

What AFROMATIONS cannot do: copy the creator's script, thumbnail, voice, or unique expression.

---

## What Is Allowed

✅ **Public metadata research**
- Video titles, video IDs, publish dates
- Duration and view counts (if publicly visible)
- Video descriptions (first 1000 chars for analysis)
- Hashtags extracted from descriptions
- Channel name and public channel information

✅ **Concept extraction**
- Identifying what AI tools are discussed
- Identifying what workflow steps are demonstrated
- Identifying production techniques described
- Summarizing the educational angle of a video

✅ **Transformative content**
- Hana's original explanations of the same concepts
- AFROMATIONS-specific examples and studio perspective
- New lesson outlines structured differently from source
- Original blog posts citing source for attribution (internally)
- Social posts promoting AFROMATIONS's original teaching content

✅ **Fair use research**
- Publicly available transcripts (accessed via legal API or public scrape)
- Used for research summarization, not reproduction
- Short quotes for commentary or critique (properly attributed)

---

## What Is Not Allowed

❌ Copying a creator's full script or narration  
❌ Reproducing thumbnails or visual artwork  
❌ Claiming the creator's specific phrasing as AFROMATIONS's  
❌ Publishing a "summary" that is substantially the full content  
❌ Removing creator attribution from cited materials  
❌ Auto-publishing without review  
❌ Generating content that names and mimics a specific creator's voice  

---

## Attribution Standards

### Internal Records
Every generated asset stores:
```json
{
  "sourceCitation": {
    "videoId": "...",
    "videoTitle": "...",
    "videoUrl": "...",
    "channel": "Noble Goose Anime",
    "note": "Concept extracted and reframed by Agent Hana for AFROMATIONS educational use. Original creator retains all rights to their specific content."
  }
}
```

### Public Content Language
Published AFROMATIONS content uses language like:
- *"Agent Hana studied public AI anime workflows and created this AFROMATIONS production guide."*
- *"Inspired by publicly available AI anime production research."*
- *"AFROMATIONS's take on AI anime production — researched from public sources."*

Never:
- *"Copied from Noble Goose Anime."*
- *"Based on [creator]'s exact tutorial."*
- *"Here is [creator]'s full process."*

---

## Ralphy QA Enforcement

The Ralphy QA loop enforces this policy automatically:

1. **Verbatim copy detection** — blocks content with copy-signal phrases
2. **N-gram similarity check** — flags content >40% similar to source text
3. **Compliance score** — 0 if unsafe content detected
4. **Pass/fail gate** — only passing content can reach the publishing queue

---

## Platform Compliance

| Platform | Additional Rules |
|----------|-----------------|
| YouTube | Respect TOS. No scraped video downloads. No content ID abuse. |
| Twitter/X | Respect API TOS. Max 3 posts/day via automation. |
| Instagram | No scraping. Post original content only. |
| TikTok | No audio/video extraction. |

---

## Dispute Resolution

If a creator contacts AFROMATIONS about content:
1. Remove the specific content immediately (pending review)
2. Review the citation record in `hana_extracted_concepts`
3. Determine if transformative use applies
4. If in doubt, take down and rewrite
