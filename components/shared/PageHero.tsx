'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PageHeroProps {
  eyebrow?: string
  heading: string
  subheading?: string
  ctaLabel?: string
  ctaHref?: string
  className?: string
  backgroundUrl?: string
  backgroundAlt?: string
}

export function PageHero({ eyebrow, heading, subheading, ctaLabel, ctaHref, className, backgroundUrl }: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative bg-background min-h-[40vh] flex items-center overflow-hidden',
        className
      )}
    >
      {backgroundUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url('${backgroundUrl}')` }}
          aria-hidden="true"
        />
      )}
      {/* Gradient decoration */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #4cd7f6 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 w-full">
        <div className="max-w-3xl">
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-primary font-headline font-semibold text-sm uppercase tracking-widest mb-4"
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-headline font-extrabold text-5xl md:text-7xl text-white leading-[0.95] tracking-tighter"
          >
            {heading}
          </motion.h1>

          {subheading && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-on-surface-variant font-body text-base md:text-lg leading-relaxed max-w-2xl"
            >
              {subheading}
            </motion.p>
          )}

          {ctaLabel && ctaHref && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <Link
                href={ctaHref}
                className="inline-flex bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-lg font-headline font-semibold text-base hover:opacity-90 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {ctaLabel}
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
