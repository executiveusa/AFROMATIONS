-- Migration 003: Hana Manga Reader System (Comimi)
-- Series / Chapters / Pages / Progress / Lessons

CREATE TABLE IF NOT EXISTS hana_manga_series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text,
  series_type text NOT NULL DEFAULT 'manga',
  reading_direction text NOT NULL DEFAULT 'rtl',
  status text NOT NULL DEFAULT 'draft',
  cover_image_url text,
  created_by_agent text DEFAULT 'hana',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hana_manga_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id uuid REFERENCES hana_manga_series(id),
  slug text NOT NULL,
  title text NOT NULL,
  subtitle text,
  chapter_number numeric,
  summary text,
  status text NOT NULL DEFAULT 'draft',
  access_level text NOT NULL DEFAULT 'public',
  reading_direction text,
  has_cover boolean DEFAULT true,
  page_turn_mode text DEFAULT 'single',
  layout_mode text DEFAULT 'inline',
  cover_image_url text,
  published_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(series_id, slug)
);

CREATE TABLE IF NOT EXISTS hana_manga_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid REFERENCES hana_manga_chapters(id) ON DELETE CASCADE,
  page_index integer NOT NULL,
  page_id text NOT NULL,
  page_type text NOT NULL DEFAULT 'image',
  image_url text,
  thumbnail_url text,
  html text,
  width integer,
  height integer,
  alt text,
  label text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(chapter_id, page_index)
);

CREATE TABLE IF NOT EXISTS hana_reader_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid,
  chapter_id uuid REFERENCES hana_manga_chapters(id),
  current_page_index integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  metadata jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(learner_id, chapter_id)
);

CREATE TABLE IF NOT EXISTS hana_manga_chapter_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid REFERENCES hana_manga_chapters(id),
  lesson_type text NOT NULL,
  title text NOT NULL,
  objectives jsonb DEFAULT '[]',
  vocabulary jsonb DEFAULT '[]',
  cultural_notes jsonb DEFAULT '[]',
  production_notes jsonb DEFAULT '[]',
  quiz jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_manga_series_slug ON hana_manga_series(slug);
CREATE INDEX IF NOT EXISTS idx_manga_chapters_series ON hana_manga_chapters(series_id);
CREATE INDEX IF NOT EXISTS idx_manga_chapters_slug ON hana_manga_chapters(slug);
CREATE INDEX IF NOT EXISTS idx_manga_chapters_status ON hana_manga_chapters(status);
CREATE INDEX IF NOT EXISTS idx_manga_chapters_access ON hana_manga_chapters(access_level);
CREATE INDEX IF NOT EXISTS idx_manga_pages_chapter ON hana_manga_pages(chapter_id);
CREATE INDEX IF NOT EXISTS idx_reader_progress_learner ON hana_reader_progress(learner_id);
CREATE INDEX IF NOT EXISTS idx_reader_progress_chapter ON hana_reader_progress(chapter_id);

-- Seed: Series
INSERT INTO hana_manga_series (slug, title, subtitle, description, series_type, reading_direction, status, created_by_agent)
VALUES
  ('dual', 'DUAL', 'Seattle 2056', 'A cinematic anime story from AFROMATIONS. Two characters, one city, infinite futures.', 'manga', 'rtl', 'published', 'hana'),
  ('hana-warriors-of-light', 'Hana: Warriors of Light', 'A Mythic Saga', 'A mythic onna-bugeisha inspired AFROMATIONS manga series led by Agent Hana.', 'manga', 'rtl', 'draft', 'hana'),
  ('owpil', 'O.W.P.I.L', 'One Without Purpose Is Lost', 'A documentary comic project exploring creative identity and artistic purpose.', 'comic', 'ltr', 'draft', 'hana'),
  ('hana-academy', 'Hana Academy', 'Learn Through Manga', 'Hana teaches anime production, Japanese language, and creative workflows through manga panels.', 'lesson', 'ltr', 'draft', 'hana')
ON CONFLICT (slug) DO NOTHING;

-- Seed: Chapters
INSERT INTO hana_manga_chapters (series_id, slug, title, subtitle, chapter_number, summary, status, access_level, reading_direction, has_cover, page_turn_mode, layout_mode)
SELECT
  s.id,
  'chapter-1-knock-at-the-door',
  'Chapter 1: Knock at the Door',
  'The story begins',
  1,
  'Seattle 2056. A knock changes everything. DUAL begins.',
  'published',
  'public',
  'rtl',
  true,
  'single',
  'inline'
FROM hana_manga_series s WHERE s.slug = 'dual'
ON CONFLICT (series_id, slug) DO NOTHING;

INSERT INTO hana_manga_chapters (series_id, slug, title, subtitle, chapter_number, summary, status, access_level, reading_direction, has_cover, page_turn_mode, layout_mode)
SELECT
  s.id,
  'volume-1-warrior-scholar',
  'Volume 1: Warrior Scholar',
  'The first test',
  1,
  'Hana faces her first trial as warrior and scholar. A mythic origin chapter.',
  'draft',
  'public',
  'rtl',
  true,
  'single',
  'inline'
FROM hana_manga_series s WHERE s.slug = 'hana-warriors-of-light'
ON CONFLICT (series_id, slug) DO NOTHING;

