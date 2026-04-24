'use client'

import { InnerLayout } from '@/components/inner-layout'
import { useI18n } from '@/lib/i18n'

export default function HanaPage() {
  const { t } = useI18n()

  return (
    <InnerLayout>
      <main className="min-h-screen bg-(--af-black) pt-24 pb-16">
        {/* Hero */}
        <section className="px-6 sm:px-12 max-w-5xl mx-auto mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Character placeholder */}
            <div
              data-reveal
              className="aspect-square border border-white/10 rounded-sm bg-(--af-grey) flex items-center justify-center"
            >
              <div className="text-center space-y-3">
                <p
                  className="text-6xl font-light text-(--af-red)"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  花
                </p>
                <p className="text-(--af-grey-light) text-xs tracking-wider uppercase">
                  Agent Hana — Warrior Scholar
                </p>
              </div>
            </div>

            {/* Introduction */}
            <div className="space-y-6">
              <div data-reveal>
                <p className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-4">
                  {t('hanna.eyebrow')}
                </p>
                <h1
                  className="text-4xl sm:text-5xl font-bold text-(--af-cream) mb-2"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {t('hanna.title')}
                </h1>
                <p className="text-(--af-grey-light) text-sm">
                  {t('hanna.subtitle')}
                </p>
              </div>

              <p data-reveal data-delay="1" className="text-(--af-grey-light) leading-relaxed">
                Hana is not a historical figure. She&apos;s an AI scholar designed in 2056, rooted
                in both Japanese tradition and Black culture. She teaches because language is power,
                and knowledge should never be gatekept.
              </p>

              <div data-reveal data-delay="2" className="space-y-2">
                <h3 className="text-sm font-semibold text-(--af-cream)">
                  What Does Hana Teach?
                </h3>
                <ul className="text-(--af-grey-light) text-sm space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-(--af-red) text-xs mt-0.5">—</span>
                    Japanese language (JLPT N5–N1 + beyond)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-(--af-red) text-xs mt-0.5">—</span>
                    Grammar, particles, and sentence structure
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-(--af-red) text-xs mt-0.5">—</span>
                    Culture, folklore, mythology, and kami
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-(--af-red) text-xs mt-0.5">—</span>
                    Oral production, listening, and comprehension
                  </li>
                </ul>
              </div>

              <div data-reveal data-delay="3" className="pt-4 border-t border-white/5">
                <p className="text-(--af-grey-light) text-sm italic">
                  &ldquo;Fluency isn&apos;t fast. It&apos;s deep. And depth comes from respect.&rdquo;
                </p>
                <p className="text-(--af-grey-light) text-xs mt-1">— Agent Hana</p>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* How Hana Works — spotlight-border grid pattern */}
        <section className="px-6 sm:px-12 max-w-5xl mx-auto py-20">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            Methodology
          </p>
          <h2
            data-reveal
            data-delay="1"
            className="text-3xl font-bold text-(--af-cream) mb-10"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            How Hana Works
          </h2>

          <div className="grid sm:grid-cols-2 gap-px bg-white/5 rounded-sm overflow-hidden">
            {[
              {
                title: 'Structured Lessons',
                desc: 'Each lesson builds on the previous. Vocabulary before fluency. Culture before shallow phrases.',
              },
              {
                title: 'Real Assessment',
                desc: 'No shallow quizzes. Hana evaluates oral production, listening comprehension, and deep understanding.',
              },
              {
                title: 'Memory Graph',
                desc: 'Hana learns your learning patterns and adapts. Your memory is encrypted and under your control.',
              },
              {
                title: 'Consent First',
                desc: 'Voice, memory, vision features require explicit permission. You control what Hana can do.',
              },
            ].map((card, i) => (
              <div
                key={card.title}
                data-reveal
                data-delay={String(i + 1)}
                className="bg-(--af-black) p-8 transition-colors duration-200 hover:bg-(--af-grey)"
              >
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
              Hana&apos;s Philosophy
            </h3>

            <div className="space-y-4 text-(--af-grey-light) text-sm leading-relaxed">
              <p>
                <strong className="text-(--af-cream)">Language is not a code.</strong> It&apos;s a
                way of thinking. You&apos;re learning to think like a Japanese speaker, not to
                decode messages.
              </p>
              <p>
                <strong className="text-(--af-cream)">Culture comes first.</strong> Meaning without
                context is empty. Understanding the culture makes the language stick.
              </p>
              <p>
                <strong className="text-(--af-cream)">Fluency is hard.</strong> There are no
                shortcuts. But the work is worth it because the destination is real comprehension,
                not fake familiarity.
              </p>
              <p>
                <strong className="text-(--af-cream)">Your agency matters.</strong> You decide what
                to learn, how fast, and what you share. Hana is a tool you control, not a system
                that controls you.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section data-reveal className="px-6 sm:px-12 max-w-5xl mx-auto text-center pb-8">
          <p className="text-(--af-grey-light) mb-6 max-w-xl mx-auto text-sm">
            Ready to start learning? Begin with the fundamentals and progress at your own pace.
          </p>
          <a
            href="/learn"
            className="inline-flex h-11 items-center rounded-sm bg-(--af-red) px-8 text-sm font-semibold tracking-wider text-(--af-cream) transition-colors hover:bg-(--af-red-dark)"
          >
            Begin Learning
          </a>
        </section>
      </main>
    </InnerLayout>
  )
}
