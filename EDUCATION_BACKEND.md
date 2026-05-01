# Hana Academy Education Backend

This document describes the backend infrastructure for Hana Academy course management, lesson tracking, and learner progress analytics.

## Overview

The education system consists of:

1. **API Routes** (`/api/education/*`) — RESTful endpoints for progress tracking
2. **Database Schema** — Supabase tables for storing lesson progress and course data
3. **Utilities** — TypeScript utilities for frontend integration (`/lib/education.ts`)
4. **User Management** — Authentication via Supabase Auth (`/lib/use-user.ts`)

## API Endpoints

### POST /api/education/progress
Save or update lesson progress for a user.

**Request Body:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "lessonSlug": "hiragana-energy",
  "lessonTitle": "Hiragana Energy",
  "module": 1,
  "quizScore": 85,
  "completed": true,
  "timeSpentSeconds": 1200
}
```

**Response:**
```json
{
  "success": true,
  "progress": {
    "id": "uuid",
    "user_id": "uuid",
    "lesson_slug": "hiragana-energy",
    "lesson_title": "Hiragana Energy",
    "module_number": 1,
    "quiz_score": 85,
    "completed": true,
    "time_spent_seconds": 1200,
    "completed_at": "2026-05-01T15:30:00Z",
    "created_at": "2026-04-01T10:00:00Z",
    "updated_at": "2026-05-01T15:30:00Z"
  }
}
```

### GET /api/education/progress?userId=UUID
Fetch all lesson progress for a user.

**Response:**
```json
{
  "progress": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "lesson_slug": "hiragana-energy",
      "lesson_title": "Hiragana Energy",
      "module_number": 1,
      "quiz_score": 85,
      "completed": true,
      "time_spent_seconds": 1200,
      "created_at": "2026-04-01T10:00:00Z",
      "updated_at": "2026-05-01T15:30:00Z"
    }
  ]
}
```

### GET /api/education/stats?userId=UUID
Fetch aggregated learning statistics for a user.

**Response:**
```json
{
  "userId": "uuid",
  "totalCompletedLessons": 12,
  "moduleStats": {
    "1": 4,
    "2": 5,
    "3": 3
  },
  "lastUpdated": "2026-05-01T15:45:00Z"
}
```

## Database Schema

### Tables

#### `lesson_progress`
Tracks individual lesson completion and quiz scores.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to auth.users |
| `lesson_slug` | TEXT | Unique lesson identifier (e.g., "hiragana-energy") |
| `lesson_title` | TEXT | Human-readable lesson title |
| `module_number` | INT | Module number (1-7) |
| `quiz_score` | INT | Quiz score (0-100), nullable |
| `completed` | BOOLEAN | Whether lesson is marked complete |
| `time_spent_seconds` | INT | Total seconds spent on lesson |
| `completed_at` | TIMESTAMP | When lesson was completed |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

**Unique Constraint:** `(user_id, lesson_slug)` — Each user can only have one record per lesson

#### `course_enrollment`
Tracks which courses users are enrolled in and their progress.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to auth.users |
| `course_slug` | TEXT | Course identifier (e.g., "japanese-by-anime") |
| `course_title` | TEXT | Course title |
| `enrolled_at` | TIMESTAMP | When user enrolled |
| `started_at` | TIMESTAMP | When user started course, nullable |
| `completed_at` | TIMESTAMP | When user completed course, nullable |
| `progress_percentage` | INT | Overall progress (0-100) |
| `status` | TEXT | Status: 'enrolled', 'in-progress', 'completed', 'paused' |

**Unique Constraint:** `(user_id, course_slug)` — Each user can only be enrolled once per course

#### `quiz_answers`
Stores detailed quiz attempt data for analytics and review.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to auth.users |
| `lesson_slug` | TEXT | Lesson identifier |
| `question_number` | INT | Question sequence number |
| `user_answer` | TEXT | User's submitted answer |
| `correct_answer` | TEXT | Correct answer |
| `is_correct` | BOOLEAN | Whether answer was correct |
| `created_at` | TIMESTAMP | When answer was submitted |

#### `learning_objectives_progress`
Tracks progress on individual learning objectives within lessons.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to auth.users |
| `lesson_slug` | TEXT | Lesson identifier |
| `objective_number` | INT | Objective sequence number |
| `objective_text` | TEXT | Learning objective description |
| `mastered` | BOOLEAN | Whether objective is mastered |
| `attempts` | INT | Number of attempts made |
| `mastered_at` | TIMESTAMP | When objective was mastered |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

**Unique Constraint:** `(user_id, lesson_slug, objective_number)`

### Row Level Security (RLS)

All tables have RLS enabled. Users can only see and modify their own data:

- Users can view/insert/update their own `lesson_progress` records
- Users can view/insert/update their own `course_enrollment` records
- Users can view/insert their own `quiz_answers` records
- Users can view/insert/update their own `learning_objectives_progress` records

## Frontend Integration

### Using `useLessonProgress` Hook

```typescript
import { useLessonProgress } from '@/lib/education'

