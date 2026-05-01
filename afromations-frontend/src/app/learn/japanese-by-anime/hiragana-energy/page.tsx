'use client'

import { InnerLayout } from '@/components/inner-layout'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLessonProgress } from '@/lib/education'
import { useUser } from '@/lib/use-user'

const LESSON_SLUG = 'hiragana-energy'
const LESSON_TITLE = 'Hiragana Energy'
const MODULE = 1

export default function HiraganaEnergyLessonPage() {
  const [completed, setCompleted] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const { user } = useUser()
  const { saveProgress, loading: progressLoading, error: progressError } = useLessonProgress()

  return (
    <InnerLayout>
      <main className="min-h-screen bg-(--af-black) pt-24 pb-16">
        {/* Header */}
        <section className="px-6 sm:px-12 max-w-4xl mx-auto mb-12">
          <div data-reveal>
            <p className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
              Module 1 • Lesson 1
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold text-(--af-cream) mb-4"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Hiragana Energy
            </h1>
            <p className="text-(--af-grey-light) text-sm">
              Estimated time: 15 minutes • Level: N5 Beginner
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
                Recognize and pronounce all 46 hiragana characters
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--af-red) mt-1">✓</span>
                Understand how hiragana represents Japanese sounds and rhythm
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--af-red) mt-1">✓</span>
                Read simple anime dialogue in hiragana
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--af-red) mt-1">✓</span>
                Feel the energy and flow of spoken Japanese
              </li>
            </ul>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 sm:px-12 max-w-4xl mx-auto mb-12">
          <div data-reveal className="space-y-8">
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold text-(--af-cream) mb-3">What is Hiragana?</h2>
              <p className="text-(--af-grey-light) leading-relaxed">
                Hiragana (ひらがな) is one of Japan&apos;s writing systems. It represents the sounds
                of the Japanese language. Unlike kanji (which represent meanings), hiragana are pure
                phonetic symbols. Every hiragana character represents one syllable.
              </p>
            </div>

            {/* Core Concept */}
            <div className="border-l-2 border-(--af-red) pl-6">
              <h3 className="font-bold text-(--af-cream) mb-2">The Energy of Sound</h3>
              <p className="text-(--af-grey-light) leading-relaxed">
                In anime, hiragana brings words to life. You hear the rhythm, the emotion, the
                pauses. Learning hiragana is learning to feel Japanese, not just decode it. When
                you master hiragana, you unlock the rhythm of the language itself.
              </p>
            </div>

            {/* Vocabulary Box */}
            <div className="bg-(--af-grey) border border-white/10 rounded-sm p-6">
              <h3 className="font-bold text-(--af-cream) mb-4">Core Vocabulary</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {[
                  { ja: 'あ', ro: 'a', meaning: 'The first sound' },
                  { ja: 'い', ro: 'i', meaning: 'Like "ee" in see' },
                  { ja: 'う', ro: 'u', meaning: 'Like "oo" in moon' },
                  { ja: 'え', ro: 'e', meaning: 'Like "eh" in bed' },
                ].map((item) => (
                  <div
                    key={item.ja}
                    className="border border-white/5 rounded-sm p-3 bg-(--af-black)"
                  >
                    <p className="text-2xl font-bold text-(--af-red) mb-1">{item.ja}</p>
                    <p className="text-(--af-cream) text-xs mb-1">{item.ro}</p>
                    <p className="text-(--af-grey-light) text-xs">{item.meaning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Anime Example */}
            <div className="border-l-2 border-(--af-red) pl-6">
              <h3 className="font-bold text-(--af-cream) mb-2">From Anime Scenes</h3>
              <p className="text-(--af-grey-light) text-sm mb-3 leading-relaxed">
                <strong className="text-(--af-cream)">Scene:</strong> A character wakes up in the morning.
                They stretch and say:
              </p>
              <p className="text-lg text-(--af-red) font-semibold mb-2 font-mono">
                あ、朝だ！
              </p>
              <p className="text-(--af-grey-light) text-sm">
                <strong className="text-(--af-cream)">Romaji:</strong> "A, asa da!"
                <br />
                <strong className="text-(--af-cream)">Meaning:</strong> "Oh, it&apos;s morning!"
              </p>
            </div>

            {/* Practice */}
            <div className="bg-(--af-grey) border border-white/10 rounded-sm p-6">
              <h3 className="font-bold text-(--af-cream) mb-4">Mini Quiz</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-(--af-cream) text-sm font-semibold mb-2">
                    1. Which hiragana represents the "oh" sound?
                  </p>
                  <div className="space-y-2">
                    {['あ', 'お', 'う'].map((option) => (
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

                <div>
                  <p className="text-(--af-cream) text-sm font-semibold mb-2">
                    2. Hiragana is phonetic, meaning it represents:
                  </p>
                  <div className="space-y-2">
                    {[
                      'Sounds and syllables',
                      'Meanings like kanji',
                      'Only consonants',
                    ].map((option, idx) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="q2"
                          value={String(idx)}
                          checked={quizAnswers[2] === String(idx)}
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
            onClick={async () => {
              if (!user?.id) {
                console.log('[v0] User not authenticated')
                setCompleted(!completed)
                return
              }

              setSubmitting(true)
              const success = await saveProgress({
                userId: user.id,
                lessonSlug: LESSON_SLUG,
                lessonTitle: LESSON_TITLE,
                module: MODULE,
                completed: !completed,
                timeSpentSeconds: Math.floor(Math.random() * 1800) + 600, // 10-40 min simulation
              })

              if (success) {
                setCompleted(!completed)
              }
              setSubmitting(false)
            }}
            disabled={progressLoading || submitting}
            className={`w-full h-11 rounded-sm px-8 text-sm font-semibold tracking-wider transition-colors ${
              completed
                ? 'bg-(--af-red) text-(--af-cream)'
                : 'border border-(--af-red) text-(--af-red) hover:bg-(--af-red) hover:text-(--af-cream)'
            } ${(progressLoading || submitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting || progressLoading
              ? 'Saving...'
              : completed
                ? '✓ Lesson Completed'
                : 'Mark as Complete'}
          </button>

          {progressError && (
            <p className="text-(--af-red) text-sm mt-2">{progressError}</p>
          )}

          {/* Navigation */}
          <div className="mt-8 flex gap-4">
            <Link href="/learn/japanese-by-anime">
              <button className="border border-white/10 rounded-sm px-6 py-3 text-sm font-semibold text-(--af-cream) hover:bg-(--af-grey) transition-colors">
                ← Back to Course
              </button>
            </Link>
            <Link href="/learn/japanese-by-anime/wa-vs-ga">
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
