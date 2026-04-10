'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { ArrowRight, ArrowUpRight, TrendingUp, Target, BarChart3, Users } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay } as Transition,
})

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const stats = [
  { value: '50+', label: 'Campaigns Delivered', color: 'text-primary' },
  { value: '5', label: 'Languages Supported', color: 'text-secondary' },
  { value: '10x', label: 'Average ROI', color: 'text-tertiary' },
  { value: '95%', label: 'Client Retention', color: 'text-primary' },
]

const caseStudies = [
  {
    tags: ['UAE', 'Real Estate'],
    client: 'Premium Property Developer, Dubai',
    title: 'Dubai Real Estate: 85 Qualified Leads Per Month',
    metricValue: '85',
    metricLabel: 'Qualified Leads/Month',
    metricColor: 'text-primary',
    badge: '60% Cost Per Lead Reduction',
    badgeBg: 'bg-primary/10 text-primary',
    href: '/case-studies/dubai-real-estate-leads',
    icon: Target,
  },
  {
    tags: ['Canada', 'Immigration'],
    client: 'Immigration Consultancy, Toronto',
    title: 'Canada Immigration Consultancy: 40% Lower CPL',
    metricValue: '40%',
    metricLabel: 'Cost Per Lead Reduction',
    metricColor: 'text-secondary',
    badge: '3x Conversion Rate Increase',
    badgeBg: 'bg-secondary/10 text-secondary',
    href: '/case-studies/canada-immigration-cpl-reduction',
    icon: TrendingUp,
  },
  {
    tags: ['India', 'Retail'],
    client: 'Leading Retail Brand, Chandigarh',
    title: 'Chandigarh SME: 220% Organic Traffic Growth',
    metricValue: '220%',
    metricLabel: 'Organic Traffic Growth',
    metricColor: 'text-tertiary',
    badge: '34 Keywords Ranking #1',
    badgeBg: 'bg-tertiary/10 text-tertiary',
    href: '/case-studies/chandigarh-sme-organic-growth',
    icon: BarChart3,
  },
  {
    tags: ['India', 'Political'],
    client: 'Constituency Campaign, North India',
    title: 'Political Campaign: 3x Voter Reach in 6 Weeks',
    metricValue: '3x',
    metricLabel: 'Voter Reach Increase',
    metricColor: 'text-primary',
    badge: '45K WhatsApp Contacts Reached',
    badgeBg: 'bg-primary/10 text-primary',
    href: '/case-studies/punjab-mla-campaign-voter-reach',
    icon: Users,
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

interface CaseStudiesContentProps {
  prefix: string
}

export function CaseStudiesContent({ prefix }: CaseStudiesContentProps) {
  return (
    <main className="min-h-screen bg-background">
      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 30% 40%, rgba(76,215,246,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow */}
          <motion.div {...fadeUp(0.1)} className="mb-6">
            <span className="inline-block text-xs font-headline uppercase tracking-widest text-primary-container border border-primary-container/20 px-4 py-1.5 rounded-full">
              Proven Results
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.2)}
            className="font-headline font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-on-surface"
          >
            Case{' '}
            <span className="gradient-text">Studies</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...fadeUp(0.3)}
            className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mt-6 leading-relaxed"
          >
            Numbers don&apos;t lie. Here&apos;s what we&apos;ve delivered for our clients across multiple markets.
          </motion.p>

          {/* CTA */}
          <motion.div {...fadeUp(0.4)} className="mt-8">
            <Link
              href={`${prefix}/contact`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-semibold px-8 py-4 rounded-xl text-base md:text-lg transition-all duration-300 cursor-pointer shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Start Your Success Story
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  STATS BAR                                                    */}
      {/* ============================================================ */}
      <section className="bg-surface-container-low border-y border-outline-variant/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-outline-variant/50"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="flex flex-col items-center justify-center text-center py-10 px-4"
              >
                <span className={`font-headline font-extrabold text-4xl md:text-5xl ${stat.color} leading-none`}>
                  {stat.value}
                </span>
                <span className="font-body text-on-surface-variant text-sm mt-2">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CASE STUDY GRID                                              */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-14">
            <motion.p
              {...fadeUp(0)}
              className="text-xs font-headline uppercase tracking-widest text-primary mb-4"
            >
              Portfolio
            </motion.p>
            <motion.h2
              {...fadeUp(0.1)}
              className="font-headline font-extrabold text-3xl md:text-4xl lg:text-5xl text-on-surface"
            >
              Client Success Stories
            </motion.h2>
            <motion.p
              {...fadeUp(0.2)}
              className="font-body text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed"
            >
              Each case study represents a real challenge solved, a real business grown, and a real relationship built.
            </motion.p>
          </div>

          {/* 2x2 Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {caseStudies.map((cs) => (
              <motion.div
                key={cs.href}
                variants={itemVariants}
                className="group flex flex-col rounded-2xl border border-outline-variant bg-surface-container-high transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(76,215,246,0.08)]"
              >
                {/* Card content */}
                <div className="flex flex-col flex-1 p-6 md:p-8">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cs.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block text-xs font-headline font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Client */}
                  <p className="font-body text-on-surface-variant text-sm mb-2">
                    {cs.client}
                  </p>

                  {/* Title */}
                  <h3 className="font-headline font-bold text-on-surface text-lg md:text-xl leading-snug mb-6">
                    {cs.title}
                  </h3>

                  {/* Spacer to push metric to bottom */}
                  <div className="flex-1" />

                  {/* Hero metric */}
                  <div className="mb-4">
                    <span className={`font-headline font-extrabold text-4xl md:text-5xl ${cs.metricColor} leading-none`}>
                      {cs.metricValue}
                    </span>
                    <p className="font-body text-on-surface-variant text-sm mt-1">
                      {cs.metricLabel}
                    </p>
                  </div>

                  {/* Badge + arrow row */}
                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/50">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-headline font-semibold px-3 py-1.5 rounded-full ${cs.badgeBg}`}>
                      <TrendingUp className="w-3.5 h-3.5" />
                      {cs.badge}
                    </span>

                    <Link
                      href={`${prefix}${cs.href}`}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-outline-variant text-on-surface-variant transition-all duration-300 cursor-pointer hover:bg-primary hover:text-on-primary hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Read case study: ${cs.title}`}
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA SECTION                                                  */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-surface-container-low">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp(0)}
            className="relative rounded-3xl border border-outline-variant overflow-hidden"
          >
            {/* Gradient background glow */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(135deg, rgba(76,215,246,0.08) 0%, rgba(0,225,171,0.06) 50%, rgba(6,182,212,0.08) 100%)',
              }}
            />

            <div className="relative z-10 px-8 py-14 md:px-14 md:py-20 text-center bg-surface-container-high/80 backdrop-blur-sm rounded-3xl">
              <motion.h2
                {...fadeUp(0.1)}
                className="font-headline font-extrabold text-3xl md:text-4xl lg:text-5xl text-on-surface leading-tight"
              >
                Ready to Grow Your Business?
              </motion.h2>

              <motion.p
                {...fadeUp(0.2)}
                className="font-body text-on-surface-variant text-base md:text-lg max-w-xl mx-auto mt-4 leading-relaxed"
              >
                Join the ranks of high-growth companies leveraging AI for their market dominance.
              </motion.p>

              <motion.div {...fadeUp(0.3)} className="mt-8">
                <Link
                  href={`${prefix}/contact`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-semibold px-8 py-4 rounded-xl text-base md:text-lg transition-all duration-300 cursor-pointer shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Get a Free Audit
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.p
                {...fadeUp(0.4)}
                className="font-body text-on-surface-variant/60 text-sm mt-5"
              >
                No commitment, just clarity.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
