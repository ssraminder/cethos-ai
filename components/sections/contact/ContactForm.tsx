'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Loader } from 'lucide-react'

const SERVICES = [
  'Performance Marketing (PPC)',
  'Social Media Management',
  'SEO & Online Reputation',
  'AI-Powered Content',
  'WhatsApp & SMS Campaigns',
  'Political Campaign Marketing',
  'Offline Marketing & Print',
  'Brand Strategy & Identity',
  'Multilingual Marketing',
]

const BUDGETS = [
  'Under $1,000/month',
  '$1,000 – $3,000/month',
  '$3,000 – $10,000/month',
  '$10,000+/month',
  'Project-based (one-off)',
]

const LANGUAGES = ['English', 'हिंदी (Hindi)', 'ਪੰਜਾਬੀ (Punjabi)', 'العربية (Arabic)', 'Français (French)']

interface ContactFormProps {
  locale?: string
}

export function ContactForm({ locale = 'en' }: ContactFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    service_interest: '',
    budget_range: '',
    message: '',
    preferred_language: 'English',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const supabase = createClient()
      const { error } = await supabase.from('agp_contact_submissions').insert({
        name: form.name,
        email: form.email,
        company: form.company || null,
        service_interest: form.service_interest || null,
        budget_range: form.budget_range || null,
        message: form.message || null,
        preferred_language: form.preferred_language,
        status: 'new',
      })
      if (error) throw error
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg('Something went wrong. Please email us directly at info@ascelo.ai')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="w-16 h-16 text-[#06B6D4] mb-6" />
        <h3 className="font-heading font-bold text-[#0A0F1E] text-2xl mb-3">
          Message Sent!
        </h3>
        <p className="font-body text-[#0A0F1E]/60 text-base leading-relaxed max-w-sm">
          Thank you, {form.name}. We&apos;ll review your message and get back to you within 24 hours with your free strategy audit.
        </p>
      </div>
    )
  }

  const inputClass = 'w-full bg-white border border-[#0A0F1E]/10 rounded-lg px-4 py-3 font-body text-[#0A0F1E] text-sm placeholder:text-[#0A0F1E]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent transition-all duration-200'
  const labelClass = 'block font-heading font-medium text-[#0A0F1E] text-sm mb-2'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Rajan Mehta"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="rajan@company.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className={labelClass}>Company / Organisation</label>
        <input
          id="company"
          name="company"
          type="text"
          value={form.company}
          onChange={handleChange}
          placeholder="Your company name"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="service_interest" className={labelClass}>Service You&apos;re Interested In</label>
          <select
            id="service_interest"
            name="service_interest"
            value={form.service_interest}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select a service…</option>
            {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="budget_range" className={labelClass}>Monthly Budget Range</label>
          <select
            id="budget_range"
            name="budget_range"
            value={form.budget_range}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select range…</option>
            {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Tell Us About Your Goals</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder="What are you trying to achieve? What's your biggest marketing challenge right now?"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="preferred_language" className={labelClass}>Preferred Communication Language</label>
        <select
          id="preferred_language"
          name="preferred_language"
          value={form.preferred_language}
          onChange={handleChange}
          className={inputClass}
        >
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {status === 'error' && (
        <p className="font-body text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg border border-red-100">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-[#06B6D4] text-white font-heading font-semibold py-4 px-8 rounded-lg text-base hover:bg-[#06B6D4]/90 disabled:opacity-60 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] flex items-center justify-center gap-3"
      >
        {status === 'loading' ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Sending…
          </>
        ) : (
          'Get My Free Strategy Audit'
        )}
      </button>

      <p className="font-body text-[#0A0F1E]/40 text-xs text-center">
        No spam. No commitment. Just honest marketing advice.
      </p>
    </form>
  )
}
