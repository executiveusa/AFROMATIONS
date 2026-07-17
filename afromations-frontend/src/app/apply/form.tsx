'use client'

import { useEffect, useState } from 'react'
import { API_URL } from '@/lib/utils'

const ARTIST_TYPES = [
  'Tattoo artist',
  'Anime artist',
  'Manga creator',
  'Character designer',
  'Illustrator',
  'Muralist',
  'Animator',
  'Musician with visual IP',
  'Other',
]

const INTERESTS = [
  'Paid character collaborations',
  'Merchandise licensing',
  'Human finish and production work',
  'Artist promotion and booking referrals',
  'Provenance / certificate records',
  'Hana Character Launch Agent',
  'Drops and campaign launches',
]

type ApplicationPath = 'artist' | 'hana'
type OriginalCharacterStatus = 'yes' | 'in_progress' | 'no'

interface FormState {
  path: ApplicationPath
  name: string
  email: string
  age21Confirmed: boolean
  artistType: string[]
  cityAndShop: string
  portfolioUrl: string
  instagram: string
  hasOriginalCharacters: OriginalCharacterStatus
  collaborationGoal: string
  interests: string[]
  openToBuildInPublic: boolean
  budgetRange: string
  consent: boolean
}

const INITIAL: FormState = {
  path: 'artist',
  name: '',
  email: '',
  age21Confirmed: false,
  artistType: [],
  cityAndShop: '',
  portfolioUrl: '',
  instagram: '',
  hasOriginalCharacters: 'yes',
  collaborationGoal: '',
  interests: [],
  openToBuildInPublic: false,
  budgetRange: '',
  consent: false,
}

