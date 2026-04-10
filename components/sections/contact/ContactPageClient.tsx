'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Loader,
  ClipboardList,
  PhoneCall,
  FileSearch,
  ThumbsUp,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay } as Transition,
})

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

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
  '$1,000\u2013$3,000/month',
  '$3,000\u2013$10,000/month',
  '$10,000+/month',
  'Project-based (one-off)',
]

const LANGUAGES = [
  'English',
  '\u0939\u093F\u0902\u0926\u0940 (Hindi)',
  '\u0A2A\u0A70\u0A1C\u0A3E\u0A2C\u0A40 (Punjabi)',
  '\u0627\u0644\u0639\u0631\u0628\u064A\u0629 (Arabic)',
  'Fran\u00E7ais (French)',
]

const timelineSteps = [
  {
    number: '01',
    text: 'We review your form within 24 hours',
    icon: ClipboardList,
  },
  {
    number: '02',
    text: 'A strategist schedules a 30-min discovery call',
    icon: PhoneCall,
  },
  {
    number: '03',
    text: 'We deliver a free audit with clear recommendations',
    icon: FileSearch,
  },
  {
    number: '04',
    text: 'You decide if we\u2019re the right fit \u2014 no pressure',
    icon: ThumbsUp,
  },
]

/* ------------------------------------------------------------------ */
/*  Contact Page Client                                                 */
/* ------------------------------------------------------------------ */

