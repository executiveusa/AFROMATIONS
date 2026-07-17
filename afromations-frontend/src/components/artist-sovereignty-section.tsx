import Link from 'next/link'

const COLLABORATION_STEPS = [
  {
    number: '01',
    title: 'You bring the original art',
    body: 'Your tattoo flash, character sheet, sketchbook work, or finished illustration remains yours unless a separate written agreement says otherwise.',
  },
  {
    number: '02',
    title: 'Hana builds the campaign',
    body: 'We create controlled mockups, story angles, product concepts, launch assets, and a marketing plan around the approved artwork.',
  },
  {
    number: '03',
    title: 'Real artists finish the work',
    body: 'AI can help explore direction. Final commercial art can be refined by the originating artist or another paid human collaborator—with clear credit.',
  },
  {
    number: '04',
    title: 'The license is specific',
    body: 'Every use states the product, territory, duration, exclusivity, payment, and renewal terms. No vague forever-rights buried in platform language.',
  },
  {
    number: '05',
    title: 'The proof travels with the work',
    body: 'Source records, contributor history, file hashes, approval notes, and an optional public timestamp become part of the certificate package.',
  },
  {
    number: '06',
    title: 'We market the artist too',
    body: 'The campaign points back to the artist, studio, portfolio, and future commissions—not only to the product being sold.',
  },
]

const COVENANT = [
  'No training on your work without explicit written permission.',
  'No transfer of pre-existing intellectual property by default.',
  'Human contributors are named, credited, and paid.',
  'AI use is disclosed in the production record.',
  'Publishing and product launches require owner approval.',
  'Artists keep access to source files, records, and approved exports.',
]

const CERTIFICATE_FIELDS = [
  ['Creator', 'Artist or studio name'],
  ['Work ID', 'Unique AFROMATIONS record'],
  ['Rights', 'Exact licensed uses'],
  ['Contributors', 'Human roles and credits'],
  ['AI disclosure', 'Models and tools used'],
  ['Fingerprint', 'SHA-256 file hash'],
  ['Timestamp', 'Signed evidence date'],
  ['Verification', 'Public record URL'],
]

