'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { CaseStudy } from '@/lib/types'

interface CaseStudyCardProps {
  caseStudy: CaseStudy | (Omit<CaseStudy, 'id'> & { metrics?: Array<{ label: string; value: string; prefix: string; suffix: string; sort_order: number }> })
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const displayMetrics = caseStudy.metrics?.slice(0, 2) ?? []

  return (
    <Link
      href={`/case-studies/${caseStudy.slug}`}
      className={cn(
        'group block rounded-2xl overflow-hidden border border-[#EC4899]/10 bg-white transition-all duration-300 cursor-pointer',
        'hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(236,72,153,0.15)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]'
      )}
    >
      {/* Image area */}
      <div className="relative h-48 bg-gradient-to-br from-[#0A0F1E] to-[#1a1f35] overflow-hidden">
        {caseStudy.featured_image_url ? (
          <>
            <Image
              src={caseStudy.featured_image_url}
              alt={caseStudy.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/80 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#EC4899]/10 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#EC4899]/20" />
            </div>
          </div>
        )}

        {/* Client name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-3">
          <p className="text-white/60 text-xs font-heading font-medium uppercase tracking-wider">
            {caseStudy.client_name}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-[#0A0F1E] text-base leading-snug mb-4 group-hover:text-[#EC4899] transition-colors duration-300">
          {caseStudy.title}
        </h3>

        {/* Metrics pills */}
        {displayMetrics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {displayMetrics.map((metric, index) => (
              <span
                key={index}
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
        <div className="mt-4 flex items-center gap-1 text-[#EC4899] text-sm font-heading font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View case study
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
