'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { InnerLayout } from '@/components/inner-layout'
import { DualAvatar } from '@/components/dual-avatar'
import Link from 'next/link'

/* ─── Studio Modes ─── */
const STUDIO_MODES = [
  {
    id: 'image',
    name: 'Image Studio',
    icon: '画',
    tagline: 'Generate & transform images with 50+ AI models',
    description: 'Text-to-image and image-to-image generation powered by Flux, Nano Banana 2, Midjourney, Seedream, GPT-4o, and more. Multi-image input support for complex compositions.',
    features: ['Text-to-Image', 'Image-to-Image', 'Multi-Reference (14 images)', 'Upscaling', 'Background Removal'],
    models: ['Flux Dev', 'Nano Banana 2', 'Seedream 5.0', 'Midjourney v7', 'GPT-4o', 'Ideogram v3'],
    accentColor: 'var(--af-red)',
  },
  {
    id: 'video',
    name: 'Video Studio',
    icon: '動',
    tagline: 'Create cinematic videos from text or images',
    description: 'Text-to-video and image-to-video generation with 60+ models. Create anime scenes, cinematic sequences, and dynamic animations.',
    features: ['Text-to-Video', 'Image-to-Video', 'Video Extension', '4K Output', 'Motion Control'],
    models: ['Kling v3', 'Sora 2', 'Veo 3', 'Wan 2.6', 'Seedance 2.0', 'Runway Gen-3'],
    accentColor: 'var(--af-gold)',
  },
  {
    id: 'lipsync',
    name: 'Lip Sync Studio',
    icon: '唇',
    tagline: 'Animate portraits with audio-driven lip sync',
    description: 'Turn static portraits into talking videos. Perfect for anime character dialogue, voiceovers, and storytelling.',
    features: ['Portrait-to-Video', 'Audio Sync', 'Multiple Models', 'Video Lipsync', 'Expression Control'],
    models: ['Infinite Talk', 'Wan 2.2 Speech', 'LTX 2.3 Lipsync', 'Sync Lipsync', 'LatentSync'],
    accentColor: 'var(--af-coral)',
  },
  {
    id: 'cinema',
    name: 'Cinema Studio',
    icon: '映',
    tagline: 'Pro camera controls for cinematic shots',
    description: 'Create photorealistic cinematic shots with professional camera controls. Choose lenses, focal lengths, apertures, and film stocks.',
    features: ['Pro Camera Controls', 'Lens Selection', 'Aperture Control', 'Film Stocks', 'Cinematic Grading'],
    models: ['8K Digital', 'Full-Frame Cine', '70mm Film', 'Anamorphic', '16mm Classic'],
    accentColor: 'var(--af-teal)',
  },
  {
    id: 'blender',
    name: 'Blender Control',
    icon: '立',
    tagline: 'AI-assisted 3D modeling and animation',
    description: 'Control Blender locally or in the cloud. Generate 3D models, rigs, and animations with AI assistance. Perfect for anime character creation.',
    features: ['3D Model Generation', 'Auto-Rigging', 'Toon Shaders', 'Scene Compositing', 'Cloud Rendering'],
    models: ['Local Blender', 'Cloud GPU', 'AI Assist', 'Batch Render', 'Real-time Preview'],
    accentColor: 'var(--af-red)',
  },
  {
    id: 'workflow',
    name: 'Workflow Studio',
    icon: '流',
    tagline: 'Build multi-step AI pipelines visually',
    description: 'Chain image, video, and audio models into automated workflows. Create production pipelines without code.',
    features: ['Node-based Editor', 'Template Library', 'Multi-step Chains', 'API Integration', 'Batch Processing'],
    models: ['Community Templates', 'Custom Workflows', 'API Export', 'Scheduled Jobs'],
    accentColor: 'var(--af-gold)',
  },
] as const

type StudioModeId = (typeof STUDIO_MODES)[number]['id']