export function ApplicationForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const path = new URLSearchParams(window.location.search).get('path')
    if (path === 'hana' || path === 'artist') {
      setForm((current) => ({ ...current, path }))
    }
  }, [])

  const toggleArray = (field: 'artistType' | 'interests', value: string) => {
    setForm((current) => {
      const values = current[field]
      return {
        ...current,
        [field]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value],
      }
    })
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErrorMsg('')

    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg('Name and email are required.')
      return
    }
    if (!form.age21Confirmed) {
      setErrorMsg('You must confirm that you are 21 or older.')
      return
    }
    if (form.artistType.length === 0) {
      setErrorMsg('Select at least one artist type.')
      return
    }
    if (!form.consent) {
      setErrorMsg('Please accept the application consent to continue.')
      return
    }

    setStatus('submitting')

    const applicationBrief = [
      `Application path: ${form.path === 'artist' ? 'Founding artist roster' : 'Hana Character Launch Agent'}`,
      `City / studio: ${form.cityAndShop || 'Not provided'}`,
      `Goal: ${form.collaborationGoal || 'Not provided'}`,
    ].join('\n')

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      age21Confirmed: form.age21Confirmed,
      artistType: form.artistType,
      portfolioUrl: form.portfolioUrl.trim(),
      instagram: form.instagram.trim(),
      twitter: '',
      hasOriginalCharacters: form.hasOriginalCharacters,
      wantHanaToHelp: applicationBrief,
      interests: form.interests,
      interestedInDemo: form.path === 'hana',
      openToBuildInPublic: form.openToBuildInPublic,
      budgetRange: form.path === 'artist' ? 'Artist roster — no fee' : form.budgetRange,
      consent: form.consent,
    }

    try {
      const response = await fetch(`${API_URL}/artist-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const details = await response.text()
        throw new Error(details || 'Submission failed')
      }

      setStatus('success')
    } catch (error) {
      console.error('Artist application failed', error)
      setStatus('error')
      setErrorMsg('The form could not be submitted. Please try again or contact AFROMATIONS directly.')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-emerald-500/30 bg-emerald-500/10 p-8 text-center" role="status">
        <div className="text-3xl text-emerald-300" aria-hidden="true">✓</div>
        <h2 className="mt-3 text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Application received.</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-(--af-grey-light)">
          We review applications personally. We will contact you by email if the founding circle or Hana installation is a fit.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-8" noValidate>
      <fieldset>
        <legend className="text-xs font-semibold tracking-wide text-(--af-grey-light)">How do you want to work with us?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setForm((current) => ({ ...current, path: 'artist' }))}
            className={`min-h-24 border p-4 text-left transition-colors ${
              form.path === 'artist'
                ? 'border-(--af-gold) bg-(--af-gold)/10'
                : 'border-white/10 bg-white/5 hover:border-white/25'
            }`}
            aria-pressed={form.path === 'artist'}
          >
            <span className="block text-sm font-semibold">Join the Founding Artist Circle</span>
            <span className="mt-2 block text-xs leading-relaxed text-(--af-grey-light)">No roster fee. Paid or revenue-share projects are agreed case by case.</span>
          </button>
          <button
            type="button"
            onClick={() => setForm((current) => ({ ...current, path: 'hana' }))}
            className={`min-h-24 border p-4 text-left transition-colors ${
              form.path === 'hana'
                ? 'border-(--af-red) bg-(--af-red)/10'
                : 'border-white/10 bg-white/5 hover:border-white/25'
            }`}
            aria-pressed={form.path === 'hana'}
          >
            <span className="block text-sm font-semibold">Hire Hana — $1,495</span>
            <span className="mt-2 block text-xs leading-relaxed text-(--af-grey-light)">Done-for-you character studio installation. Payment plan available.</span>
          </button>
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs text-(--af-grey-light)">Name or studio name *</span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--af-cream) placeholder:text-(--af-grey-light) focus:border-white/30 focus:outline-none"
            placeholder="Your name or shop"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs text-(--af-grey-light)">Email *</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--af-cream) placeholder:text-(--af-grey-light) focus:border-white/30 focus:outline-none"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-xs text-(--af-grey-light)">City and studio / shop</span>
        <input
          type="text"
          value={form.cityAndShop}
          onChange={(event) => setForm((current) => ({ ...current, cityAndShop: event.target.value }))}
          className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--af-cream) placeholder:text-(--af-grey-light) focus:border-white/30 focus:outline-none"
          placeholder="Seattle — Example Tattoo Studio"
        />
      </label>

      <fieldset>
        <legend className="text-xs text-(--af-grey-light)">Artist type * — select all that apply</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {ARTIST_TYPES.map((type) => {
            const selected = form.artistType.includes(type)
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleArray('artistType', type)}
                className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                  selected
                    ? 'border-(--af-red) bg-(--af-red) text-(--af-cream)'
                    : 'border-white/15 text-(--af-grey-light) hover:border-white/35'
                }`}
                aria-pressed={selected}
              >
                {type}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs text-(--af-grey-light)">Portfolio or booking URL</span>
          <input
            type="url"
            value={form.portfolioUrl}
            onChange={(event) => setForm((current) => ({ ...current, portfolioUrl: event.target.value }))}
            className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--af-cream) placeholder:text-(--af-grey-light) focus:border-white/30 focus:outline-none"
            placeholder="https://"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs text-(--af-grey-light)">Instagram handle</span>
          <input
            type="text"
            value={form.instagram}
            onChange={(event) => setForm((current) => ({ ...current, instagram: event.target.value }))}
            className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--af-cream) placeholder:text-(--af-grey-light) focus:border-white/30 focus:outline-none"
            placeholder="@handle"
          />
        </label>
      </div>

      <fieldset>
        <legend className="text-xs text-(--af-grey-light)">Do you have original characters or original flash?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {[
            ['yes', 'Yes — ready to show'],
            ['in_progress', 'In development'],
            ['no', 'Not yet'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm((current) => ({ ...current, hasOriginalCharacters: value as OriginalCharacterStatus }))}
              className={`border px-4 py-3 text-xs transition-colors ${
                form.hasOriginalCharacters === value
                  ? 'border-(--af-red) bg-(--af-red)/15 text-(--af-cream)'
                  : 'border-white/10 text-(--af-grey-light) hover:border-white/30'
              }`}
              aria-pressed={form.hasOriginalCharacters === value}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-2 block text-xs text-(--af-grey-light)">
          {form.path === 'artist'
            ? 'What kind of collaboration or promotion would help you most?'
            : 'What do you want Hana to build around your character?'}
        </span>
        <textarea
          rows={5}
          value={form.collaborationGoal}
          onChange={(event) => setForm((current) => ({ ...current, collaborationGoal: event.target.value }))}
          className="w-full resize-y border border-white/10 bg-white/5 px-4 py-3 text-sm text-(--af-cream) placeholder:text-(--af-grey-light) focus:border-white/30 focus:outline-none"
          placeholder="Tell us about the work, the audience, and what you want to happen next."
        />
      </label>

      <fieldset>
        <legend className="text-xs text-(--af-grey-light)">Areas of interest</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const selected = form.interests.includes(interest)
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleArray('interests', interest)}
                className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                  selected
                    ? 'border-(--af-red) bg-(--af-red) text-(--af-cream)'
                    : 'border-white/15 text-(--af-grey-light) hover:border-white/35'
                }`}
                aria-pressed={selected}
              >
                {interest}
              </button>
            )
          })}
        </div>
      </fieldset>

      {form.path === 'hana' && (
        <fieldset>
          <legend className="text-xs text-(--af-grey-light)">Preferred payment option</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {['$1,495 paid in full', '3 payments of $550 — $1,650 total'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setForm((current) => ({ ...current, budgetRange: option }))}
                className={`border px-4 py-3 text-xs transition-colors ${
                  form.budgetRange === option
                    ? 'border-(--af-red) bg-(--af-red)/15 text-(--af-cream)'
                    : 'border-white/10 text-(--af-grey-light) hover:border-white/30'
                }`}
                aria-pressed={form.budgetRange === option}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="space-y-3 border border-white/10 bg-white/5 p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.openToBuildInPublic}
            onChange={(event) => setForm((current) => ({ ...current, openToBuildInPublic: event.target.checked }))}
            className="mt-1 accent-(--af-red)"
          />
          <span className="text-sm text-(--af-grey-light)">
            I am open to a credited public case study. Final publication would still require my approval.
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.age21Confirmed}
            onChange={(event) => setForm((current) => ({ ...current, age21Confirmed: event.target.checked }))}
            className="mt-1 accent-(--af-red)"
          />
          <span className="text-sm text-(--af-grey-light)">I confirm that I am 21 years of age or older. *</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(event) => setForm((current) => ({ ...current, consent: event.target.checked }))}
            className="mt-1 accent-(--af-red)"
          />
          <span className="text-sm text-(--af-grey-light)">
            I consent to AFROMATIONS storing this application and contacting me about it. This application does not transfer rights, create a contract, or guarantee acceptance. *
          </span>
        </label>
      </div>

      {errorMsg && (
        <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="af-btn-primary min-h-13 w-full rounded-full px-6 py-3.5 text-sm font-semibold disabled:cursor-wait disabled:opacity-50"
      >
        {status === 'submitting'
          ? 'Submitting…'
          : form.path === 'artist'
            ? 'Submit Artist Application'
            : 'Apply for the Hana Installation'}
      </button>

      <p className="text-center text-[10px] leading-relaxed text-(--af-grey-light)">
        We review applications personally. No work is licensed, generated from, published, or sold through this application alone.
      </p>
    </form>
  )
}
