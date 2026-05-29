# HANA Operator Dashboard — Complete Specification
## End-to-End Plan for Full Build (Phase 2-4)

**Version:** 1.0  
**Status:** Ready for Implementation  
**Scope:** Backend API + Frontend Dashboard (4-6 weeks)  
**Design Philosophy:** Apple minimalism + Anime aesthetic = Professional accessibility  

---

## PART 1: DESIGN SYSTEM

### Color Palette

```
Primary Colors:
- Cream:        #F5F3F0  (backgrounds, primary text)
- Deep Navy:    #0A0A0A  (dark mode base)
- Soft White:   #FFFFFF  (cards, surfaces)

Accent Colors (Anime-inspired):
- Red/Gold:     #DC2626  (CTAs, highlights, HANA's signature)
- Teal:         #14B8A6  (secondary actions, calm)
- Soft Pink:    #F472B6  (affirmations, positive mood)
- Warm Gold:    #F59E0B  (achievements, progress)

Semantic Colors:
- Success:      #10B981  (affirmation saved, session complete)
- Warning:      #F59E0B  (rate limit approaching, low credits)
- Error:        #EF4444  (session failed, error state)
- Info:         #3B82F6  (tips, guidance, HANA speaking)

Neutrals:
- Grey-50:      #F9FAFB
- Grey-100:     #F3F4F6
- Grey-200:     #E5E7EB
- Grey-300:     #D1D5DB
- Grey-400:     #9CA3AF
- Grey-500:     #6B7280
- Grey-600:     #4B5563
- Grey-700:     #374151
- Grey-800:     #1F2937
- Grey-900:     #111827
```

### Typography

```
Font Stack: 
  Primary:  "Sora", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
  Mono:     "Cascadia Code", "Monaco", monospace

Sizes & Weights:
- H1 (Hero):      40px / 600 (bold)  — Page titles, HANA intro
- H2 (Section):   28px / 600 (bold)  — Section headers
- H3 (Card):      18px / 600 (bold)  — Card titles, affirmation previews
- Body (Large):   16px / 400 (normal) — Main content, descriptions
- Body (Normal):  14px / 400 (normal) — Form labels, secondary text
- Body (Small):   12px / 500 (medium) — Hints, timestamps, counts
- Caption:        11px / 400 (normal) — Tiny text, helpers

Line Heights:
- Headings: 1.2 (tight)
- Body:     1.6 (generous)
- Small:    1.4 (medium)

Letter Spacing:
- Headings: -0.02em (readable density)
- Body:     0.01em (natural flow)
```

### Spacing System (8px base)

```
xs:  4px    (tight spacing, icons)
sm:  8px    (padding in buttons, small gaps)
md:  12px   (padding in cards)
lg:  16px   (section gaps)
xl:  24px   (large section spacing)
xxl: 32px   (page margins)
```

### Component Tokens

```
Border Radius:
- xs:   2px   (subtle, icon buttons)
- sm:   4px   (inputs, small cards)
- md:   8px   (medium cards, popovers)
- lg:   12px  (large cards, modals)
- full: 9999px (pills, badges)

Shadows:
- sm:   0 1px 2px rgba(0,0,0,0.05)
- md:   0 4px 6px rgba(0,0,0,0.1)
- lg:   0 10px 15px rgba(0,0,0,0.1)
- xl:   0 20px 25px rgba(0,0,0,0.15)

Borders:
- divider: 1px solid rgba(0,0,0,0.05)
- input:   1px solid #E5E7EB
- focus:   2px solid #DC2626
```

---

## PART 2: INFORMATION ARCHITECTURE

### Dashboard Sections (Left Sidebar Navigation)

```
┌─────────────────────────────────────┐
│ HANA  [logo]    [logout]            │  ← Header
├─────────────────────────────────────┤
│                                     │
│ 🏠 Home          (dashboard)        │
│ 💬 Affirmations  (library + create) │
│ ⏱️  Sessions      (history, stats)   │
│ ⚙️  Settings      (preferences)     │
│ ❓ Help          (guides, FAQ)      │
│ 📊 Admin         (if user is op)    │
│                                     │
├─────────────────────────────────────┤
│ Agent Status: 🟢 Ready              │
│ Rate Limit: 38/40 (95%)            │
│ Last Updated: 2m ago               │
└─────────────────────────────────────┘
```

### Responsive Behavior

**Desktop (1024px+):**
- Sidebar: 240px fixed left
- Main content: Full width minus sidebar
- 2-3 column layouts

**Tablet (768px - 1024px):**
- Sidebar: Collapsible hamburger
- Main content: Full width when expanded
- 1-2 column layouts

**Mobile (320px - 768px):**
- Sidebar: Bottom tab bar (5 main items)
- Main content: Full width
- 1 column layouts, stacked cards

---

## PART 3: CORE PAGES & FLOWS

### Page 1: Login / Registration

```
SCREEN: Welcome to HANA Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Top: HANA logo + tagline]
"Your AI Affirmation Coach"

[Center: Simple form]
┌────────────────────────────────┐
│ Email                          │
│ [your@email.com________]       │
│                                │
│ Password                       │
│ [••••••••••••••]               │
│                                │
│ ☐ Remember me                  │
│                                │
│ [Sign In] [Sign Up]            │
│                                │
│ Or continue with Google        │
└────────────────────────────────┘

[Bottom: Links]
Forgot password? | Sign up for free

DESIGN NOTES:
- Single column, centered, max-width 400px
- Large touch targets (48px minimum)
- Password field has toggle visibility
- Social login button below
- Apple-style: Clean, spacious, no extra elements
- Anime touch: HANA avatar in top corner, subtle glow effect
```

### Page 2: Home / Dashboard

