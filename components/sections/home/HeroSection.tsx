'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { Award, CheckCircle, ChevronDown } from 'lucide-react'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay } as Transition,
})

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#0A0F1E] overflow-hidden flex items-center justify-center pt-24">
      {/* Background orbs */}
      <motion.div
        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#EC4899]/10 blur-[120px] pointer-events-none"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#06B6D4]/10 blur-[120px] pointer-events-none"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
        {/* Eyebrow badge */}
        <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 text-[#EC4899] border border-[#EC4899]/30 bg-[#EC4899]/10 px-4 py-1.5 rounded-full text-sm font-heading mb-8">
          <Award className="w-4 h-4" />
          <span>Punjab&apos;s #1 Political Marketing Agency</span>
        </motion.div>

        {/* Headline */}
        <div className="mb-6">
          <motion.div {...fadeUp(0.2)}>
            <span className="block font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none tracking-wide text-white">
              WIN VOTES.
            </span>
          </motion.div>
          <motion.div {...fadeUp(0.3)}>
            <span className="block font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none tracking-wide bg-gradient-to-r from-[#EC4899] to-[#06B6D4] bg-clip-text text-transparent">
              WIN MARKETS.
            </span>
          </motion.div>
          <motion.div {...fadeUp(0.4)}>
            <span className="block font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-none tracking-wide text-white/70">
              WIN ONLINE.
            </span>
          </motion.div>
        </div>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.5)}
          className="font-body text-lg md:text-xl text-[#F8FAFC]/70 max-w-2xl mx-auto mt-6"
        >
          AI-Powered campaigns for political candidates, brands, and businesses across India, UAE and Canada. Human strategy. Machine speed. Real results.
        </motion.p>

        {/* CTA row */}
        <motion.div
          {...fadeUp(0.6)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link
            href="/contact"
            className="bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-white font-heading font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 cursor-pointer shadow-lg shadow-[#06B6D4]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
          >
            Get a Free Audit
          </Link>
          <Link
            href="/case-studies"
            className="border border-white/30 hover:border-white text-white font-heading font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 cursor-pointer hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
          >
            See Our Work
          </Link>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          {...fadeUp(0.7)}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 mt-8 text-[#F8FAFC]/50 text-sm"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            No contracts
          </span>
          <span className="hidden sm:block mx-3 opacity-30">·</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            Free strategy audit
          </span>
          <span className="hidden sm:block mx-3 opacity-30">·</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            Results in 30 days
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>
    </section>
  )
}
