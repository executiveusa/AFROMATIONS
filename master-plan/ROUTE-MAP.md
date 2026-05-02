# AFROMATIONS Route Map

**Purpose:** Complete list of all routes in the application for agent reference

---

## Public Pages

### Core Pages
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `app/page.tsx` | Homepage |
| `/hana` | `app/hana/page.tsx` | Agent Hana introduction |

### Education Routes
| Route | Component | Purpose |
|-------|-----------|---------|
| `/learn` | `app/learn/page.tsx` | Hana Academy hub |
| `/learn/japanese-by-anime` | `app/learn/japanese-by-anime/page.tsx` | Course landing |
| `/learn/japanese-by-anime/hiragana-energy` | `app/learn/japanese-by-anime/hiragana-energy/page.tsx` | Lesson |
| `/learn/japanese-by-anime/wa-vs-ga` | `app/learn/japanese-by-anime/wa-vs-ga/page.tsx` | Lesson |
| `/learn/japanese-by-anime/honorifics` | `app/learn/japanese-by-anime/honorifics/page.tsx` | Lesson |

### Social Purpose Routes
| Route | Component | Purpose |
|-------|-----------|---------|
| `/social-purpose` | `app/social-purpose/page.tsx` | SPC mission page |
| `/volunteer` | `app/volunteer/page.tsx` | Volunteer intake |
| `/donate` | `app/donate/page.tsx` | Donation page |
| `/commission` | `app/commission/page.tsx` | Mural commission |
| `/graffiti-cleanup` | `app/graffiti-cleanup/page.tsx` | Cleanup service |
| `/partnerships` | `app/partnerships/page.tsx` | Corporate partnerships |

### Store Routes
| Route | Component | Purpose |
|-------|-----------|---------|
| `/store` | `app/store/page.tsx` | Store landing |
| `/store/cart` | `app/store/cart/page.tsx` | Shopping cart |
| `/store/product/[id]` | `app/store/product/[id]/page.tsx` | Product detail |
| `/store/success` | `app/store/success/page.tsx` | Order confirmation |

---

## API Routes

### Education API
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/education/progress` | GET, POST | User lesson progress |
| `/api/education/stats` | GET | User learning statistics |

### Impact/Social Purpose API
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/impact/intake` | POST | Form submissions |

### Store API
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/store/products` | GET | Product catalog |
| `/api/store/checkout` | POST | Create Stripe checkout |
| `/api/store/webhook` | POST | Stripe webhooks |
| `/api/store/order/[sessionId]` | GET | Order details |

---

## Anchor Links (Homepage)

These are section anchors on the homepage:
- `#studio` - Studio section
- `#hanna` - Hana section (redirects to /hana)
- `#education` - Education section (redirects to /learn)
- `#gallery` - Gallery section
- `#blog` - Blog section
- `#community` - Community section

---

## External Links

- GitHub: `https://github.com/executiveusa/AFROMATIONS`
- Discord: `https://discord.gg/afromations`
- Twitter: `https://twitter.com/afromations`

---

## Route Ownership

### Agent Hana Owns:
- `/hana`
- `/learn/*`
- All education API routes

### Store System Owns:
- `/store/*`
- All store API routes

### Social Purpose Owns:
- `/social-purpose`
- `/volunteer`
- `/donate`
- `/commission`
- `/graffiti-cleanup`
- `/partnerships`
- `/api/impact/*`

---

## Planned Routes (Not Yet Implemented)

| Route | Purpose | Priority |
|-------|---------|----------|
| `/dashboard` | User dashboard with progress | High |
| `/certificates` | Earned certificates | Medium |
| `/community` | Community hub | Medium |
| `/blog` | Blog posts | Low |
| `/careers` | Job openings | Low |
