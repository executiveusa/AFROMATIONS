import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sovereignty Vault — AFROMATIONS',
  description:
    'A readable provenance and certificate system for artist-owned work: human contribution records, license terms, file fingerprints, timestamps, C2PA-ready metadata, and optional blockchain anchoring.',
}

const VAULT_LAYERS = [
  {
    title: 'Source archive',
    body: 'Original sketches, layered files, photos, voice notes, drafts, and creator declarations are preserved as the private evidence base.',
  },
  {
    title: 'Human contribution log',
    body: 'The record states who conceived, drew, edited, approved, inked, colored, prepared, or otherwise shaped the final work.',
  },
  {
    title: 'License record',
    body: 'Product, territory, duration, exclusivity, payment, attribution, renewal, and termination terms are summarized in plain language.',
  },
  {
    title: 'AI disclosure',
    body: 'Models, tools, reference inputs, generated stages, and human modifications are documented rather than hidden.',
  },
  {
    title: 'Cryptographic fingerprint',
    body: 'Each approved file receives a SHA-256 hash so later copies can be checked against the recorded version.',
  },
  {
    title: 'Timestamp and optional chain anchor',
    body: 'A signed timestamp and optional public-chain batch anchor can support evidence that the recorded manifest existed at a particular time.',
  },
]

const NOT_CLAIMS = [
  'A certificate does not automatically create copyright.',
  'A blockchain transaction does not determine who legally authored a work.',
  'A file hash does not prove the submitter had permission to register the file.',
  'The Vault does not replace contracts, government registration, or legal advice.',
  'C2PA-style provenance describes a production history; it is not an ownership court.',
]

export default function ProvenancePage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-5 py-4 sm:px-8" aria-label="Breadcrumb">
        <div className="mx-auto flex max-w-7xl items-center gap-3 text-xs">
          <Link href="/" className="font-bold tracking-[0.16em] text-(--af-red)">AFROMATIONS</Link>
          <span className="text-(--af-grey-light)">/</span>
          <span>Sovereignty Vault</span>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-white/5 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="vault-title">
        <div className="absolute right-0 top-0 text-[18rem] font-black leading-none text-(--af-gold)/5" aria-hidden="true">証</div>
        <div className="relative mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.34em] text-(--af-gold) uppercase">Prove the process. Preserve the evidence.</p>
          <h1 id="vault-title" className="mt-5 max-w-5xl text-4xl font-extrabold leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl" style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}>
            Keep the rights—and keep a record strong enough to travel with the work.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-(--af-grey-light)">
            The AFROMATIONS Sovereignty Vault organizes source files, human authorship evidence,
            license terms, AI disclosures, cryptographic fingerprints, and public verification into one readable record.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/apply?path=artist" className="af-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-8 text-sm font-semibold">
              Join the Artist Circle
            </Link>
            <Link href="/apply?path=hana" className="af-btn-secondary inline-flex min-h-12 items-center justify-center rounded-full border px-8 text-sm font-semibold">
              Add the Vault to a Hana Installation
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="vault-layers-title">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-red) uppercase">The evidence stack</p>
            <h2 id="vault-layers-title" className="mt-4 text-3xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
              Blockchain is one layer—not the whole promise.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-(--af-grey-light)">
              Ownership protection begins with source files, human decisions, written agreements, and transparent contributor records.
              A timestamp or chain anchor can make the final evidence package harder to alter retroactively, but it cannot replace the rest.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {VAULT_LAYERS.map((layer, index) => (
              <article key={layer.title} className="bg-(--af-black) p-6 sm:p-7">
                <div className="text-xs font-bold text-(--af-red)">{String(index + 1).padStart(2, '0')}</div>
                <h3 className="mt-4 text-lg font-semibold">{layer.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-(--af-grey-light)">{layer.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-[#0d0c0b] px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="coa-title">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-gold) uppercase">Readable certificate</p>
            <h2 id="coa-title" className="mt-4 text-3xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
              A certificate people can understand without decoding a wallet.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-(--af-grey-light)">
              Every certificate is designed to answer the questions a buyer, collaborator, gallery, platform, or future licensee will actually ask.
            </p>
          </div>

          <div className="border border-(--af-gold)/35 bg-[#15120d] p-1">
            <div className="border border-white/10 p-6 sm:p-9">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.28em] text-(--af-gold) uppercase">AFROMATIONS certificate of authenticity</div>
                  <div className="mt-2 text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>DUAL // Chapter 1 Cover</div>
                </div>
                <div className="text-5xl font-black text-(--af-gold)/20" aria-hidden="true">認</div>
              </div>

              <dl className="mt-6 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
                {[
                  ['Work ID', 'AFR-DUAL-CH1-001'],
                  ['Creator', 'Verified creator record'],
                  ['Human roles', 'Concept, drawing, final approval'],
                  ['Licensed use', 'Defined in signed project terms'],
                  ['AI disclosure', 'Recorded by stage and tool'],
                  ['File hash', 'SHA-256 fingerprint'],
                  ['Timestamp', 'Signed evidence receipt'],
                  ['Verification', 'Public certificate URL'],
                ].map(([term, description]) => (
                  <div key={term} className="bg-[#11100e] p-4">
                    <dt className="text-[9px] font-semibold tracking-[0.2em] text-(--af-gold) uppercase">{term}</dt>
                    <dd className="mt-2 text-sm text-(--af-grey-light)">{description}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 border-l-2 border-(--af-gold) pl-4 text-xs leading-relaxed text-(--af-grey-light)">
                The certificate summarizes evidence and terms. The signed agreement remains controlling where the two differ.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="truth-title">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-red) uppercase">Truth before hype</p>
            <h2 id="truth-title" className="mt-4 text-3xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
              What we will never claim.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-(--af-grey-light)">
              Digital sovereignty depends on accurate language. False certainty makes artists more vulnerable, not less.
            </p>
          </div>
          <div className="border-t border-white/10">
            {NOT_CLAIMS.map((claim, index) => (
              <div key={claim} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/10 py-5">
                <span className="text-xs font-bold text-(--af-red)">{String(index + 1).padStart(2, '0')}</span>
                <p className="text-sm leading-relaxed text-(--af-grey-light)">{claim}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="vault-cta-title">
        <div className="mx-auto max-w-5xl border border-(--af-red)/30 bg-(--af-red)/5 p-7 text-center sm:p-12">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-(--af-red) uppercase">Build the first public cases with us</p>
          <h2 id="vault-cta-title" className="mt-4 text-3xl font-bold sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
            Dual becomes the proof. Founding artists become the standard.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-(--af-grey-light)">
            We are building the initial verification records with a small artist circle before expanding the system.
          </p>
          <Link href="/apply?path=artist" className="af-btn-primary mt-7 inline-flex min-h-12 items-center justify-center rounded-full px-8 text-sm font-semibold">
            Apply to the Founding Circle
          </Link>
          <p className="mt-7 text-xs leading-relaxed text-(--af-grey-light)">
            Educational information only. This is not legal advice. Work with a licensed attorney for legal decisions.
          </p>
        </div>
      </section>
    </main>
  )
}
