'use client'

import { useState } from 'react'

interface AgeGateProps {
  onAgeVerified: () => void
}

export function AgeGate({ onAgeVerified }: AgeGateProps) {
  const [birthDate, setBirthDate] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const calculateAge = (date: string): number => {
    const birth = new Date(date)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setError('')

    if (!birthDate) {
      setError('Please enter your birth date.')
      return
    }

    const age = calculateAge(birthDate)

    if (age < 21) {
      setError('You must be 21 years or older to use Agent Hana.')
      return
    }

    // Store verification in localStorage
    localStorage.setItem('hana_age_verified', 'true')
    localStorage.setItem('hana_birth_date_hash', btoa(birthDate)) // Simple obfuscation

    onAgeVerified()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-md w-full mx-4">
        {/* Card */}
        <div className="bg-[var(--af-grey)] border border-[var(--af-red)]/30 rounded-lg p-8">
          {/* Header */}
          <div className="mb-6">
            <h1
              className="text-3xl font-bold text-[var(--af-cream)] mb-2"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Agent Hana
            </h1>
            <p className="text-[var(--af-grey-light)] text-sm">
              21+ Only
            </p>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-[var(--af-cream)] text-sm leading-relaxed mb-4">
              Agent Hana is an adult-only learning companion for serious students of Japanese language and culture.
            </p>
            <p className="text-[var(--af-cream)] text-sm leading-relaxed">
              To proceed, please verify that you are 21 years or older.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="birthDate"
                className="block text-xs font-semibold tracking-wider text-[var(--af-red)] mb-2 uppercase"
              >
                Birth Date
              </label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2 bg-black/40 border border-[var(--af-grey-light)]/20 rounded text-[var(--af-cream)] placeholder-[var(--af-grey-light)] focus:outline-none focus:border-[var(--af-red)] transition-colors"
              />
            </div>

            {error && (
              <div className="bg-[var(--af-red)]/10 border border-[var(--af-red)]/30 rounded px-3 py-2">
                <p className="text-[var(--af-red)] text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[var(--af-red)] text-[var(--af-cream)] font-semibold text-sm tracking-wider rounded transition-colors hover:bg-[var(--af-red-dark)] disabled:opacity-50"
              disabled={submitted && !!error}
            >
              Verify Age & Continue
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-[var(--af-grey-mid)]">
            <p className="text-[var(--af-grey-light)] text-xs text-center">
              Your birth date is verified locally and never sent to servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
