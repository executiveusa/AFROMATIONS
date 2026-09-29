import type { ReactNode } from 'react'

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">
      {children}
    </p>
  )
}

export function MediaSlot({
  label,
  className = '',
}: {
  label: string
  className?: string
}) {
  return (
    <div
      className={`flex min-h-56 items-center justify-center border border-dashed border-white/15 bg-white/[.018] p-6 text-center ${className}`}
    >
      <span className="max-w-56 text-[10px] font-semibold tracking-[0.18em] text-white/30 uppercase">
        {label}
      </span>
    </div>
  )
}

export function PageIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body: string
}) {
  return (
    <section className="px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>{eyebrow}</SectionLabel>
        <h1
          className="mt-5 max-w-5xl text-5xl font-extrabold leading-[.95] tracking-[-.06em] text-(--af-cream) sm:text-7xl lg:text-8xl"
          style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}
        >
          {title}
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-(--af-grey-light) sm:text-lg">
          {body}
        </p>
      </div>
    </section>
  )
}
