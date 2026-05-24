'use client'

import { motion, AnimatePresence } from 'motion/react'
import { InnerLayout } from '@/components/inner-layout'
import { DualAvatar } from '@/components/dual-avatar'
import { HtmlInCanvasBeta } from '@/components/studio/html-in-canvas-beta'
import Link from 'next/link'

/* ─── Studio Modes ─── */
const STUDIO_MODES = [
  {
    id: 'image',
    name: 'Image Studio',
    icon: '画',
    tagline: 'AI image generation — available now',
    description: 'Generate anime-style illustrations and character art from text prompts. Describe your scene, choose a style, and Hana builds it. Supports text-to-image and basic image editing.',
    features: ['Text-to-Image', 'Anime & Cel-Shaded Styles', 'Character Portraits', 'Scene Illustration'],
    models: ['Flux Dev', 'Seedream', 'GPT-4o'],
    accentColor: 'var(--af-red)',
    available: true,
  },
] as const

const ROADMAP_MODES = [
  { id: 'video', name: 'Video Studio', icon: '動', description: 'Animate scenes and characters from images or text.' },
  { id: 'lipsync', name: 'Lip Sync', icon: '唇', description: 'Sync character portraits to dialogue and audio.' },
  { id: 'blender', name: 'Blender Control', icon: '立', description: 'AI-assisted 3D modeling and toon rendering.' },
  { id: 'workflow', name: 'Workflows', icon: '流', description: 'Chain generation steps into automated pipelines.' },
] as const

type StudioModeId = (typeof STUDIO_MODES)[number]['id']