export function ArtistSovereigntySection() {
  return (
    <>
      <section className="border-b border-white/5 bg-(--af-black) px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="artist-circle-title">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-red) uppercase">
                Founding tattoo artist circle
              </p>
              <h2
                id="artist-circle-title"
                className="mt-4 text-3xl font-bold leading-tight tracking-[-.035em] text-(--af-cream) sm:text-5xl"
                style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}
              >
                Your art should build your name—not disappear into somebody else&apos;s brand.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-(--af-grey-light)">
                AFROMATIONS is starting locally with tattoo artists, anime artists, and manga creators.
                We connect original art to character projects, merchandise, media, and licensing opportunities,
                then market the artist alongside the work.
              </p>

              <div className="mt-8 border-l-2 border-(--af-gold) pl-5">
                <p className="text-lg font-semibold text-(--af-cream)">
                  Joining the artist roster costs nothing.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-(--af-grey-light)">
                  Direct human work is paid separately. On qualifying AFROMATIONS-owned collaborative drops, the contributing artist receives at least 40% of net profit. Terms are shown before work begins.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/apply?path=artist"
                  className="af-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold"
                >
                  Join the Founding Circle
                </Link>
                <Link
                  href="/provenance"
                  className="af-btn-secondary inline-flex min-h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold"
                >
                  See the Proof System
                </Link>
              </div>
            </div>

            <div className="border-t border-white/10">
              {COLLABORATION_STEPS.map((step) => (
                <article key={step.number} className="grid gap-4 border-b border-white/10 py-7 sm:grid-cols-[5rem_1fr]">
                  <div className="text-3xl font-bold text-(--af-red)/70" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-(--af-cream)">{step.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-(--af-grey-light)">{step.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-[#0d0c0b] px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="covenant-title">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="border border-(--af-red)/25 bg-(--af-red)/5 p-6 sm:p-9">
              <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-red) uppercase">
                Artist covenant
              </p>
              <h2
                id="covenant-title"
                className="mt-4 text-3xl font-bold leading-tight text-(--af-cream) sm:text-4xl"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                The rules are part of the product.
              </h2>
              <div className="mt-8 space-y-4">
                {COVENANT.map((item, index) => (
                  <div key={item} className="flex gap-4 border-t border-white/10 pt-4">
                    <span className="text-xs font-bold text-(--af-red)">{String(index + 1).padStart(2, '0')}</span>
                    <p className="text-sm leading-relaxed text-(--af-grey-light)">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden border border-(--af-gold)/30 bg-[#15120d] p-6 sm:p-9">
              <div className="absolute right-5 top-3 text-7xl font-black text-(--af-gold)/10" aria-hidden="true">認</div>
              <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-gold) uppercase">
                Certificate of authenticity
              </p>
              <h2 className="mt-4 max-w-lg text-3xl font-bold leading-tight text-(--af-cream) sm:text-4xl" style={{ fontFamily: 'Sora, sans-serif' }}>
                Every approved work gets a readable record—not a mystery token.
              </h2>
              <div className="mt-8 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
                {CERTIFICATE_FIELDS.map(([label, value]) => (
                  <div key={label} className="bg-[#11100e] p-4">
                    <div className="text-[9px] font-semibold tracking-[0.2em] text-(--af-gold) uppercase">{label}</div>
                    <div className="mt-2 text-sm text-(--af-grey-light)">{value}</div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs leading-relaxed text-(--af-grey-light)">
                Blockchain anchoring and timestamps can support evidence that a record existed at a particular time.
                They do not automatically create copyright, determine authorship, or replace legal registration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-(--af-grey)/35 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="hana-offer-title">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_.82fr] lg:items-center">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-red) uppercase">
                For creators building their own world
              </p>
              <h2
                id="hana-offer-title"
                className="mt-4 text-3xl font-bold leading-tight tracking-[-.035em] text-(--af-cream) sm:text-5xl"
                style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}
              >
                Turn one original character into an AI-powered anime studio.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-(--af-grey-light)">
                Hana is the done-for-you studio agent behind AFROMATIONS. We install her around your character,
                brand rules, approvals, media workflows, merchandise, publishing, and provenance records.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  'Private Hana agent installation',
                  'Character consistency system',
                  '15 campaign assets',
                  '5 merchandise concepts',
                  '3 short animation tests',
                  'Telegram and voice control',
                  '30-day content engine',
                  'Provenance Starter Vault',
                ].map((item) => (
                  <div key={item} className="flex gap-3 border-t border-white/10 py-3 text-sm text-(--af-grey-light)">
                    <span className="text-(--af-red)">◆</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <aside className="border border-(--af-red)/40 bg-(--af-black) p-1" aria-label="Hana Character Launch Agent price">
              <div className="border border-white/10 p-7 sm:p-9">
                <div className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">
                  Three founding installations
                </div>
                <div className="mt-5 flex items-end gap-3">
                  <span className="text-5xl font-bold text-(--af-cream)" style={{ fontFamily: 'Sora, sans-serif' }}>$1,495</span>
                  <span className="pb-1 text-xs text-(--af-grey-light)">done for you</span>
                </div>
                <p className="mt-4 text-sm text-(--af-grey-light)">Payment plan: 3 payments of $550 ($1,650 total).</p>
                <p className="mt-2 text-sm text-(--af-grey-light)">Optional maintenance: $249/month. Cancel anytime.</p>
                <Link
                  href="/apply?path=hana"
                  className="af-btn-primary mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold"
                >
                  Apply for a Founding Installation
                </Link>
                <p className="mt-4 text-[10px] leading-relaxed text-(--af-grey-light)">
                  Third-party API usage, hosting, product samples, advertising, and platform fees are client-paid.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