```
SCREEN: Dashboard Overview
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1: HANA Welcome Card
┌─────────────────────────────────────┐
│ 👋 Hi, [User]!                      │
│                                     │
│ "Ready for today's affirmations?"   │
│                                     │
│ Your mood: [ Neutral ▼ ]            │
│                                     │
│ [Get Today's Affirmation] →         │
└─────────────────────────────────────┘

SECTION 2: Quick Stats (3-column grid)
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Sessions │  │Affirmtns │  │ Streak   │
│   47     │  │  312     │  │   5 days │
│ this mo. │  │  total   │  │ 🔥       │
└──────────┘  └──────────┘  └──────────┘

SECTION 3: Today's Affirmations (Feed)
Card 1:
┌─────────────────────────────────────┐
│ ✨ Confidence                       │
│                                     │
│ "I am capable of achieving my      │
│  goals, one step at a time."        │
│                                     │
│ [❤️ Save]  [✓ Used]  [↑ Share]     │
└─────────────────────────────────────┘

Card 2:
┌─────────────────────────────────────┐
│ 💪 Strength                         │
│                                     │
│ "My challenges make me stronger,    │
│  not weaker."                       │
│                                     │
│ [🤍 Save]  [ Mark Used]  [↑ Share]  │
└─────────────────────────────────────┘

SECTION 4: HANA Chat (Persistent)
┌─────────────────────────────────────┐
│ HANA: How are you feeling about     │
│ your affirmations today?            │
│                                     │
│ You: [type here...]                │
│                                     │
│ [Send →]                           │
└─────────────────────────────────────┘

DESIGN NOTES:
- Top-to-bottom flow, no complex layouts
- Large white cards with subtle shadows
- Emoji badges for category (✨🤍💪)
- Red accent on primary CTAs
- Teal on secondary actions
- Generous top/bottom margins (24px+)
- Chat feels personal, not robotic
- HANA's responses in teal bubble, user's in grey
```

### Page 3: Affirmations Library

```
SCREEN: Affirmations Library
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Top: Action Bar]
[Search: find affirmations...]
[Filters ▼]  [Sort: Most Recent ▼]  [+ Create New]

[Content: Masonry/Grid]

GROUP 1: HEALTH (4 cards)
┌──────────────┐  ┌──────────────┐
│ I am healthy │  │ My body is   │
│ and strong   │  │ my ally      │
│              │  │              │
│ ❤️ 234       │  │ ❤️ 89       │
└──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐
│ I prioritize │  │ Rest is part │
│ my wellness  │  │ of success   │
│              │  │              │
│ ❤️ 145       │  │ ❤️ 67       │
└──────────────┘  └──────────────┘

GROUP 2: CAREER (4 cards)
[similar structure]

GROUP 3: RELATIONSHIPS (3 cards)
[similar structure]

GROUP 4: CUSTOM (Created by user)
[similar structure, with trash icons]

DESIGN NOTES:
- Grid: 2 columns (mobile) → 3 columns (tablet) → 4 columns (desktop)
- Each card shows: category + text + like count
- Hover states: subtle shadow increase, slight scale
- Swipe on mobile to delete custom affirmations
- Search is always visible, top-pinned
- Category colors: Health=pink, Career=gold, Relationships=teal
- Filter options: Category, Most Used, Recently Added, Favorites
```

### Page 4: Create / Generate Affirmations

```
SCREEN: Generate New Affirmations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Header]
"Create Personalized Affirmations"
Powered by HANA AI (using NVIDIA NIM)

[Form Section 1: What's on your mind?]
┌─────────────────────────────────────┐
│ I'm struggling with...              │
│ [Dropdown menu]                     │
│ • Self-confidence                   │
│ • Work stress                       │
│ • Relationships                     │
│ • Health & fitness                  │
│ • Finances                          │
│ • Personal growth                   │
│ • Other                             │
└─────────────────────────────────────┘

[Form Section 2: Your context (optional)]
┌─────────────────────────────────────┐
│ Tell HANA more (optional):          │
│ [Textarea]                          │
│ "I have a big presentation today    │
│  and I'm nervous about it..."       │
│                                     │
│ Character count: 45/200             │
└─────────────────────────────────────┘

[Form Section 3: Tone preference]
┌─────────────────────────────────────┐
│ How should HANA speak to you?       │
│ ☐ Motivational (pumped up)          │
│ ☑ Calm & grounded (peaceful)        │
│ ☐ Supportive (compassionate)        │
│ ☐ Direct & practical (action-ready) │
└─────────────────────────────────────┘

[Action Buttons]
[← Back]  [Generate (5 affirmations) →]

LOADING STATE:
After click:
┌─────────────────────────────────────┐
│ ✨ HANA is thinking...              │
│                                     │
│ [Spinning animation with HANA icon] │
│                                     │
│ "Crafting affirmations just for     │
│  you..."                            │
└─────────────────────────────────────┘

RESULTS STATE:
┌─────────────────────────────────────┐
│ ✨ Your Affirmations Are Ready!     │
│                                     │
│ Card 1: "You are capable of..."     │
│ [+ Add to Library]                  │
│                                     │
│ Card 2: "This moment is yours..."   │
│ [+ Add to Library]                  │
│ ...                                 │
│                                     │
│ [← Create More]  [Save All →]       │
└─────────────────────────────────────┘

DESIGN NOTES:
- Simple form, one question at a time (if mobile)
- Desktop: All questions visible, form fits in 600px
- Generate button is RED, attention-grabbing
- Loading state has pulsing HANA avatar (anime touch)
- Results show each affirmation in expandable cards
- Clear indication: "Powered by NVIDIA NIM (free)"
```

### Page 5: Sessions & Tracking

