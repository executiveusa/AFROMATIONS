# Phase 3: Dashboard Backend - Stats, Notifications & Chat

**Status:** Planning  
**Depends On:** Phase 2 (Database) ✅  
**Estimated Duration:** 1 week  
**Date:** 2026-05-29

---

## Overview

Phase 3 implements the remaining backend API routes needed for the HANA Dashboard:
- **Stats API** — User progress metrics, engagement tracking
- **Notifications API** — In-app notifications and reminders
- **HANA Chat API** — Real-time or polling-based chat with the HANA agent

These routes will integrate with the database schema from Phase 2 and the NIM client from Phase 1.

---

## Part 1: Stats & Dashboard API

### File: `hanna-backend/api/src/routes/dashboard.ts`

**Existing file** — will extend with new endpoints

#### New Endpoints

**GET /api/dashboard/stats**
- User's overall statistics
- Affirmations created/saved count
- Sessions completed and total time
- Current streak (days)
- Last session date
- Response: { affirmationsCreated, sessionCount, totalTime, streakDays, lastSession }

**GET /api/dashboard/progress**
- Mood trend data (last 30 days)
- Category breakdown (which categories most used)
- Weekly engagement chart data
- Affirmation generation vs. manual ratio
- Response: { moods: [], categoryBreakdown: {}, weeklyData: [], ratio: 0.5 }

**GET /api/dashboard/recent-sessions**
- Last N sessions (limit 10)
- Includes duration, mood before/after, date
- Response: { sessions: [{ id, duration, moodBefore, moodAfter, date }] }

**GET /api/dashboard/favorites**
- User's liked/favorited affirmations
- With like count and creation date
- Response: { favorites: [{ id, content, category, likeCount, createdAt }] }

**PATCH /api/dashboard/settings**
- Update user preferences (theme, notifications, language)
- Request: { theme?, language?, notificationsEnabled?, emailNotifications? }
- Response: { updated preferences }

#### Implementation Notes

```typescript
// Extract user from auth token
const userId = extractUserId(c)

// Query stats from hana_user_stats table
// Join with hana_affirmations for counts
// Join with hana_affirmation_sessions for engagement

// Example response structure:
{
  stats: {
    affirmationsCreated: 24,
    affirmationsSaved: 47,
    sessionsCompleted: 18,
    totalSessionTime: 4320, // seconds
    streakDays: 7,
    lastSessionDate: "2026-05-29"
  },
  progress: {
    moods: [
      { date: "2026-05-29", mood: "confident", count: 1 },
      { date: "2026-05-28", mood: "anxious", count: 2 }
    ],
    categories: {
      health: 8,
      career: 6,
      relationships: 4,
      confidence: 12,
      creativity: 2
    }
  }
}
```

---

## Part 2: Notifications API

### File: `hanna-backend/api/src/routes/notifications.ts` (new)

#### Endpoints

**GET /api/notifications**
- List unread notifications (limit 20)
- Pagination support
- Filters: type, read/unread
- Response: { notifications: [], count, unreadCount }

**PATCH /api/notifications/:id/read**
- Mark notification as read
- Response: { notification: { ... } }

**PATCH /api/notifications/read-all**
- Mark all as read
- Response: { count: N }

**DELETE /api/notifications/:id**
- Delete a notification
- Response: { message: "Deleted" }

#### Notification Types

The system will auto-generate notifications for:

1. **session_reminder** — "Time for your daily affirmation!"
2. **affirmation_shared** — "Someone liked your affirmation"
3. **achievement_unlocked** — "🏆 7-day streak unlocked!"
4. **milestone_reached** — "50 affirmations created!"
5. **streak_warning** — "Your streak ends today if you don't practice"
6. **new_in_library** — "New affirmations in your favorite category"
7. **system_update** — "New features available"

#### Background Job (Future)

