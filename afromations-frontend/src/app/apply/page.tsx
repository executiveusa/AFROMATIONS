import type { Metadata } from 'next'
import Link from 'next/link'
import { ApplicationForm } from './form'

export const metadata: Metadata = {
  title: 'Apply — Hana Artist Partner Program',
  description:
    'Apply for an invite to the AFROMATIONS Hana Artist Partner Program. Invite-only for 21+ serious artists.',
}

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4 text-xs">
        <Link href="/" className="font-bold tracking-widest text-(--af-red)">AFROMATIONS</Link>
        <span className="text-(--af-grey-light)">/</span>
        <Link href="/artist-partner-program" className="text-(--af-grey-light) hover:text-(--af-cream)">Artist Partner Program</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Apply</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">Invite-only · 21+</div>
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
          Apply for Invite
        </h1>
        <p className="text-(--af-grey-light) mb-8 text-sm leading-relaxed">
          We review every application personally. Expect a response within a few days. If you are accepted, we will follow up with next steps.
        </p>
        <ApplicationForm />
      </div>
    </main>
  )
}
