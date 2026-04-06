'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { CaseStudy } from '@/lib/types'
import type { SiteGraphic } from '@/lib/graphics'

// One gradient per card position — cycles if more than 3
const GRADIENTS = [
  'from-[#EC4899] via-[#A855F7] to-[#06B6D4]',
  'from-[#06B6D4] via-[#3B82F6] to-[#8B5CF6]',
  'from-[#F97316] via-[#EC4899] to-[#A855F7]',
]

interface CaseStudyCardProps {
  caseStudy: CaseStudy | (Omit<CaseStudy, 'id'> & { metrics?: Array<{ label: string; value: string; prefix: string; suffix: string; sort_order: number }> })
  locale?: string
  graphic?: SiteGraphic | null
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
        'group block rounded-2xl overflow-hidden border border-[#EC4899]/10 bg-white transition-all duration-300 cursor-pointer',
        'hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(236,72,153,0.15)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]'
      )}
    >
      {/* Gradient header with primary metric as hero */}
      <div className={cn('relative h-44 bg-gradient-to-br flex flex-col items-center justify-center text-center px-6', gradient)}>
        {/* Industry label */}
        <p className="text-white/60 text-xs font-heading font-semibold uppercase tracking-widest mb-3">
          {caseStudy.client_name}
        </p>

        {heroMetric ? (
          <>
            <p className="font-display text-6xl text-white leading-none">
              {heroMetric.prefix}{heroMetric.value}{heroMetric.suffix}
            </p>
            <p className="text-white/80 text-sm font-heading mt-2">
              {heroMetric.label}
            </p>
          </>
        ) : (
          <p className="font-display text-4xl text-white/90 leading-tight">
            {caseStudy.title}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-[#0A0F1E] text-base leading-snug mb-4 group-hover:text-[#EC4899] transition-colors duration-300">
          {caseStudy.title}
        </h3>

        {/* Remaining metrics pills */}
        {displayMetrics.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {displayMetrics.slice(1).map((metric, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-[#FDF2F8] text-[#EC4899] text-xs font-heading font-semibold px-3 py-1.5 rounded-full"
              >
                <span className="text-base font-bold">
                  {metric.prefix}{metric.value}{metric.suffix}
                </span>
                <span className="text-[#831843]/70">{metric.label}</span>
              </span>
            ))}
          </div>
        )}

        {/* View case study link */}
        <div className="mt-4 flex items-center gap-1 text-[#EC4899] text-sm font-heading font-medium group-hover:gap-2 transition-all duration-300">
          View case study
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
