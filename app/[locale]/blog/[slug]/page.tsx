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

  if (!post) return { title: 'Post Not Found | Cethos Media' }

  return {
    title: `${post.title} | Cethos Media`,
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

// Render plain markdown-like content as readable HTML paragraphs
function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) { key++; continue }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="font-heading font-bold text-[#0A0F1E] text-xl mt-8 mb-3">
          {trimmed.slice(4)}
        </h3>
      )
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="font-heading font-bold text-[#0A0F1E] text-2xl mt-10 mb-4 pb-2 border-b border-[#EC4899]/20">
          {trimmed.slice(3)}
        </h2>
      )
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="font-display text-[#0A0F1E] text-4xl mt-6 mb-6">
          {trimmed.slice(2)}
        </h1>
      )
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <li key={key++} className="font-body text-[#0A0F1E]/80 leading-relaxed ml-4 list-disc mb-1">
          {trimmed.slice(2)}
        </li>
      )
    } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      elements.push(
        <p key={key++} className="font-body font-semibold text-[#0A0F1E] leading-relaxed mb-4">
          {trimmed.slice(2, -2)}
        </p>
      )
    } else {
      elements.push(
        <p key={key++} className="font-body text-[#0A0F1E]/80 leading-relaxed mb-4 text-base">
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
    <main className="pt-20 md:pt-24 bg-white min-h-screen">

      {/* Hero */}
      <div className="bg-[#0A0F1E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

          {/* Back link */}
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-heading font-medium transition-colors duration-200 mb-8 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
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
                  className="inline-block bg-[#EC4899]/15 text-[#EC4899] text-xs font-heading font-semibold px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-heading font-bold text-white text-2xl sm:text-3xl md:text-4xl leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-white/50 text-sm font-heading">
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
        <div className="relative w-full h-64 sm:h-80 md:h-96 bg-[#0A0F1E]">
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1E]/30 via-transparent to-white/20" />
        </div>
      )}

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Excerpt lead */}
        {post.excerpt && (
          <p className="font-body text-[#0A0F1E]/70 text-lg leading-relaxed mb-8 border-l-4 border-[#EC4899] pl-5 italic">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="prose-container">
          {post.content
            ? renderContent(post.content)
            : <p className="font-body text-[#0A0F1E]/50 italic">Content coming soon.</p>
          }
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#0A0F1E] to-[#1a1f35] rounded-2xl p-8 text-center">
          <p className="font-heading font-bold text-white text-xl mb-2">
            Ready to grow your business?
          </p>
          <p className="font-body text-white/60 text-sm mb-6">
            Get a free strategy audit from the Cethos Media team.
          </p>
          <Link
            href={locale === 'en' ? '/contact' : `/${locale}/contact`}
            className="inline-flex bg-[#06B6D4] text-white px-8 py-3 rounded-lg font-heading font-semibold text-sm hover:bg-[#06B6D4]/90 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
          >
            Get a Free Audit
          </Link>
        </div>

        {/* Back to blog */}
        <div className="mt-10 pt-8 border-t border-[#EC4899]/10">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-[#EC4899] text-sm font-heading font-medium hover:gap-3 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </article>

    </main>
  )
}
