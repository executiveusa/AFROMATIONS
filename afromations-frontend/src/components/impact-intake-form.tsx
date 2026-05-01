'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export interface ImpactIntakeFormProps {
  formType: 'volunteer' | 'sponsor' | 'mural_commission' | 'graffiti_cleanup' | 'school_partner' | 'community_partner' | 'artist_signup' | 'teacher_signup'
  title: string
  description: string
  fields: {
    name: boolean
    email: boolean
    phone: boolean
    organization: boolean
    role: boolean
    neighborhood: boolean
    projectType: boolean
    budgetRange: boolean
    timeline: boolean
    message: boolean
  }
  onSuccess?: () => void
}

export function ImpactIntakeForm({ formType, title, description, fields, onSuccess }: ImpactIntakeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    neighborhood: '',
    projectType: '',
    budgetRange: '',
    timeline: '',
    message: '',
    consent: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email required'
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    if (!formData.consent) newErrors.consent = 'You must consent to proceed'

    return Object.keys(newErrors).length === 0 ? null : newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validate()
    if (validationErrors) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/impact/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intake_type: formType,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          organization: formData.organization || null,
          neighborhood: formData.neighborhood || null,
          project_type: formData.projectType || null,
          budget_range: formData.budgetRange || null,
          timeline: formData.timeline || null,
          message: formData.message,
          consent: formData.consent,
        }),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setIsSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        role: '',
        neighborhood: '',
        projectType: '',
        budgetRange: '',
        timeline: '',
        message: '',
        consent: false,
      })

      if (onSuccess) onSuccess()

      setTimeout(() => setIsSuccess(false), 5000)
    } catch (error) {
      setErrors({ submit: 'Submission failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-(--af-red) border border-(--af-red) rounded-lg p-8 text-center"
      >
        <h3 className="text-2xl font-bold text-(--af-cream) mb-2">
          Thank You!
        </h3>
        <p className="text-(--af-cream) mb-4">
          We&apos;ve received your submission. We&apos;ll be in touch soon to discuss next steps.
        </p>
        <p className="text-sm text-(--af-cream) opacity-90">
          Check your email for confirmation details.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-(--af-cream) mb-3">
          {title}
        </h2>
        <p className="text-lg text-(--af-grey-light)">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        {fields.name && (
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-(--af-cream) mb-2">
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full bg-background border rounded-lg px-4 py-3 text-(--af-cream) placeholder:text-(--af-grey-light) focus:outline-none focus:ring-2 focus:ring-(--af-red) transition-all ${
                errors.name ? 'border-(--af-red)' : 'border-(--af-red) border-opacity-30'
              }`}
              placeholder="Your name"
            />
            {errors.name && <p className="text-(--af-red) text-sm mt-1">{errors.name}</p>}
          </div>
        )}

        {/* Email */}
        {fields.email && (
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-(--af-cream) mb-2">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-background border rounded-lg px-4 py-3 text-(--af-cream) placeholder:text-(--af-grey-light) focus:outline-none focus:ring-2 focus:ring-(--af-red) transition-all ${
                errors.email ? 'border-(--af-red)' : 'border-(--af-red) border-opacity-30'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-(--af-red) text-sm mt-1">{errors.email}</p>}
          </div>
        )}

        {/* Phone */}
        {fields.phone && (
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-(--af-cream) mb-2">
              Phone (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-background border border-(--af-red) border-opacity-30 rounded-lg px-4 py-3 text-(--af-cream) placeholder:text-(--af-grey-light) focus:outline-none focus:ring-2 focus:ring-(--af-red) transition-all"
              placeholder="(555) 123-4567"
            />
          </div>
        )}

        {/* Organization */}
        {fields.organization && (
          <div>
            <label htmlFor="organization" className="block text-sm font-semibold text-(--af-cream) mb-2">
              Organization (optional)
            </label>
            <input
              id="organization"
              name="organization"
              type="text"
              value={formData.organization}
              onChange={handleChange}
              className="w-full bg-background border border-(--af-red) border-opacity-30 rounded-lg px-4 py-3 text-(--af-cream) placeholder:text-(--af-grey-light) focus:outline-none focus:ring-2 focus:ring-(--af-red) transition-all"
              placeholder="School, nonprofit, or business name"
            />
          </div>
        )}

        {/* Role */}
        {fields.role && (
          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-(--af-cream) mb-2">
              Your Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-background border border-(--af-red) border-opacity-30 rounded-lg px-4 py-3 text-(--af-cream) focus:outline-none focus:ring-2 focus:ring-(--af-red) transition-all"
            >
              <option value="">Select a role</option>
              <option value="volunteer">Volunteer</option>
              <option value="sponsor">Sponsor</option>
              <option value="educator">Educator</option>
              <option value="artist">Artist</option>
              <option value="organizer">Community Organizer</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        {/* Neighborhood */}
        {fields.neighborhood && (
          <div>
            <label htmlFor="neighborhood" className="block text-sm font-semibold text-(--af-cream) mb-2">
              Neighborhood / Location (optional)
            </label>
            <input
              id="neighborhood"
              name="neighborhood"
              type="text"
              value={formData.neighborhood}
              onChange={handleChange}
              className="w-full bg-background border border-(--af-red) border-opacity-30 rounded-lg px-4 py-3 text-(--af-cream) placeholder:text-(--af-grey-light) focus:outline-none focus:ring-2 focus:ring-(--af-red) transition-all"
              placeholder="e.g., Capitol Hill, Downtown Seattle"
            />
          </div>
        )}

        {/* Project Type */}
        {fields.projectType && (
          <div>
            <label htmlFor="projectType" className="block text-sm font-semibold text-(--af-cream) mb-2">
              Project Type
            </label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full bg-background border border-(--af-red) border-opacity-30 rounded-lg px-4 py-3 text-(--af-cream) focus:outline-none focus:ring-2 focus:ring-(--af-red) transition-all"
            >
              <option value="">Select project type</option>
              <option value="graffiti_removal">Graffiti Removal</option>
              <option value="mural">Mural Commission</option>
              <option value="workshop">Workshop</option>
              <option value="internship">Internship</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        {/* Budget Range */}
        {fields.budgetRange && (
          <div>
            <label htmlFor="budgetRange" className="block text-sm font-semibold text-(--af-cream) mb-2">
              Budget Range (optional)
            </label>
            <select
              id="budgetRange"
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleChange}
              className="w-full bg-background border border-(--af-red) border-opacity-30 rounded-lg px-4 py-3 text-(--af-cream) focus:outline-none focus:ring-2 focus:ring-(--af-red) transition-all"
            >
              <option value="">Select budget range</option>
              <option value="under_1k">Under $1,000</option>
              <option value="1k_5k">$1,000 - $5,000</option>
              <option value="5k_10k">$5,000 - $10,000</option>
              <option value="10k_25k">$10,000 - $25,000</option>
              <option value="25k_plus">$25,000+</option>
            </select>
          </div>
        )}

        {/* Timeline */}
        {fields.timeline && (
          <div>
            <label htmlFor="timeline" className="block text-sm font-semibold text-(--af-cream) mb-2">
              Timeline (optional)
            </label>
            <select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="w-full bg-background border border-(--af-red) border-opacity-30 rounded-lg px-4 py-3 text-(--af-cream) focus:outline-none focus:ring-2 focus:ring-(--af-red) transition-all"
            >
              <option value="">Select timeline</option>
              <option value="asap">ASAP</option>
              <option value="next_month">Next Month</option>
              <option value="next_quarter">Next Quarter</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        )}

        {/* Message */}
        {fields.message && (
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-(--af-cream) mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className={`w-full bg-background border rounded-lg px-4 py-3 text-(--af-cream) placeholder:text-(--af-grey-light) focus:outline-none focus:ring-2 focus:ring-(--af-red) transition-all resize-none ${
                errors.message ? 'border-(--af-red)' : 'border-(--af-red) border-opacity-30'
              }`}
              placeholder="Tell us more about your needs, ideas, or how you want to help..."
            />
            {errors.message && <p className="text-(--af-red) text-sm mt-1">{errors.message}</p>}
          </div>
        )}

        {/* Consent */}
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={formData.consent}
            onChange={handleChange}
            className="mt-1 w-5 h-5 border border-(--af-red) rounded focus:ring-2 focus:ring-(--af-red) cursor-pointer"
          />
          <label htmlFor="consent" className="text-sm text-(--af-grey-light) cursor-pointer">
            I consent to be contacted about this request and to AFROMATIONS sharing my information for project coordination and impact reporting. *
          </label>
        </div>
        {errors.consent && <p className="text-(--af-red) text-sm">{errors.consent}</p>}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-(--af-red) bg-opacity-10 border border-(--af-red) border-opacity-50 rounded-lg p-4">
            <p className="text-(--af-red) text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full af-btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </motion.button>
      </form>
    </div>
  )
}