```
SCREEN: Your Sessions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Top: Stats Overview]
Total Sessions: 47  |  This Month: 12  |  Streak: 5 days 🔥

[Filter bar]
[Time Range: This Month ▼]  [Sort: Newest ▼]

[Timeline / List]

Session Card (Expandable):
┌─────────────────────────────────────┐
│ Today, 2:15 PM                      │
│ Duration: 8 minutes                 │
│                                     │
│ Mood Before: Anxious → After: Calm │
│ [Mood progress bar visualization]   │
│                                     │
│ Affirmations Used: 3                │
│ • Confidence                        │
│ • Strength                          │
│ • Self-compassion                   │
│                                     │
│ Notes: "Feeling much better. HANA   │
│        helped me refocus."          │
│                                     │
│ [Show Details ▼]                    │
└─────────────────────────────────────┘

Session Card 2:
┌─────────────────────────────────────┐
│ Yesterday, 7:30 AM                  │
│ Duration: 6 minutes                 │
│                                     │
│ Mood Before: Neutral → After: Happy │
│ [Mood progress bar visualization]   │
│                                     │
│ Affirmations Used: 5                │
│ • Success                           │
│ • Gratitude                         │
│ • Purpose                           │
│ • Growth                            │
│ • Love                              │
│                                     │
│ [Show Details ▼]                    │
└─────────────────────────────────────┘

[Pagination: Previous ... 1 2 3 ... Next]

[Bottom: Chart (Monthly Trend)]
Sessions per day (bar chart)
Mo Tu We Th Fr Sa Su
[visualization]

DESIGN NOTES:
- Each session is a "stacked card" that expands
- Mood before/after shown as emoji transition + visual indicator
- Color coding by mood: anxious (red), neutral (grey), calm (teal), happy (pink)
- Monthly chart shows usage pattern at bottom
- Easy to see: "I've been most active on weekday mornings"
```

### Page 6: Settings & Preferences

```
SCREEN: Settings
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1: Profile
┌─────────────────────────────────────┐
│ [Avatar image]                      │
│ Name: [Your Name_______]            │
│ Email: [your@email.com______]       │
│                                     │
│ Bio (optional):                     │
│ [I am a 25-year-old creative...] │
│                                     │
│ [Save Changes]                      │
└─────────────────────────────────────┘

SECTION 2: HANA Preferences
┌─────────────────────────────────────┐
│ HANA's Personality                  │
│ ☑ Motivational & energetic          │
│ ☑ Warm & compassionate              │
│ ☐ Direct & no-nonsense              │
│ ☑ Uses humor                        │
│                                     │
│ Response Length:                    │
│ ○ Brief (1-2 sentences)             │
│ ◉ Normal (2-4 sentences)            │
│ ○ Detailed (4+ sentences)           │
│                                     │
│ Use Affirmations or Stories:        │
│ ◉ Affirmations (focused)            │
│ ○ Stories (narrative)               │
│ ○ Mix of both                       │
│                                     │
│ [Save Preferences]                  │
└─────────────────────────────────────┘

SECTION 3: Notifications
┌─────────────────────────────────────┐
│ ☑ Daily reminder (7:00 AM)          │
│ ☑ Streak celebration                │
│ ☑ New affirmations available        │
│ ☐ HANA tips & suggestions           │
│                                     │
│ Reminder Time: [7:00 AM] [Change]   │
│                                     │
│ Timezone: [America/Los_Angeles] ▼   │
│                                     │
│ [Save]                              │
└─────────────────────────────────────┘

SECTION 4: Privacy & Account
┌─────────────────────────────────────┐
│ Data Collection:                    │
│ ☑ Allow anonymized analytics        │
│ ☑ Allow HANA to learn from chats    │
│                                     │
│ [Download My Data]                  │
│ [Delete My Account] (red button)    │
│                                     │
│ Version: 1.0.0                      │
│ Last Updated: May 25, 2026          │
└─────────────────────────────────────┘

DESIGN NOTES:
- Settings organized in clear, collapsible sections
- Checkboxes for toggles, radio buttons for exclusive options
- Inline help text for complex settings
- Changes save immediately with success toast
- Dangerous actions (delete) are red and require confirmation
- Timezone auto-detected but changeable
```

### Page 7: Help & FAQ

```
SCREEN: Help Center
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Search bar]
[Search help topics...]

[Sections]

SECTION 1: Getting Started
Q: What is HANA?
A: HANA is your AI affirmation coach. She helps you create personalized
   affirmations, track your mood improvements, and provide daily support.
   Powered by advanced AI (NVIDIA NIM).

Q: How do I get started?
A: 1. Sign up with email or Google
   2. Set your preferences
   3. Create your first affirmations
   4. Start a session and chat with HANA

SECTION 2: Using Affirmations
Q: How often should I use affirmations?
A: Daily is ideal, but even 1-2 sessions per week helps. HANA will remind you
   based on your preferences.

Q: Can I create custom affirmations?
A: Yes! Click "Create New" and tell HANA what you're working through.
   She'll generate personalized affirmations for you.

Q: Can I edit affirmations?
A: Not yet, but you can save your favorites and delete ones you don't like.

SECTION 3: Sessions & Tracking
Q: What's a session?
A: A session is a period where you work with affirmations and chat with HANA.
   She tracks your mood before and after.

Q: Is my data private?
A: Yes. Your data is encrypted and never shared. See Settings > Privacy.

SECTION 4: Troubleshooting
Q: HANA isn't responding
A: Check your internet connection. If it persists, try refreshing the page.
   Rate limits reset every minute.

Q: I forgot my password
A: Click "Forgot password?" on the login screen. You'll get a reset link.

[Contact Support Button]
[email: support@afromations.studio]

DESIGN NOTES:
- Q&A format is easy to scan
- Answers are concise but helpful
- Contact button is prominent for actual issues
```

---

## PART 4: HANA CHAT INTERFACE (Persistent, All Pages)

### Chat Widget (Bottom-Right, Sticky)

```
CLOSED STATE:
┌─────────────┐
│ 💬 HANA     │
│             │
│ "Click to   │
│  chat"      │
│             │
│ (Pulsing)   │
└─────────────┘
(Bottom-right corner, 120px wide)

OPEN STATE (Expanded):
┌──────────────────────────────────┐
│ HANA 花    [_]  [×]              │ ← Header
├──────────────────────────────────┤
│                                  │
│ HANA: Hi! How can I help you     │
│       today?                     │
│                                  │
│ You: I'm feeling overwhelmed     │
│                                  │
│ HANA: That's a tough feeling.    │
│       Let's find an affirmation  │
│       that resonates with you.   │
│       Would "Progress over       │
│       perfection" help?          │
│                                  │
│ You: That's helpful, thank you   │
│                                  │
│ HANA: You're welcome! 💜         │
│                                  │
├──────────────────────────────────┤
│ [typing...]                      │
│ [text input box__________] [⏎]   │
│                                  │
│ Powered by NVIDIA NIM            │
└──────────────────────────────────┘
(Desktop: 360px wide, 500px tall)
(Mobile: Full screen, expandable)

DESIGN NOTES:
- HANA's messages in teal bubble (#14B8A6) on left
- User messages in grey bubble on right
- Emoji support (HANA uses 💜 pink heart often)
- Typing indicator shown as "..."
- Input field has placeholder text
- Easy to minimize/maximize
- Doesn't obscure important content
- On mobile, takes full screen when open
- Always accessible, not modal
```

