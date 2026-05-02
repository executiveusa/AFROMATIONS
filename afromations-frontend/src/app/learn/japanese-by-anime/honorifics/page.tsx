'use client'

import { InnerLayout } from '@/components/inner-layout'
import Link from 'next/link'
import { useState } from 'react'

export default function HonorificLessonPage() {
  const [completed, setCompleted] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})

  return (
    <InnerLayout>
      <main className="min-h-screen bg-(--af-black) pt-24 pb-16">
        {/* Header */}
        <section className="px-6 sm:px-12 max-w-4xl mx-auto mb-12">
          <div data-reveal>
            <p className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
              Module 4 • Lesson 12
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold text-(--af-cream) mb-4"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Honorifics: Reading the Room
            </h1>
            <p className="text-(--af-grey-light) text-sm">
              Estimated time: 18 minutes • Level: N4 Intermediate
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
                Recognize and use common honorifics: san, sama, kun, chan, senpai, sensei
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--af-red) mt-1">✓</span>
                Understand the social relationships behind each honorific
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--af-red) mt-1">✓</span>
                Identify appropriate usage in anime and real-world contexts
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--af-red) mt-1">✓</span>
                Recognize when characters break honorific rules for dramatic effect
              </li>
            </ul>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 sm:px-12 max-w-4xl mx-auto mb-12">
          <div data-reveal className="space-y-8">
            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold text-(--af-cream) mb-3">Language Shapes Relationships</h2>
              <p className="text-(--af-grey-light) leading-relaxed">
                In English, you say &quot;hey David&quot; to a friend and &quot;hey David&quot; to your boss. In
                Japanese, the language itself shifts to show respect. Honorifics (敬語, keigo) are how
                Japanese speakers encode relationship and hierarchy into speech. In anime, they reveal
                character relationships instantly.
              </p>
            </div>

            {/* Core Honorifics */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-(--af-cream)">The Main Honorifics</h3>

              <div className="bg-(--af-grey) border border-white/10 rounded-sm p-6">
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-(--af-red) font-bold mb-1">さん (-san)</p>
                    <p className="text-(--af-cream) mb-1">Default, polite, neutral respect</p>
                    <p className="text-(--af-grey-light)">
                      <strong>Use with:</strong> Coworkers, acquaintances, most people
                    </p>
                    <p className="text-(--af-grey-light) mt-2 italic">
                      Example: 田中さん (Tanaka-san) — respectful but not overly formal
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-(--af-red) font-bold mb-1">様 (-sama)</p>
                    <p className="text-(--af-cream) mb-1">High respect, formal, distant</p>
                    <p className="text-(--af-grey-light)">
                      <strong>Use with:</strong> Customers, royalty, gods, people of much higher status
                    </p>
                    <p className="text-(--af-grey-light) mt-2 italic">
                      Example: お姫様 (Ohime-sama) — a princess (with extra respect)
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-(--af-red) font-bold mb-1">君 (-kun)</p>
                    <p className="text-(--af-cream) mb-1">Casual, friendly, slightly informal</p>
                    <p className="text-(--af-grey-light)">
                      <strong>Use with:</strong> Close friends, younger people, people you&apos;re close to or superior to
                    </p>
                    <p className="text-(--af-grey-light) mt-2 italic">
                      Example: 太郎君 (Taro-kun) — suggests closeness or affection
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-(--af-red) font-bold mb-1">ちゃん (-chan)</p>
                    <p className="text-(--af-cream) mb-1">Cute, affectionate, very casual</p>
                    <p className="text-(--af-grey-light)">
                      <strong>Use with:</strong> Children, close friends, loved ones, cute things
                    </p>
                    <p className="text-(--af-grey-light) mt-2 italic">
                      Example: 美咲ちゃん (Misaki-chan) — affectionate, warm
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-(--af-red) font-bold mb-1">先輩 (senpai)</p>
                    <p className="text-(--af-cream) mb-1">Senior, mentor, someone ahead of you</p>
                    <p className="text-(--af-grey-light)">
                      <strong>Use with:</strong> Older students, more experienced coworkers
                    </p>
                    <p className="text-(--af-grey-light) mt-2 italic">
                      Example: 田中先輩 (Tanaka-senpai) — acknowledging hierarchy
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-(--af-red) font-bold mb-1">先生 (sensei)</p>
                    <p className="text-(--af-cream) mb-1">Teacher, doctor, mentor, expert</p>
                    <p className="text-(--af-grey-light)">
                      <strong>Use with:</strong> Teachers, doctors, artists, anyone who teaches or leads
                    </p>
                    <p className="text-(--af-grey-light) mt-2 italic">
                      Example: 先生、質問があります (Sensei, I have a question)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Anime Drama */}
            <div className="border-l-2 border-(--af-red) pl-6">
              <h3 className="font-bold text-(--af-cream) mb-2">Honorifics as Drama</h3>
              <p className="text-(--af-grey-light) leading-relaxed">
                One of the most powerful moments in anime is when a character drops an honorific or
                adds a new one. If a character suddenly calls someone by their bare name (no
                honorific), it signals intimacy, anger, or a shift in power. This is impossible to
                convey in English subtitles, but now you&apos;ll hear it.
              </p>
            </div>

            {/* Anime Examples */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-(--af-cream)">From Anime Scenes</h3>

              <div className="border border-white/10 rounded-sm p-6 bg-(--af-black)">
                <p className="text-(--af-red) text-sm font-semibold mb-2">Scene 1: School Formality</p>
                <p className="text-lg text-(--af-cream) font-semibold mb-2 font-mono">
                  先生、今日の宿題は?
                </p>
                <p className="text-(--af-grey-light) text-sm mb-2">
                  <strong className="text-(--af-cream)">Sensei, kyo no shukudai wa?</strong>
                </p>
                <p className="text-(--af-grey-light) text-sm">
                  "Teacher, what&apos;s today&apos;s homework?" (Using sensei shows respect and proper context)
                </p>
              </div>

              <div className="border border-white/10 rounded-sm p-6 bg-(--af-black)">
                <p className="text-(--af-red) text-sm font-semibold mb-2">Scene 2: Friendship Shift</p>
                <p className="text-lg text-(--af-cream) font-semibold mb-2 font-mono">
                  田中さん → 田中君へ
                </p>
                <p className="text-(--af-grey-light) text-sm mb-2">
                  <strong className="text-(--af-cream)">Tanaka-san → Tanaka-kun</strong>
                </p>
                <p className="text-(--af-grey-light) text-sm">
                  A character switches from formal san to casual kun when they become close friends.
                  This shift is HUGE in anime and signals a relationship change.
                </p>
              </div>

              <div className="border border-white/10 rounded-sm p-6 bg-(--af-black)">
                <p className="text-(--af-red) text-sm font-semibold mb-2">Scene 3: Intimacy/Anger</p>
                <p className="text-lg text-(--af-cream) font-semibold mb-2 font-mono">
                  美咲ちゃん → 美咲！
                </p>
                <p className="text-(--af-grey-light) text-sm mb-2">
                  <strong className="text-(--af-cream)">Misaki-chan → Misaki!</strong>
                </p>
                <p className="text-(--af-grey-light) text-sm">
                  Dropping the chan for bare name signals either deep intimacy or anger. Listen to
                  the tone to know which!
                </p>
              </div>
            </div>

            {/* Practice */}
            <div className="bg-(--af-grey) border border-white/10 rounded-sm p-6">
              <h3 className="font-bold text-(--af-cream) mb-4">Choose the Right Honorific</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-(--af-cream) text-sm font-semibold mb-2">
                    1. You&apos;re asking your biology teacher a question after class.
                  </p>
                  <div className="space-y-2">
                    {['先生', '先輩', 'さん', '君'].map((option) => (
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
                    2. You&apos;re talking to your best friend from childhood.
                  </p>
                  <div className="space-y-2">
                    {['さん', 'ちゃん', '様', '先輩'].map((option) => (
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
            <button disabled className="ml-auto border border-white/10 rounded-sm px-6 py-3 text-sm font-semibold text-(--af-grey-light) opacity-50 cursor-not-allowed">
              Next Lesson → (Coming Soon)
            </button>
          </div>
        </section>
      </main>
    </InnerLayout>
  )
}
