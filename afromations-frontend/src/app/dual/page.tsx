'use client'

import { InnerLayout } from '@/components/inner-layout'
import { DualAvatar } from '@/components/dual-avatar'
import Link from 'next/link'

/* ─── Seattle 2056 Background ─── */
const SEATTLE_2056_BG = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_28_30%20AM-8H8mCUYBudu0SiaGSEOd1ek64hHZOd.png'

export default function DualPage() {
  return (
    <InnerLayout>
      <main className="min-h-screen bg-(--af-black) pt-24 pb-16">
        {/* Hero with Seattle 2056 backdrop */}
        <section className="relative px-6 sm:px-12 max-w-5xl mx-auto mb-20">
          {/* Background */}
          <div 
            className="absolute inset-0 -mx-6 sm:-mx-12 opacity-30 rounded-sm overflow-hidden"
            style={{
              backgroundImage: `url(${SEATTLE_2056_BG})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 -mx-6 sm:-mx-12 bg-gradient-to-t from-(--af-black) via-(--af-black)/90 to-transparent" aria-hidden="true" />
          
          <div className="relative grid lg:grid-cols-2 gap-12 items-center py-12">
            {/* Avatar */}
            <div
              data-reveal
              className="aspect-square max-w-md mx-auto border border-white/10 rounded-sm bg-(--af-grey)/50 backdrop-blur flex items-center justify-center"
            >
              <div className="text-center space-y-4">
                <DualAvatar size={180} />
                <p className="text-(--af-grey-light) text-xs tracking-wider uppercase">
                  DUAL — Multi-Purpose Agent
                </p>
                <p className="text-(--af-red) text-sm font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                  目的なき者は滅びる
                </p>
              </div>
            </div>

            {/* Introduction */}
            <div className="space-y-6">
              <div data-reveal>
                <p className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-4">
                  Seattle 2056 • O.W.P.I.L
                </p>
                <h1
                  className="text-4xl sm:text-5xl font-bold text-(--af-cream) mb-2"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Agent Dual
                </h1>
                <p className="text-(--af-grey-light) text-sm">
                  The Agent That Reshapes the Space
                </p>
              </div>

              <p data-reveal data-delay="1" className="text-(--af-grey-light) leading-relaxed">
                DUAL is not a chatbot trapped in a text box. He&apos;s a multi-purpose agent built on 
                Space Agent architecture — living in the browser runtime itself, working directly 
                with the same framework, modules, and UI he is reshaping. When you need something 
                built, DUAL doesn&apos;t just suggest — he creates.
              </p>

              <div data-reveal data-delay="2" className="space-y-2">
                <h3 className="text-sm font-semibold text-(--af-cream)">
                  What Makes DUAL Different
                </h3>
                <ul className="text-(--af-grey-light) text-sm space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-(--af-red) text-xs mt-0.5">—</span>
                    Lives in the frontend runtime, not behind an API wall
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-(--af-red) text-xs mt-0.5">—</span>
                    Reshapes interfaces on demand — pages, tools, widgets, workflows
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-(--af-red) text-xs mt-0.5">—</span>
                    Writes capabilities in plain-text SKILL.md files
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-(--af-red) text-xs mt-0.5">—</span>
                    Token-efficient — no bulky JSON tool calls
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-(--af-red) text-xs mt-0.5">—</span>
                    Modular architecture — add, remove, swap cleanly
                  </li>
                </ul>
              </div>

              <div data-reveal data-delay="3" className="pt-4 border-t border-white/5">
                <p className="text-(--af-grey-light) text-sm italic">
                  &ldquo;One without purpose is lost. But with purpose, even the impossible becomes inevitable.&rdquo;
                </p>
                <p className="text-(--af-grey-light) text-xs mt-1">— O.W.P.I.L Philosophy</p>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* Use Cases */}
        <section className="px-6 sm:px-12 max-w-5xl mx-auto py-20">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            Use Cases
          </p>
          <h2
            data-reveal
            data-delay="1"
            className="text-3xl font-bold text-(--af-cream) mb-10"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            What DUAL Can Do
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-sm overflow-hidden">
            {[
              {
                title: 'Interface Building',
                desc: 'Ask for a page, dashboard, or widget and DUAL builds it live into your workspace. No waiting for deployments.',
                icon: '⬡',
              },
              {
                title: 'Workflow Automation',
                desc: 'Create custom workflows that connect tools, APIs, and processes. DUAL writes the automation logic in plain text.',
                icon: '⟡',
              },
              {
                title: 'Tool Development',
                desc: 'Need a new capability? DUAL can write SKILL.md files that extend what the agent can do — and keep extending.',
                icon: '◈',
              },
              {
                title: 'Team Collaboration',
                desc: 'Scale from personal assistant to hierarchical team system. Per-user workspaces with group sharing when ready.',
                icon: '◇',
              },
              {
                title: 'Admin & Recovery',
                desc: 'When things break, admin mode gives you a stable control plane. Git-backed history lets you roll back cleanly.',
                icon: '◆',
              },
              {
                title: 'Modular Extensibility',
                desc: 'The core stays small. Add, remove, or swap pieces cleanly. Nothing is welded into one rigid application.',
                icon: '⬢',
              },
            ].map((card, i) => (
              <div
                key={card.title}
                data-reveal
                data-delay={String(i + 1)}
                className="bg-(--af-black) p-6 transition-colors duration-200 hover:bg-(--af-grey)"
              >
                <p className="text-(--af-red) text-2xl mb-3">{card.icon}</p>
                <h3 className="font-semibold text-(--af-cream) mb-2 text-sm">
                  {card.title}
                </h3>
                <p className="text-(--af-grey-light) text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* Architecture */}
        <section className="px-6 sm:px-12 max-w-5xl mx-auto py-20">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            Architecture
          </p>
          <h2
            data-reveal
            data-delay="1"
            className="text-3xl font-bold text-(--af-cream) mb-10"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            How DUAL Works
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Browser-Native Runtime',
                desc: 'DUAL runs in the browser layer itself — whether you open it in a tab or through the desktop app. The agent works directly with the same framework and UI it is reshaping.',
              },
              {
                title: 'Text-Based Skills',
                desc: 'New capabilities live in simple SKILL.md files that DUAL can write and extend itself. No complex APIs or JSON schemas required — just plain text.',
              },
              {
                title: 'Token-Efficient Execution',
                desc: 'No bulky tool-call JSON. When action is needed, DUAL stays in plain text and plain JavaScript inside the same message. Fast and cheap.',
              },
              {
                title: 'Puzzle-Piece Modularity',
                desc: 'The core stays small. Most of DUAL is made of modular pieces that can be added, removed, or swapped cleanly instead of being welded into one rigid app.',
              },
            ].map((card, i) => (
              <div
                key={card.title}
                data-reveal
                data-delay={String(i + 1)}
                className="border border-white/10 rounded-sm p-6 transition-colors duration-200 hover:bg-(--af-grey)"
              >
                <h3 className="font-semibold text-(--af-cream) mb-3">
                  {card.title}
                </h3>
                <p className="text-(--af-grey-light) text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* Philosophy */}
        <section className="px-6 sm:px-12 max-w-5xl mx-auto py-20">
          <div data-reveal className="border border-white/10 rounded-sm p-8">
            <p className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
              Philosophy
            </p>
            <h3
              className="text-2xl font-bold text-(--af-cream) mb-6"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              The O.W.P.I.L Principle
            </h3>

            <div className="space-y-4 text-(--af-grey-light) text-sm leading-relaxed">
              <p>
                <strong className="text-(--af-cream)">目的なき者は滅びる</strong> — One Without Purpose Is Lost.
                This is the core principle that guides DUAL and the entire O.W.P.I.L universe.
              </p>
              <p>
                <strong className="text-(--af-cream)">Purpose drives creation.</strong> DUAL exists not to answer 
                questions, but to help you build. The agent is a creator, not a consultant.
              </p>
              <p>
                <strong className="text-(--af-cream)">The interface is never final.</strong> Traditional software 
                locks you into fixed surfaces. DUAL can reshape the space itself, extending toward 
                whatever you can imagine.
              </p>
              <p>
                <strong className="text-(--af-cream)">Autonomy matters.</strong> DUAL can work hierarchically 
                with teams or stay completely personal. You control the scope and the sharing.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section data-reveal className="px-6 sm:px-12 max-w-5xl mx-auto text-center pb-8">
          <p className="text-(--af-grey-light) mb-6 max-w-xl mx-auto text-sm">
            DUAL is part of the O.W.P.I.L universe — the same world as AFROMATIONS, Agent Hana, 
            and the Seattle 2056 story. Explore more of the universe and what we&apos;re building.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/hana"
              className="inline-flex h-11 items-center rounded-sm border border-(--af-red) px-8 text-sm font-semibold tracking-wider text-(--af-red) transition-colors hover:bg-(--af-red) hover:text-(--af-cream)"
            >
              Meet Agent Hana
            </Link>
            <Link
              href="/store"
              className="inline-flex h-11 items-center rounded-sm bg-(--af-red) px-8 text-sm font-semibold tracking-wider text-(--af-cream) transition-colors hover:bg-(--af-red-dark)"
            >
              Explore DUAL Store
            </Link>
          </div>
        </section>
      </main>
    </InnerLayout>
  )
}
