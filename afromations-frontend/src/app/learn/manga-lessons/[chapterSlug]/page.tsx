import { InnerLayout } from '@/components/inner-layout'
import Link from 'next/link'

export default async function LessonChapterPage({
  params,
}: {
  params: Promise<{ chapterSlug: string }>
}) {
  const { chapterSlug } = await params

  return (
    <InnerLayout>
      <main className="min-h-screen bg-(--af-black) pt-24 pb-16">
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
          <Link
            href="/learn/manga-lessons"
            className="text-[11px] tracking-[0.15em] uppercase text-(--af-red) hover:underline mb-6 inline-block"
          >
            ← Back to Manga Lessons
          </Link>
          <p className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            Hana Academy · Lesson
          </p>
          <h1
            className="text-3xl font-bold text-(--af-cream) mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {chapterSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </h1>
          <p className="text-(--af-grey-light) text-sm">
            This lesson chapter is invite-only and currently in production.
          </p>
        </section>

        <section className="px-6 sm:px-12 max-w-7xl mx-auto">
          <div className="border border-white/10 rounded-sm p-8 text-center max-w-lg mx-auto">
            <p className="text-(--af-cream) font-semibold mb-3">Invite-Only Access</p>
            <p className="text-(--af-grey-light) text-sm mb-6">
              Hana Manga Lessons are available to Hana Artist Partner Program members. Apply for
              an invite to get access.
            </p>
            <Link
              href="/apply"
              className="inline-block border border-(--af-red) text-(--af-red) px-6 py-2 text-[11px] tracking-[0.15em] uppercase hover:bg-(--af-red) hover:text-black transition-colors"
            >
              Apply for Invite
            </Link>
          </div>
        </section>
      </main>
    </InnerLayout>
  )
}
