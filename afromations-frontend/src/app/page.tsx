import Link from 'next/link'
import type { ReactNode } from 'react'
import { HeroSection } from '@/components/hero-section'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const pillars = [
  {
    label: 'Stories',
    body: 'Original anime worlds and cinematic IP.',
  },
  {
    label: 'Artists',
    body: 'Real creators, visible authorship, real opportunity.',
  },
  {
    label: 'Community',
    body: 'Creative work connected to people and place.',
  },
]

const selectedWork = [
  {
    title: 'DUAL',
    meta: 'Flagship original IP',
    href: '/dual',
    media: 'DUAL image / video slot',
    active: true,
  },
  {
    title: 'Hana',
    meta: 'Studio intelligence',
    href: '/hana',
    media: 'Hana character / interface slot',
    active: true,
  },
  {
    title: 'AfroScribble',
    meta: 'Creative production tool',
    href: null,
    media: 'AfroScribble media slot',
    active: false,
  },
  {
    title: 'Selected Collaboration',
    meta: 'Real artist or community project',
    href: null,
    media: 'Real project proof slot',
    active: false,
  },
]

const hanaCapabilities = [
  'Creative research',
  'Production planning',
  'Character continuity',
  'Asset organization',
  'Publishing support',
]

const communityPaths = [
  {
    title: 'Find an Artist',
    body: 'A direct path to hire creators from the AFROMATIONS network.',
  },
  {
    title: 'Bring Us a Project',
    body: 'Mural, animation, event, cleanup, youth activation, or cultural storytelling.',
  },
  {
    title: 'Community Projects',
    body: 'Document the real work already happening and make the outcomes visible.',
  },
  {
    title: 'Join the Network',
    body: 'Artist onboarding and a future pipeline for paid creative opportunities.',
  },
]

const stories = ['Artist Story', 'Behind the Scenes', 'DUAL / Studio Journal']

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">
      {children}
    </p>
  )
}

function SectionHeading({
  number,
  title,
  body,
}: {
  number: string
  title: string
  body: string
}) {
  return (
    <div className="max-w-2xl">
      <Eyebrow>{number}</Eyebrow>
      <h2
        className="mt-3 text-3xl font-bold tracking-[-0.04em] text-(--af-cream) sm:text-5xl lg:text-6xl"
        style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}
      >
        {title}
      </h2>
      <p className="mt-5 max-w-xl text-sm leading-7 text-(--af-grey-light) sm:text-base">
        {body}
      </p>
    </div>
  )
}

function MediaPlaceholder({
  label,
  ratio = 'aspect-[4/3]',
}: {
  label: string
  ratio?: string
}) {
  return (
    <div
      className={`${ratio} flex w-full items-center justify-center overflow-hidden border border-dashed border-white/15 bg-white/[0.025] px-5 text-center`}
    >
      <span className="max-w-44 text-[10px] font-semibold tracking-[0.2em] text-white/30 uppercase">
        {label}
      </span>
    </div>
  )
}

