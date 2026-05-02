-- Hana Academy Education Database Schema
-- Tables for lesson progress tracking, user progress, and quiz results

-- ============================================================
-- lesson_progress: Tracks individual lesson completion and scores
-- ============================================================
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_slug TEXT NOT NULL,
  lesson_title TEXT NOT NULL,
  module_number INT,
  quiz_score INT CHECK (quiz_score >= 0 AND quiz_score <= 100),
  completed BOOLEAN DEFAULT FALSE,
  time_spent_seconds INT DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Composite unique key: each user can only have one record per lesson
  UNIQUE(user_id, lesson_slug)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_slug ON lesson_progress(lesson_slug);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON lesson_progress(completed);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_module ON lesson_progress(module_number);

-- ============================================================
-- course_enrollment: Tracks which courses users are enrolled in
-- ============================================================
CREATE TABLE IF NOT EXISTS course_enrollment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_slug TEXT NOT NULL,
  course_title TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INT DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in-progress', 'completed', 'paused')),
  
  UNIQUE(user_id, course_slug)
);

CREATE INDEX IF NOT EXISTS idx_course_enrollment_user_id ON course_enrollment(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollment_course_slug ON course_enrollment(course_slug);
CREATE INDEX IF NOT EXISTS idx_course_enrollment_status ON course_enrollment(status);

-- ============================================================
-- quiz_answers: Stores individual quiz attempt answers for analytics
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_slug TEXT NOT NULL,
  question_number INT NOT NULL,
  user_answer TEXT,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_user_id ON quiz_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_lesson_slug ON quiz_answers(lesson_slug);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_created_at ON quiz_answers(created_at);

-- ============================================================
-- learning_objectives_progress: Tracks learner progress on specific learning objectives
-- ============================================================
CREATE TABLE IF NOT EXISTS learning_objectives_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_slug TEXT NOT NULL,
  objective_number INT NOT NULL,
  objective_text TEXT NOT NULL,
  mastered BOOLEAN DEFAULT FALSE,
  attempts INT DEFAULT 0,
  mastered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, lesson_slug, objective_number)
);

CREATE INDEX IF NOT EXISTS idx_objectives_progress_user_id ON learning_objectives_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_objectives_progress_mastered ON learning_objectives_progress(mastered);

-- ============================================================
-- Enable RLS (Row Level Security) policies
-- ============================================================
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_objectives_progress ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own progress
CREATE POLICY "Users can view their own lesson progress"
  ON lesson_progress FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own lesson progress"
  ON lesson_progress FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own lesson progress"
  ON lesson_progress FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Allow users to see only their own course enrollment
CREATE POLICY "Users can view their own enrollments"
  ON course_enrollment FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own enrollments"
  ON course_enrollment FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own enrollments"
  ON course_enrollment FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Allow users to see only their own quiz answers
CREATE POLICY "Users can view their own quiz answers"
  ON quiz_answers FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own quiz answers"
  ON quiz_answers FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- Allow users to see only their own objective progress
CREATE POLICY "Users can view their own objectives progress"
  ON learning_objectives_progress FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own objectives progress"
  ON learning_objectives_progress FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own objectives progress"
  ON learning_objectives_progress FOR UPDATE
  USING (auth.uid()::text = user_id::text);
