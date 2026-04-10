'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { CaseStudy } from '@/lib/types'

const GRADIENTS = [
  'from-primary/60 via-primary-container/40 to-tertiary/30',
  'from-tertiary/60 via-primary/40 to-secondary/30',
  'from-secondary/60 via-primary-container/40 to-primary/30',
]

interface CaseStudyCardProps {
  caseStudy: CaseStudy | (Omit<CaseStudy, 'id'> & { metrics?: Array<{ label: string; value: string; prefix: string; suffix: string; sort_order: number }> })
  locale?: string
  index?: number
}

export function CaseStudyCard({ caseStudy, locale = 'en', index = 0 }: CaseStudyCardProps) {
  const prefix = locale === 'en' ? '' : `/${locale}`
  const displayMetrics = caseStudy.metrics?.slice(0, 2) ?? []
  const heroMetric = displayMetrics[0]
  const gradient = GRADIENTS[index % GRADIENTS.length]

  return (
    <Link
      href={`${prefix}/case-studies/${caseStudy.slug}`}
      className={cn(
        'group block rounded-2xl overflow-hidden border border-outline-variant/10 bg-surface-container-high transition-all duration-300 cursor-pointer',
        'hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(76,215,246,0.15)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
      )}
    >
      {/* Gradient header with primary metric */}
      <div className={cn('relative h-44 bg-gradient-to-br flex flex-col items-center justify-center text-center px-6', gradient)}>
        <p className="text-white/60 text-xs font-headline font-semibold uppercase tracking-widest mb-3">
          {caseStudy.client_name}
        </p>

        {heroMetric ? (
          <>
            <p className="font-headline font-extrabold text-6xl text-white leading-none">
              {heroMetric.prefix}{heroMetric.value}{heroMetric.suffix}
            </p>
            <p className="text-white/80 text-sm font-headline mt-2">
              {heroMetric.label}
            </p>
          </>
        ) : (
          <p className="font-headline font-extrabold text-4xl text-white/90 leading-tight">
            {caseStudy.title}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-headline font-semibold text-on-surface text-base leading-snug mb-4 group-hover:text-primary transition-colors duration-300">
          {caseStudy.title}
        </h3>

        {displayMetrics.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {displayMetrics.slice(1).map((metric, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-headline font-semibold px-3 py-1.5 rounded-full"
              >
                <span className="text-base font-bold">
                  {metric.prefix}{metric.value}{metric.suffix}
                </span>
                <span className="text-on-surface-variant">{metric.label}</span>
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-1 text-primary text-sm font-headline font-medium group-hover:gap-2 transition-all duration-300">
          View case study
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