---

## PART 5: BACKEND API SPECIFICATION

### Authentication Endpoints

```
POST /api/auth/register
Request:
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "User Name"
}
Response (201):
{
  "id": "user_12345",
  "email": "user@example.com",
  "name": "User Name",
  "token": "jwt_token_here",
  "created_at": "2026-05-25T14:30:00Z"
}

POST /api/auth/login
Request:
{
  "email": "user@example.com",
  "password": "secure_password"
}
Response (200):
{
  "id": "user_12345",
  "email": "user@example.com",
  "name": "User Name",
  "token": "jwt_token_here",
  "expires_in": 86400
}

POST /api/auth/refresh
Request: (header: Authorization: Bearer <token>)
Response (200):
{
  "token": "new_jwt_token",
  "expires_in": 86400
}

GET /api/auth/me
Request: (header: Authorization: Bearer <token>)
Response (200):
{
  "id": "user_12345",
  "email": "user@example.com",
  "name": "User Name",
  "avatar_url": "https://...",
  "bio": "Optional bio",
  "preferences": { ... }
}

POST /api/auth/logout
Request: (header: Authorization: Bearer <token>)
Response (200):
{ "message": "Logged out successfully" }
```

### Affirmations Endpoints

```
GET /api/affirmations
Query: ?category=health&limit=20&offset=0&sort=recent
Response (200):
{
  "affirmations": [
    {
      "id": "aff_12345",
      "content": "I am capable of achieving my goals...",
      "category": "health",
      "source": "hana" | "user" | "library",
      "created_at": "2026-05-25T14:30:00Z",
      "likes": 234,
      "liked_by_user": false
    },
    ...
  ],
  "total": 312,
  "limit": 20,
  "offset": 0
}

POST /api/affirmations/generate
Request:
{
  "topic": "Self-confidence",
  "context": "I have a big presentation today...",
  "tone": "calm",
  "count": 5
}
Response (200):
{
  "affirmations": [
    {
      "id": "temp_1",
      "content": "I am capable of achieving my goals...",
      "category": "confidence"
    },
    ...
  ],
  "generated_at": "2026-05-25T14:30:00Z"
}

POST /api/affirmations
Request:
{
  "content": "I am capable of achieving my goals...",
  "category": "health",
  "is_public": false
}
Response (201):
{
  "id": "aff_67890",
  "content": "I am capable of achieving my goals...",
  "category": "health",
  "created_at": "2026-05-25T14:30:00Z"
}

PUT /api/affirmations/:id
Request:
{
  "content": "Updated affirmation...",
  "category": "health"
}
Response (200):
{
  "id": "aff_67890",
  "content": "Updated affirmation...",
  "updated_at": "2026-05-25T14:35:00Z"
}

DELETE /api/affirmations/:id
Response (204): No content

POST /api/affirmations/:id/like
Response (200):
{
  "id": "aff_12345",
  "liked": true,
  "likes": 235
}

POST /api/affirmations/:id/use
Request:
{
  "mood_before": "anxious",
  "mood_after": "calm"
}
Response (200):
{
  "id": "aff_12345",
  "used_count": 5,
  "last_used": "2026-05-25T14:30:00Z"
}
```

### Sessions Endpoints

```
GET /api/sessions
Query: ?limit=20&offset=0&date_from=2026-05-01&date_to=2026-05-31
Response (200):
{
  "sessions": [
    {
      "id": "session_12345",
      "user_id": "user_12345",
      "started_at": "2026-05-25T14:30:00Z",
      "ended_at": "2026-05-25T14:38:00Z",
      "duration_seconds": 480,
      "mood_before": "anxious",
      "mood_after": "calm",
      "affirmations_used": [
        { "id": "aff_12345", "content": "...", "category": "health" }
      ],
      "notes": "Feeling much better after this session",
      "created_at": "2026-05-25T14:30:00Z"
    },
    ...
  ],
  "total": 47,
  "streak": 5
}

POST /api/sessions
Request:
{
  "mood_before": "anxious",
  "affirmations": ["aff_12345", "aff_67890"]
}
Response (201):
{
  "id": "session_12345",
  "user_id": "user_12345",
  "started_at": "2026-05-25T14:30:00Z",
  "mood_before": "anxious"
}

PUT /api/sessions/:id
Request:
{
  "mood_after": "calm",
  "notes": "Feeling much better...",
  "ended_at": "2026-05-25T14:38:00Z"
}
Response (200):
{
  "id": "session_12345",
  "mood_after": "calm",
  "duration_seconds": 480,
  "ended_at": "2026-05-25T14:38:00Z"
}

GET /api/sessions/stats
Response (200):
{
  "total_sessions": 47,
  "this_month": 12,
  "this_week": 3,
  "streak": 5,
  "average_mood_improvement": 2.1,
  "favorite_affirmation_category": "health",
  "most_active_time": "morning"
}
```

### HANA Chat Endpoints

```
POST /api/hana/chat
Request:
{
  "message": "I'm feeling overwhelmed",
  "session_id": "session_12345",
  "context": {
    "mood": "anxious",
    "recent_affirmations": ["aff_12345"],
    "user_preferences": { "tone": "calm" }
  }
}
Response (200):
{
  "id": "msg_12345",
  "content": "That's a tough feeling. Let's find an affirmation...",
  "suggestions": [
    { "id": "aff_12345", "content": "..." }
  ],
  "created_at": "2026-05-25T14:30:00Z"
}

GET /api/hana/chat/:session_id
Response (200):
{
  "messages": [
    { "role": "hana", "content": "Hi! How can I help?", "created_at": "..." },
    { "role": "user", "content": "I'm overwhelmed", "created_at": "..." },
    ...
  ]
}
```

