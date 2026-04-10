'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Globe,
  MessageSquare,
  TrendingUp,
  UserPlus,
  Phone,
  Search,
  FileText,
  Share2,
  Monitor,
  Settings,
  Megaphone,
  Palette,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface ServiceItem {
  icon: LucideIcon
  name: string
  description: string
  href: string
  color: 'primary' | 'tertiary' | 'secondary'
}

const services: ServiceItem[] = [
  {
    icon: Globe,
    name: 'Multilingual & Multicultural Marketing',
    description:
      'Reach diaspora and immigrant communities in their language — English, Arabic, French, Hindi, and Punjabi.',
    href: '/services/multilingual-marketing',
    color: 'primary',
  },
  {
    icon: MessageSquare,
    name: 'WhatsApp & SMS Campaigns',
    description:
      'Direct, high-open-rate messaging to your leads and clients — personalized at scale via WhatsApp and SMS.',
    href: '/services/whatsapp-sms-campaigns',
    color: 'tertiary',
  },
  {
    icon: TrendingUp,
    name: 'Performance Marketing (PPC)',
    description:
      'Google, Meta, and LinkedIn ads managed by AI — optimized daily for leads, not just clicks.',
    href: '/services/performance-marketing',
    color: 'secondary',
  },
  {
    icon: UserPlus,
    name: 'Lead Generation & Outreach Automation',
    description:
      'AI agents source, enrich, and reach out to your ideal clients across email, LinkedIn, and phone — on autopilot.',
    href: '/services/lead-generation-outreach',
    color: 'primary',
  },
  {
    icon: Phone,
    name: 'AI Voice Calling & Receptionist',
    description:
      'A 24/7 AI receptionist that answers calls, qualifies leads, and books appointments — powered by Vapi.',
    href: '/services/ai-voice-calling',
    color: 'tertiary',
  },
  {
    icon: Search,
    name: 'SEO & Online Reputation',
    description:
      'Rank higher, get found, and own your reputation — AI-powered SEO that compounds month over month.',
    href: '/services/seo-reputation',
    color: 'secondary',
  },
  {
    icon: FileText,
    name: 'AI-Powered Content Production',
    description:
      'Blog posts, social content, email newsletters, and video scripts — produced at scale by AI, reviewed by humans.',
    href: '/services/ai-content-production',
    color: 'primary',
  },
  {
    icon: Share2,
    name: 'Social Media Management',
    description:
      'Consistent, on-brand social presence across Instagram, Facebook, LinkedIn, and TikTok — managed and scheduled for you.',
    href: '/services/social-media-management',
    color: 'tertiary',
  },
  {
    icon: Monitor,
    name: 'Website Design & Development',
    description:
      'High-converting websites built and deployed in weeks — not months. Designed for leads, not just looks.',
    href: '/services/website-design-development',
    color: 'secondary',
  },
  {
    icon: Settings,
    name: 'Internal Process Automation',
    description:
      'We automate your invoicing, document handling, onboarding, and internal workflows — so your team does less admin and more revenue work.',
    href: '/services/process-automation',
    color: 'primary',
  },
  {
    icon: Megaphone,
    name: 'Political Campaign Marketing',
    description:
      'Data-driven, multilingual political campaigns for India — voter outreach, WhatsApp mobilization, and ground intelligence.',
    href: '/services/political-campaign-marketing',
    color: 'tertiary',
  },
  {
    icon: Palette,
    name: 'Brand Strategy & Identity',
    description:
      'Positioning, messaging, visual identity, and brand voice — the foundation everything else is built on.',
    href: '/services/brand-strategy',
    color: 'secondary',
  },
]

/* ------------------------------------------------------------------ */
/*  Color helpers                                                      */
/* ------------------------------------------------------------------ */

const iconBgColor: Record<ServiceItem['color'], string> = {
  primary: 'bg-primary/15',
  tertiary: 'bg-tertiary/15',
  secondary: 'bg-secondary/15',
}

const iconTextColor: Record<ServiceItem['color'], string> = {
  primary: 'text-primary',
  tertiary: 'text-tertiary',
  secondary: 'text-secondary',
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface ServicesPageClientProps {
  prefix: string
}

export function ServicesPageClient({ prefix }: ServicesPageClientProps) {
  return (
    <main className="bg-background min-h-screen">
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Decorative gradient orb */}
        <div
          className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full opacity-[0.07]"
          style={{
            background:
              'radial-gradient(circle, #4cd7f6 0%, transparent 70%)',
            transform: 'translate(30%, -20%)',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Eyebrow badge */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-5 inline-block rounded-full border border-outline-variant bg-surface-container-low px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary"
            >
              What We Do
            </motion.span>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-headline text-5xl font-extrabold leading-none tracking-tight text-on-surface md:text-7xl lg:text-8xl"
            >
              Our{' '}
              <span className="gradient-text">Services</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-on-surface-variant md:text-lg"
            >
              AI-powered, human-managed marketing across every channel — built
              for ambitious businesses worldwide.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <Link
                href={`${prefix}/contact`}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-container px-8 py-4 font-headline text-base font-semibold text-on-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
              >
                Get a Free Strategy Audit
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== SERVICES GRID ========== */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <h2 className="font-headline text-3xl font-bold text-on-surface md:text-4xl lg:text-5xl">
              Everything You Need to Grow
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant md:text-lg">
              From political campaigns to performance marketing — we have the
              expertise, tools, and track record to deliver results.
            </p>
          </motion.div>

          {/* Cards grid */}
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {services.map((service) => {
              const Icon = service.icon

              return (
                <motion.div key={service.name} variants={fadeUp} className="flex">
                  <Link
                    href={`${prefix}${service.href}`}
                    className={cn(
                      'group flex w-full flex-col rounded-xl border border-outline-variant/40 bg-surface-container-low p-6 transition-all duration-300 cursor-pointer',
                      'hover:bg-surface-container-high hover:shadow-lg hover:shadow-primary/5 hover:border-outline-variant',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                    )}
                  >
                    {/* Icon circle */}
                    <div
                      className={cn(
                        'mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-300',
                        iconBgColor[service.color],
                        iconTextColor[service.color]
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Name */}
                    <h3 className="font-headline text-lg font-semibold text-on-surface transition-colors duration-300 group-hover:text-primary">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-on-surface-variant">
                      {service.description}
                    </p>

                    {/* Learn more */}
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container via-surface-container-high to-surface-container p-10 text-center md:p-16"
          >
            {/* Gradient overlay decoration */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                background:
                  'linear-gradient(135deg, #4cd7f6 0%, #00e1ab 50%, #06b6d4 100%)',
              }}
              aria-hidden="true"
            />

            <div className="relative">
              <h2 className="font-headline text-3xl font-bold text-on-surface md:text-4xl lg:text-5xl">
                Ready to Grow Your Business?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant md:text-lg">
                Let&apos;s map out a customized AI marketing roadmap that scales
                your revenue without scaling your overhead.
              </p>
              <div className="mt-8">
                <Link
                  href={`${prefix}/contact`}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container px-10 py-4 font-headline text-lg font-semibold text-on-primary shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                >
                  Get Your Free AI Audit
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
