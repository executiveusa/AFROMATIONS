import { HeroSection } from '@/components/hero-section'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const SECTIONS = [
  {
    id: 'work',
    eyebrow: '01',
    title: 'Selected Work',
    body: 'DUAL leads here. One project, one image or video, one clear path into the work.',
  },
  {
    id: 'hana',
    eyebrow: '02',
    title: 'Hana',
    body: 'The studio intelligence behind AFROMATIONS. Keep this section intentionally spare until the Hana experience is ready.',
  },
  {
    id: 'artists',
    eyebrow: '03',
    title: 'Real Artists',
    body: 'Real names, real work, real places. No filler profiles.',
  },
  {
    id: 'community',
    eyebrow: '04',
    title: 'Community Impact',
    body: 'A place for artist opportunities, commissions, and community projects.',
  },
  {
    id: 'why',
    eyebrow: '05',
    title: 'Why This Matters',
    body: 'Original worlds should create opportunity without erasing the people who make them.',
  },
  {
    id: 'stories',
    eyebrow: '06',
    title: 'Stories',
    body: 'Artist interviews, behind the scenes, DUAL development, and studio field notes.',
  },
]

export default function Home() {
  return (
    <main className="bg-(--af-black)">
      <Navbar />
      <HeroSection />

      {SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="border-b border-white/8 px-5 py-20 sm:px-8 sm:py-28"
          aria-labelledby={`${section.id}-title`}
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">
                {section.eyebrow}
              </p>
              <h2
                id={`${section.id}-title`}
                className="mt-3 text-3xl font-bold tracking-[-0.035em] text-(--af-cream) sm:text-5xl"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {section.title}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-(--af-grey-light) sm:text-base">
                {section.body}
              </p>
            </div>
          </div>
        </section>
      ))}

      <section className="px-5 py-24 sm:px-8 sm:py-32" aria-labelledby="final-cta-title">
        <div className="mx-auto max-w-7xl">
          <h2
            id="final-cta-title"
            className="max-w-3xl text-4xl font-bold tracking-[-0.045em] text-(--af-cream) sm:text-6xl"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            What do you want to build?
          </h2>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="/apply?path=artist" className="af-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold">
              I&apos;m an Artist
            </a>
            <a href="/apply?path=project" className="af-btn-secondary inline-flex min-h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold">
              I Have a Project
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