Will need a Cloudflare Cron trigger to:
- Generate daily reminders (based on user's preferred time)
- Check for broken streaks
- Update achievement status
- Send email digests (optional)

```typescript
// Pseudo-code for cron handler
export async function generateDailyNotifications() {
  // Query all users with daily_reminder_enabled = true
  // For each user, check their timezone-adjusted time
  // If it's their reminder time, insert notification
  // Insert into hana_notifications table
}
```

---

## Part 3: HANA Chat API

### File: `hanna-backend/api/src/routes/hana-chat.ts` (new)

This is the conversation interface with the HANA agent.

#### Endpoints

**POST /api/hana-chat/message**
- Send message to HANA agent
- HANA reads user's affirmation history and mood context
- NIM generates contextual response
- Response: { message: "...", context: {}, tokens: N }

**GET /api/hana-chat/history**
- Retrieve conversation history
- Pagination: limit (default 20), offset
- Response: { messages: [], count }

**DELETE /api/hana-chat/history**
- Clear chat history
- Response: { message: "History cleared" }

#### HANA Chat Logic

```typescript
// When user sends message:

1. Extract user_id from token
2. Get user's recent affirmations (last 10)
3. Get user's mood history (last 7 days)
4. Build context prompt:
   "User has created X affirmations in categories: [list]
    Recent mood: [mood]
    Practice streak: X days
    This is their [Nth] conversation with HANA"

5. Send to NIM with enhanced system prompt:
   "You are HANA, a supportive affirmation coach. 
    You personalize responses based on the user's journey.
    [context from step 4]"

6. Get response from NIM
7. Insert into hana_chat_messages table:
   - user_id, role: 'user', content: userMessage
   - user_id, role: 'assistant', content: hanaResponse
   - context: { mood, affirmationCount, streak, ... }
   - tokens_used: response.usage.total_tokens

8. Return response with token count
```

#### Example Conversation

```
User: "I'm feeling overwhelmed with work"
HANA: "I hear you. You've created 24 affirmations so far, 
       with 8 focused on career confidence. 
       Let me help you find an affirmation that speaks to this moment.
       
       Here's one that resonates: 'I handle challenges one step at a time.
       My progress matters more than perfection.'
       
       How does that land for you?"

User: "That's helpful. How do I build more confidence in my role?"
HANA: "Based on your history, you've been working on 'confidence' 
       affirmations. What's working so far?
       
       I'd suggest: [generates 3 specific affirmations for career confidence]"
```

#### WebSocket vs. Polling

Two approaches:

**Option A: Polling (simpler)**
- Frontend polls `/api/hana-chat/history` every 2-3 seconds
- Lower latency requirements
- Works on Workers without special setup

**Option B: WebSocket (real-time)**
- Use Durable Objects for persistent connections
- Frontend subscribes to `/ws/hana-chat`
- True real-time updates
- More complex but better UX

**Recommendation:** Start with polling in Phase 3, upgrade to WebSocket in Phase 4 if needed.

---

## Part 4: Supporting Routes

### Update `hanna-backend/api/src/routes/affirmations.ts`

Add endpoints:

**GET /api/affirmations/recommended**
- Get 3-5 recommended affirmations based on:
  - User's current mood
  - Categories they frequent most
  - Affirmations they haven't used recently
- Uses NIM to pick personalized recommendations

**GET /api/affirmations/:id/context**
- Get full context around an affirmation:
  - How often user has used it
  - Average mood before/after sessions using it
  - Community stats (views, likes)

---

## Implementation Order

### Week 1: Core APIs

**Day 1-2: Stats API**
- [ ] GET /dashboard/stats
- [ ] GET /dashboard/progress
- [ ] GET /dashboard/recent-sessions
- [ ] PATCH /dashboard/settings
- [ ] Update hana_user_stats on every session

**Day 3-4: Notifications API**
- [ ] GET /notifications
- [ ] PATCH /notifications/:id/read
- [ ] PATCH /notifications/read-all
- [ ] DELETE /notifications/:id
- [ ] Create notification records on achievements

**Day 5-7: HANA Chat API**
- [ ] POST /hana-chat/message (with NIM integration)
- [ ] GET /hana-chat/history
- [ ] DELETE /hana-chat/history
- [ ] Context building from user history
- [ ] Token counting and cost tracking

### Week 2: Polish & Testing

- [ ] Integration tests for all routes
- [ ] Performance testing (large chat histories)
- [ ] Rate limiting on chat API (10 req/min per user)
- [ ] Error handling edge cases
- [ ] Documentation for frontend team

---

## Estimated Effort

| Component | Time | Complexity |
|-----------|------|-----------|
| Stats API | 4 hours | Low |
| Notifications | 6 hours | Medium |
| HANA Chat | 8 hours | High |
| Testing & Polish | 6 hours | Medium |
| **Total** | **24 hours** | — |

**Parallel work possible:** Stats and Notifications can be done in parallel by different agents.

---

## Code Patterns

### Stats Query Pattern

```typescript
// Get user stats
const stats = await supabaseQuery(c, 'hana_user_stats', {
  eq: { user_id: userId },
  limit: 1,
})

// Update stats (after session)
await supabasePatch(c, 'hana_user_stats', {
  sessions_completed: currentCount + 1,
  total_session_time: currentTime + duration,
  streak_days: calculateStreak(lastSessionDate),
}, { user_id: userId })
```

### Notification Creation Pattern

```typescript
// Auto-create notification
await supabaseInsert(c, 'hana_notifications', {
  user_id: userId,
  type: 'achievement_unlocked',
  title: '🏆 7-Day Streak!',
  message: 'You've maintained a 7-day affirmation practice!',
  data: JSON.stringify({ achievementSlug: 'streak_7' }),
})
```

### HANA Chat Pattern

```typescript
// Get context
const affirmations = await supabaseQuery(c, 'hana_affirmations', {
  eq: { user_id: userId },
  limit: 10,
  order: 'created_at.desc'
})

// Build enhanced prompt
const context = {
  affirmationsCount: affirmations.length,
  categories: extractCategories(affirmations),
  streakDays: userStats.streak_days,
  recentMood: getMostRecentMood(userStats)
}

// Call NIM with context
const response = await generateAffirmation(c, userMessage, context)

// Save conversation
await supabaseInsert(c, 'hana_chat_messages', {
  user_id: userId,
  role: 'user',
  content: userMessage,
  context: JSON.stringify(context)
})
```

---

## Dependencies

- Phase 1: ✅ NIM client + auth/affirmations routes
- Phase 2: ✅ Database schema (stats, notifications, chat_messages)
- Phase 3: This document

---

## Success Criteria

- [ ] All 12+ endpoints implemented
- [ ] Each route requires authentication
- [ ] Stats accurately reflect user activity
- [ ] Notifications auto-generate on achievements
- [ ] HANA chat reads user history and personalizes
- [ ] No missing error handling
- [ ] Latency < 200ms per request (excluding NIM)
- [ ] Rate limiting enforced on chat API
- [ ] Tested with manual curl commands

---

## References

- **NIM Client:** `hanna-backend/api/src/lib/nim-client.ts`
- **Database Schema:** `hanna-backend/api/migrations/001_*.sql`, `002_*.sql`
- **Dashboard Spec:** `HANA_DASHBOARD_SPECIFICATION.md` (Part 5)
- **Phase 1 Routes:** `hanna-backend/api/src/routes/auth.ts`, `affirmations.ts`

---

**Status:** Ready for Implementation  
**Next:** Phase 3 Backend Development
