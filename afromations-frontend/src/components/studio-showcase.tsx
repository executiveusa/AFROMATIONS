'use client'

import { useRef, useEffect, useState } from 'react'

const showcaseItems = [
  {
    title: '3D Character Pipeline',
    description: 'Blender bpy → Anime toon shader → Eevee render → GLB/FBX export. Full pipeline from concept to deployable asset.',
    tag: 'Pipeline',
  },
  {
    title: 'Anime Content Engine',
    description: 'Google Trends monitoring → AI article generation → Auto-publish. Fresh anime content daily, written with authentic voice.',
    tag: 'Content',
  },
  {
    title: 'Community Hub',
    description: 'Weekly digests, trending topic discussions, creator spotlights. Building the biggest black anime community together.',
    tag: 'Community',
  },
]

export function StudioShowcase() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="gallery"
      ref={ref}
      className="border-t border-white/5 px-6 py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-[10px] font-medium tracking-[0.4em] text-[var(--af-red)] uppercase">
          The Studio
        </p>
        <h2
          className="text-3xl font-bold tracking-tight text-[var(--af-cream)] sm:text-4xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          What We Build
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {showcaseItems.map((item, i) => (
            <div
              key={item.title}
              className={`
                group relative overflow-hidden rounded-sm border border-white/5 bg-[var(--af-grey)] p-8
                transition-all duration-500
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
              `}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Tag */}
              <span className="inline-block text-[10px] tracking-wider text-[var(--af-red)] uppercase">
                {item.tag}
              </span>

              <h3 className="mt-4 text-lg font-semibold text-[var(--af-cream)]">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[var(--af-grey-light)]">
                {item.description}
              </p>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 h-px w-0 bg-[var(--af-red)] transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
