'use client'

import Link from 'next/link'
import {
  Vote,
  Printer,
  Share2,
  TrendingUp,
  Sparkles,
  Search,
  MessageCircle,
  Palette,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Service } from '@/lib/types'

const iconMap: Record<string, LucideIcon> = {
  Vote,
  Printer,
  Share2,
  TrendingUp,
  Sparkles,
  Search,
  MessageCircle,
  Palette,
}

interface ServiceCardProps {
  service: Service | Omit<Service, 'id'>
  variant?: 'compact' | 'full'
}

export function ServiceCard({ service, variant = 'compact' }: ServiceCardProps) {
  const IconComponent = service.icon_name ? iconMap[service.icon_name] : null
  const slug = 'slug' in service ? service.slug : (service as Service).slug

  return (
    <Link
      href={`/services/${slug}`}
      className={cn(
        'group block rounded-2xl border border-[#EC4899]/10 bg-white p-6 transition-all duration-300 cursor-pointer',
        'hover:-translate-y-1 hover:border-[#EC4899]/40 hover:shadow-[0_8px_30px_rgba(236,72,153,0.15)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]'
      )}
    >
      {/* Icon */}
      {IconComponent && (
        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FDF2F8] text-[#EC4899] group-hover:bg-[#EC4899] group-hover:text-white transition-colors duration-300">
          <IconComponent className="w-6 h-6" />
        </div>
      )}

      {/* Title */}
      <h3 className="font-heading font-semibold text-[#0A0F1E] text-lg mb-2 group-hover:text-[#EC4899] transition-colors duration-300">
        {service.title}
      </h3>

      {/* Short desc */}
      {service.short_desc && (
        <p className="text-[#831843]/70 text-sm leading-relaxed">
          {service.short_desc}
        </p>
      )}

      {/* Full variant: long desc preview */}
      {variant === 'full' && service.long_desc && (
        <p className="mt-3 text-[#831843]/60 text-sm leading-relaxed line-clamp-3">
          {service.long_desc}
        </p>
      )}

      {/* Arrow indicator */}
      <div className="mt-4 flex items-center gap-1 text-[#EC4899] text-sm font-heading font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Learn more
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
