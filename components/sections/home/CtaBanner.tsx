'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { Phone, Zap } from 'lucide-react'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay } as Transition,
})

export function CtaBanner() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-gradient-to-br from-[#0A0F1E] via-[#1a0a2e] to-[#0A0F1E] overflow-hidden">
      {/* Pink glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(236,72,153,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <motion.h2
          {...fadeUp(0.1)}
          className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-none tracking-wide"
        >
          READY TO DOMINATE YOUR MARKET?
        </motion.h2>

        {/* Subtext */}
        <motion.p
          {...fadeUp(0.2)}
          className="font-body text-lg text-[#F8FAFC]/70 mt-4 max-w-xl mx-auto"
        >
          Talk to our team today. Free strategy audit included. No commitment required.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.3)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link
            href="/contact"
            className="bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-white font-heading font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 cursor-pointer shadow-lg shadow-[#06B6D4]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
          >
            Get a Free Audit
          </Link>
          <a
            href="tel:+919876543210"
            className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white font-heading font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 cursor-pointer hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
          >
            <Phone className="w-5 h-5" />
            Call Us Directly
          </a>
        </motion.div>

        {/* Urgency note */}
        <motion.p
          {...fadeUp(0.4)}
          className="inline-flex items-center gap-1.5 mt-8 text-[#EC4899] text-sm font-heading"
        >
          <Zap className="w-4 h-4" />
          Limited spots available this month
        </motion.p>
      </div>
    </section>
  )
}
