'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, Calendar } from 'lucide-react'

interface BookingModalProps {
  open: boolean
  onClose: () => void
}

const CHALLENGES = [
  'Not getting enough leads',
  'High cost per lead / poor ROAS',
  'No consistent online presence',
  'Need to automate operations',
  'Launching a new product or brand',
  'Not sure — need a strategy session',
]

const CAL_LINK = 'cethos/ascelo-strategy-call'

export function BookingModal({ open, onClose }: BookingModalProps) {
  const [step, setStep] = useState<'form' | 'calendar'>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [challenge, setChallenge] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => firstInputRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
      // Reset on close
      setStep('form')
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function validate() {
    const e: { name?: string; email?: string } = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleContinue() {
    if (validate()) setStep('calendar')
  }

  // Build Cal.com embed URL with prefill
  const calUrl = new URL(`https://cal.com/${CAL_LINK}`)
  calUrl.searchParams.set('embed', 'true')
  calUrl.searchParams.set('name', name)
  calUrl.searchParams.set('email', email)
  if (company) calUrl.searchParams.set('company', company)
  if (challenge) calUrl.searchParams.set('notes', challenge)

  const inputClass = 'w-full bg-white border border-[#EC4899]/20 rounded-xl px-4 py-3 text-[#0A0F1E] text-sm font-body placeholder-[#0A0F1E]/30 focus:outline-none focus:ring-2 focus:ring-[#EC4899]/50 focus:border-[#EC4899] transition-all duration-200'
  const labelClass = 'block font-heading font-semibold text-[#0A0F1E] text-xs uppercase tracking-wider mb-1.5'

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0A0F1E]/70 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Book a strategy call"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#EC4899] to-[#06B6D4] px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-semibold text-white/70 text-xs uppercase tracking-widest mb-0.5">
                      Free · 30 Minutes · No obligation
                    </p>
                    <h2 className="font-display text-2xl text-white leading-tight">
                      {step === 'form' ? "Let's Talk Growth" : 'Pick Your Time'}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    aria-label="Close booking modal"
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2 mt-4">
                  <div className={`h-1 rounded-full flex-1 transition-colors duration-300 ${step === 'form' ? 'bg-white' : 'bg-white/40'}`} />
                  <div className={`h-1 rounded-full flex-1 transition-colors duration-300 ${step === 'calendar' ? 'bg-white' : 'bg-white/40'}`} />
                </div>
              </div>

              {/* Body */}
              <AnimatePresence mode="wait">
                {step === 'form' ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Name *</label>
                        <input
                          ref={firstInputRef}
                          type="text"
                          value={name}
                          onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
                          placeholder="Jane Smith"
                          className={inputClass}
                        />
                        {errors.name && <p className="text-[#EC4899] text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Email *</label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
                          placeholder="jane@company.com"
                          className={inputClass}
                        />
                        {errors.email && <p className="text-[#EC4899] text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Company <span className="text-[#0A0F1E]/30 normal-case font-normal">(optional)</span></label>
                      <input
                        type="text"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="Acme Inc."
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>What&apos;s your biggest challenge?</label>
                      <select
                        value={challenge}
                        onChange={e => setChallenge(e.target.value)}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="">Select one...</option>
                        {CHALLENGES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleContinue}
                      className="w-full bg-[#EC4899] hover:bg-[#EC4899]/90 text-white font-heading font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC4899] mt-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Pick a Time
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <p className="text-center text-[#0A0F1E]/40 text-xs font-body">
                      Your info is only used to personalise your booking. No spam, ever.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col"
                  >
                    <button
                      onClick={() => setStep('form')}
                      className="flex items-center gap-1.5 text-[#EC4899] text-xs font-heading font-semibold px-6 py-3 hover:bg-[#FDF2F8] transition-colors duration-200 cursor-pointer focus-visible:outline-none"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to details
                    </button>
                    <iframe
                      src={calUrl.toString()}
                      className="w-full border-0"
                      style={{ height: '520px' }}
                      title="Book a strategy call"
                      loading="lazy"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
