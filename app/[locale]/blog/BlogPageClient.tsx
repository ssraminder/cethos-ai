'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Tag, ArrowRight, Sparkles, BarChart3, BookOpen, Briefcase } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], delay: i * 0.1 },
  }),
}

const cardGradients = [
  'from-primary/20 via-tertiary/10 to-primary/5',
  'from-secondary/20 via-primary/10 to-secondary/5',
  'from-tertiary/20 via-secondary/10 to-tertiary/5',
  'from-primary/15 via-secondary/10 to-tertiary/5',
]

const cardIcons = [Sparkles, BarChart3, BookOpen, Briefcase]

interface BlogPostData {
  date: string
  category: string
  title: string
  excerpt: string
  tags: string[]
  link: string
}

const posts: BlogPostData[] = [
  {
    date: '5 Apr 2026',
    category: 'Strategy',
    title: 'Navigating Multilingual Marketing: How AI and Local Expertise Drive ROI in India, UAE, and Canada',
    excerpt: 'Discover how AI-powered multilingual marketing with local expertise drives ROI across India, UAE & Canada. Strategic insights for SMEs & diaspora brands.',
    tags: ['MULTILINGUAL MARKETING', 'AI-POWERED TOOLS', 'LOCAL EXPERTISE'],
    link: '/blog/navigating-multilingual-marketing-how-ai-and-local-expertise-en-1775364664468',
  },
  {
    date: '5 Apr 2026',
    category: 'Intelligence',
    title: 'How AI-Powered Performance Marketing Is Changing the Game for SMEs in India, UAE, and Canada',
    excerpt: 'Discover how AI-powered performance marketing is revolutionizing SME success in India, UAE, and Canada with actionable insights and local examples.',
    tags: ['AI PERFORMANCE MARKETING', 'SME DIGITAL MARKETING', 'META ADS INDIA'],
    link: '/blog/how-ai-powered-performance-marketing-is-changing-the-game-fo-en-1775360237860',
  },
  {
    date: '5 Apr 2026',
    category: 'Mastery',
    title: 'Mastering Multilingual Marketing: How SMEs in India, UAE, and Canada Can Leverage AI for Local Success',
    excerpt: 'Discover how SMEs in India, UAE, and Canada can master multilingual marketing using AI, enhancing engagement and local success.',
    tags: ['MULTILINGUAL MARKETING', 'AI-POWERED TOOLS', 'SMES IN INDIA'],
    link: '/blog/mastering-multilingual-marketing-how-smes-in-india-uae-and-c-en-1775359628191',
  },
  {
    date: '5 Apr 2026',
    category: 'Business',
    title: 'Navigating Digital Marketing for Diaspora Businesses: Leveraging Multilingual Campaigns in India, UAE, and Canada',
    excerpt: 'Discover how diaspora businesses can leverage multilingual campaigns to enhance local engagement with Ascelo AI\'s AI tools.',
    tags: ['DIASPORA MARKETING', 'MULTILINGUAL CAMPAIGNS', 'AI MARKETING TOOLS'],
    link: '/blog/navigating-digital-marketing-for-diaspora-businesses-leverag-en-1775359483852',
  },
]

export function BlogPageClient() {
  return (
    <main className="min-h-screen bg-background pt-24 md:pt-32 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Neural gradient bg effect */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-10 right-1/4 w-80 h-80 bg-tertiary/5 rounded-full blur-3xl" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-primary/8 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 md:py-16">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className="inline-block text-xs font-headline font-semibold uppercase tracking-[0.2em] text-primary border border-primary/20 bg-primary/5 px-4 py-1.5 rounded-full mb-6">
              Blog
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="font-headline font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-on-surface tracking-tight"
          >
            Insights &{' '}
            <span className="gradient-text">Ideas</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="mt-5 text-on-surface-variant text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Strategy, research, and marketing intelligence from the Ascelo AI team — for ambitious businesses worldwide.
          </motion.p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post, i) => {
            const IconComponent = cardIcons[i]
            const isLastRow = i === 3
            return (
              <motion.div
                key={post.link}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className={`group flex ${isLastRow ? 'lg:col-start-2' : ''}`}
              >
                <Link
                  href={post.link}
                  className="flex flex-col w-full rounded-xl border border-outline-variant/10 bg-[rgba(22,27,43,0.6)] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(76,215,246,0.08)] hover:border-primary/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {/* Gradient header area (no image) */}
                  <div
                    className={`relative h-40 sm:h-44 bg-gradient-to-br ${cardGradients[i]} flex items-center justify-center overflow-hidden`}
                  >
                    {/* Abstract decorative shapes */}
                    <div className="absolute inset-0" aria-hidden="true">
                      <div className="absolute top-4 right-4 w-20 h-20 border border-primary/10 rounded-full" />
                      <div className="absolute bottom-6 left-6 w-14 h-14 border border-tertiary/10 rounded-lg rotate-12" />
                      <div className="absolute top-1/2 left-1/3 w-32 h-[1px] bg-gradient-to-r from-transparent via-primary/15 to-transparent -rotate-12" />
                    </div>
                    <IconComponent className="w-10 h-10 text-primary/40 group-hover:text-primary/60 transition-colors duration-300 relative z-10" />
                  </div>

                  {/* Card content */}
                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    {/* Category + Date row */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-headline font-semibold uppercase tracking-wider text-tertiary">
                        {post.category}
                      </span>
                      <span className="text-on-surface-variant/30">|</span>
                      <span className="flex items-center gap-1.5 text-xs text-on-surface-variant/60">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-headline font-bold text-base sm:text-lg text-on-surface leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-3">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="mt-2.5 text-sm text-on-surface-variant/70 leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-on-surface-variant/60 bg-surface-container-lowest border border-outline-variant/15 px-2.5 py-1 rounded-full"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More */}
                    <div className="mt-4 pt-3 border-t border-outline-variant/10 flex items-center gap-2 text-sm font-headline font-semibold text-primary/70 group-hover:text-primary transition-colors duration-300">
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
