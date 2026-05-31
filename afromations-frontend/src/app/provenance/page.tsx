import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Provenance Vault — AFROMATIONS',
  description:
    'Track authorship evidence, human contribution, AI assistance, file hashes, and source files for your original characters.',
}

const FIELDS = [
  { label: 'Source files', desc: 'Original sketches, reference photos, process screenshots' },
  { label: 'Final files', desc: 'Finished illustrations, animation files, exports' },
  { label: 'File hashes', desc: 'SHA-256 fingerprints of every file version' },
  { label: 'Human contribution notes', desc: "Artist's own description of their creative process" },
  { label: 'AI tools used', desc: 'Which AI tools assisted and how (image gen, color, cleanup)' },
  { label: 'Prompts used', desc: 'Optional: prompts that produced specific outputs' },
  { label: 'License terms', desc: 'Current license status for this character or work' },
  { label: 'Auction / drop ID', desc: 'Link to any public drops this work appeared in' },
  { label: 'Public proof URL', desc: 'Public permalink for sharing provenance with buyers/licensees' },
]

export default function ProvenancePage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4 text-xs">
        <Link href="/" className="font-bold tracking-widest text-(--af-red)">AFROMATIONS</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Provenance Vault</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">Coming soon · Partner artists only</div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>Provenance Vault</h1>
        <p className="text-lg text-(--af-grey-light) max-w-2xl mb-4 leading-relaxed">
          Every original character deserves an evidence trail. The Provenance Vault tracks your authorship, documents your process, hashes your files, and creates a timestamped record of your creative work.
        </p>
        <p className="text-sm text-(--af-grey-light)/70 mb-12 p-4 rounded-lg border border-white/5 bg-white/5">
          <strong className="text-(--af-cream)">Important:</strong> Blockchain can timestamp evidence, but it does not replace copyright, trademark, contracts, or legal advice. The Provenance Vault is an evidence record, not a legal filing. Educational information only — not legal advice. Work with a licensed attorney for legal decisions.
        </p>

        {/* What gets tracked */}
        <div className="mb-16">
          <div className="text-[10px] tracking-[0.4em] text-(--af-grey-light) uppercase mb-6">What the Vault tracks</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FIELDS.map((f) => (
              <div key={f.label} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold mb-1">{f.label}</div>
                <div className="text-xs text-(--af-grey-light) leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Data model preview */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-16 overflow-auto">
          <div className="text-[10px] tracking-[0.4em] text-(--af-grey-light) uppercase mb-4">Record schema (preview)</div>
          <pre className="text-xs text-(--af-grey-light) leading-relaxed whitespace-pre-wrap">{`ProvenanceRecord {
  id               — unique record ID
  artistId         — your AFROMATIONS account
  characterId      — the character this belongs to
  title            — record title / description
  sourceFiles      — original file paths
  finalFiles       — output file paths
  fileHashes       — SHA-256 of each file
  humanContribution — your creative process notes
  aiToolsUsed      — ["Flux", "AfroScribble", ...]
  promptsUsed      — optional: prompts used
  licenseTerms     — current license
  copyrightStatus  — human_authored | ai_assisted | ai_generated
  publicProofUrl   — shareable permalink
  createdAt / updatedAt
}`}</pre>
        </div>

        {/* What blockchain can / cannot do */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="text-[10px] tracking-wider text-emerald-400 uppercase mb-3">Blockchain can</div>
            <ul className="space-y-2 text-sm text-(--af-grey-light)">
              {[
                'Timestamp when a file hash was recorded',
                'Create a tamper-evident evidence trail',
                'Show prior use in licensing disputes',
                'Build buyer confidence in auctions',
                'Support (not replace) copyright registration',
              ].map((item) => (
                <li key={item} className="flex gap-2"><span className="text-emerald-400 shrink-0">✓</span>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
            <div className="text-[10px] tracking-wider text-red-400 uppercase mb-3">Blockchain cannot</div>
            <ul className="space-y-2 text-sm text-(--af-grey-light)">
              {[
                'Create copyright or trademark rights',
                'Replace registration with the Copyright Office',
                'Prevent infringement on its own',
                'Substitute for contracts',
                'Provide legal protection without an attorney',
              ].map((item) => (
                <li key={item} className="flex gap-2"><span className="text-red-400 shrink-0">✗</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-(--af-red)/20 bg-(--af-red)/5 p-8 text-center">
          <div className="text-xl font-semibold mb-3">Get access to the Provenance Vault</div>
          <p className="text-(--af-grey-light) text-sm mb-6">
            The Vault is part of the Hana Artist Partner Program. Apply for an invite to get started.
          </p>
          <Link href="/apply" className="af-btn-primary inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold">
            Apply for Invite
          </Link>
        </div>
      </div>
    </main>
  )
}