export function ContactPageClient() {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return

    setStatus('loading')

    // Simulate a short delay, then show success
    setTimeout(() => {
      setStatus('success')
    }, 800)
  }

  const inputClass =
    'w-full bg-surface-container-lowest border-0 rounded-lg px-4 py-3 font-body text-on-surface text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200'
  const labelClass =
    'block font-headline uppercase tracking-widest text-xs text-primary mb-2'
  const selectClass =
    'w-full bg-surface-container-lowest border-0 rounded-lg px-4 py-3 font-body text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 cursor-pointer appearance-none'

  return (
    <div className="min-h-screen bg-background">
      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(76,215,246,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow */}
          <motion.div {...fadeUp(0.1)} className="mb-6">
            <span className="inline-block text-xs font-headline uppercase tracking-widest text-primary-container border border-primary-container/20 px-4 py-1.5 rounded-full">
              Let&apos;s Talk Results
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.2)}
            className="font-headline font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-on-surface"
          >
            Contact <span className="gradient-text">Us</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...fadeUp(0.3)}
            className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mt-6 leading-relaxed"
          >
            Tell us about your business and goals. We&apos;ll come back with a free strategy audit
            and a clear plan to grow your revenue.
          </motion.p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FORM + CONTACT INFO (Two Columns)                            */}
      {/* ============================================================ */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* LEFT — Form (spans 3 cols) */}
            <motion.div
              {...fadeUp(0.1)}
              className="lg:col-span-3 relative rounded-xl border border-outline-variant bg-surface-container-low overflow-hidden"
            >
              {/* Data-pulse gradient line at top */}
              <div
                className="h-[2px] w-full"
                style={{
                  background:
                    'linear-gradient(90deg, #4cd7f6, #06b6d4, #00e1ab, #ffb0cd, #4cd7f6)',
                }}
                aria-hidden="true"
              />

              <div className="p-6 md:p-8">
                <h2 className="font-headline font-bold text-on-surface text-xl md:text-2xl mb-8">
                  Get Your Free Strategy Audit
                </h2>

                {status === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <CheckCircle className="w-16 h-16 text-tertiary mb-6" />
                    <h3 className="font-headline font-bold text-on-surface text-2xl mb-3">
                      Message Sent!
                    </h3>
                    <p className="font-body text-on-surface-variant text-base leading-relaxed max-w-sm">
                      Thank you, {form.name}. We&apos;ll review your message and get back to you
                      within 24 hours with your free strategy audit.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className={labelClass}>
                          Full Name *
                        </label>
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
                        <label htmlFor="email" className={labelClass}>
                          Email Address *
                        </label>
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

                    {/* Company */}
                    <div>
                      <label htmlFor="company" className={labelClass}>
                        Company / Organisation
                      </label>
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

                    {/* Service + Budget row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="service_interest" className={labelClass}>
                          Service You&apos;re Interested In
                        </label>
                        <select
                          id="service_interest"
                          name="service_interest"
                          value={form.service_interest}
                          onChange={handleChange}
                          className={selectClass}
                        >
                          <option value="">Select a service...</option>
                          {SERVICES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="budget_range" className={labelClass}>
                          Monthly Budget Range
                        </label>
                        <select
                          id="budget_range"
                          name="budget_range"
                          value={form.budget_range}
                          onChange={handleChange}
                          className={selectClass}
                        >
                          <option value="">Select range...</option>
                          {BUDGETS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Goals */}
                    <div>
                      <label htmlFor="message" className={labelClass}>
                        Tell Us About Your Goals
                      </label>
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

                    {/* Language */}
                    <div>
                      <label htmlFor="preferred_language" className={labelClass}>
                        Preferred Communication Language
                      </label>
                      <select
                        id="preferred_language"
                        name="preferred_language"
                        value={form.preferred_language}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        {LANGUAGES.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-semibold py-4 px-8 rounded-xl text-base hover:brightness-110 disabled:opacity-60 transition-all duration-300 cursor-pointer shadow-lg shadow-primary/20 hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center gap-3"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Get My Free Strategy Audit'
                      )}
                    </button>

                    <p className="font-body text-on-surface-variant/50 text-xs text-center">
                      No spam. No commitment. Just honest marketing advice.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>

            {/* RIGHT — Direct Contact Card (spans 2 cols) */}
            <motion.div
              {...fadeUp(0.2)}
              className="lg:col-span-2 h-fit rounded-xl bg-surface-container-high border border-outline-variant p-6 md:p-8"
            >
              <h3 className="font-headline font-bold text-on-surface text-lg mb-6">
                Direct Contact
              </h3>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-headline text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                      Email Us
                    </p>
                    <a
                      href="mailto:info@ascelo.ai"
                      className="font-body text-on-surface text-sm hover:text-primary transition-colors duration-300 cursor-pointer"
                    >
                      info@ascelo.ai
                    </a>
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-tertiary" />
                  </div>
                  <div>
                    <p className="font-headline text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                      Call / WhatsApp
                    </p>
                    <a
                      href="tel:+15873292590"
                      className="font-body text-on-surface text-sm hover:text-tertiary transition-colors duration-300 cursor-pointer"
                    >
                      +1 (587) 329-2590
                    </a>
                  </div>
                </div>

                {/* Office */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-headline text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                      Office
                    </p>
                    <p className="font-body text-on-surface text-sm leading-relaxed">
                      421, 7th Ave SW, Floor 30,
                      <br />
                      Calgary, AB T2P 4K9
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHAT HAPPENS NEXT (Timeline)                                 */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-surface-container-low">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <motion.p
              {...fadeUp(0)}
              className="text-xs font-headline uppercase tracking-widest text-primary mb-4"
            >
              What Happens Next
            </motion.p>
            <motion.h2
              {...fadeUp(0.1)}
              className="font-headline font-extrabold text-3xl md:text-4xl lg:text-5xl text-on-surface"
            >
              From Form to <span className="gradient-text">Results</span>
            </motion.h2>
          </div>

          {/* Timeline — horizontal on desktop, vertical on mobile */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Desktop: horizontal connecting line */}
            <div
              className="hidden md:block absolute top-10 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-[2px] bg-outline-variant"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
              {timelineSteps.map((step, i) => (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  className="group flex flex-col items-center text-center"
                >
                  {/* Numbered circle */}
                  <div className="relative z-10 w-20 h-20 rounded-full border-2 border-outline-variant bg-surface-container-high flex items-center justify-center mb-5 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_24px_rgba(76,215,246,0.15)]">
                    {i === 3 ? (
                      <CheckCircle className="w-8 h-8 text-tertiary" />
                    ) : (
                      <span className="font-headline font-extrabold text-xl text-primary">
                        {step.number}
                      </span>
                    )}
                  </div>

                  {/* Text */}
                  <p className="font-body text-on-surface-variant text-sm leading-relaxed max-w-[200px]">
                    {step.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
