import type { Metadata } from 'next'
import Link from 'next/link'
import { ApplicationForm } from './form'

export const metadata: Metadata = {
  title: 'Apply — AFROMATIONS',
  description:
    'Apply to join the founding tattoo artist circle or request a $1,495 done-for-you Hana Character Launch Agent installation.',
}

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-5 py-4 sm:px-8" aria-label="Breadcrumb">
        <div className="mx-auto flex max-w-4xl items-center gap-3 text-xs">
          <Link href="/" className="font-bold tracking-[0.16em] text-(--af-red)">AFROMATIONS</Link>
          <span className="text-(--af-grey-light)">/</span>
          <span>Apply</span>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-red) uppercase">Founding applications // 21+</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-[-.045em] sm:text-6xl" style={{ fontFamily: 'Sora, sans-serif' }}>
          Start with the work. Protect the relationship. Build from there.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-(--af-grey-light)">
          Apply to join the no-fee founding artist roster or request the $1,495 done-for-you Hana Character Launch Agent.
          We review every application personally.
        </p>

        <div className="mt-10 border border-white/10 bg-white/[.025] p-5 sm:p-8">
          <ApplicationForm />
        </div>
      </div>
    </main>
  )
}