export default function Home() {
  return (
    <main className="bg-(--af-black)">
      <Navbar />
      <HeroSection />

      <section
        id="studio"
        className="border-b border-white/8 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
        aria-labelledby="studio-title"
      >
        <div className="mx-auto max-w-7xl">
          <Eyebrow>00</Eyebrow>
          <h2
            id="studio-title"
            className="mt-3 max-w-3xl text-3xl font-bold tracking-[-0.04em] text-(--af-cream) sm:text-5xl"
            style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}
          >
            What AFROMATIONS Is
          </h2>

          <div className="mt-10 grid gap-px overflow-hidden border border-white/8 bg-white/8 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.label} className="min-h-44 bg-(--af-black) p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-(--af-cream)">{pillar.label}</h3>
                <p className="mt-4 max-w-xs text-sm leading-6 text-(--af-grey-light)">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="work"
        className="border-b border-white/8 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
        aria-labelledby="work-title"
      >
        <div className="mx-auto max-w-7xl">
          <div id="work-title">
            <SectionHeading
              number="01"
              title="Selected Work"
              body="Four clear entry points. The structure is finished now; the final copy and media can be inserted without rebuilding the page."
            />
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {selectedWork.map((item) => {
              const content = (
                <>
                  <MediaPlaceholder label={item.media} ratio="aspect-[5/6]" />
                  <div className="flex min-h-36 flex-col justify-between border-t border-white/8 p-5">
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.02em] text-(--af-cream)">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-(--af-grey-light)">{item.meta}</p>
                    </div>
                    <span className="mt-6 text-[10px] font-semibold tracking-[0.18em] text-white/35 uppercase">
                      {item.active ? 'View project' : 'Reserved slot'}
                    </span>
                  </div>
                </>
              )

              return item.href ? (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group overflow-hidden border border-white/8 bg-white/[0.015] transition-colors hover:border-white/20"
                >
                  {content}
                </Link>
              ) : (
                <article
                  key={item.title}
                  className="overflow-hidden border border-white/8 bg-white/[0.015]"
                >
                  {content}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section
        id="hana"
        className="border-b border-white/8 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
        aria-labelledby="hana-title"
      >
        <div className="mx-auto max-w-7xl">
          <div id="hana-title">
            <SectionHeading
              number="02"
              title="Hana"
              body="The studio intelligence behind AFROMATIONS. The homepage explains the outcome, not the orchestration stack."
            />
          </div>

          <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <MediaPlaceholder
              label="Hana character / device / live interface placeholder"
              ratio="min-h-[360px] lg:min-h-[520px]"
            />

            <div className="flex min-h-[360px] flex-col justify-between border border-white/8 p-6 sm:p-8 lg:min-h-[520px] lg:p-10">
              <div>
                <p
                  className="max-w-xl text-2xl font-semibold leading-tight tracking-[-0.035em] text-(--af-cream) sm:text-3xl"
                  style={{ textWrap: 'balance' }}
                >
                  The studio intelligence behind AFROMATIONS.
                </p>
                <div className="mt-10 space-y-0">
                  {hanaCapabilities.map((item) => (
                    <div
                      key={item}
                      className="flex min-h-14 items-center border-t border-white/8 text-sm text-(--af-cream)"
                    >
                      <span className="mr-4 text-(--af-red)">—</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/hana"
                className="mt-10 inline-flex min-h-12 w-fit items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-(--af-cream) transition-colors hover:border-white/35 hover:bg-white/[0.04]"
              >
                Meet Hana
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="artists"
        className="border-b border-white/8 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
        aria-labelledby="artists-title"
      >
        <div className="mx-auto max-w-7xl">
          <div id="artists-title">
            <SectionHeading
              number="03"
              title="Real Artists"
              body="Three verified profiles are enough to launch this section. Each slot is ready for a portrait, artwork, name, city, discipline, and project."
            />
          </div>

          <div className="mt-12 grid gap-4 lg:mt-16 sm:grid-cols-3">
            {[1, 2, 3].map((artist) => (
              <article key={artist} className="border border-white/8 bg-white/[0.015]">
                <MediaPlaceholder label="Portrait / artwork" ratio="aspect-[4/5]" />
                <div className="p-5 sm:p-6">
                  <p className="text-lg font-semibold text-(--af-cream)">Artist Name</p>
                  <p className="mt-2 text-sm text-(--af-grey-light)">City · Discipline · Project</p>
                </div>
              </article>
            ))}
          </div>

          <a
            href="/apply?path=artist"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-(--af-cream) transition-colors hover:border-white/35 hover:bg-white/[0.04]"
          >
            Join the Artist Network
          </a>
        </div>
      </section>

      <section
        id="community"
        className="border-b border-white/8 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
        aria-labelledby="community-title"
      >
        <div className="mx-auto max-w-7xl">
          <div id="community-title">
            <SectionHeading
              number="04"
              title="Community Impact"
              body="The section is built around actions people can actually take. Copy and proof can be added one block at a time."
            />
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-white/8 bg-white/8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {communityPaths.map((item) => (
              <article key={item.title} className="min-h-64 bg-(--af-black) p-6 sm:p-7">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-(--af-cream)">
                  {item.title}
                </h3>
                <p className="mt-5 text-sm leading-7 text-(--af-grey-light)">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="why"
        className="border-b border-white/8 px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
        aria-labelledby="why-title"
      >
        <div className="mx-auto max-w-7xl">
          <Eyebrow>05</Eyebrow>
          <h2
            id="why-title"
            className="mt-6 max-w-5xl text-4xl font-bold leading-[1.02] tracking-[-0.055em] text-(--af-cream) sm:text-6xl lg:text-7xl"
            style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}
          >
            We build original worlds without erasing the people who create them.
          </h2>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/8 pt-7 text-[11px] font-semibold tracking-[0.2em] text-(--af-gold) uppercase sm:gap-x-12">
            <span>Craft</span>
            <span>Ownership</span>
            <span>Culture</span>
            <span>Opportunity</span>
          </div>
        </div>
      </section>

      <section
        id="stories"
        className="border-b border-white/8 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
        aria-labelledby="stories-title"
      >
        <div className="mx-auto max-w-7xl">
          <div id="stories-title">
            <SectionHeading
              number="06"
              title="Stories"
              body="An editorial layer for artist interviews, behind-the-scenes work, DUAL development, and community field notes."
            />
          </div>

          <div className="mt-12 grid gap-4 lg:mt-16 sm:grid-cols-3">
            {stories.map((story) => (
              <article key={story} className="border border-white/8 bg-white/[0.015]">
                <MediaPlaceholder label="Story image" ratio="aspect-[16/10]" />
                <div className="min-h-36 p-5 sm:p-6">
                  <p className="text-lg font-semibold text-(--af-cream)">{story}</p>
                  <p className="mt-3 text-sm text-(--af-grey-light)">Headline placeholder</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
        aria-labelledby="final-cta-title"
      >
        <div className="mx-auto max-w-7xl">
          <Eyebrow>07</Eyebrow>
          <h2
            id="final-cta-title"
            className="mt-4 max-w-3xl text-4xl font-bold tracking-[-0.055em] text-(--af-cream) sm:text-6xl lg:text-7xl"
            style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}
          >
            Build with us.
          </h2>

          <div className="mt-10 grid gap-3 sm:max-w-2xl sm:grid-cols-2">
            <a
              href="/apply?path=artist"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-(--af-cream) px-7 text-sm font-semibold text-(--af-black) transition-opacity hover:opacity-85"
            >
              I&apos;m an Artist
            </a>
            <a
              href="/apply?path=project"
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 px-7 text-sm font-semibold text-(--af-cream) transition-colors hover:border-white/40 hover:bg-white/[0.04]"
            >
              I Have a Project
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