### Streaming Chat (WebSocket alternative)

```
WebSocket: wss://api.afromations.studio/ws/hana/:session_id?token=<jwt>

Message Types:
→ { "type": "message", "content": "User message here" }
← { "type": "response", "content": "HANA response...", "id": "msg_12345" }
← { "type": "suggestion", "affirmations": [...] }
← { "type": "typing", "status": true }  // HANA is typing
← { "type": "error", "message": "..." }
```

---

## PART 6: DATABASE SCHEMA

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  avatar_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  hana_tone VARCHAR(50) DEFAULT 'calm', -- 'motivational', 'calm', 'supportive', 'direct'
  response_length VARCHAR(50) DEFAULT 'normal', -- 'brief', 'normal', 'detailed'
  affirmation_type VARCHAR(50) DEFAULT 'affirmations', -- 'affirmations', 'stories', 'mixed'
  reminder_enabled BOOLEAN DEFAULT TRUE,
  reminder_time TIME DEFAULT '07:00:00',
  timezone VARCHAR(50) DEFAULT 'UTC',
  allow_analytics BOOLEAN DEFAULT TRUE,
  allow_learning BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affirmations (library + user-created)
CREATE TABLE affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category VARCHAR(50), -- 'health', 'career', 'relationships', 'confidence', 'creativity'
  source VARCHAR(20) DEFAULT 'library', -- 'hana' (AI-generated), 'user' (manual), 'library' (curated)
  is_public BOOLEAN DEFAULT FALSE,
  likes INT DEFAULT 0,
  used_count INT DEFAULT 0,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_personal_affirmation UNIQUE (user_id, content) WHERE user_id IS NOT NULL
);

-- Affirmation likes (user engagement)
CREATE TABLE affirmation_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  affirmation_id UUID REFERENCES affirmations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_like UNIQUE (user_id, affirmation_id)
);

-- Sessions (affirmation usage sessions)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  duration_seconds INT,
  mood_before VARCHAR(50), -- 'anxious', 'neutral', 'calm', 'happy', etc.
  mood_after VARCHAR(50),
  notes TEXT,
  affirmations_used INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session-affirmation mapping
CREATE TABLE session_affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  affirmation_id UUID REFERENCES affirmations(id) ON DELETE CASCADE,
  order_index INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_session_affirmation UNIQUE (session_id, affirmation_id)
);

-- Chat history (HANA conversations)
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20), -- 'user' or 'hana'
  content TEXT NOT NULL,
  suggestions JSONB, -- [{"id": "aff_123", "content": "..."}]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_affirmations_user_id ON affirmations(user_id);
CREATE INDEX idx_affirmations_category ON affirmations(category);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_chat_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_user_id ON chat_messages(user_id);
```

---

## PART 7: FRONTEND COMPONENT ARCHITECTURE

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx                    ← Main dashboard shell
│   │   ├── layout.tsx                  ← Sidebar + navigation
│   │   ├── home/
│   │   │   └── page.tsx                ← Home/dashboard view
│   │   ├── affirmations/
│   │   │   ├── page.tsx                ← Library view
│   │   │   ├── create/page.tsx         ← Generation form
│   │   │   └── [id]/edit/page.tsx      ← Edit affirmation
│   │   ├── sessions/
│   │   │   ├── page.tsx                ← Sessions list
│   │   │   └── [id]/detail/page.tsx    ← Session detail
│   │   ├── settings/
│   │   │   └── page.tsx                ← Settings panel
│   │   └── help/page.tsx               ← Help center
│   ├── auth/
│   │   ├── login/page.tsx              ← Login form
│   │   └── signup/page.tsx             ← Registration form
│   └── loading.tsx                     ← Global loading fallback
│
├── components/
│   ├── hana-dashboard/
│   │   ├── DashboardLayout.tsx         ← Sidebar + main wrapper
│   │   ├── Sidebar.tsx                 ← Navigation sidebar
│   │   ├── TopBar.tsx                  ← Header/top bar
│   │   ├── HanaChat.tsx                ← Chat widget (sticky)
│   │   ├── HanaChatBubble.tsx          ← Individual message
│   │   ├── WelcomeCard.tsx             ← Home welcome
│   │   ├── StatsGrid.tsx               ← 3-card stats
│   │   ├── AffirmationCard.tsx         ← Single affirmation display
│   │   ├── AffirmationGrid.tsx         ← Masonry grid of affirmations
│   │   ├── AffirmationForm.tsx         ← Create/edit form
│   │   ├── GenerateForm.tsx            ← AI generation form
│   │   ├── SessionCard.tsx             ← Session display (expandable)
│   │   ├── SessionList.tsx             ← Sessions list view
│   │   ├── MoodSelector.tsx            ← Mood emoji picker
│   │   ├── TabBar.tsx                  ← Mobile bottom tab bar
│   │   └── NotificationToast.tsx       ← Toast notifications
│   │
│   ├── common/
│   │   ├── Button.tsx                  ← Reusable button component
│   │   ├── Input.tsx                   ← Text input field
│   │   ├── Card.tsx                    ← Card wrapper
│   │   ├── Modal.tsx                   ← Modal dialog
│   │   ├── LoadingSpinner.tsx          ← Spinner animation
│   │   ├── Badge.tsx                   ← Category badges
│   │   └── Avatar.tsx                  ← User avatar
│   │
│   └── auth/
│       ├── LoginForm.tsx               ← Login component
│       └── SignupForm.tsx              ← Signup component
│
├── lib/
│   ├── api-client.ts                   ← Fetch wrapper + error handling
│   ├── hooks/
│   │   ├── useAuth.ts                  ← Auth context hook
│   │   ├── useAffirmations.ts          ← Affirmations data fetching
│   │   ├── useSessions.ts              ← Sessions data fetching
│   │   ├── useHanaChat.ts              ← Chat interaction hook
│   │   └── useForm.ts                  ← Generic form handler
│   │
│   ├── types/
│   │   ├── user.ts                     ← User type definitions
│   │   ├── affirmation.ts              ← Affirmation types
│   │   ├── session.ts                  ← Session types
│   │   └── message.ts                  ← Chat message types
│   │
│   ├── utils/
│   │   ├── format.ts                   ← Date, mood formatting
│   │   ├── validation.ts               ← Form validation rules
│   │   └── constants.ts                ← App constants (colors, categories)
│   │
│   └── store/
│       ├── authContext.tsx             ← Auth state management
│       └── dashboardContext.tsx        ← Dashboard state
│
├── styles/
│   ├── globals.css                     ← Global styles
│   ├── design-system.css               ← Color, spacing, typography tokens
│   └── animations.css                  ← Keyframe animations
│
└── public/
    ├── hana-avatar.png                 ← HANA illustration
    └── icons/
        ├── home.svg
        ├── affirmations.svg
        ├── sessions.svg
        ├── settings.svg
        └── help.svg
```