/* ─── DUAL Agent Panel ─── */
function DualAgentPanel({ activeModeId }: { activeModeId: StudioModeId }) {
  const suggestions: Record<StudioModeId, string[]> = {
    image: [
      'Generate a cel-shaded anime character portrait',
      'Transform this sketch into a finished illustration',
      'Create a cyberpunk Seattle cityscape in 2056',
    ],
    video: [
      'Animate this character walking through rain',
      'Create a 10-second cinematic establishing shot',
      'Generate a fight sequence from this storyboard',
    ],
    lipsync: [
      'Make this character speak this dialogue',
      'Sync this portrait to my voice recording',
      'Add natural expressions to this talking head',
    ],
    cinema: [
      'Shoot this scene with an anamorphic lens',
      'Create a shallow depth-of-field portrait',
      'Capture a wide establishing shot at golden hour',
    ],
    blender: [
      'Generate a 3D model from this concept art',
      'Auto-rig this character for animation',
      'Apply anime toon shaders to this model',
    ],
    workflow: [
      'Create a concept-to-animation pipeline',
      'Build a batch image processing workflow',
      'Set up automated video generation',
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
          <p className="text-xs font-semibold text-(--af-cream)">DUAL Agent</p>
          <p className="text-[10px] text-(--af-grey-light)">AI Studio Controller</p>
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
        Ask DUAL
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
        Powered by Open-Generative-AI — 200+ models at your command.
      </p>
    </div>
  )
}

/* ─── Blender Integration Panel ─── */
function BlenderPanel() {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  
  return (
    <div className="af-card">
      <div className="af-card-inner">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-(--af-cream)" style={{ fontFamily: 'Sora, sans-serif' }}>
            Blender Connection
          </h3>
          <span
            className={`flex items-center gap-1.5 text-[10px] tracking-wider uppercase ${
              connectionStatus === 'connected' ? 'text-(--af-teal)' :
              connectionStatus === 'connecting' ? 'text-(--af-gold)' : 'text-(--af-grey-light)'
            }`}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
            {connectionStatus === 'connected' ? 'Connected' :
             connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
          </span>
        </div>
        
        <div className="grid gap-3">
          <button
            onClick={() => setConnectionStatus('connecting')}
            className="w-full rounded border border-white/10 bg-white/3 px-4 py-3 text-left transition-colors hover:border-(--af-red) hover:bg-white/5"
          >
            <p className="text-sm font-semibold text-(--af-cream)">Local Blender</p>
            <p className="text-[10px] text-(--af-grey-light)">Connect to Blender running on localhost:5000</p>
          </button>
          
          <button
            onClick={() => setConnectionStatus('connecting')}
            className="w-full rounded border border-white/10 bg-white/3 px-4 py-3 text-left transition-colors hover:border-(--af-gold) hover:bg-white/5"
          >
            <p className="text-sm font-semibold text-(--af-cream)">Cloud GPU Render</p>
            <p className="text-[10px] text-(--af-grey-light)">Connect to remote Blender instance (RunPod/Vast.ai)</p>
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-[10px] text-(--af-grey-light) mb-2">DUAL can control Blender to:</p>
          <ul className="text-[10px] text-(--af-grey-light) space-y-1">
            <li>• Generate 3D models from text descriptions</li>
            <li>• Auto-rig characters for animation</li>
            <li>• Apply anime-style toon shaders</li>
            <li>• Render scenes with AI-optimized settings</li>
            <li>• Composite and post-process outputs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Studio Page ─── */
export default function StudioPage() {
  const [activeMode, setActiveMode] = useState<StudioModeId>('image')
  const activeStudio = STUDIO_MODES.find((m) => m.id === activeMode)!

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
                DUAL Studio
              </h1>
            </div>
          </div>
          <p className="text-(--af-grey-light) max-w-2xl text-sm leading-relaxed">
            200+ AI models for image generation, video creation, lip sync, and cinematic production. 
            Control Blender locally or in the cloud. Build automated workflows. 
            All powered by DUAL, the Operational Wisdom Pilot.
          </p>
        </section>

        {/* Studio Mode Tabs */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2" role="tablist">
            {STUDIO_MODES.map((mode) => (
              <button
                key={mode.id}
                role="tab"
                aria-selected={activeMode === mode.id}
                onClick={() => setActiveMode(mode.id)}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold tracking-wider uppercase transition-all"
                style={{
                  borderColor: activeMode === mode.id ? mode.accentColor : 'rgba(255,255,255,0.1)',
                  color: activeMode === mode.id ? mode.accentColor : 'var(--af-grey-light)',
                  background: activeMode === mode.id ? `${mode.accentColor}15` : 'transparent',
                }}
              >
                <span aria-hidden="true" className="text-base">{mode.icon}</span>
                {mode.name}
              </button>
            ))}
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
                    <button
                      className="af-btn-primary inline-flex h-10 items-center rounded-full px-6 text-xs font-semibold tracking-wider"
                      style={{ background: activeStudio.accentColor }}
                    >
                      Launch {activeStudio.name}
                    </button>
                    <Link
                      href="/dual"
                      className="inline-flex h-10 items-center rounded-full border border-white/10 px-6 text-xs font-semibold tracking-wider text-(--af-grey-light) hover:border-white/20 hover:text-(--af-cream) transition-colors"
                    >
                      Learn About DUAL →
                    </Link>
                  </div>
                </div>
              </div>

              {/* DUAL Agent Panel */}
              <DualAgentPanel activeModeId={activeMode} />
            </motion.div>
          </AnimatePresence>

          {/* Blender Integration (shown when Blender mode is active) */}
          {activeMode === 'blender' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="mt-6"
            >
              <BlenderPanel />
            </motion.div>
          )}
        </section>

        {/* Stats Section */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '200+', label: 'AI Models', color: 'var(--af-red)' },
              { value: '6', label: 'Studio Modes', color: 'var(--af-gold)' },
              { value: '∞', label: 'Generations', color: 'var(--af-teal)' },
              { value: '24/7', label: 'Cloud Access', color: 'var(--af-coral)' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-[10px] tracking-wider uppercase text-(--af-grey-light)">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Integration Info */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mt-16">
          <div className="af-card">
            <div className="af-card-inner">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-(--af-red) mb-2 block">
                    Local + Cloud
                  </span>
                  <h3 className="text-xl font-bold text-(--af-cream) mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
                    Blender Integration
                  </h3>
                  <p className="text-sm text-(--af-grey-light) leading-relaxed mb-4">
                    DUAL can control Blender running on your local machine or a cloud GPU instance. 
                    Generate 3D models, apply anime shaders, rig characters, and render scenes — 
                    all through natural language commands.
                  </p>
                  <ul className="text-[11px] text-(--af-grey-light) space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-(--af-gold)">→</span>
                      <span><strong className="text-(--af-cream)">Local:</strong> Connect to Blender on localhost for real-time control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-(--af-gold)">→</span>
                      <span><strong className="text-(--af-cream)">Cloud:</strong> Offload to RunPod, Vast.ai, or AWS for heavy renders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-(--af-gold)">→</span>
                      <span><strong className="text-(--af-cream)">AI Assist:</strong> Generate models, textures, and animations via prompts</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-(--af-gold) mb-2 block">
                    Open Source
                  </span>
                  <h3 className="text-xl font-bold text-(--af-cream) mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
                    Powered by Open-Generative-AI
                  </h3>
                  <p className="text-sm text-(--af-grey-light) leading-relaxed mb-4">
                    DUAL Studio is built on Open-Generative-AI, a free, open-source alternative to 
                    Higgsfield AI, Freepik AI, Krea AI, and Openart AI. No content filters, no 
                    subscription fees, full creative freedom.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://github.com/Anil-matcha/Open-Generative-AI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center rounded-full border border-white/10 px-5 text-[11px] font-semibold tracking-wider text-(--af-grey-light) hover:border-white/20 hover:text-(--af-cream) transition-colors"
                    >
                      View on GitHub
                    </a>
                    <a
                      href="https://dev.muapi.ai/open-generative-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center rounded-full bg-(--af-gold) px-5 text-[11px] font-semibold tracking-wider text-(--af-black)"
                    >
                      Try Online
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </InnerLayout>
  )
}
