'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft } from 'lucide-react'

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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => firstInputRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
      setStep('form')
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function validate() {
    const e: { name?: string; email?: string } = {}
    if (!name.trim()) e.name = 'Required'
    if (!email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const calUrl = new URL(`https://cal.com/${CAL_LINK}`)
  calUrl.searchParams.set('embed', 'true')
  calUrl.searchParams.set('name', name)
  calUrl.searchParams.set('email', email)
  if (company) calUrl.searchParams.set('company', company)
  if (challenge) calUrl.searchParams.set('notes', challenge)

  const inputClass = [
    'w-full bg-[#F8F9FA] border border-gray-200 rounded-lg px-4 py-2.5',
    'text-[#0A0F1E] text-sm font-body placeholder-gray-400',
    'focus:outline-none focus:ring-1 focus:ring-[#0A0F1E] focus:border-[#0A0F1E]',
    'transition-all duration-150',
  ].join(' ')

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
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl pointer-events-auto overflow-hidden">

              {/* Header */}
              <div className="bg-[#0A0F1E] px-6 pt-6 pb-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white/40 text-xs font-body mb-1">Free · 30 min · No obligation</p>
                    <h2 className="font-heading font-bold text-white text-xl leading-tight">
                      {step === 'form' ? "Book a Strategy Call" : "Pick a Time"}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="mt-0.5 text-white/40 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Step dots */}
                <div className="flex items-center gap-1.5">
                  <div className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${step === 'form' ? 'bg-[#EC4899]' : 'bg-white/20'}`} />
                  <div className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${step === 'calendar' ? 'bg-[#EC4899]' : 'bg-white/20'}`} />
                </div>
              </div>

              {/* Body */}
              <AnimatePresence mode="wait">
                {step === 'form' ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-6 py-5 space-y-4"
                  >
                    {/* Name + Email */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-heading font-semibold text-[#0A0F1E] mb-1">
                          Name <span className="text-[#EC4899]">*</span>
                        </label>
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
                        <label className="block text-xs font-heading font-semibold text-[#0A0F1E] mb-1">
                          Email <span className="text-[#EC4899]">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
                          placeholder="jane@co.com"
                          className={inputClass}
                        />
                        {errors.email && <p className="text-[#EC4899] text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-xs font-heading font-semibold text-[#0A0F1E] mb-1">
                        Company <span className="text-gray-400 font-normal">— optional</span>
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="Acme Inc."
                        className={inputClass}
                      />
                    </div>

                    {/* Challenge */}
                    <div>
                      <label className="block text-xs font-heading font-semibold text-[#0A0F1E] mb-1">
                        What&apos;s your biggest challenge?
                      </label>
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

                    {/* CTA */}
                    <button
                      onClick={() => { if (validate()) setStep('calendar') }}
                      className="w-full bg-[#0A0F1E] hover:bg-[#0A0F1E]/80 text-white font-heading font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0F1E]"
                    >
                      Continue to booking
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <p className="text-center text-gray-400 text-xs">
                      No spam. Your info is only used for your booking.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <button
                      onClick={() => setStep('form')}
                      className="flex items-center gap-1.5 text-gray-500 hover:text-[#0A0F1E] text-xs font-heading px-6 py-3 transition-colors duration-150 cursor-pointer focus-visible:outline-none"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                    <iframe
                      src={calUrl.toString()}
                      className="w-full border-0"
                      style={{ height: '500px' }}
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
