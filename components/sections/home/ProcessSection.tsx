'use client'

import { motion } from 'framer-motion'
import { Compass, Sparkles, Zap, BarChart2, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { processSteps } from '@/lib/data/process-steps'

const iconMap: Record<string, LucideIcon> = {
  Compass,
  Sparkles,
  Zap,
  BarChart2,
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export function ProcessSection() {
  const t = useTranslations('sections')

  return (
    <SectionWrapper>
      <SectionHeader
        eyebrow={t('process_eyebrow')}
        heading={t('process_heading')}
        subheading={t('process_sub')}
        centered
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-4 gap-8"
      >
        {processSteps.map((step, index) => {
          const IconComponent = iconMap[step.icon_name ?? ''] ?? null
          return (
            <motion.div key={step.title} variants={itemVariants} className="relative">
              {/* Step number (decorative) */}
              <div className="absolute -top-4 -left-2 font-display text-6xl text-[#EC4899]/20 select-none pointer-events-none leading-none">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Icon */}
              {IconComponent && (
                <div className="relative z-10 w-14 h-14 rounded-full bg-[#EC4899]/10 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-[#EC4899]" />
                </div>
              )}

              {/* Title */}
              <h3 className="font-heading font-bold text-lg text-[#0A0F1E] mt-4">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-body text-sm text-[#831843]/70 mt-2 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </SectionWrapper>
  )
}
