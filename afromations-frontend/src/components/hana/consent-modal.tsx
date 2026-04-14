'use client'

import { useState } from 'react'

interface ConsentModalProps {
  learnerId: string
  onConsentComplete: (consents: Record<string, boolean>) => void
}

export function ConsentModal({ learnerId, onConsentComplete }: ConsentModalProps) {
  const [consents, setConsents] = useState({
    voice_input: false,
    memory_retention: false,
    vision_assessment: false,
    terms_of_service: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const handleToggle = (key: keyof typeof consents) => {
    setConsents((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    if (!consents.terms_of_service) {
      return
    }

    // Store consent preferences
    localStorage.setItem('hana_consents', JSON.stringify(consents))

    // In production: POST to /api/hana/learner/:id/consent for each consent type
    onConsentComplete(consents)
  }

  const canSubmit = consents.terms_of_service && !submitted

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative max-w-2xl w-full mx-4 my-8">
        {/* Card */}
        <div className="bg-[var(--af-grey)] border border-[var(--af-red)]/30 rounded-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-[var(--af-cream)] mb-2"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Permission to Learn
            </h1>
            <p className="text-[var(--af-grey-light)] text-sm">
              Agent Hana requires your explicit consent for specific features.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Voice Input */}
            <div className="border border-[var(--af-grey-mid)] rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consents.voice_input}
                  onChange={() => handleToggle('voice_input')}
                  className="mt-1 w-5 h-5 accent-[var(--af-red)]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-[var(--af-cream)] mb-1">
                    Voice Recording
                  </p>
                  <p className="text-[var(--af-grey-light)] text-sm">
                    Allow Hana to record your voice for pronunciation assessment and oral production evaluation. You control when recording starts.
                  </p>
                </div>
              </label>
            </div>

            {/* Memory Retention */}
            <div className="border border-[var(--af-grey-mid)] rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consents.memory_retention}
                  onChange={() => handleToggle('memory_retention')}
                  className="mt-1 w-5 h-5 accent-[var(--af-red)]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-[var(--af-cream)] mb-1">
                    Memory & Learning Graph
                  </p>
                  <p className="text-[var(--af-grey-light)] text-sm">
                    Allow Hana to build a knowledge graph of your learning progress. This helps personalize lessons and track growth. Your memory is encrypted and under your control.
                  </p>
                </div>
              </label>
            </div>

            {/* Vision Assessment */}
            <div className="border border-[var(--af-grey-mid)] rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consents.vision_assessment}
                  onChange={() => handleToggle('vision_assessment')}
                  className="mt-1 w-5 h-5 accent-[var(--af-red)]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-[var(--af-cream)] mb-1">
                    Vision-Based Assessment
                  </p>
                  <p className="text-[var(--af-grey-light)] text-sm">
                    Allow Hana to use your webcam for kanji/character recognition testing. This is optional and entirely voluntary.
                  </p>
                </div>
              </label>
            </div>

            {/* Terms Required */}
            <div className="border border-[var(--af-red)]/50 bg-[var(--af-red)]/5 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consents.terms_of_service}
                  onChange={() => handleToggle('terms_of_service')}
                  className="mt-1 w-5 h-5 accent-[var(--af-red)]"
                  required
                />
                <div className="flex-1">
                  <p className="font-semibold text-[var(--af-cream)] mb-1">
                    Terms of Service (Required)
                  </p>
                  <p className="text-[var(--af-grey-light)] text-sm">
                    I agree to the Terms of Service and acknowledge that Agent Hana is for adult learners (21+) only.
                  </p>
                </div>
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex-1 py-3 px-4 bg-[var(--af-red)] text-[var(--af-cream)] font-semibold text-sm tracking-wider rounded transition-colors hover:bg-[var(--af-red-dark)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                I Agree & Continue
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-[var(--af-grey-mid)] space-y-2">
            <p className="text-[var(--af-grey-light)] text-xs">
              ✓ You can revoke consent at any time in Settings.
            </p>
            <p className="text-[var(--af-grey-light)] text-xs">
              ✓ Voice recordings are encrypted and never shared.
            </p>
            <p className="text-[var(--af-grey-light)] text-xs">
              ✓ Your data complies with GDPR and data protection laws.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