/* ─── Hana Agent Panel ─── */
function DualAgentPanel({ activeModeId }: { activeModeId: StudioModeId }) {
  const suggestions: Record<StudioModeId, string[]> = {
    image: [
      'Generate a cel-shaded anime character portrait',
      'Draw a cyberpunk Seattle cityscape at night',
      'Create a character in traditional Edo-period armor',
    ],
  }

  return (
    <div
      className="rounded-sm border border-white/8 bg-[rgba(10,10,10,0.85)] p-5"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* Agent header */}
      <div className="mb-4 flex items-center gap-3">
        <DualAvatar size={32} />
        <div>
          <p className="text-xs font-semibold text-(--af-cream)">Agent Hana 花</p>
          <p className="text-[10px] text-(--af-grey-light)">Your creative partner</p>
        </div>
        <span
          className="ml-auto flex items-center gap-1.5 text-[9px] tracking-wider uppercase"
          style={{ color: 'var(--af-teal)' }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
          Ready
        </span>
      </div>

      {/* Suggested prompts */}
      <p className="mb-3 text-[10px] tracking-[0.3em] text-(--af-grey-light) uppercase">
        Try a prompt
      </p>
      <ul className="space-y-2" role="list">
        {suggestions[activeModeId].map((s) => (
          <li key={s}>
            <button
              className="w-full rounded border border-white/6 bg-white/3 px-3 py-2 text-left text-[11px] leading-snug text-(--af-grey-light) transition-colors hover:border-white/12 hover:text-(--af-cream)"
              aria-label={`Ask DUAL: ${s}`}
            >
              <span style={{ color: 'var(--af-gold)' }}>→ </span>
              {s}
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[9px] leading-relaxed text-(--af-grey-light)" style={{ opacity: 0.6 }}>
        Hana guides your creative process — describe what you want to make.
      </p>
    </div>
  )
}

/* ─── Main Studio Page ─── */
export default function StudioPage() {
  const activeMode: StudioModeId = 'image'
  const activeStudio = STUDIO_MODES[0]

  return (
    <InnerLayout>
      <main
        className="min-h-screen pt-24 pb-16"
        style={{
          background: `
            linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.95)),
            url('/images/seattle-2056.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Header */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
          <div className="flex items-center gap-4 mb-4">
            <DualAvatar size={48} />
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-(--af-gold) mb-1">
                AI-Powered Creative Suite
              </p>
              <h1
                className="text-4xl sm:text-5xl font-bold text-(--af-cream)"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Hana Studio
              </h1>
            </div>
          </div>
          <p className="text-(--af-grey-light) max-w-2xl text-sm leading-relaxed">
            An AI-powered creative workspace for anime storytelling.
            Generate characters, scenes, and illustrations — guided by Agent Hana.
            Video, 3D, and workflow tools are on the roadmap.
          </p>
        </section>

        {/* Available Studio Mode */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold tracking-wider uppercase"
              style={{ color: 'var(--af-teal)', borderColor: 'var(--af-teal)30' }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
              Available Now
            </span>
            <span className="text-[10px] text-(--af-grey-light)">Image Studio</span>
          </div>
        </section>

        {/* Active Studio Panel */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-6 lg:grid-cols-3"
            >
              {/* Main Studio Card */}
              <div className="af-card lg:col-span-2">
                <div className="af-card-inner">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <span
                        className="mb-2 inline-block text-[10px] font-medium tracking-[0.3em] uppercase"
                        style={{ color: activeStudio.accentColor }}
                      >
                        {activeStudio.tagline}
                      </span>
                      <h2
                        className="text-2xl font-bold text-(--af-cream)"
                        style={{ fontFamily: 'Sora, sans-serif' }}
                      >
                        {activeStudio.name}
                      </h2>
                    </div>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-5xl"
                      style={{ fontFamily: 'serif', opacity: 0.2, color: activeStudio.accentColor }}
                    >
                      {activeStudio.icon}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-(--af-grey-light) mb-6">
                    {activeStudio.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-(--af-grey-light) mb-3">
                      Capabilities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeStudio.features.map((f) => (
                        <span
                          key={f}
                          className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-(--af-grey-light)"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Models */}
                  <div className="mb-6">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-(--af-grey-light) mb-3">
                      Available Models
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeStudio.models.map((m) => (
                        <span
                          key={m}
                          className="rounded border px-2 py-1 text-[10px] font-medium"
                          style={{ 
                            borderColor: `${activeStudio.accentColor}40`,
                            color: activeStudio.accentColor,
                          }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/hana"
                      className="af-btn-primary inline-flex h-10 items-center rounded-full px-6 text-xs font-semibold tracking-wider"
                      style={{ background: activeStudio.accentColor }}
                    >
                      Meet Agent Hana
                    </Link>
                    <Link
                      href="/learn"
                      className="inline-flex h-10 items-center rounded-full border border-white/10 px-6 text-xs font-semibold tracking-wider text-(--af-grey-light) hover:border-white/20 hover:text-(--af-cream) transition-colors"
                    >
                      Explore Academy →
                    </Link>
                  </div>
                </div>
              </div>

              {/* DUAL Agent Panel */}
              <DualAgentPanel activeModeId={activeMode} />
            </motion.div>
          </AnimatePresence>

        </section>

        {/* Roadmap Section */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mt-16">
          <div className="af-card">
            <div className="af-card-inner">
              <span className="text-[10px] tracking-[0.2em] uppercase text-(--af-gold) mb-2 block">
                What&apos;s Next
              </span>
              <h3 className="text-xl font-bold text-(--af-cream) mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                Studio Roadmap
              </h3>
              <p className="text-sm text-(--af-grey-light) leading-relaxed mb-6">
                Image generation is live. These capabilities are in development and will be released as they reach production quality.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {ROADMAP_MODES.map((mode) => (
                  <div
                    key={mode.id}
                    className="flex items-start gap-3 rounded border border-white/5 bg-white/2 px-4 py-3"
                  >
                    <span
                      className="shrink-0 text-2xl"
                      style={{ fontFamily: 'serif', opacity: 0.4, color: 'var(--af-grey-light)' }}
                      aria-hidden="true"
                    >
                      {mode.icon}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-(--af-cream)">{mode.name}</p>
                      <p className="text-[10px] leading-relaxed text-(--af-grey-light) mt-0.5">{mode.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HTML-in-Canvas Beta Feature */}
        <HtmlInCanvasBeta />
      </main>
    </InnerLayout>
  )
}
