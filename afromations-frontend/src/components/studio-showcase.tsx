'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { InView } from '@/components/motion/in-view'
import { TextEffect } from '@/components/motion/text-effect'
import { useI18n } from '@/lib/i18n'

/* ─── Open-Source Tool Registry ─── */
const STUDIO_TOOLS = [
  {
    id: 'openmontage',
    tag: 'VIDEO & ANIMATION',
    name: 'OpenMontage',
    tagline: 'AI-powered anime scene assembly',
    description:
      'Storyboard, composite, and render anime scenes directly in the browser. OpenMontage handles keyframe interpolation, cel-shading, and timeline editing — all open source.',
    features: ['Scene Storyboarding', 'Cel-shade Rendering', 'Timeline Editor', 'AI Auto-Fill'],
    href: 'https://github.com/openmontage/openmontage',
    launchLabel: 'Open Animation Studio',
    accentColor: 'var(--af-red)',
    icon: '映',
  },
  {
    id: 'lmms',
    tag: 'MUSIC PRODUCTION',
    name: 'LMMS',
    tagline: 'Full DAW — make beats, compose scores',
    description:
      'Linux MultiMedia Studio runs entirely in-browser via WebAssembly. Lay down beats, compose anime-style orchestral scores, record vocals, and export stems — no install needed.',
    features: ['Beat Sequencer', 'Piano Roll', 'VST Plugins', 'MIDI Support'],
    href: 'https://lmms.io',
    launchLabel: 'Open Music Studio',
    accentColor: 'var(--af-gold)',
    icon: '楽',
  },
  {
    id: 'audacity',
    tag: 'AUDIO EDITING',
    name: 'Audacity Web',
    tagline: 'Record, mix, and master your tracks',
    description:
      'The world\'s most popular open-source audio editor, rebuilt for the web. Record vocals, layer sound effects, EQ, compress, and export studio-quality audio for your anime projects.',
    features: ['Multi-track Recording', 'Noise Removal', 'EQ & Compression', 'Waveform Editor'],
    href: 'https://www.audacityteam.org',
    launchLabel: 'Open Audio Editor',
    accentColor: 'var(--af-teal)',
    icon: '音',
  },
  {
    id: 'musescore',
    tag: 'SHEET MUSIC',
    name: 'MuseScore',
    tagline: 'Compose and score your soundtrack',
    description:
      'Write full orchestral scores for your anime. MuseScore\'s web player lets you compose, share, and export sheet music with 800+ soundfonts including Japanese traditional instruments.',
    features: ['Orchestral Scoring', '800+ Soundfonts', 'MIDI Export', 'Community Scores'],
    href: 'https://musescore.com',
    launchLabel: 'Open Score Editor',
    accentColor: 'var(--af-coral)',
    icon: '譜',
  },
] as const

type ToolId = (typeof STUDIO_TOOLS)[number]['id']

