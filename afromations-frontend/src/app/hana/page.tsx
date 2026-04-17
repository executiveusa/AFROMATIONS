import { JapaneseText } from '@/components/hana/japanese-text'

export const metadata = {
  title: 'Agent Hana',
  description: 'Meet your Japanese language and culture guide',
}

export default function HanaPage() {
  return (
    <main className="min-h-screen bg-black pt-24 pb-12">
      {/* Hero section */}
      <div className="px-6 sm:px-12 max-w-5xl mx-auto mb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Character image placeholder */}
          <div className="aspect-square bg-gradient-to-br from-[var(--af-red)]/20 to-indigo-900/20 rounded-lg flex items-center justify-center border border-[var(--af-red)]/20">
            <div className="text-center">
              <div className="text-8xl mb-4">🗡️</div>
              <p className="text-[var(--af-grey-light)] text-sm">
                Agent Hana (花) — Warrior Scholar
              </p>
            </div>
          </div>

          {/* Right: Introduction */}
          <div className="space-y-6">
            <div>
              <h1
                className="text-4xl sm:text-5xl font-bold text-[var(--af-cream)] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Meet Hana
              </h1>
              <p className="text-[var(--af-grey-light)]">
                Your guide through Japanese language, culture, and the wisdom that bridges worlds.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--af-cream)] mb-2">
                  Who is Hana?
                </h3>
                <p className="text-[var(--af-grey-light)] leading-relaxed">
                  Hana is not a historical figure. She's an AI scholar designed in 2056, rooted in both Japanese tradition and Black culture. She teaches because language is power, and knowledge should never be gatekept.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--af-cream)] mb-2">
                  What Does Hana Teach?
                </h3>
                <ul className="text-[var(--af-grey-light)] space-y-2">
                  <li>✓ Japanese language (JLPT N5–N1 + beyond)</li>
                  <li>✓ Grammar, particles, and sentence structure</li>
                  <li>✓ Culture, folklore, mythology, and kami</li>
                  <li>✓ Oral production, listening, and comprehension</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--af-grey-mid)]">
              <p className="text-[var(--af-grey-light)] text-sm italic">
                "Fluency isn't fast. It's deep. And depth comes from respect."
              </p>
              <p className="text-[var(--af-grey-light)] text-xs mt-2">
                — Agent Hana
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key principles */}
      <div className="px-6 sm:px-12 max-w-5xl mx-auto mb-16">
        <h2
          className="text-3xl font-bold text-[var(--af-cream)] mb-8"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          How Hana Works
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="border border-[var(--af-grey-mid)] rounded-lg p-6 bg-[var(--af-grey)]/30">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-semibold text-[var(--af-cream)] mb-2">
              Structured Lessons
            </h3>
            <p className="text-[var(--af-grey-light)] text-sm">
              Each lesson builds on the previous. Vocabulary before fluency. Culture before shallow phrases.
            </p>
          </div>

          <div className="border border-[var(--af-grey-mid)] rounded-lg p-6 bg-[var(--af-grey)]/30">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold text-[var(--af-cream)] mb-2">
              Real Assessment
            </h3>
            <p className="text-[var(--af-grey-light)] text-sm">
              No shallow quizzes. Hana evaluates oral production, listening comprehension, and deep understanding.
            </p>
          </div>

          <div className="border border-[var(--af-grey-mid)] rounded-lg p-6 bg-[var(--af-grey)]/30">
            <div className="text-4xl mb-3">🧠</div>
            <h3 className="font-semibold text-[var(--af-cream)] mb-2">
              Memory Graph
            </h3>
            <p className="text-[var(--af-grey-light)] text-sm">
              Hana learns your learning patterns and adapts. Your memory is encrypted and under your control.
            </p>
          </div>

          <div className="border border-[var(--af-grey-mid)] rounded-lg p-6 bg-[var(--af-grey)]/30">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-semibold text-[var(--af-cream)] mb-2">
              Consent First
            </h3>
            <p className="text-[var(--af-grey-light)] text-sm">
              Voice, memory, vision features require explicit permission. You control what Hana can do.
            </p>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <div className="px-6 sm:px-12 max-w-5xl mx-auto mb-16">
        <div className="bg-gradient-to-r from-[var(--af-red)]/10 to-indigo-900/10 border border-[var(--af-red)]/20 rounded-lg p-8">
          <h3
            className="text-2xl font-bold text-[var(--af-cream)] mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Hana's Philosophy
          </h3>

          <div className="space-y-3 text-[var(--af-grey-light)]">
            <p>
              • <strong>Language is not a code.</strong> It's a way of thinking. You're learning to think like a Japanese speaker, not to decode messages.
            </p>
            <p>
              • <strong>Culture comes first.</strong> Meaning without context is empty. Understanding the culture makes the language stick.
            </p>
            <p>
              • <strong>Fluency is hard.</strong> There are no shortcuts. But the work is worth it because the destination is real comprehension, not fake familiarity.
            </p>
            <p>
              • <strong>Your agency matters.</strong> You decide what to learn, how fast, and what you share. Hana is a tool you control, not a system that controls you.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 sm:px-12 max-w-5xl mx-auto text-center">
        <p className="text-[var(--af-grey-light)] mb-6 max-w-2xl mx-auto">
          Ready to start learning? Begin with the fundamentals and progress at your own pace. Hana is here when you're ready.
        </p>

        <a
          href="/learn"
          className="inline-flex h-11 items-center rounded-md bg-[var(--af-red)] px-8 text-sm font-semibold tracking-wider text-[var(--af-cream)] transition-colors hover:bg-[var(--af-red-dark)]"
        >
          Begin Learning
        </a>
      </div>
    </main>
  )
}
