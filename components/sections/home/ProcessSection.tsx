'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { processSteps } from '@/lib/data/process-steps'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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

export function ProcessSection() {
  const t = useTranslations('sections')

  return (
    <SectionWrapper className="bg-[#0A0F1E]">
      <SectionHeader
        eyebrow={t('process_eyebrow')}
        heading={t('process_heading')}
        subheading={t('process_sub')}
        centered
        light
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative grid grid-cols-1 md:grid-cols-4 gap-0 mt-16"
      >
        {/* Connector line — desktop only */}
        <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#EC4899]/30 to-transparent" />

        {processSteps.map((step, index) => (
          <motion.div
            key={step.title}
            variants={itemVariants}
            className="flex flex-col items-center text-center px-6 pb-8 md:pb-0"
          >
            {/* Step number circle */}
            <div className="relative z-10 w-16 h-16 rounded-full border-2 border-[#EC4899]/50 bg-[#0A0F1E] flex items-center justify-center mb-6">
              <span className="font-display text-2xl text-[#EC4899] leading-none">
                {index + 1}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-heading font-bold text-base text-white mb-2">
              {step.title}
            </h3>

            {/* Description */}
            <p className="font-body text-sm text-white/50 leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  )
}
