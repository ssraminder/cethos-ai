'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  eyebrow?: string
  heading: string
  subheading?: string
  centered?: boolean
  light?: boolean
}

export function SectionHeader({ eyebrow, heading, subheading, centered, light }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 md:mb-16', centered && 'text-center')}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-[#EC4899] font-heading font-semibold text-sm uppercase tracking-widest mb-3"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={cn(
          'font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-tight',
          light ? 'text-[#F8FAFC]' : 'text-[#0A0F1E]'
        )}
      >
        {heading}
      </motion.h2>
      {subheading && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            'mt-4 text-base md:text-lg max-w-2xl leading-relaxed',
            centered && 'mx-auto',
            light ? 'text-[#F8FAFC]/70' : 'text-[#831843]/70'
          )}
        >
          {subheading}
        </motion.p>
      )}
    </div>
  )
}
