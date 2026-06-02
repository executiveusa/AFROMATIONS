import { InnerLayout } from '@/components/inner-layout'
import Link from 'next/link'

const SERIES_DATA: Record<string, {
  title: string
  subtitle: string
  description: string
  direction: string
  chapters: { slug: string; title: string; summary: string; status: string }[]
}> = {
  dual: {
    title: 'DUAL',
    subtitle: 'Seattle 2056',
    description: 'A cinematic anime story from AFROMATIONS. Two characters, one city, infinite futures. Set in a near-future Seattle where creative AI and human artists are learning to coexist.',
    direction: 'RTL (Right to Left)',
    chapters: [
      {
        slug: 'chapter-1-knock-at-the-door',
        title: 'Chapter 1: Knock at the Door',
        summary: 'Seattle 2056. A knock changes everything. DUAL begins.',
        status: 'published',
      },
    ],
  },
  'hana-warriors-of-light': {
    title: 'Hana: Warriors of Light',
    subtitle: 'A Mythic Saga',
    description: 'A mythic onna-bugeisha inspired AFROMATIONS manga series led by Agent Hana. Origins, trials, and the warrior-scholar path.',
    direction: 'RTL (Right to Left)',
    chapters: [
      {
        slug: 'volume-1-warrior-scholar',
        title: 'Volume 1: Warrior Scholar',
        summary: 'Hana faces her first trial as warrior and scholar.',
        status: 'draft',
      },
    ],
  },
  owpil: {
    title: 'O.W.P.I.L',
    subtitle: 'One Without Purpose Is Lost',
    description: 'A documentary comic project exploring creative identity and artistic purpose.',
    direction: 'LTR (Left to Right)',
    chapters: [
      {
        slug: 'fall-2026-preview',
        title: 'Fall 2026 Preview',
        summary: 'A first look at the OWPIL documentary comic series.',
        status: 'draft',
      },
    ],
  },
  'hana-academy': {
    title: 'Hana Academy',
    subtitle: 'Learn Through Manga',
    description: 'Hana teaches anime production, Japanese language, and creative workflows through manga panels. Apply for invite to access full lessons.',
    direction: 'LTR (Left to Right)',
    chapters: [],
  },
}

export default async function SeriesPage({ params }: { params: Promise<{ seriesSlug: string }> }) {
  const { seriesSlug } = await params
  const series = SERIES_DATA[seriesSlug]

  if (!series) {
    return (
      <InnerLayout>
        <main className="min-h-screen bg-(--af-black) pt-24 pb-16 px-6 sm:px-12 max-w-7xl mx-auto">
          <p className="text-(--af-grey-light)">Series not found.</p>
          <Link href="/manga" className="text-(--af-red) hover:underline mt-4 inline-block">
            ← Back to Manga
          </Link>
        </main>
      </InnerLayout>
    )
  }

  return (
    <InnerLayout>
      <main className="min-h-screen bg-(--af-black) pt-24 pb-16">
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
          <Link href="/manga" className="text-[11px] tracking-[0.15em] uppercase text-(--af-red) hover:underline mb-6 inline-block">
            ← Back to Manga
          </Link>
          <p className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            {series.subtitle}
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-(--af-cream) mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {series.title}
          </h1>
          <p className="text-(--af-grey-light) max-w-2xl text-sm mb-4">{series.description}</p>
          <p className="text-white/30 text-xs">Reading direction: {series.direction}</p>
        </section>

        <div className="divider" />

        <section className="px-6 sm:px-12 max-w-7xl mx-auto py-16">
          <h2
            className="text-2xl font-bold text-(--af-cream) mb-8"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Chapters
          </h2>
          {series.chapters.length === 0 ? (
            <div className="border border-white/10 rounded-sm p-6">
              <p className="text-(--af-grey-light) text-sm">
                Chapters coming soon. Apply for invite to get early access.
              </p>
              <Link
                href="/apply"
                className="text-[11px] tracking-[0.15em] uppercase text-(--af-red) hover:underline mt-3 inline-block"
              >
                Apply for Invite →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {series.chapters.map((ch) => (
                <div
                  key={ch.slug}
                  className="border border-white/10 rounded-sm p-6 flex items-start justify-between gap-4 hover:border-white/20 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-(--af-cream) font-semibold">{ch.title}</h3>
                      {ch.status === 'draft' && (
                        <span className="text-[9px] tracking-[0.15em] uppercase text-white/30 border border-white/20 px-2 py-0.5 rounded-sm">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-(--af-grey-light) text-sm">{ch.summary}</p>
                  </div>
                  <Link
                    href={`/manga/${seriesSlug}/${ch.slug}`}
                    className="text-[11px] tracking-[0.15em] uppercase text-(--af-red) hover:underline whitespace-nowrap"
                  >
                    Read →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </InnerLayout>
  )
}
