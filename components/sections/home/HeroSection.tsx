'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { CheckCircle2, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay } as Transition,
})

export function HeroSection() {
  const t = useTranslations('hero')

  const markets = [t('badge_india'), t('badge_uae'), t('badge_canada')]
  const trustItems = [t('trust1'), t('trust2'), t('trust3')]

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0d0d1a] to-[#0A0F1E] flex flex-col items-center justify-center text-center px-4 pt-24">

      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Market badges */}
        <motion.div {...fadeUp(0.1)} className="flex gap-3 justify-center flex-wrap mb-8">
          {markets.map((market) => (
            <span
              key={market}
              className="text-xs font-heading uppercase tracking-widest text-[#F8FAFC]/50 border border-[#F8FAFC]/10 px-3 py-1 rounded-full"
            >
              {market}
            </span>
          ))}
        </motion.div>

        {/* Headline */}
        <div className="mb-6">
          <motion.div {...fadeUp(0.2)}>
            <span className="block font-display text-6xl md:text-7xl lg:text-8xl leading-none tracking-wide text-white">
              {t('headline1')}
            </span>
          </motion.div>
          <motion.div {...fadeUp(0.3)}>
            <span className="block font-display text-6xl md:text-7xl lg:text-8xl leading-none tracking-wide bg-gradient-to-r from-[#EC4899] to-[#06B6D4] bg-clip-text text-transparent">
              {t('headline2')}
            </span>
          </motion.div>
        </div>

        {/* Sub-headline */}
        <motion.p
          {...fadeUp(0.4)}
          className="font-body text-lg md:text-xl text-[#F8FAFC]/60 max-w-2xl mx-auto mt-6 leading-relaxed"
        >
          {t('subheadline')}
        </motion.p>

        {/* CTA row */}
        <motion.div
          {...fadeUp(0.5)}
          className="flex gap-4 justify-center flex-wrap mt-10"
        >
          <Link
            href="/contact"
            className="bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-white font-heading font-semibold px-8 py-4 rounded-xl text-base md:text-lg transition-all duration-300 cursor-pointer shadow-lg shadow-[#06B6D4]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
          >
            {t('cta_primary')}
          </Link>
          <Link
            href="/case-studies"
            className="border border-white/20 hover:border-white/50 text-[#F8FAFC] font-heading font-semibold px-8 py-4 rounded-xl text-base md:text-lg transition-all duration-300 cursor-pointer hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
          >
            {t('cta_secondary')}
          </Link>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          {...fadeUp(0.6)}
          className="flex gap-6 justify-center flex-wrap mt-8"
        >
          {trustItems.map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-[#F8FAFC]/50 text-sm font-body">
              <CheckCircle2 className="w-4 h-4 text-[#06B6D4]" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll chevron */}
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
