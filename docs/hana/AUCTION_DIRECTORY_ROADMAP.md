# Auction and Directory Roadmap

## Drops / Auctions

### Current Status
Placeholder page at `/drops` — no live auction engine.

### What We Will NOT Build Yet
- Real bidding without payment infrastructure
- Real payment processing without fraud review
- Wallet withdrawals without legal/payout review
- Public marketplace before artist vetting is operational

### Planned Drop Types

| Drop Type | Description | Status |
|-----------|-------------|--------|
| Dual Demo Drop | First public drop featuring Dual character | Planned |
| Artist Commission Auction | Invite-only artist commissions | Planned |
| Character Sponsorship Drop | Brand sponsors a character/story | Planned |
| Licensing Opportunity | License an original character | Planned |

### Required Before Launch
1. Stripe / payment processor integration approved
2. Payout verification for artists
3. Legal review of auction terms
4. Fraud / chargeback policy
5. Paperclip approval gate for all drops

### Auction Route Plan (Future)

```
GET  /drops                   — Public drop calendar
GET  /drops/:slug             — Single drop page
POST /api/drops/:id/bid       — Place bid (requires auth, payment method)
POST /api/drops/:id/buy-now   — Buy now (requires auth, payment)
GET  /api/drops/:id/bids      — Bid history
POST /api/drops               — Create drop (admin only)
```

---

## Artist Directory

### Current Status
Placeholder page at `/directory` and `/artists` — no live directory.

### Directory Vision
The directory becomes the AFROMATIONS artist/community graph:
- Artist discovery by style, medium, location
- Service provider listings (animators, writers, musicians)
- Collaboration matching
- Commission availability
- Character licensing marketplace

### What We Will NOT Build Yet
- Full multi-tenant directory
- Open submission without vetting
- Public profiles without artist consent

### Planned Stack (When Building)

| Component | Tool |
|-----------|------|
| Database | Supabase / Postgres |
| Search | Meilisearch or OpenSearch |
| CMS | Payload CMS or Directus |
| Payments | Stripe / Creem |
| Submissions | Paperclip-managed |
| SEO pages | Hana-generated blog posts |

### Directory Route Plan (Future)

```
GET  /directory               — Browse directory
GET  /artists                 — Artist listing
GET  /artists/:slug           — Artist profile
GET  /services                — Service provider listing
GET  /commissions             — Commission listings
POST /api/directory/apply     — Submit for listing (vetted)
```

### Copy for Current Placeholder Pages
> "Directory opening soon for 21+ artists, collaborators, studios, collectors, and creative service providers."

CTA: "Apply to be considered" → `/apply`
