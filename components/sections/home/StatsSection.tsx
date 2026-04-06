'use client'

import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { stats, getLiveValue } from '@/lib/data/stats'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay } as Transition,
})

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export function StatsSection() {
  const t = useTranslations('sections')

  // Values derived from elapsed time since base_date — grow naturally over months
  const liveValues = stats.map(getLiveValue)

  return (
    <section className="relative bg-[#0A0F1E] w-full py-24 md:py-32 overflow-hidden">
      {/* Background: glowing orbs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#EC4899]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#06B6D4]/10 blur-[120px] pointer-events-none" />

      {/* Background: dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #F8FAFC 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Separator lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EC4899]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06B6D4]/30 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp(0)} className="mb-16 md:mb-20">
          <SectionHeader
            eyebrow={t('stats_eyebrow')}
            heading={t('stats_heading')}
            centered
            light
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="flex flex-col items-center justify-center text-center px-8 py-12 bg-[#0A0F1E] hover:bg-white/[0.03] transition-colors duration-300"
            >
              <div className="font-display text-6xl md:text-7xl lg:text-8xl text-white leading-none mb-3">
                <AnimatedCounter
                  value={liveValues[index]}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <div className="w-10 h-0.5 bg-gradient-to-r from-[#EC4899] to-[#06B6D4] mb-3" />
              <p className="font-heading text-[#F8FAFC]/50 text-xs uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
