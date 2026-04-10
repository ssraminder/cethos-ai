'use client'

import Link from 'next/link'
import {
  Phone,
  Monitor,
  Target,
  Settings,
  TrendingUp,
  Star,
  FileText,
  Share2,
  MessageSquare,
  Users,
  Globe,
  Palette,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Service } from '@/lib/types'

const iconMap: Record<string, LucideIcon> = {
  Phone,
  Monitor,
  Target,
  Settings,
  TrendingUp,
  Star,
  FileText,
  Share2,
  MessageSquare,
  Users,
  Globe,
  Palette,
}

interface ServiceCardProps {
  service: Service | Omit<Service, 'id'>
  variant?: 'compact' | 'full'
  locale?: string
  graphic?: unknown
}

export function ServiceCard({ service, variant = 'compact', locale = 'en' }: ServiceCardProps) {
  const IconComponent = service.icon_name ? iconMap[service.icon_name] : null
  const slug = 'slug' in service ? service.slug : (service as Service).slug
  const prefix = locale === 'en' ? '' : `/${locale}`

  return (
    <Link
      href={`${prefix}/services/${slug}`}
      className={cn(
        'group block rounded-2xl border border-outline-variant/10 bg-surface-container-low p-6 transition-all duration-300 cursor-pointer',
        'hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(76,215,246,0.15)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
      )}
    >
      {IconComponent && (
        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">
          <IconComponent className="w-6 h-6" />
        </div>
      )}

      <h3 className="font-headline font-semibold text-on-surface text-lg mb-2 group-hover:text-primary transition-colors duration-300">
        {service.title}
      </h3>

      {service.short_desc && (
        <p className="text-on-surface-variant text-sm leading-relaxed">
          {service.short_desc}
        </p>
      )}

      {variant === 'full' && service.long_desc && (
        <p className="mt-3 text-on-surface-variant/60 text-sm leading-relaxed line-clamp-3">
          {service.long_desc}
        </p>
      )}

      <div className="mt-4 flex items-center gap-1 text-primary text-sm font-headline font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Learn more
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