---

## PART 8: USER FLOWS & SCENARIOS

### Scenario 1: First-Time User (Monday, 7 AM)

```
1. User opens dashboard.afromations.studio
2. Sees login screen, clicks "Sign up"
3. Fills in email, password, name (simple form)
4. Gets welcome email (optional verification)
5. Lands on /dashboard/home
6. HANA greets: "Hi Sarah! Welcome to your affirmation journey."
7. User sees 3-card stats (all zeros)
8. User clicks "Get Today's Affirmation"
9. System shows 5 default affirmations
10. User likes 2, dismisses 3
11. User clicks "Start Session"
12. HANA asks: "What's on your mind today?"
13. User types: "I'm nervous about my new job"
14. HANA suggests: "Let's find affirmations for confidence"
15. User selects affirmations, chats with HANA
16. User rates mood before (nervous) and after (calm)
17. Session saved, shows in history
18. HANA: "Great work today! You can come back anytime."
19. User sees streak counter: "1 day 🔥"
20. User logs out, gets reminder notification for tomorrow

DESIGN TOUCHPOINTS:
- Onboarding is smooth, zero friction
- HANA explains everything naturally
- Visual feedback at each step (card flips, mood selector, chat bubbles)
- No technical jargon
- Celebration of first session (confetti? glow effect?)
```

### Scenario 2: Existing User (Thursday, 2 PM)

```
1. User opens dashboard (already logged in)
2. Home screen shows quick summary:
   - 47 sessions total
   - 5-day streak 🔥
   - Today's mood progression (anxious → working on it)
3. User scrolls to "Today's Affirmations"
4. Sees feed of personalized affirmations
5. User likes one, clicks "Use This"
6. Opens HANA chat
7. Types: "I'm procrastinating on my project"
8. HANA responds: "Procrastination is a sign your brain needs a break.
   Let's reframe this. Try: 'Progress over perfection.'"
9. User saves that affirmation to library
10. User marks session as complete
11. System asks for mood update
12. User changes mood from anxious to calm
13. Session recorded automatically
14. User sees streak extended to 6 days
15. HANA: "You're on a roll! Keep going."

DESIGN TOUCHPOINTS:
- Minimal clicks to get to core action
- Chat feels conversational, not robotic
- Affirmations are contextual (based on what user just said)
- Saving is one-click
- Positive reinforcement (streak, celebrations)
```

### Scenario 3: Weekend, Generating Custom

```
1. User opens /dashboard/affirmations/create
2. Sees form: "What's on your mind?"
3. Selects from dropdown: "Relationships"
4. Types context: "My partner and I had a disagreement"
5. Selects tone: "Supportive & compassionate"
6. Clicks "Generate 5 Affirmations"
7. Spinner shows: "HANA is thinking..."
8. 5 new affirmations appear
9. User reads each one, likes 4 of them
10. Clicks "Save All to Library"
11. Success message: "4 new affirmations saved!"
12. User goes to /dashboard/sessions
13. Starts new session
14. Uses the 4 custom affirmations
15. Chats with HANA about the relationship issue
16. HANA provides perspective
17. User ends session with improved mood
18. Session shows: "Relationships affirmations × 4"

DESIGN TOUCHPOINTS:
- Form is conversational, not technical
- Loading state is animated and reassuring
- Generated affirmations are high-quality
- Quick save option
- Session context automatically picked up
```

---

## PART 9: INTERACTION PATTERNS & ANIMATIONS

### Button States

```
Default:
┌──────────────┐
│ Get Started  │ (red, #DC2626)
└──────────────┘

Hover:
┌──────────────┐
│ Get Started  │ (darker red, #B91C1C, slight shadow increase)
└──────────────┘

Active:
┌──────────────┐
│ Get Started  │ (pressed effect, 2px offset down)
└──────────────┘

Disabled:
┌──────────────┐
│ Get Started  │ (grey, opacity 50%)
└──────────────┘

Loading:
┌──────────────┐
│ ⟳ Saving...  │ (spinning icon, disabled state)
└──────────────┘

Success:
┌──────────────┐
│ ✓ Saved!     │ (green, #10B981, checkmark)
└──────────────┘ (auto-reverts to normal after 2s)
```

### Card Interactions

```
Default:
┌─────────────────────┐
│ Affirmation text    │
│                     │
│ [❤️ Save]           │
└─────────────────────┘

Hover:
┌─────────────────────┐
│ Affirmation text    │ (subtle shadow increase)
│                     │
│ [❤️ Save] [↑Share]  │ (more buttons appear on hover)
└─────────────────────┘

Clicked (like):
┌─────────────────────┐
│ Affirmation text    │
│                     │
│ [❤️ Saved] (red)    │ (heart fills in, animation)
└─────────────────────┘
```

### Chat Message Animation

```
User Message (right-aligned, grey bubble):
Appears from bottom with slight scale-in + fade
Slides in from 0.95 scale → 1.0 scale, 0 opacity → 1

HANA Message (left-aligned, teal bubble):
Appears from bottom with staggered reveal
Typewriter effect: characters appear one-by-one (if text is long)
Slight pause before typing begins (shows "..." first)
When done, adds subtle bounce effect
```

### Loading States

