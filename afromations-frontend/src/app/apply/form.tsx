'use client'

import { useState } from 'react'
import { API_URL } from '@/lib/utils'

const ARTIST_TYPES = [
  'Anime artist', 'Character designer', 'Manga creator', 'Tattoo artist',
  'Muralist', 'Animator', 'Illustrator', 'Musician with visual IP', 'Other',
]

const INTERESTS = [
  'Research and content generation',
  'Provenance / IP documentation',
  'Artist landing page',
  'Character asset packs',
  'Drops and auctions',
  'Commission coordination',
  'AfroScribble (stencils/coloring pages)',
]

interface FormState {
  name: string
  email: string
  ageConfirmed: boolean
  artistType: string
  portfolioUrl: string
  instagram: string
  twitter: string
  hasOriginalCharacters: string
  wantHanaToHelp: string
  interestedInDemo: boolean
  openToBuildInPublic: boolean
  budgetRange: string
  interests: string[]
  consent: boolean
}

const INITIAL: FormState = {
  name: '', email: '', ageConfirmed: false, artistType: '',
  portfolioUrl: '', instagram: '', twitter: '',
  hasOriginalCharacters: '', wantHanaToHelp: '',
  interestedInDemo: false, openToBuildInPublic: false,
  budgetRange: '', interests: [], consent: false,
}

