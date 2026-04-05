'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  dark?: boolean
  light?: boolean
  id?: string
}

export function SectionWrapper({ children, className, dark, light, id }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'w-full',
        dark && 'bg-[#0A0F1E] text-[#F8FAFC]',
        light && 'bg-[#FDF2F8]',
        !dark && !light && 'bg-white',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {children}
      </div>
    </motion.section>
  )
}