```
Affirmation Generation:
┌──────────────────────┐
│ ✨ HANA is thinking  │
│                      │
│ [Animated HANA icon] │ (glowing, pulsing)
│                      │
│ "Crafting your       │
│  affirmations..."    │
└──────────────────────┘
Duration: Variable based on API response (usually 2-3s)

Page Transitions:
Fade out current page (200ms)
→ Load new page in background
→ Fade in new page (200ms)
No jarring blank screens, smooth flow

Session Load:
Skeleton loaders (grey placeholder cards)
→ Fade in real content as it arrives
→ Preserves layout shift
```

### Gesture Support (Mobile)

```
Swipe Left on Affirmation Card:
→ Reveals delete button (if custom)
→ Can cancel with swipe right

Swipe Down:
→ Closes HANA chat modal
→ Refreshes page (if at top)

Long Press on Affirmation:
→ Shows copy/share menu
→ Non-standard but useful

Tap & Hold on Like Button:
→ Shows "added to favorites" toast
```

---

## PART 10: ACCESSIBILITY & INCLUSIVE DESIGN

### Keyboard Navigation

```
Tab order:
1. Input fields
2. Buttons (primaries first, secondaries second)
3. Links
4. Interactive cards

Skip Links:
- Skip to main content
- Skip navigation
(Visible on focus)

ARIA Labels:
- All buttons have aria-label if icon-only
- Chat has aria-live="polite" for new messages
- Loading states have aria-busy="true"
- Forms have aria-required on mandatory fields
```

### Color Accessibility

```
Contrast Ratios (WCAG AAA):
- Text on background: 7:1 minimum
- UI components: 4.5:1 minimum
- Text on images: White overlay with opacity

Color-Blind Safe:
- Don't rely on color alone (always add icon/text)
- Mood selector: emoji + text label, not just color
- Status indicators: icon + color (✓ + green, ✗ + red)

Examples:
✓ GOOD:   [✓ Saved] (checkmark + green + text)
✗ BAD:    [■ Saved] (color only)
```

### Motion & Animation

```
Respect prefers-reduced-motion:
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

Animations are decorative, not required for functionality
Loading states still work without animation
```

### Screen Reader Support

```
HANA Chat:
- Each message is semantic: <p role="article">
- New messages trigger aria-live announcements
- User can hear: "HANA says: Your affirmation is..."

Affirmation Cards:
- Heading structure: H3 for category, text is body
- Like button: aria-label="Like this affirmation"
- No visual-only information

Sessions:
- Mood before/after: Uses text labels, not just color
- Streak counter: "5 day streak" text, not just emoji
```

---

## PART 11: DEPLOYMENT & PERFORMANCE

### Frontend (Vercel)

```
Build:
- Next.js 15+ with App Router
- Static generation for /dashboard/help (pre-render)
- Server components for auth checks
- Client components for interactivity

Optimization:
- Image optimization (next/image)
- Code splitting by route
- CSS-in-JS (minimal JS overhead)
- No large libraries (< 150KB gzip)

Performance Targets:
- Lighthouse: 95+ (all metrics)
- First Contentful Paint: < 1.2s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

Deployment:
- Push to main → auto-deploy to production
- Vercel preview deployments on PRs
- CDN edge caching
```

### Backend (Cloudflare Workers)

```
Runtime:
- Hono framework (lightweight, fast)
- Cloudflare Workers (edge compute, global)
- D1 database (SQLite, replicated globally)
- Cloudflare KV for caching

API Optimization:
- Rate limiting: 40 req/min per user (NIM limit)
- Response caching: 30min TTL on affirmations
- Request deduplication: Same prompt = cached response
- Compression: gzip on all JSON responses

Performance Targets:
- API response time: < 200ms (p95)
- Uptime: 99.95%
- Global availability: All regions

Deployment:
- Wrangler CLI for deployment
- Preview environments for testing
- Automatic rollback on error
```

### Monitoring

```
Frontend (Sentry):
- JavaScript error tracking
- Performance monitoring
- Session replay on errors

Backend (LogRocket):
- API response times
- Error rates by endpoint
- Database query performance

Cost Tracking:
- Token usage per request (NVIDIA NIM)
- Daily spend alerts
- Monthly cost report

Uptime (StatusPage):
- Public status page
- Component monitoring
- Incident tracking
```

---

## PART 12: IMPLEMENTATION TIMELINE

### Week 1: Foundation & Auth (Backend)
```
Days 1-2:
- Set up Hono + Cloudflare Workers
- Create database schema (Supabase/D1)
- Implement JWT auth endpoints

Days 3-4:
- Create auth routes (register, login, refresh)
- Add password hashing (bcrypt)
- Implement protected routes middleware

Days 5:
- Test auth flow end-to-end
- Create test users
- Debug CORS/token issues
```

### Week 2: Affirmations & NIM (Backend)
```
Days 1-2:
- Create NVIDIA NIM client
- Implement response caching
- Wire NIM into affirmations/generate endpoint

Days 3-4:
- Create affirmations CRUD routes
- Add database queries (search, filter, sort)
- Implement like/use tracking

Days 5:
- Test affirmation generation
- Verify NIM rate limiting works
- Load test with mock data
```

### Week 3: Sessions & Chat (Backend)
```
Days 1-2:
- Create sessions endpoints
- Implement mood tracking
- Add session analytics

Days 3-4:
- Create chat endpoints
- Implement HANA personality system
- Wire context-aware responses

Days 5:
- Test full session flow
- Verify chat quality
- End-to-end testing
```

### Week 4: Frontend - Auth & Layout (Frontend)
```
Days 1-2:
- Set up Next.js project
- Create auth pages (login, signup)
- Implement JWT token management

Days 3-4:
- Create dashboard layout (sidebar, top bar)
- Implement navigation
- Add mobile tab bar

Days 5:
- Test responsiveness
- Verify auth flow works with backend
- Deploy preview
```

### Week 5: Frontend - Core Pages (Frontend)
```
Days 1-2:
- Build Home page (welcome card, stats, feed)
- Create AffirmationCard components
- Implement "Get Today's Affirmation"

Days 3-4:
- Build Affirmations Library (grid, filters)
- Create Generate page (form + results)
- Add create/edit flows

Days 5:
- Test all affirmation interactions
- Verify API integration
- Polish UI/UX
```