INSERT INTO hana_manga_chapters (series_id, slug, title, subtitle, chapter_number, summary, status, access_level, reading_direction, has_cover, page_turn_mode, layout_mode)
SELECT
  s.id,
  'fall-2026-preview',
  'Fall 2026 Preview',
  'First look',
  0,
  'A preview of the OWPIL documentary comic series. Identity, purpose, and art.',
  'draft',
  'public',
  'ltr',
  true,
  'single',
  'inline'
FROM hana_manga_series s WHERE s.slug = 'owpil'
ON CONFLICT (series_id, slug) DO NOTHING;

-- Seed: Placeholder HTML pages for DUAL Chapter 1
INSERT INTO hana_manga_pages (chapter_id, page_index, page_id, page_type, html, alt, label)
SELECT
  ch.id,
  0,
  'p0-cover',
  'html',
  '<div style="background:#0a0a0a;color:#e8e0d0;font-family:serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;min-height:600px;padding:40px;text-align:center;"><h1 style="font-size:3em;letter-spacing:0.1em;margin-bottom:0.2em;">DUAL</h1><p style="font-size:1.2em;opacity:0.7;letter-spacing:0.3em;text-transform:uppercase;">Chapter 1</p><p style="font-size:1.4em;margin-top:1em;font-style:italic;">Knock at the Door</p><p style="margin-top:3em;opacity:0.4;font-size:0.9em;">AFROMATIONS · Seattle 2056</p><p style="margin-top:2em;opacity:0.3;font-size:0.75em;">[Cover art pending — asset in production]</p></div>',
  'DUAL Chapter 1 Cover',
  'Cover'
FROM hana_manga_chapters ch
JOIN hana_manga_series s ON ch.series_id = s.id
WHERE s.slug = 'dual' AND ch.slug = 'chapter-1-knock-at-the-door'
ON CONFLICT (chapter_id, page_index) DO NOTHING;

INSERT INTO hana_manga_pages (chapter_id, page_index, page_id, page_type, html, alt, label)
SELECT
  ch.id,
  1,
  'p1',
  'html',
  '<div style="background:#0a0a0a;color:#e8e0d0;font-family:serif;display:flex;flex-direction:column;justify-content:flex-end;height:100%;min-height:600px;padding:40px;"><p style="opacity:0.4;font-size:0.8em;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:1em;">Seattle · 2056 · 03:17</p><p style="font-size:1.1em;line-height:1.8;max-width:480px;">The rain had not stopped in eleven days.<br><br>Mira counted them. She counted everything now — a habit from before, from the facility, from the years when numbers were the only thing that could not lie to you.</p><p style="margin-top:3em;opacity:0.3;font-size:0.75em;">[Panel art pending]</p></div>',
  'Page 1',
  'Page 1'
FROM hana_manga_chapters ch
JOIN hana_manga_series s ON ch.series_id = s.id
WHERE s.slug = 'dual' AND ch.slug = 'chapter-1-knock-at-the-door'
ON CONFLICT (chapter_id, page_index) DO NOTHING;

INSERT INTO hana_manga_pages (chapter_id, page_index, page_id, page_type, html, alt, label)
SELECT
  ch.id,
  2,
  'p2',
  'html',
  '<div style="background:#0a0a0a;color:#e8e0d0;font-family:serif;display:flex;flex-direction:column;justify-content:center;height:100%;min-height:600px;padding:40px;"><blockquote style="border-left:3px solid #c9a96e;padding-left:1.5em;margin:0;font-size:1.3em;font-style:italic;line-height:1.7;">Three knocks.<br><br>Not urgent. Not afraid.<br><br>Patient.</blockquote><p style="margin-top:3em;opacity:0.4;font-size:0.9em;">She had not had a visitor since the grid went silent.</p><p style="margin-top:3em;opacity:0.3;font-size:0.75em;">[Panel art pending]</p></div>',
  'Page 2',
  'Page 2'
FROM hana_manga_chapters ch
JOIN hana_manga_series s ON ch.series_id = s.id
WHERE s.slug = 'dual' AND ch.slug = 'chapter-1-knock-at-the-door'
ON CONFLICT (chapter_id, page_index) DO NOTHING;

INSERT INTO hana_manga_pages (chapter_id, page_index, page_id, page_type, html, alt, label)
SELECT
  ch.id,
  3,
  'p3',
  'html',
  '<div style="background:#0a0a0a;color:#e8e0d0;font-family:serif;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%;min-height:600px;padding:40px;text-align:center;"><p style="font-size:2em;letter-spacing:0.4em;opacity:0.6;text-transform:uppercase;">To be continued</p><p style="margin-top:2em;opacity:0.5;font-size:1em;">DUAL Chapter 1 · Full art in production</p><p style="margin-top:1em;opacity:0.3;font-size:0.85em;">Follow the build at afromations.com/dual</p></div>',
  'End of Preview',
  'End'
FROM hana_manga_chapters ch
JOIN hana_manga_series s ON ch.series_id = s.id
WHERE s.slug = 'dual' AND ch.slug = 'chapter-1-knock-at-the-door'
ON CONFLICT (chapter_id, page_index) DO NOTHING;
