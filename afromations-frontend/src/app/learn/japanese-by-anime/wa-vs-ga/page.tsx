'use client'

import { InnerLayout } from '@/components/inner-layout'
import Link from 'next/link'
import { useState } from 'react'

export default function WaVsGaLessonPage() {
  const [completed, setCompleted] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})

  return (
    <InnerLayout>
      <main className="min-h-screen bg-(--af-black) pt-24 pb-16">
        {/* Header */}
        <section className="px-6 sm:px-12 max-w-4xl mx-auto mb-12">
          <div data-reveal>
            <p className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
              Module 3 • Lesson 7
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold text-(--af-cream) mb-4"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              WA vs GA: The Particle Question
            </h1>
            <p className="text-(--af-grey-light) text-sm">
              Estimated time: 20 minutes • Level: N4 Intermediate
            </p>
          </div>
        </section>

        {/* Learning Objectives */}
        <section className="px-6 sm:px-12 max-w-4xl mx-auto mb-12">
          <div data-reveal className="border border-white/10 rounded-sm p-6 bg-(--af-grey)">
            <h2 className="font-semibold text-(--af-cream) mb-4">Learning Objectives</h2>
            <ul className="space-y-2 text-(--af-grey-light) text-sm">
              <li className="flex items-start gap-2">
                <span className="text-(--af-red) mt-1">✓</span>
                Distinguish when to use wa (は) vs ga (が) particles
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--af-red) mt-1">✓</span>
                Understand the nuances and shifts in meaning
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--af-red) mt-1">✓</span>
                Recognize both particles in anime dialogue
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--af-red) mt-1">✓</span>
                Use particles correctly in simple sentences
              </li>
            </ul>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 sm:px-12 max-w-4xl mx-auto mb-12">
          <div data-reveal className="space-y-8">
            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold text-(--af-cream) mb-3">The Biggest Question</h2>
              <p className="text-(--af-grey-light) leading-relaxed">
                The wa (は) vs ga (が) question is THE particle question in Japanese. Both can mark
                the subject of a sentence, but they mean different things. Understanding the
                difference is understanding how Japanese speakers think about subjects and
                information.
              </p>
            </div>

            {/* Core Concept */}
            <div className="space-y-4">
              <div className="border-l-2 border-(--af-red) pl-6">
                <h3 className="font-bold text-(--af-cream) mb-2">WA (は) — Topic Marker</h3>
                <p className="text-(--af-grey-light) leading-relaxed">
                  <strong className="text-(--af-cream)">Function:</strong> Marks the topic. &quot;Speaking
                  of [this topic]...&quot;
                </p>
                <p className="text-(--af-grey-light) leading-relaxed mt-2">
                  <strong className="text-(--af-cream)">Vibe:</strong> General, established, background
                  information. The subject is already on the table.
                </p>
              </div>

              <div className="border-l-2 border-(--af-red) pl-6">
                <h3 className="font-bold text-(--af-cream) mb-2">GA (が) — Subject Marker</h3>
                <p className="text-(--af-grey-light) leading-relaxed">
                  <strong className="text-(--af-cream)">Function:</strong> Marks the specific subject
                  doing an action or having a quality.
                </p>
                <p className="text-(--af-grey-light) leading-relaxed mt-2">
                  <strong className="text-(--af-cream)">Vibe:</strong> Focused, emphatic, new
                  information. Answering &quot;who?&quot; or &quot;what?&quot;
                </p>
              </div>
            </div>

            {/* Comparison Box */}
            <div className="bg-(--af-grey) border border-white/10 rounded-sm p-6">
              <h3 className="font-bold text-(--af-cream) mb-4">Head-to-Head Comparison</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-(--af-cream) font-semibold mb-2">私は学生です。</p>
                  <p className="text-(--af-grey-light) mb-1">
                    <strong>Watashi wa gakusei desu.</strong>
                  </p>
                  <p className="text-(--af-grey-light)">
                    "Speaking of me, I&apos;m a student." (General fact, establishing context)
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-(--af-cream) font-semibold mb-2">私が学生です。</p>
                  <p className="text-(--af-grey-light) mb-1">
                    <strong>Watashi ga gakusei desu.</strong>
                  </p>
                  <p className="text-(--af-grey-light)">
                    "I am the student [you&apos;re talking about]." (Emphasis, answering &quot;who is the
                    student?&quot;)
                  </p>
                </div>
              </div>
            </div>

            {/* Anime Examples */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-(--af-cream)">From Anime Scenes</h3>

              <div className="border border-white/10 rounded-sm p-6 bg-(--af-black)">
                <p className="text-(--af-red) text-sm font-semibold mb-2">Scene 1: Character Introduction</p>
                <p className="text-lg text-(--af-cream) font-semibold mb-2 font-mono">
                  俺は忍者だ。
                </p>
                <p className="text-(--af-grey-light) text-sm mb-2">
                  <strong className="text-(--af-cream)">Ore wa ninja da.</strong>
                </p>
                <p className="text-(--af-grey-light) text-sm">
                  "I&apos;m a ninja." (Establishing who the character is — topic is &quot;me&quot;)
                </p>
              </div>

              <div className="border border-white/10 rounded-sm p-6 bg-(--af-black)">
                <p className="text-(--af-red) text-sm font-semibold mb-2">Scene 2: Question Response</p>
                <p className="text-lg text-(--af-cream) font-semibold mb-2 font-mono">
                  誰が強いですか？ — 私が強いです。
                </p>
                <p className="text-(--af-grey-light) text-sm mb-2">
                  <strong className="text-(--af-cream)">Dare ga tsuyoi desu ka? — Watashi ga tsuyoi desu.</strong>
                </p>
                <p className="text-(--af-grey-light) text-sm">
                  "Who is strong? — I am strong." (Direct answer to the question — using ga to focus on the
                  subject)
                </p>
              </div>
            </div>

            {/* Rule Summary */}
            <div className="bg-(--af-red) text-(--af-cream) rounded-sm p-6">
              <h3 className="font-bold mb-3">Quick Rule</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>WA:</strong> Use when the subject is already known or established (topic)
                </li>
                <li>
                  <strong>GA:</strong> Use when emphasizing or identifying the subject (answering &quot;who?&quot; or
                  &quot;what?&quot;)
                </li>
                <li>
                  <strong>Pro Tip:</strong> Native speakers often switch between them naturally. Your ear will
                  learn this over time.
                </li>
              </ul>
            </div>

            {/* Practice */}
            <div className="bg-(--af-grey) border border-white/10 rounded-sm p-6">
              <h3 className="font-bold text-(--af-cream) mb-4">Fill the Blank</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-(--af-cream) text-sm font-semibold mb-2">
                    1. 彼 ___ 悪人です。 (He is a villain)
                  </p>
                  <div className="space-y-2">
                    {['は (wa)', 'が (ga)'].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="q1"
                          value={option}
                          checked={quizAnswers[1] === option}
                          onChange={(e) =>
                            setQuizAnswers((prev) => ({ ...prev, [1]: e.target.value }))
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-(--af-grey-light) text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-(--af-cream) text-sm font-semibold mb-2">
                    2. 誰 ___ 来ましたか？ (Who came?) — Answer context: emphasizing identity
                  </p>
                  <div className="space-y-2">
                    {['は (wa)', 'が (ga)'].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="q2"
                          value={option}
                          checked={quizAnswers[2] === option}
                          onChange={(e) =>
                            setQuizAnswers((prev) => ({ ...prev, [2]: e.target.value }))
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-(--af-grey-light) text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Completion */}
        <section className="px-6 sm:px-12 max-w-4xl mx-auto">
          <button
            onClick={() => setCompleted(!completed)}
            className={`w-full h-11 rounded-sm px-8 text-sm font-semibold tracking-wider transition-colors ${
              completed
                ? 'bg-(--af-red) text-(--af-cream)'
                : 'border border-(--af-red) text-(--af-red) hover:bg-(--af-red) hover:text-(--af-cream)'
            }`}
          >
            {completed ? '✓ Lesson Completed' : 'Mark as Complete'}
          </button>

          {/* Navigation */}
          <div className="mt-8 flex gap-4">
            <Link href="/learn/japanese-by-anime">
              <button className="border border-white/10 rounded-sm px-6 py-3 text-sm font-semibold text-(--af-cream) hover:bg-(--af-grey) transition-colors">
                ← Back to Course
              </button>
            </Link>
            <Link href="/learn/japanese-by-anime/honorifics">
              <button className="ml-auto border border-white/10 rounded-sm px-6 py-3 text-sm font-semibold text-(--af-cream) hover:bg-(--af-grey) transition-colors">
                Next Lesson →
              </button>
            </Link>
          </div>
        </section>
      </main>
    </InnerLayout>
  )
}