### Week 6: Frontend - Sessions & Chat (Frontend)
```
Days 1-2:
- Build Sessions page (list, detail)
- Create MoodSelector component
- Implement session creation flow

Days 3-4:
- Build HANA chat widget (sticky)
- Implement WebSocket connection (or polling)
- Create message threading

Days 5:
- Test full session workflow
- End-to-end integration test
- Performance optimization
```

### Week 7: Polish & QA
```
Days 1-2:
- Bug fixes
- Performance optimization
- Accessibility audit

Days 3-4:
- Design polish (animations, colors, spacing)
- Mobile responsiveness testing
- Cross-browser testing

Days 5:
- Load testing
- Security audit
- Final QA sign-off
```

### Week 8: Launch
```
Days 1-2:
- Production deployment
- Monitoring setup
- Team training

Days 3-4:
- User feedback collection
- Bug fixes
- Hot-fix deployments as needed

Days 5:
- Post-launch monitoring
- Feature analytics
- User onboarding optimization
```

---

## PART 13: SUCCESS METRICS & KPIs

### User Engagement
```
Daily Active Users (DAU): > 100
Monthly Active Users (MAU): > 500

Session Metrics:
- Avg sessions per user per week: 3.5
- Avg session duration: 8 minutes
- Affirmations used per session: 4

Retention:
- Day 7 retention: > 40%
- Day 30 retention: > 25%
- Churn rate: < 5% monthly
```

### Feature Adoption
```
Affirmation Generation:
- % of users who generate custom: > 60%
- % who save generated affirmations: > 70%

Chat Engagement:
- % of sessions with chat interaction: > 80%
- Avg chat messages per session: 3.2

Library Curation:
- Avg affirmations saved per user: > 25
- % of library affirmations that get used: > 40%
```

### Technical Metrics
```
Performance:
- API response time (p95): < 200ms
- Frontend page load time: < 1.5s
- Chat message latency: < 800ms

Reliability:
- API uptime: 99.95%
- Database uptime: 99.99%
- Error rate: < 0.1%

Cost:
- Daily operational cost: < $1 (with Token Saver)
- Cost per user per month: < $0.05
- NIM inference cost: $0 (free tier)
```

### User Satisfaction
```
Net Promoter Score (NPS): > 50
Customer Satisfaction (CSAT): > 4.2/5
Feature requests: Top 3 prioritized each month

User Feedback:
- "Easy to use": > 85%
- "Helpful": > 90%
- "Would recommend": > 80%
```

---

## PART 14: CONTINGENCIES & RISKS

### Risk: NVIDIA NIM Rate Limit Hit
```
Mitigation:
- Implement aggressive caching (dedup requests)
- Queue requests if limit exceeded
- Show user: "HANA is thinking... (might take a moment)"
- Fall back to cached affirmations library

Fallback:
- Pre-generated affirmation library (1000+)
- If NIM unavailable, suggest from library
- Queue requests for when NIM is available
```

### Risk: Supabase/Database Outage
```
Mitigation:
- Use Cloudflare KV for session backup
- Implement read replicas for reliability
- Cache affirmations aggressively

Fallback:
- Read-only mode (show existing data)
- Queue writes for replay when DB comes back
- Show status page notice
```

### Risk: Token Costs Exceed Budget
```
Mitigation:
- Token Saver Protocol ensures < $1/day
- Caching hits target 80%
- NIM (free tier) handles 99% of inference

Fallback:
- Reduce feature scope (remove chat)
- Defer to batch API (12hr wait)
- Use cheaper LLM models
```

### Risk: User Adoption Below Target
```
Mitigation:
- A/B test onboarding flows
- Weekly email reminders
- In-app tips and guided tours
- Celebrate streaks and progress visibly

Fallback:
- Pivot to B2B (therapists, coaches)
- Partner with wellness apps
- Open-source the platform
```

---

## PART 15: FINAL CHECKLIST

### Backend Ready
- [ ] Supabase project created and schema deployed
- [ ] JWT auth endpoints tested
- [ ] NVIDIA NIM client tested with real API
- [ ] Rate limiting implemented and tested
- [ ] Affirmations CRUD fully functional
- [ ] Sessions endpoints working
- [ ] Chat endpoint returning quality responses
- [ ] WebSocket or polling chat working
- [ ] Database queries optimized
- [ ] Error handling comprehensive
- [ ] Logging setup for monitoring
- [ ] Load testing completed (1000 concurrent users)

### Frontend Ready
- [ ] Next.js project scaffolded
- [ ] Design system tokens in CSS
- [ ] Auth pages (login, signup) complete
- [ ] Dashboard layout built and responsive
- [ ] All 6 main pages built and functional
- [ ] Components tested in isolation
- [ ] API integration complete
- [ ] Chat widget working seamlessly
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit passed
- [ ] Performance targets met
- [ ] End-to-end testing completed

### Design & UX
- [ ] All color tokens verified for contrast
- [ ] Typography applied consistently
- [ ] Spacing using 8px baseline
- [ ] Animations respect prefers-reduced-motion
- [ ] No purple gradients, clean Apple aesthetic
- [ ] Anime elements integrated subtly
- [ ] Emoji usage consistent and meaningful
- [ ] UI feels professional and intuitive
- [ ] New users understand without tutorial

### Launch
- [ ] Monitoring setup (Sentry, LogRocket)
- [ ] Status page created
- [ ] Deployment automated (Vercel + Cloudflare)
- [ ] Database backups automated
- [ ] Security headers configured
- [ ] SSL/HTTPS enforced
- [ ] Privacy policy written
- [ ] Terms of service written
- [ ] GDPR compliance verified
- [ ] Support process established
- [ ] Team trained on system
- [ ] Rollback procedures documented

---

**This is your complete blueprint for the HANA Operator Dashboard.** Every pixel, every interaction, every data point is specified. You can hand this to any team and they'll build the same product. Ready to start implementing?

