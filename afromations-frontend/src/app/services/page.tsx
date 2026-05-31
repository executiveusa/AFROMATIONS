import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services — AFROMATIONS',
  description: 'Artist infrastructure services from AFROMATIONS. Private AI agent installs, character asset packs, landing pages, and more.',
}

const SERVICES = [
  {
    name: 'Hana Agent Install',
    status: 'Invite-only',
    desc: 'A private AI studio agent installed for your creative business. Manages research, content, publishing, and provenance.',
    badge: 'bg-yellow-500/20 text-yellow-300',
  },
  {
    name: '24-Hour Character Demo',
    status: 'Request available',
    desc: 'Hana evaluates one original character and delivers a sample content pack with provenance trail in 24 hours.',
    badge: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    name: 'Artist Landing Page',
    status: 'Partner artists',
    desc: 'A professional public page for your characters, portfolio, commission availability, and contact.',
    badge: 'bg-yellow-500/20 text-yellow-300',
  },
  {
    name: 'Character Asset Pack',
    status: 'Coming soon',
    desc: 'Stencil layers, coloring pages, printable packs, and production-ready visual derivatives from your character art.',
    badge: 'bg-white/10 text-(--af-grey-light)',
  },
  {
    name: 'Provenance Vault',
    status: 'Partner artists',
    desc: 'Full authorship documentation, file hashing, AI assistance records, and public proof links.',
    badge: 'bg-yellow-500/20 text-yellow-300',
  },
  {
    name: 'Drop / Auction Support',
    status: 'Coming soon',
    desc: 'Drop page preparation, provenance records, and auction coordination for partner artists.',
    badge: 'bg-white/10 text-(--af-grey-light)',
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4 text-xs">
        <Link href="/" className="font-bold tracking-widest text-(--af-red)">AFROMATIONS</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Services</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">21+ · Invite-only</div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>Services</h1>
        <p className="text-lg text-(--af-grey-light) max-w-2xl mb-12 leading-relaxed">
          Artist infrastructure services for serious 21+ creators. Built around Hana — your private AI studio agent.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {SERVICES.map((svc) => (
            <div key={svc.name} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="text-lg font-semibold">{svc.name}</div>
                <span className={`rounded px-2 py-0.5 text-[10px] shrink-0 ${svc.badge}`}>{svc.status}</span>
              </div>
              <p className="text-sm text-(--af-grey-light) leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/apply" className="af-btn-primary inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold">
            Apply for Invite
          </Link>
          <p className="mt-3 text-xs text-(--af-grey-light)">Pricing is discussed after application review. No public pricing yet.</p>
        </div>
      </div>
    </main>
  )
}
