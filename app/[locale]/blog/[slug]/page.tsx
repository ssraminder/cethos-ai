export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/lib/types'

interface Props {
  params: { locale: string; slug: string }
}

export async function generateMetadata({ params: { slug, locale } }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: post } = await supabase
    .from('agp_blog_posts')
    .select('title, excerpt, featured_image_url')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return { title: 'Post Not Found | Ascelo AI' }

  return {
    title: `${post.title} | Ascelo AI`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.featured_image_url ? [post.featured_image_url] : [],
      locale,
    },
  }
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) { key++; continue }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="font-headline font-bold text-white text-xl mt-8 mb-3">
          {trimmed.slice(4)}
        </h3>
      )
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="font-headline font-bold text-white text-2xl mt-10 mb-4 pb-2 border-b border-primary/20">
          {trimmed.slice(3)}
        </h2>
      )
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="font-headline font-extrabold text-white text-4xl mt-6 mb-6">
          {trimmed.slice(2)}
        </h1>
      )
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <li key={key++} className="font-body text-on-surface-variant leading-relaxed ml-4 list-disc mb-1">
          {trimmed.slice(2)}
        </li>
      )
    } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      elements.push(
        <p key={key++} className="font-body font-semibold text-on-surface leading-relaxed mb-4">
          {trimmed.slice(2, -2)}
        </p>
      )
    } else {
      elements.push(
        <p key={key++} className="font-body text-on-surface-variant leading-relaxed mb-4 text-base">
          {trimmed}
        </p>
      )
    }
  }

  return elements
}

export default async function BlogPostPage({ params: { locale, slug } }: Props) {
  const supabase = createClient()
  const { data: post } = await supabase
    .from('agp_blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single<BlogPost>()

  if (!post) notFound()

  const backHref = locale === 'en' ? '/blog' : `/${locale}/blog`
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null
  const readTime = post.content ? estimateReadTime(post.content) : null

  return (
    <div className="bg-background min-h-screen">

      {/* Hero */}
      <div className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,_#4cd7f6,_transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

          {/* Back link */}
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm font-headline font-medium transition-colors duration-200 mb-8 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-primary/15 text-primary text-xs font-headline font-semibold px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-headline font-bold text-white text-2xl sm:text-3xl md:text-4xl leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-on-surface-variant text-sm font-headline">
            {post.author_name && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author_name}
              </span>
            )}
            {publishedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {publishedDate}
              </span>
            )}
            {readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readTime} min read
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Featured image */}
      {post.featured_image_url && (
        <div className="relative w-full h-64 sm:h-80 md:h-96 bg-surface-container-low">
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/20" />
        </div>
      )}

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Excerpt lead */}
        {post.excerpt && (
          <p className="font-body text-on-surface-variant text-lg leading-relaxed mb-8 border-l-4 border-primary pl-5 italic">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="prose-container">
          {post.content
            ? renderContent(post.content)
            : <p className="font-body text-on-surface-variant/50 italic">Content coming soon.</p>
          }
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-surface-container-high rounded-2xl p-8 text-center border border-outline-variant/10">
          <p className="font-headline font-bold text-white text-xl mb-2">
            Ready to grow your business?
          </p>
          <p className="font-body text-on-surface-variant text-sm mb-6">
            Get a free strategy audit from the Ascelo AI team.
          </p>
          <Link
            href={locale === 'en' ? '/contact' : `/${locale}/contact`}
            className="inline-flex bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-3 rounded-lg font-headline font-semibold text-sm hover:opacity-90 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Get a Free Audit
          </Link>
        </div>

        {/* Back to blog */}
        <div className="mt-10 pt-8 border-t border-outline-variant/15">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-primary text-sm font-headline font-medium hover:gap-3 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </article>

    </div>
  )
}