export function MyLessonComponent() {
  const { saveProgress, loading, error } = useLessonProgress()
  const { user } = useUser()

  const handleComplete = async () => {
    const success = await saveProgress({
      userId: user.id,
      lessonSlug: 'hiragana-energy',
      lessonTitle: 'Hiragana Energy',
      module: 1,
      quizScore: 85,
      completed: true,
      timeSpentSeconds: 1200,
    })

    if (success) {
      console.log('Progress saved!')
    }
  }

  return (
    <button onClick={handleComplete} disabled={loading}>
      {loading ? 'Saving...' : 'Complete Lesson'}
    </button>
  )
}
```

### Using `useCourseStats` Hook

```typescript
import { useCourseStats } from '@/lib/education'
import { useUser } from '@/lib/use-user'

export function UserDashboard() {
  const { user } = useUser()
  const { stats, loading, fetchStats } = useCourseStats(user?.id || '')

  useEffect(() => {
    fetchStats()
  }, [user?.id, fetchStats])

  if (loading) return <p>Loading stats...</p>

  return (
    <div>
      <p>Completed Lessons: {stats?.totalCompletedLessons || 0}</p>
      <p>Module 1: {stats?.moduleStats[1] || 0} lessons</p>
    </div>
  )
}
```

## Setting Up the Database

### 1. Run the Schema Migration

Execute the SQL in `/scripts/education-schema.sql` in your Supabase SQL Editor:

```sql
-- Copy and run the entire content of education-schema.sql
```

### 2. Verify Tables Created

In Supabase, verify these tables exist:
- `lesson_progress`
- `course_enrollment`
- `quiz_answers`
- `learning_objectives_progress`

### 3. Test RLS Policies

Verify that RLS policies are working:
- Log in as a test user
- Try to query another user's data (should fail)
- Try to query your own data (should succeed)

## Curriculum Structure

### Japanese by Anime Course

7 modules with 31 total lessons:

1. **Sound & Rhythm** (4 lessons)
   - Hiragana Energy
   - Vowels in Context
   - Consonant Clusters
   - Listening Patterns

2. **Everyday Phrases** (5 lessons)
   - Greetings & Responses
   - Classroom Language
   - Emotional Reactions
   - Daily Expressions
   - Social Context

3. **Particles & Meaning** (6 lessons)
   - WA vs GA
   - Particle Combinations
   - Directional Particles
   - Possession & Relationships
   - Question Patterns
   - Emphasis & Addition

4. **Honorifics: Reading the Room** (4 lessons)
   - San, Sama, Kun, Chan
   - Senpai & Sensei
   - Status & Hierarchy
   - Breaking Rules for Drama

5. **Culture in the Scene** (5 lessons)
   - Food & Festivals
   - School Life
   - Family & Roles
   - Shrines & Spirituality
   - Historical Context

6. **Creative Translation** (4 lessons)
   - Why Subtitles Aren't Literal
   - Cultural Meaning Shifts
   - Wordplay & Humor
   - Professional Translation

7. **Artist AI Lab** (3 lessons)
   - Creating Study Cards
   - Scene Breakdown Tools
   - Visual Prompt Generation

## Analytics & Reporting

### Key Metrics

- **Lesson Completion Rate**: Percentage of lessons completed per module
- **Average Quiz Score**: Mean score across all attempted quizzes
- **Time Investment**: Total time spent per lesson/module
- **Learning Objectives Mastery**: Percentage of objectives mastered per lesson
- **Course Completion Rate**: Percentage of learners completing courses

### Future Enhancements

- Detailed learner profiles with learning styles
- Adaptive lesson recommendations based on mastery
- Peer comparison (optional, privacy-first)
- Certificate generation upon course completion
- Community forums for lessons

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Missing userId parameter" | No userId in request | Ensure user is authenticated |
| "Failed to save progress" | Supabase connection issue | Check database connection |
| "Failed to fetch progress" | User not authenticated | Log in first |
| "Missing Supabase credentials" | Env vars not set | Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY |

## Future Development

### Phase 2 (Q3 2026)

- [ ] Live progress streaming (real-time sync across devices)
- [ ] Advanced analytics dashboard for educators
- [ ] Custom course creation tools
- [ ] Spaced repetition system for vocabulary
- [ ] AI-generated practice content

### Phase 3 (Q4 2026)

- [ ] Mobile app sync
- [ ] Offline mode with local caching
- [ ] Community challenges
- [ ] Mentor matching system
- [ ] Corporate training licenses

## Support

For issues or questions:
1. Check the error logs in `/user_read_only_context/v0_debug_logs.log`
2. Verify database permissions in Supabase dashboard
3. Check auth status using the Supabase debugger