/* ─── OpenHarness Agent Panel ─── */
function AgentPanel({ activeToolId }: { activeToolId: ToolId }) {
  const tool = STUDIO_TOOLS.find((t) => t.id === activeToolId)!
  const suggestions: Record<ToolId, string[]> = {
    openmontage: [
      'Generate a 30-second opening sequence for my anime',
      'Storyboard a battle scene with 6 panels',
      'Apply cel-shading to my character sketches',
    ],
    lmms: [
      'Create a lo-fi hip-hop beat at 85 BPM',
      'Compose a dramatic orchestral theme for a samurai arc',
      'Build a 4-bar trap intro for the opening credits',
    ],
    audacity: [
      'Remove background noise from my voice recording',
      'Add reverb to make my vocals sound cinematic',
      'Master this track for streaming at -14 LUFS',
    ],
    musescore: [
      'Score a Japanese shamisen melody in D minor',
      'Write a 16-bar intro for a 5-piece ensemble',
      'Transcribe this melody into sheet music notation',
    ],
  }

  return (
    <div
      className="rounded-sm border border-white/8 bg-[rgba(10,10,10,0.85)] p-5"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* Agent header */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
          style={{ borderColor: 'var(--af-red)', color: 'var(--af-red)' }}
        >
          花
        </div>
        <div>
          <p className="text-xs font-semibold text-(--af-cream)">Agent Hana</p>
          <p className="text-[10px] text-(--af-grey-light)">OpenHarness · {tool.name}</p>
        </div>
        <span
          className="ml-auto flex items-center gap-1.5 text-[9px] tracking-wider uppercase"
          style={{ color: 'var(--af-teal)' }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
          Live
        </span>
      </div>

      {/* Suggested prompts */}
      <p className="mb-3 text-[10px] tracking-[0.3em] text-(--af-grey-light) uppercase">
        Try asking Hana
      </p>
      <ul className="space-y-2" role="list">
        {suggestions[activeToolId].map((s) => (
          <li key={s}>
            <button
              className="w-full rounded border border-white/6 bg-white/3 px-3 py-2 text-left text-[11px] leading-snug text-(--af-grey-light) transition-colors hover:border-white/12 hover:text-(--af-cream)"
              onClick={() => {
                /* TODO: wire to OpenHarness agent stream endpoint */
              }}
              aria-label={`Ask Hana: ${s}`}
            >
              <span style={{ color: 'var(--af-red)' }}>→ </span>
              {s}
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[9px] leading-relaxed text-(--af-grey-light)" style={{ opacity: 0.6 }}>
        Powered by{' '}
        <a
          href="https://github.com/HKUDS/OpenHarness"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline"
          style={{ color: 'var(--af-grey-light)' }}
        >
          OpenHarness
        </a>
        {' '}— open agent infrastructure.
      </p>
    </div>
  )
}

/* ─── Main Component ─── */
export function StudioShowcase() {
  const [activeId, setActiveId] = useState<ToolId>('openmontage')
  const { t } = useI18n()
  const activeTool = STUDIO_TOOLS.find((t) => t.id === activeId)!

  return (
    <section
      id="studio"
      className="border-t border-white/5 px-5 py-20 sm:px-6 sm:py-32"
      aria-labelledby="studio-heading"
    >
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <InView
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          once
        >
          <p className="mb-2 text-[10px] font-medium tracking-[0.4em] text-(--af-red) uppercase">
            {t('studio.eyebrow')}
          </p>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2
              id="studio-heading"
              className="text-2xl font-bold tracking-tight text-(--af-cream) sm:text-3xl md:text-4xl"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {t('studio.title')}
            </h2>
            <p className="text-[11px] text-(--af-grey-light) sm:text-right">
              Real open-source tools.{' '}
              <span style={{ color: 'var(--af-red)' }}>AI-powered</span> by Agent Hana.
            </p>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-(--af-grey-light)">
            This is a real live creative studio — not mockups. Come in, create anime, produce music, and build worlds. Every tool below is open source and runs in your browser with Hana running the backend via OpenHarness.
          </p>
        </InView>

        {/* Tool tabs */}
        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Studio tools">
          {STUDIO_TOOLS.map((tool) => (
            <button
              key={tool.id}
              role="tab"
              aria-selected={activeId === tool.id}
              aria-controls={`panel-${tool.id}`}
              onClick={() => setActiveId(tool.id)}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-semibold tracking-wider uppercase transition-all"
              style={{
                borderColor: activeId === tool.id ? tool.accentColor : 'rgba(255,255,255,0.08)',
                color: activeId === tool.id ? tool.accentColor : 'var(--af-grey-light)',
                background: activeId === tool.id ? `${tool.accentColor}12` : 'transparent',
              }}
            >
              <span aria-hidden="true">{tool.icon}</span>
              {tool.name}
            </button>
          ))}
        </div>

        {/* Active tool panel + agent */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            id={`panel-${activeId}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 grid gap-6 md:grid-cols-3"
          >
            {/* Tool card — 2 cols */}
            <div className="af-card md:col-span-2">
              <div className="af-card-inner">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="mb-2 inline-block text-[10px] font-medium tracking-[0.3em] uppercase" style={{ color: activeTool.accentColor }}>
                      {activeTool.tag}
                    </span>
                    <h3
                      className="text-xl font-bold text-(--af-cream) sm:text-2xl"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {activeTool.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-(--af-grey-light)">{activeTool.tagline}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-4xl"
                    style={{ fontFamily: 'serif', opacity: 0.25, color: activeTool.accentColor }}
                  >
                    {activeTool.icon}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-(--af-grey-light)">
                  {activeTool.description}
                </p>

                {/* Feature pills */}
                <ul className="mt-5 flex flex-wrap gap-2" role="list">
                  {activeTool.features.map((f) => (
                    <li
                      key={f}
                      className="rounded-full border border-white/8 px-3 py-1 text-[10px] font-medium text-(--af-grey-light)"
                    >
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Launch CTA */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={activeTool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="af-btn-primary inline-flex h-9 items-center rounded-full px-5 text-xs font-semibold tracking-wider"
                    style={{ background: activeTool.accentColor }}
                  >
                    {activeTool.launchLabel}
                  </a>
                  <a
                    href={activeTool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] tracking-wider text-(--af-grey-light) underline-offset-3 hover:underline"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            </div>

            {/* Agent Hana panel — 1 col */}
            <AgentPanel activeToolId={activeId} />
          </motion.div>
        </AnimatePresence>

        {/* Bottom community strip */}
        <InView
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          once
          className="mt-8"
        >
          <article className="af-card">
            <div className="af-card-inner md:flex md:items-center md:justify-between md:gap-8">
              <div>
                <span className="mb-3 inline-block text-[10px] font-medium tracking-[0.3em] text-(--af-red) uppercase">
                  {t('studio.community.tag')}
                </span>
                <h3 className="text-xl font-bold text-(--af-cream) sm:text-2xl" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {t('studio.community.title')}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-(--af-grey-light)">
                  {t('studio.community.description')}
                </p>
              </div>
              <div className="mt-5 flex shrink-0 flex-wrap gap-3 md:mt-0">
                <a
                  href="https://discord.gg/afromations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="af-btn-primary inline-flex h-9 items-center rounded-full px-5 text-xs font-semibold tracking-wider"
                  aria-label="Join the AFROMATIONS Discord community"
                >
                  {t('studio.community.cta.discord')}
                </a>
                <button className="af-btn-secondary inline-flex h-9 items-center rounded-full border px-5 text-xs font-semibold tracking-wider">
                  {t('studio.community.cta.discuss')}
                </button>
              </div>
            </div>
          </article>
        </InView>

      </div>
    </section>
  )
}
