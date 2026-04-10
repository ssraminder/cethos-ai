'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import {
  Brain,
  Globe,
  Zap,
  ShieldCheck,
  Languages,
  Handshake,
  ArrowRight,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: {
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94],
    delay,
  } as Transition,
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
    transition: {
      duration: 0.55,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const missionCards = [
  {
    icon: Brain,
    title: 'AI-Native Approach',
    body: "We don\u2019t bolt AI on as an afterthought. Our workflows are AI-first \u2014 from research to creative production to campaign optimisation \u2014 with human strategy guiding every decision.",
  },
  {
    icon: Globe,
    title: 'Global Reach',
    body: 'Based in Calgary, we serve ambitious businesses worldwide. One agency, multilingual capabilities, consistent results across every market.',
  },
]

const values = [
  {
    icon: Zap,
    title: 'AI-Powered Speed',
    body: 'We use AI to generate, test, and iterate faster than any traditional agency. But AI only handles the grunt work \u2014 strategy and judgment remain human.',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'hover:border-primary/60',
  },
  {
    icon: ShieldCheck,
    title: 'Results Guaranteed',
    body: "We set clear, measurable KPIs before every engagement. If we don\u2019t hit them, we work for free until we do.",
    color: 'text-tertiary',
    bg: 'bg-tertiary/10',
    border: 'hover:border-tertiary/60',
  },
  {
    icon: Languages,
    title: 'Multilingual by Nature',
    body: 'Not translated \u2014 created natively. Our team produces campaigns in English, Arabic, French, Hindi and Punjabi with authentic local voice.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    border: 'hover:border-secondary/60',
  },
  {
    icon: Handshake,
    title: 'Long-Term Partnerships',
    body: "We don\u2019t do one-time projects. We build long-term growth relationships \u2014 with transparent reporting and regular strategy reviews.",
    color: 'text-primary-container',
    bg: 'bg-primary-container/10',
    border: 'hover:border-primary-container/60',
  },
]

const team = [
  {
    initial: 'R',
    color: 'border-primary text-primary',
    bgGlow: 'bg-primary/10',
    name: 'Rajan Mehta',
    role: 'Founder & Strategy Director',
    bio: '15 years in political and brand marketing across India and the Gulf. Built campaigns for 3 winning MLA candidates.',
  },
  {
    initial: 'P',
    color: 'border-secondary text-secondary',
    bgGlow: 'bg-secondary/10',
    name: 'Priya Sidhu',
    role: 'Head of Performance Marketing',
    bio: 'Google and Meta certified. Managed $50M+ in ad spend across global markets.',
  },
  {
    initial: 'A',
    color: 'border-tertiary text-tertiary',
    bgGlow: 'bg-tertiary/10',
    name: 'Arjun Bhatia',
    role: 'AI & Content Lead',
    bio: 'Ex-agency creative director turned AI-first content strategist. Produces at scale without sacrificing quality.',
  },
  {
    initial: 'S',
    color: 'border-primary-container text-primary-container',
    bgGlow: 'bg-primary-container/10',
    name: 'Sarah Mitchell',
    role: 'International Market Lead',
    bio: 'Specialist in diaspora community marketing and cross-border campaign execution across multiple continents.',
  },
]

/* ------------------------------------------------------------------ */
/*  Page Component                                                      */
/* ------------------------------------------------------------------ */

export function AboutPageClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(76,215,246,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow */}
          <motion.div {...fadeUp(0.1)} className="mb-6">
            <span className="inline-block text-xs font-headline uppercase tracking-widest text-primary-container border border-primary-container/20 px-4 py-1.5 rounded-full">
              Our Story
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.2)}
            className="font-headline font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-on-surface"
          >
            About{' '}
            <span className="gradient-text">Ascelo AI</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...fadeUp(0.3)}
            className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            We started because we were frustrated with agencies that
            overpromised and underdelivered. So we built something different
            &mdash; AI-powered, human-managed, and results-obsessed.
          </motion.p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  MISSION                                                      */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-surface-container-low">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left -- text */}
            <div>
              <motion.p
                {...fadeUp(0)}
                className="text-xs font-headline uppercase tracking-widest text-primary mb-4"
              >
                Our Mission
              </motion.p>
              <motion.h2
                {...fadeUp(0.1)}
                className="font-headline font-extrabold text-3xl md:text-4xl lg:text-5xl text-on-surface leading-tight"
              >
                Make World-Class Marketing Accessible
              </motion.h2>
              <motion.p
                {...fadeUp(0.2)}
                className="font-body text-on-surface-variant text-base md:text-lg leading-relaxed mt-6"
              >
                Great marketing shouldn&apos;t require a Fortune 500 budget. We
                use AI to give SMEs, political candidates, and growing
                businesses the same firepower as enterprise agencies &mdash; at
                a fraction of the cost.
              </motion.p>
            </div>

            {/* Right -- decorative grid with sub-cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {missionCards.map((card) => (
                <motion.div
                  key={card.title}
                  variants={itemVariants}
                  className="group relative rounded-2xl border border-outline-variant bg-surface-container-high p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(76,215,246,0.08)]"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <card.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-headline font-bold text-on-surface text-base mb-2">
                    {card.title}
                  </h3>
                  <p className="font-body text-on-surface-variant text-sm leading-relaxed">
                    {card.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  VALUES                                                       */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <motion.p
              {...fadeUp(0)}
              className="text-xs font-headline uppercase tracking-widest text-primary mb-4"
            >
              Our Values
            </motion.p>
            <motion.h2
              {...fadeUp(0.1)}
              className="font-headline font-extrabold text-3xl md:text-4xl lg:text-5xl text-on-surface"
            >
              How We Work
            </motion.h2>
            <motion.p
              {...fadeUp(0.2)}
              className="font-body text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed"
            >
              Four principles that guide every campaign, every decision, every
              client relationship.
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
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={itemVariants}
                className={`group flex items-start gap-5 rounded-2xl border border-outline-variant bg-surface-container-low p-6 md:p-8 transition-all duration-300 ${v.border}`}
              >
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center`}
                >
                  <v.icon className={`w-6 h-6 ${v.color}`} />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline font-bold text-on-surface text-lg mb-2">
                    {v.title}
                  </h3>
                  <p className="font-body text-on-surface-variant text-sm leading-relaxed">
                    {v.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TEAM                                                         */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-surface-container-low">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <motion.p
              {...fadeUp(0)}
              className="text-xs font-headline uppercase tracking-widest text-primary mb-4"
            >
              The Team
            </motion.p>
            <motion.h2
              {...fadeUp(0.1)}
              className="font-headline font-extrabold text-3xl md:text-4xl lg:text-5xl text-on-surface"
            >
              People Behind the Results
            </motion.h2>
            <motion.p
              {...fadeUp(0.2)}
              className="font-body text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed"
            >
              Strategists, creatives, and technologists united by one goal
              &mdash; making your marketing work harder.
            </motion.p>
          </div>

          {/* 4-col grid, equal height */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="flex flex-col items-center text-center rounded-2xl border border-outline-variant bg-surface-container-high p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(76,215,246,0.08)]"
              >
                {/* Circular initial avatar */}
                <div
                  className={`w-20 h-20 rounded-full border-2 ${member.color} ${member.bgGlow} flex items-center justify-center mb-5`}
                >
                  <span
                    className={`font-headline font-extrabold text-2xl ${member.color.split(' ')[1]}`}
                  >
                    {member.initial}
                  </span>
                </div>

                <h3 className="font-headline font-bold text-on-surface text-base mb-1">
                  {member.name}
                </h3>
                <p className="font-headline text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                  {member.role}
                </p>
                <p className="font-body text-on-surface-variant text-sm leading-relaxed flex-1">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA                                                          */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp(0)}
            className="relative rounded-3xl border border-outline-variant overflow-hidden"
          >
            {/* Gradient border glow */}
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
                Let our AI audit your current strategy and show you exactly
                where the gaps are. No fluff, just data.
              </motion.p>

              <motion.div {...fadeUp(0.3)} className="mt-8">
                <Link
                  href="/contact"
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
