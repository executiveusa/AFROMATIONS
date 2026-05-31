# UI Copy Audit

## Audit Date: May 2026

## Pages Audited

### Homepage (`/`)

| Element | Current | Required Action |
|---------|---------|----------------|
| Hero headline | i18n key `hero.title` | Verify key resolves to artist-focused copy |
| Hero CTA | "Start Creating" → `/studio` | Add "Apply for Invite" as primary CTA |
| Marquee words | AFROMATIONS, Anime, Culture… | OK |
| Powered by badge | "Powered by Agent Hana 花" | OK |

### Navbar

| Element | Current | Required Action |
|---------|---------|----------------|
| Links | Studio, Academy, Store, Mission | Add: Hana, Dual, Apply |
| Apply CTA | Missing | Add primary "Apply" button |

### Hana Page (`/hana`)

| Element | Current | Issue |
|---------|---------|-------|
| Description | "AI scholar designed in 2056..." | Learning-focused, not partner-focused |
| CTAs | "Explore Hana Academy" → `/learn` | Should also link to partner program |
| 21+ positioning | Missing | Add invite-only language |

### Dual Page (`/dual`)

| Element | Current | Status |
|---------|---------|--------|
| Positioning | "Multi-Purpose Agent / Space Agent" | ⚠️ Needs artist-focused framing |
| Build log | No real build log sections | Add placeholder build log |
| Apply CTA | "Explore DUAL Store" | Change secondary CTA to "Apply" |

### Studio Page (`/studio`)

| Element | Current | Status |
|---------|---------|--------|
| Eyebrow | "AI-Powered Creative Suite" | OK |
| Positioning | Image generation + roadmap | OK — honest about roadmap |
| No 21+ language | Missing | Add invite-only note |

### Social Purpose Page (`/social-purpose`)

| Element | Current | Issue |
|---------|---------|-------|
| Title | "Art, Cleanup, and AI for a Better Seattle" | Outdated — leads with cleanup not artist IP |
| Description | Graffiti cleanup, murals, youth | Needs artist infrastructure framing |
| No New World Kids mention | Good | Keep this way |

## Copy Blockers Found

1. **No "Apply for Invite" CTA anywhere in the main nav** — critical missing conversion path
2. **Dual page frames DUAL as a coding/interface agent**, not a character demo — needs artist framing
3. **Hana page is 100% learning-focused** — missing artist partner positioning
4. **Social purpose page leads with graffiti cleanup** — does not reflect 21+ artist infrastructure positioning

## Pages Missing

| Route | Priority |
|-------|---------|
| `/artist-partner-program` | Critical |
| `/apply` | Critical |
| `/provenance` | High |
| `/drops` | High |
| `/directory` | Medium |
| `/artists` | Medium |
| `/services` | Low |

## Required Disclaimers

All IP/legal blog posts must include:
> "Educational information only. This is not legal advice. Work with a licensed attorney for legal decisions."

All pages with legal/IP content must not promise:
- Copyright protection
- Trademark registration
- Automatic ownership from blockchain
