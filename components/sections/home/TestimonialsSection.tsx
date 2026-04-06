'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { TestimonialCard } from '@/components/shared/TestimonialCard'
import { testimonials as fallbackTestimonials } from '@/lib/data/testimonials'
import type { Testimonial } from '@/lib/types'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

interface TestimonialsSectionProps {
  testimonials?: (Testimonial | Omit<Testimonial, 'id'>)[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const t = useTranslations('sections')
  const items = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials
  const [activeIndex, setActiveIndex] = useState(0)

  const prev = () => setActiveIndex((i) => (i - 1 + items.length) % items.length)
  const next = () => setActiveIndex((i) => (i + 1) % items.length)

  return (
    <SectionWrapper light>
      <SectionHeader
        eyebrow={t('testimonials_eyebrow')}
        heading={t('testimonials_heading')}
        subheading={t('testimonials_sub')}
        centered
      />

      {/* Desktop: full grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {items.map((t, i) => (
          <motion.div key={i} variants={itemVariants}>
            <div className="rounded-2xl bg-[#0A0F1E] overflow-hidden h-full">
              <TestimonialCard testimonial={t} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile: single card carousel */}
      <div className="md:hidden">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-2xl bg-[#0A0F1E] overflow-hidden"
        >
          <TestimonialCard testimonial={items[activeIndex]} />
        </motion.div>

        {/* Prev/Next controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="w-10 h-10 rounded-full bg-[#0A0F1E] flex items-center justify-center text-white hover:bg-[#EC4899] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] ${
                  i === activeIndex ? 'bg-[#EC4899] w-5' : 'bg-[#0A0F1E]/30'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next testimonial"
            className="w-10 h-10 rounded-full bg-[#0A0F1E] flex items-center justify-center text-white hover:bg-[#EC4899] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </SectionWrapper>
  )
}
