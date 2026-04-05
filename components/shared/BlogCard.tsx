'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { BlogPost } from '@/lib/types'

interface BlogCardProps {
  post: BlogPost
  locale: string
}

export function BlogCard({ post, locale }: BlogCardProps) {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className={cn(
        'group block rounded-2xl overflow-hidden border border-[#EC4899]/10 bg-white transition-all duration-300 cursor-pointer',
        'hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(236,72,153,0.15)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]'
      )}
    >
      {/* Featured image */}
      <div className="relative h-48 bg-gradient-to-br from-[#0A0F1E] to-[#1a1f35] overflow-hidden">
        {post.featured_image_url ? (
          <>
            <Image
              src={post.featured_image_url}
              alt={post.title}
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

        {/* Author / date overlay */}
        {publishedDate && (
          <div className="absolute bottom-0 left-0 right-0 px-5 py-3">
            <p className="text-white/60 text-xs font-heading font-medium uppercase tracking-wider">
              {publishedDate}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-[#0A0F1E] text-base leading-snug mb-2 group-hover:text-[#EC4899] transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="font-body text-sm text-[#0A0F1E]/60 leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block bg-[#FDF2F8] text-[#EC4899] text-xs font-heading font-medium px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Read more link */}
        <div className="flex items-center gap-1 text-[#EC4899] text-sm font-heading font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Read article
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
