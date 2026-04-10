'use client'

import { useRef, useEffect, useState } from 'react'

const stats = [
  { label: 'Render Resolution', value: '4K' },
  { label: 'Shader Type', value: 'Toon / Anime' },
  { label: 'Agent Version', value: '花 v3.0' },
  { label: 'Pipeline', value: 'Eevee → GLB' },
]

const abilities = [
  'Anime character generation',
  '3D avatar creation (Blender bpy)',
  'Google Trends monitoring',
  'Blog article generation',
  'Community digest & scheduling',
  'Asset export (GLB, FBX, PNG)',
]

export function HannaFeature() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="hanna"
      ref={sectionRef}
      className="relative border-t border-white/5 px-6 py-32"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <p className="mb-3 text-[10px] font-medium tracking-[0.4em] text-[var(--af-red)] uppercase">
          Featured Agent
        </p>

        <div className="grid gap-16 md:grid-cols-2">
          {/* Left — Character placeholder */}
          <div className="relative flex items-center justify-center">
            <div
              className={`
                relative h-[480px] w-full overflow-hidden rounded-sm border border-white/5 bg-[var(--af-grey)]
                transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
            >
              {/* Hanna silhouette placeholder — replace with actual 3D render */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="mb-4 text-6xl">花</div>
                <p className="text-xs tracking-wider text-[var(--af-grey-light)]">
                  Agent Hanna — 3D render loading
                </p>
                <p className="mt-1 text-[10px] text-[var(--af-grey-light)]">
                  Japanese warrior princess · 27 · Anime style
                </p>
              </div>

              {/* Red corner accent */}
              <div className="absolute right-0 top-0 h-16 w-px bg-[var(--af-red)]" />
              <div className="absolute right-0 top-0 h-px w-16 bg-[var(--af-red)]" />
            </div>
          </div>

          {/* Right — Info */}
          <div
            className={`
              flex flex-col justify-center
              transition-all duration-700 delay-200
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <h2
              className="text-3xl font-bold tracking-tight text-[var(--af-cream)] sm:text-4xl"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Agent Hanna
            </h2>
            <p className="mt-1 text-sm text-[var(--af-red)]">
              花 — The Blade That Creates
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--af-grey-light)]">
              A Japanese warrior princess forged from anime tradition but
              built on cutting-edge AI infrastructure. Hanna is the creative
              engine behind AFROMATIONS — she generates characters, writes
              content, monitors trends, and deploys assets without breaking
              a sweat.
            </p>

            {/* Stats grid */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="border-l border-white/10 pl-4">
                  <p className="text-[10px] tracking-wider text-[var(--af-grey-light)] uppercase">
                    {s.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--af-cream)]">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Abilities */}
            <div className="mt-8">
              <p className="mb-3 text-[10px] tracking-wider text-[var(--af-grey-light)] uppercase">
                Capabilities
              </p>
              <ul className="space-y-2">
                {abilities.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-2 text-sm text-[var(--af-cream)]"
                  >
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--af-red)]" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
