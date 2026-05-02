'use client'

import Link from 'next/link'
import { InView } from '@/components/motion/in-view'
import { TegakiText } from '@/components/tegaki-text'
import { DualAvatar } from '@/components/dual-avatar'

/* ─── Seattle 2056 Background ─── */
const SEATTLE_2056_BG = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_28_30%20AM-8H8mCUYBudu0SiaGSEOd1ek64hHZOd.png'

export function DualFeature() {
  const stats = [
    { label: 'Architecture', value: 'Space Agent Core' },
    { label: 'Runtime', value: 'Browser-Native' },
    { label: 'Version', value: '2056.1' },
    { label: 'Mode', value: 'Multi-Purpose' },
  ]

  const abilities = [
    'Reshapes the interface on demand — build pages, tools, widgets live',
    'Writes and extends capabilities via SKILL.md plain-text files',
    'Token-efficient execution — no bulky JSON tool calls',
    'Puzzle-piece modularity — add, remove, swap cleanly',
    'Personal to hierarchical scaling — solo or team workflows',
    'Git-backed history with admin time travel rollback',
  ]

  return (
    <section
      id="dual"
      className="relative border-t border-white/5 px-5 py-20 sm:px-6 sm:py-32 overflow-hidden"
      aria-labelledby="dual-heading"
    >
      {/* Seattle 2056 Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${SEATTLE_2056_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-(--af-black) via-(--af-black)/80 to-(--af-black)/60" aria-hidden="true" />
      
      <div className="relative mx-auto max-w-6xl">

        {/* Section header */}
        <div className="mb-10 text-center">
          <InView
            variants={{
              hidden: { opacity: 0, x: -48 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            once
            className="flex justify-center"
          >
            <TegakiText
              font="tangerine"
              size={20}
              color="var(--af-red)"
              className="tracking-[0.4em] uppercase"
            >
              Multi-Purpose Agent
            </TegakiText>
          </InView>
        </div>

        <div className="grid gap-10 md:gap-16 md:grid-cols-2">

          {/* Left — DUAL Avatar with Seattle backdrop */}
          <InView
            variants={{
              hidden: { opacity: 0, x: -32 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            once
            className="relative flex items-center justify-center"
          >
            <div className="relative h-80 w-full overflow-hidden rounded-sm border border-white/5 bg-(--af-grey) sm:h-96 flex items-center justify-center"
              style={{
                backgroundImage: `url(${SEATTLE_2056_BG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-(--af-black)/60" />
              
              {/* Avatar */}
              <div className="relative z-10">
                <DualAvatar size={200} />
              </div>
              
              {/* Red corner accent */}
              <div className="absolute right-0 top-0 h-16 w-px bg-(--af-red)" />
              <div className="absolute right-0 top-0 h-px w-16 bg-(--af-red)" />
              
              {/* Japanese text overlay */}
              <div className="absolute bottom-4 left-4 z-10">
                <p className="text-[10px] tracking-wider text-(--af-red) uppercase">Seattle 2056</p>
                <p className="text-lg font-bold text-(--af-cream)" style={{ fontFamily: 'Sora, sans-serif' }}>
                  目的なき者は滅びる
                </p>
                <p className="text-[10px] text-(--af-grey-light)">One Without Purpose Is Lost</p>
              </div>
            </div>
          </InView>

          {/* Right — Info */}
          <InView
            variants={{
              hidden: { opacity: 0, x: 32 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            once
            className="flex flex-col justify-center"
          >
            <h2
              id="dual-heading"
              className="text-2xl font-bold tracking-tight text-(--af-cream) sm:text-3xl md:text-4xl"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              DUAL Agent
            </h2>
            <p className="mt-1 text-sm text-(--af-red)">
              The Agent That Reshapes the Space
            </p>
            <p className="mt-4 text-sm leading-relaxed text-(--af-grey-light)">
              DUAL is not a chatbot trapped in a text box. Built on Space Agent architecture, 
              DUAL lives in the browser runtime itself — working directly with the same 
              framework, modules, spaces, and UI it is reshaping. Ask for a page, tool, 
              widget, or workflow, and DUAL can build it straight into the running 
              workspace while you work.
            </p>

            {/* Stats grid */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="border-l border-white/10 pl-4">
                  <p className="text-[10px] tracking-wider text-(--af-grey-light) uppercase">
                    {s.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-(--af-cream)">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Abilities */}
            <div className="mt-8">
              <p className="mb-3 text-[10px] tracking-wider text-(--af-grey-light) uppercase">
                Capabilities
              </p>
              <ul className="space-y-2" role="list">
                {abilities.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm text-(--af-cream)">
                    <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-(--af-red)" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* "Powered by" section */}
            <div className="mt-8 flex flex-col items-end gap-3 border-t border-white/5 pt-5 sm:flex-row sm:items-center sm:justify-end">
              <div className="text-right">
                <p className="text-[9px] tracking-[0.35em] text-(--af-grey-light) uppercase">
                  Powered by
                </p>
                <p
                  className="mt-0.5 text-sm font-bold tracking-widest"
                  style={{ fontFamily: 'Sora, sans-serif', color: 'var(--af-red)' }}
                >
                  O.W.P.I.L
                </p>
              </div>
              <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden="true" />
              <p className="max-w-[200px] text-right text-[10px] leading-relaxed text-(--af-grey-light) sm:text-left">
                One Without Purpose Is Lost. DUAL embodies the mission of finding and fulfilling purpose through creation.
              </p>
            </div>

            {/* Learn More CTA */}
            <div className="mt-6 flex justify-end">
              <Link
                href="/dual"
                className="af-btn-secondary inline-flex h-10 items-center rounded-full border px-6 text-[11px] font-semibold tracking-wider"
              >
                Meet DUAL Agent
              </Link>
            </div>
          </InView>
        </div>
      </div>
    </section>
  )
}
