'use client'

import { useState, useTransition } from 'react'
import { submitAuditRequest } from '@/app/[locale]/audit/actions'
import { Loader, Globe, User, Mail, Building2, Phone, MapPin, Shield } from 'lucide-react'

const COUNTRIES = ['Canada', 'United Arab Emirates', 'India', 'United States', 'United Kingdom', 'Australia', 'Other']

interface AuditFormProps {
  locale?: string
}

export function AuditForm({ locale = 'en' }: AuditFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const inputClass = 'w-full bg-white border border-[#0A0F1E]/10 rounded-lg px-4 py-3 font-body text-[#0A0F1E] text-sm placeholder:text-[#0A0F1E]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent transition-all duration-200'
  const labelClass = 'block font-heading font-medium text-[#0A0F1E] text-sm mb-2'

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await submitAuditRequest(formData)
      } catch (e) {
        if (e instanceof Error && !e.message.includes('NEXT_REDIRECT')) {
          setError(e.message)
        }
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Honeypot — hidden from real users */}
      <input type="text" name="website_confirm" className="hidden" tabIndex={-1} autoComplete="off" />

      {/* Website URL */}
      <div>
        <label htmlFor="website_url" className={labelClass}>
          <Globe className="inline w-4 h-4 mr-1.5 -mt-0.5 text-[#EC4899]" />
          Website URL <span className="text-[#EC4899]">*</span>
        </label>
        <input
          id="website_url"
          name="website_url"
          type="url"
          required
          placeholder="https://yourwebsite.com"
          className={inputClass}
        />
        <p className="mt-1.5 font-body text-[#0A0F1E]/40 text-xs">Include https:// — e.g. https://mybusiness.com</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className={labelClass}>
            <User className="inline w-4 h-4 mr-1.5 -mt-0.5 text-[#EC4899]" />
            Full Name <span className="text-[#EC4899]">*</span>
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            placeholder="Sarah Johnson"
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelClass}>
            <Mail className="inline w-4 h-4 mr-1.5 -mt-0.5 text-[#EC4899]" />
            Email Address <span className="text-[#EC4899]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="sarah@business.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Company Name */}
        <div>
          <label htmlFor="company_name" className={labelClass}>
            <Building2 className="inline w-4 h-4 mr-1.5 -mt-0.5 text-[#0A0F1E]/40" />
            Company Name
          </label>
          <input
            id="company_name"
            name="company_name"
            type="text"
            placeholder="Acme Inc."
            className={inputClass}
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className={labelClass}>
            <Phone className="inline w-4 h-4 mr-1.5 -mt-0.5 text-[#0A0F1E]/40" />
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            className={inputClass}
          />
        </div>
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className={labelClass}>
          <MapPin className="inline w-4 h-4 mr-1.5 -mt-0.5 text-[#0A0F1E]/40" />
          Country / Market
        </label>
        <select id="country" name="country" className={inputClass}>
          <option value="">Select your country…</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Consent */}
      <div className="flex items-start gap-3 bg-[#FDF2F8] rounded-xl p-4 border border-[#EC4899]/10">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 w-4 h-4 accent-[#EC4899] cursor-pointer"
        />
        <label htmlFor="consent" className="font-body text-[#0A0F1E]/70 text-sm leading-relaxed cursor-pointer">
          I agree to receive my free audit report by email and understand that Ascelo AI may follow up with relevant insights. No spam, ever.
          <span className="text-[#EC4899]"> *</span>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="font-body text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#EC4899] text-white font-heading font-semibold py-4 px-8 rounded-xl text-base hover:bg-[#EC4899]/90 disabled:opacity-60 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] flex items-center justify-center gap-3 shadow-lg shadow-[#EC4899]/20"
      >
        {isPending ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Sending verification code…
          </>
        ) : (
          <>
            <Shield className="w-5 h-5" />
            Get My Free SEO Audit
          </>
        )}
      </button>

      <p className="font-body text-[#0A0F1E]/40 text-xs text-center">
        We&apos;ll email you a 6-digit code to verify your address. Free audit delivered in ~5 minutes.
      </p>
    </form>
  )
}
