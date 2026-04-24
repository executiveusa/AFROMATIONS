'use client'

import { useEffect, useState } from 'react'
import { API_URL, cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

interface BlogPost {
  id: string
  title: string
  metadata: { style?: string; tags?: string[]; source?: string }
  status: string
  created_at: string
}

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Top 10 Anime Openings of 2026',
    metadata: { style: 'news', tags: ['anime', 'music'], source: 'agent_hanna' },
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Black Anime Creators Breaking Barriers',
    metadata: { style: 'opinion', tags: ['creators', 'community'], source: 'agent_hanna' },
    status: 'published',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Why Studio MAPPA Changed Anime Forever',
    metadata: { style: 'review', tags: ['mappa', 'industry'], source: 'agent_hanna' },
    status: 'published',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    title: 'Afro Samurai Legacy: A Retrospective',
    metadata: { style: 'opinion', tags: ['afro samurai', 'history'], source: 'agent_hanna' },
    status: 'published',
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '5',
    title: 'The Rise of AI in Anime Production',
    metadata: { style: 'tutorial', tags: ['ai', 'technology'], source: 'agent_hanna' },
    status: 'published',
    created_at: new Date(Date.now() - 345600000).toISOString(),
  },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const STYLE_COLORS: Record<string, string> = {
  news: 'text-emerald-500',
  review: 'text-(--af-gold)',
  opinion: 'text-(--af-coral)',
  tutorial: 'text-(--af-teal)',
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useI18n()

  useEffect(() => {
    fetch(`${API_URL}/blog/posts`)
      .then((r) => r.json())
      .then((d) => {
        const fetched = d.posts ?? []
        setPosts(fetched.length > 0 ? fetched : FALLBACK_POSTS)
      })
      .catch(() => setPosts(FALLBACK_POSTS))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-(--af-black)">
      {/* Nav back link */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-(--af-black)/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2 text-sm font-bold tracking-widest text-(--af-red)">
            {t('nav.brand')}
            <span className="text-[10px] tracking-[0.3em] text-(--af-grey-light) uppercase">{t('nav.brand.sub')}</span>
          </a>
          <a
            href="/"
            className="text-xs tracking-wider text-(--af-grey-light) transition-colors hover:text-(--af-cream)"
          >
            ← Back
          </a>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        {/* Header */}
        <p className="mb-3 text-[10px] font-medium tracking-[0.4em] text-(--af-red) uppercase">
          {t('blog.eyebrow')}
        </p>
        <h1
          className="text-3xl font-bold tracking-tight text-(--af-cream) sm:text-5xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {t('blog.title')}
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-(--af-grey-light)">
          {t('blog.description')}
        </p>

        {/* Loading skeleton */}
        {loading && (
          <div className="mt-12 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border-b border-white/5 py-6">
                <div className="h-3 w-16 rounded bg-white/5" />
                <div className="mt-3 h-5 w-3/4 rounded bg-white/5" />
                <div className="mt-2 h-3 w-24 rounded bg-white/5" />
              </div>
            ))}
          </div>
        )}

        {/* Post list */}
        {!loading && (
          <div className="mt-12">
            {posts.map((post, i) => (
              <article
                key={post.id}
                className="group border-b border-white/5 py-6 transition-colors hover:border-(--af-red)/20"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs tabular-nums text-(--af-grey-light)">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-medium tracking-wider uppercase',
                      STYLE_COLORS[post.metadata.style ?? 'news'] ?? 'text-(--af-grey-light)'
                    )}
                  >
                    {post.metadata.style ?? 'article'}
                  </span>
                </div>

                <h2 className="mt-2 text-lg font-semibold text-(--af-cream) transition-colors group-hover:text-(--af-red)">
                  {post.title}
                </h2>

                <div className="mt-2 flex items-center gap-4">
                  <time className="text-[10px] tracking-wider text-(--af-grey-light)">
                    {formatDate(post.created_at)}
                  </time>
                  {post.metadata.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] tracking-wider text-(--af-grey-light) uppercase"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <p className="mt-12 text-sm text-(--af-grey-light)">
            {t('blog.empty')}
          </p>
        )}

        {/* Generated by badge */}
        <div className="mt-16 flex items-center gap-2 text-[10px] text-(--af-grey-light)">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-(--af-red)" />
          Generated by Agent Hanna 花
        </div>
      </div>
    </main>
  )
}