export function ApplicationForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const toggle = (field: keyof FormState, value: string) => {
    const current = form[field] as string[]
    setForm({
      ...form,
      [field]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.ageConfirmed) { setErrorMsg('You must confirm you are 21 or older.'); return }
    if (!form.consent) { setErrorMsg('Please check the consent box to continue.'); return }
    if (!form.name || !form.email) { setErrorMsg('Name and email are required.'); return }

    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch(`${API_URL}/artist-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please email us directly or try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <div className="text-2xl mb-3">✓</div>
        <div className="text-lg font-semibold mb-2">Application received</div>
        <p className="text-sm text-(--af-grey-light)">
          We review applications personally. Expect a response within a few days.
          If accepted, you will hear from us about next steps.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Basic info */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-(--af-grey-light) mb-1">Name *</label>
          <input
            type="text" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 text-(--af-cream) text-sm placeholder:text-(--af-grey-light) focus:outline-none focus:border-white/30"
            placeholder="Your name or studio name"
          />
        </div>
        <div>
          <label className="block text-xs text-(--af-grey-light) mb-1">Email *</label>
          <input
            type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 text-(--af-cream) text-sm placeholder:text-(--af-grey-light) focus:outline-none focus:border-white/30"
            placeholder="your@email.com"
          />
        </div>
      </div>

      {/* Age confirmation */}
      <div className="rounded-lg border border-white/10 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox" checked={form.ageConfirmed}
            onChange={(e) => setForm({ ...form, ageConfirmed: e.target.checked })}
            className="mt-0.5 accent-(--af-red)"
          />
          <span className="text-sm">
            <strong>I confirm I am 21 years of age or older.</strong>{' '}
            <span className="text-(--af-grey-light)">AFROMATIONS is invite-only for 21+ artists and creative professionals.</span>
          </span>
        </label>
      </div>

      {/* Artist type */}
      <div>
        <label className="block text-xs text-(--af-grey-light) mb-2">Artist type</label>
        <div className="flex flex-wrap gap-2">
          {ARTIST_TYPES.map((type) => (
            <button
              key={type} type="button"
              onClick={() => setForm({ ...form, artistType: type })}
              className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${
                form.artistType === type
                  ? 'bg-(--af-red) border-(--af-red) text-(--af-cream)'
                  : 'border-white/20 text-(--af-grey-light) hover:border-white/40'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio + social */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-(--af-grey-light) mb-1">Portfolio URL</label>
          <input
            type="url" value={form.portfolioUrl}
            onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
            className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 text-(--af-cream) text-sm placeholder:text-(--af-grey-light) focus:outline-none focus:border-white/30"
            placeholder="https://yoursite.com or Behance/ArtStation link"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-(--af-grey-light) mb-1">Instagram handle</label>
            <input
              type="text" value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 text-(--af-cream) text-sm placeholder:text-(--af-grey-light) focus:outline-none focus:border-white/30"
              placeholder="@handle"
            />
          </div>
          <div>
            <label className="block text-xs text-(--af-grey-light) mb-1">X / Twitter handle</label>
            <input
              type="text" value={form.twitter}
              onChange={(e) => setForm({ ...form, twitter: e.target.value })}
              className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 text-(--af-cream) text-sm placeholder:text-(--af-grey-light) focus:outline-none focus:border-white/30"
              placeholder="@handle"
            />
          </div>
        </div>
      </div>

      {/* Original characters */}
      <div>
        <label className="block text-xs text-(--af-grey-light) mb-1">Do you have original characters?</label>
        <div className="flex gap-3">
          {['Yes, I have original characters', 'Not yet, but I am developing them', 'No'].map((opt) => (
            <button
              key={opt} type="button"
              onClick={() => setForm({ ...form, hasOriginalCharacters: opt })}
              className={`rounded-lg px-3 py-2 text-xs border transition-colors flex-1 ${
                form.hasOriginalCharacters === opt
                  ? 'bg-(--af-red)/20 border-(--af-red)/40 text-(--af-cream)'
                  : 'border-white/10 text-(--af-grey-light) hover:border-white/30'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* What do you want Hana to help with */}
      <div>
        <label className="block text-xs text-(--af-grey-light) mb-1">What do you want Hana to help with?</label>
        <textarea
          rows={3} value={form.wantHanaToHelp}
          onChange={(e) => setForm({ ...form, wantHanaToHelp: e.target.value })}
          className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 text-(--af-cream) text-sm placeholder:text-(--af-grey-light) focus:outline-none focus:border-white/30 resize-none"
          placeholder="Tell us what you want to accomplish — content, IP protection, drops, landing page, etc."
        />
      </div>

      {/* Interests */}
      <div>
        <label className="block text-xs text-(--af-grey-light) mb-2">Areas of interest (select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <button
              key={interest} type="button"
              onClick={() => toggle('interests', interest)}
              className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${
                (form.interests as string[]).includes(interest)
                  ? 'bg-(--af-red) border-(--af-red) text-(--af-cream)'
                  : 'border-white/20 text-(--af-grey-light) hover:border-white/40'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Yes/no questions */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox" checked={form.interestedInDemo}
            onChange={(e) => setForm({ ...form, interestedInDemo: e.target.checked })}
            className="mt-0.5 accent-(--af-red)"
          />
          <span className="text-sm">I am interested in the 24-hour character demo</span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox" checked={form.openToBuildInPublic}
            onChange={(e) => setForm({ ...form, openToBuildInPublic: e.target.checked })}
            className="mt-0.5 accent-(--af-red)"
          />
          <span className="text-sm">I am open to building in public with AFROMATIONS</span>
        </label>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-xs text-(--af-grey-light) mb-2">Budget / investment range (optional)</label>
        <div className="flex flex-wrap gap-2">
          {['Under $500/mo', '$500–$1,500/mo', '$1,500–$5,000/mo', 'Let\'s talk'].map((range) => (
            <button
              key={range} type="button"
              onClick={() => setForm({ ...form, budgetRange: range })}
              className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${
                form.budgetRange === range
                  ? 'bg-(--af-red) border-(--af-red) text-(--af-cream)'
                  : 'border-white/20 text-(--af-grey-light) hover:border-white/40'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Consent */}
      <div className="rounded-lg border border-white/10 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox" checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            className="mt-0.5 accent-(--af-red)"
          />
          <span className="text-sm text-(--af-grey-light)">
            I consent to AFROMATIONS storing this application and following up via the email provided. I understand this is not a guarantee of acceptance or a contract.
          </span>
        </label>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full af-btn-primary rounded-full py-3.5 text-sm font-semibold disabled:opacity-50"
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
      </button>

      <p className="text-[10px] text-(--af-grey-light) text-center">
        We review applications personally. No spam. No upsells. We will only contact you about your application.
      </p>
    </form>
  )
}
