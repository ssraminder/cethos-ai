'use client'

import { Star } from 'lucide-react'
import type { Testimonial } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TestimonialCardProps {
  testimonial: Testimonial | Omit<Testimonial, 'id'>
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="rounded-2xl bg-surface-container-high border border-outline-variant/10 p-6 flex flex-col gap-4 h-full">
      {/* Stars */}
      <div className="flex items-center gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-4 h-4',
              i < testimonial.rating
                ? 'text-secondary fill-secondary'
                : 'text-white/20 fill-transparent'
            )}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="flex-1 text-on-surface/80 text-sm leading-relaxed italic">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-outline-variant/15">
        <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
          {testimonial.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={testimonial.photo_url}
              alt={testimonial.author_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary font-headline font-bold text-sm">
              {testimonial.author_name.charAt(0)}
            </span>
          )}
        </div>

        <div>
          <p className="font-headline font-semibold text-white text-sm">
            {testimonial.author_name}
          </p>
          <p className="text-on-surface-variant text-xs">
            {[testimonial.author_role, testimonial.company].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>
    </div>
  )
}
