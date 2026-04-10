'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Building2,
  Scale,
  HeartPulse,
  Cpu,
  Landmark,
  Stethoscope,
  Plane,
  ShoppingBag,
  Megaphone,
  UtensilsCrossed,
  GraduationCap,
  Zap,
  Globe,
  MessageSquare,
  BarChart3,
  Users,
  Phone,
  Search,
  Languages,
  Bot,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react'

/* ─── Animation helpers ─── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], delay } as Transition,
})

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

/* ─── Data ─── */

const STATS = [
  { value: '50+', label: 'Campaigns Delivered', color: 'text-primary' },
  { value: '10x', label: 'Average ROAS', color: 'text-secondary' },
  { value: '95%', label: 'Client Retention', color: 'text-tertiary' },
  { value: '5', label: 'Languages', color: 'text-primary' },
  { value: '3', label: 'Countries', color: 'text-secondary' },
]

const INDUSTRIES = [
  { label: 'Real Estate', icon: Building2 },
  { label: 'Legal', icon: Scale },
  { label: 'Healthcare', icon: HeartPulse },
  { label: 'SaaS & Tech', icon: Cpu },
  { label: 'Finance & Insurance', icon: Landmark },
  { label: 'Dental', icon: Stethoscope },
  { label: 'Immigration', icon: Plane },
  { label: 'E-Commerce', icon: ShoppingBag },
  { label: 'Political Campaigns', icon: Megaphone },
  { label: 'Restaurants', icon: UtensilsCrossed },
  { label: 'Education', icon: GraduationCap },
  { label: 'Solar & Clean Energy', icon: Zap },
]

const DIFFERENTIATORS = [
  {
    title: 'Native Multilingual Content',
    description:
      'Created in 5 languages by native speakers. Not translated. Not AI-only. Culturally fluent marketing for diaspora and local markets.',
    icon: Languages,
    accent: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
    borderColor: 'border-primary/20',
  },
  {
    title: 'AI Speed, Human Strategy',
    description:
      'We produce in days what traditional agencies take weeks to deliver. Every campaign is overseen by senior human strategists.',
    icon: Bot,
    accent: 'from-secondary/20 to-secondary/5',
    iconColor: 'text-secondary',
    borderColor: 'border-secondary/20',
  },
  {
    title: 'No Contracts, Real Guarantees',
    description:
      'Month-to-month. No lock-ins. If we don\'t hit your KPIs, we work for free until we do.',
    icon: ShieldCheck,
    accent: 'from-tertiary/20 to-tertiary/5',
    iconColor: 'text-tertiary',
    borderColor: 'border-tertiary/20',
  },
]

const SERVICES = [
  {
    title: 'Multilingual & Multicultural Marketing',
    description: 'AI-powered content strategies synchronized across 5 languages for global market penetration.',
    icon: Globe,
  },
  {
    title: 'WhatsApp & SMS Campaigns',
    description: 'Direct conversational marketing that reaches your leads on their favorite mobile platforms.',
    icon: MessageSquare,
  },
  {
    title: 'Performance Marketing (PPC)',
    description: 'Data-responsive advertising on Meta, Google, and TikTok optimized for maximum conversion and ROAS.',
    icon: BarChart3,
  },
  {
    title: 'Lead Generation & Outreach Automation',
    description: 'Full-funnel lead generation systems that deliver qualified prospects directly to your sales CRM.',
    icon: Users,
  },
  {
    title: 'AI Voice Calling & Receptionist',
    description: 'Automated multilingual voice assistants for appointment booking and outbound lead follow-up.',
    icon: Phone,
  },
  {
    title: 'SEO & Online Reputation',
    description: 'Semantic search optimization that dominates local rankings across multiple regions and languages.',
    icon: Search,
  },
]

const CASE_STUDIES = [
  {
    tag: 'UAE',
    tagColor: 'bg-primary/10 text-primary',
    client: 'Premium Property Developer, Dubai',
    title: 'Dubai Real Estate: 85 Qualified Leads Per Month',
    hero: '85 Qualified Leads/Month',
    badges: ['60% CPL Reduction', '$1.2M Pipeline'],
    href: '/case-studies/dubai-real-estate-leads',
  },
  {
    tag: 'Canada',
    tagColor: 'bg-secondary/10 text-secondary',
    client: 'Immigration Consultancy, Toronto',
    title: 'Canada Immigration Consultancy: 40% Lower CPL',
    hero: '40% CPL Reduction',
    badges: ['3x Conversion Rate', '#1 Punjabi Rankings'],
    href: '/case-studies/canada-immigration-cpl-reduction',
  },
  {
    tag: 'India',
    tagColor: 'bg-tertiary/10 text-tertiary',
    client: 'Leading Retail Brand, Chandigarh',
    title: 'Chandigarh SME: 220% Organic Traffic Growth',
    hero: '220% Organic Traffic Growth',
    badges: ['34 Keywords #1', '18x ROI'],
    href: '/case-studies/chandigarh-sme-organic-growth',
  },
]

const WORKFLOW_STEPS = [
  { title: 'Discovery', description: 'Deep dive into your market, competitors, and language requirements.' },
  { title: 'Production', description: 'AI-accelerated multilingual creative and technical setup.' },
  { title: 'Launch', description: 'Synchronized deployment across targeted channels and regions.' },
  { title: 'Optimize', description: 'Real-time adjustments based on live performance data.' },
]

const TESTIMONIALS = [
  {
    quote:
      'Ascelo transformed our immigration consultancy lead flow. Targeting the Punjabi-speaking market in Canada and India simultaneously was a game changer.',
    name: 'Rajiv Malhotra',
    role: 'Director',
    company: 'Global Pathways',
    initials: 'RM',
  },
  {
    quote:
      'The AI Voice agents handled our initial qualification in Arabic flawlessly. It\'s like having a 24/7 multilingual sales team.',
    name: 'Ahmed Al-Sayed',
    role: 'Founder',
    company: 'Dubai Prime Realty',
    initials: 'AA',
  },
  {
    quote:
      'Finally an agency that understands ROI as much as they understand AI. No BS, just results and transparent reporting every week.',
    name: 'Sarah Chen',
    role: 'CMO',
    company: 'Zenith Tech Solutions',
    initials: 'SC',
  },
]

/* ═══════════════════════════════════════════════════════════
   HOME PAGE CONTENT
   ═══════════════════════════════════════════════════════════ */

export function HomePageContent() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <IndustriesSection />
      <DifferentiatorsSection />
      <ServicesSection />
      <CaseStudiesSection />
      <WorkflowSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </>
  )
}

/* ─── HERO ─── */

function HeroSection() {
  return (
    <section className="relative min-h-screen bg-background flex flex-col items-center justify-center text-center px-4 pt-24 overflow-hidden">
      {/* Radial gradient background effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(76,215,246,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 30% 70%, rgba(0,225,171,0.05) 0%, transparent 50%)',
        }}
      />
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #dee1f7 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], delay: 0.1 } as Transition}
          className="font-headline font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-8xl leading-[1.05] tracking-tight"
        >
          <span className="text-on-surface">AI-Powered </span>
          <span className="gradient-text">Marketing & Automation</span>
          <span className="text-on-surface"> for Growing Businesses.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], delay: 0.3 } as Transition}
          className="mt-6 text-on-surface-variant text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
        >
          We market your business and automate your operations across Canada, India &amp; UAE
          &mdash; in English, Hindi, Punjabi, Arabic &amp; French. AI-powered speed. Human-managed strategy.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], delay: 0.5 } as Transition}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold px-8 py-4 rounded-xl text-base md:text-lg transition-all duration-300 cursor-pointer shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Book a Free Strategy Call
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 border border-outline-variant hover:border-on-surface-variant text-on-surface font-headline font-semibold px-8 py-4 rounded-xl text-base md:text-lg transition-all duration-300 cursor-pointer hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            See Our Work
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {['No Long-Term Contracts', 'Free Strategy Audit Included', 'AI + Human Strategy'].map(
            (badge) => (
              <span
                key={badge}
                className="flex items-center gap-1.5 text-on-surface-variant text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-tertiary flex-shrink-0" />
                {badge}
              </span>
            )
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-on-surface-variant/30">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>
    </section>
  )
}

/* ─── STATS BAR ─── */

function StatsBar() {
  return (
    <section className="bg-surface-container-low w-full border-y border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-4"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="flex flex-col items-center text-center"
            >
              <span className={cn('font-headline font-extrabold text-4xl md:text-5xl', stat.color)}>
                {stat.value}
              </span>
              <span className="mt-2 text-on-surface-variant text-xs uppercase tracking-widest font-medium">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─── INDUSTRIES WE GROW ─── */

function IndustriesSection() {
  return (
    <section className="bg-background w-full py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <h2 className="font-headline font-bold text-3xl md:text-4xl lg:text-5xl text-on-surface">
            Industries We Grow
          </h2>
          <p className="mt-4 text-on-surface-variant text-base md:text-lg max-w-3xl mx-auto">
            Specialized marketing strategies tailored for high-growth sectors across North America,
            Middle East, and Asia.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {INDUSTRIES.map((industry) => {
            const Icon = industry.icon
            return (
              <motion.div
                key={industry.label}
                variants={staggerItem}
                className="group relative flex items-center gap-3 px-5 py-4 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:border-primary/40 hover:bg-surface-container transition-all duration-300 cursor-default"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-headline font-semibold text-sm text-on-surface">
                  {industry.label}
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

/* ─── DIFFERENTIATORS (WHY SMEs CHOOSE ASCELO) ─── */

function DifferentiatorsSection() {
  return (
    <section className="relative bg-surface-container-lowest w-full py-20 md:py-28 overflow-hidden">
      {/* Accent blurs */}
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <h2 className="font-headline font-bold text-3xl md:text-4xl lg:text-5xl text-on-surface">
            Why SMEs Choose Ascelo Over Traditional Agencies
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {DIFFERENTIATORS.map((d) => {
            const Icon = d.icon
            return (
              <motion.div
                key={d.title}
                variants={staggerItem}
                className={cn(
                  'relative flex flex-col p-8 rounded-2xl border glass-panel h-full',
                  d.borderColor
                )}
              >
                {/* Gradient accent bg */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl bg-gradient-to-b opacity-50 pointer-events-none',
                    d.accent
                  )}
                  aria-hidden="true"
                />
                <div className="relative z-10 flex flex-col h-full">
                  <div
                    className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center mb-6',
                      d.iconColor === 'text-primary' && 'bg-primary/10',
                      d.iconColor === 'text-secondary' && 'bg-secondary/10',
                      d.iconColor === 'text-tertiary' && 'bg-tertiary/10'
                    )}
                  >
                    <Icon className={cn('w-7 h-7', d.iconColor)} />
                  </div>
                  <h3 className="font-headline font-bold text-xl text-on-surface mb-3">
                    {d.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed flex-1">
                    {d.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

/* ─── SERVICES ─── */

function ServicesSection() {
  return (
    <section className="bg-background w-full py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <h2 className="font-headline font-bold text-3xl md:text-4xl lg:text-5xl text-on-surface">
            Full-Service AI Marketing &amp; Automation
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                variants={staggerItem}
                className="group relative flex flex-col p-6 rounded-2xl border border-outline-variant/40 bg-surface-container-low hover:border-primary/30 hover:bg-surface-container transition-all duration-300 h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-headline font-bold text-lg text-on-surface mb-2">
                  {service.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed flex-1">
                  {service.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div {...fadeUp(0.3)} className="mt-10 flex justify-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-primary font-headline font-semibold hover:text-primary/80 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            View All 12 Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── CASE STUDIES ─── */

function CaseStudiesSection() {
  return (
    <section className="bg-surface-container-lowest w-full py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <h2 className="font-headline font-bold text-3xl md:text-4xl lg:text-5xl text-on-surface">
            Global Success Stories
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {CASE_STUDIES.map((cs) => (
            <motion.div key={cs.href} variants={staggerItem} className="flex">
              <Link
                href={cs.href}
                className="group flex flex-col w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low hover:border-primary/30 overflow-hidden transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* Hero metric area */}
                <div className="relative px-6 pt-6 pb-8 bg-gradient-to-br from-surface-container to-surface-container-high">
                  <span
                    className={cn(
                      'inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4',
                      cs.tagColor
                    )}
                  >
                    {cs.tag}
                  </span>
                  <p className="text-on-surface-variant text-xs mb-1">{cs.client}</p>
                  <p className="font-headline font-bold text-2xl md:text-3xl gradient-text leading-tight">
                    {cs.hero}
                  </p>
                </div>

                {/* Bottom section */}
                <div className="flex flex-col flex-1 px-6 py-5">
                  <h3 className="font-headline font-semibold text-base text-on-surface mb-4 group-hover:text-primary transition-colors duration-300">
                    {cs.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {cs.badges.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-surface-container-high text-on-surface-variant border border-outline-variant/30"
                      >
                        <CheckCircle2 className="w-3 h-3 text-tertiary" />
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div {...fadeUp(0.3)} className="mt-10 flex justify-center">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-primary font-headline font-semibold hover:text-primary/80 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            View All Case Studies
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── WORKFLOW TIMELINE ─── */

function WorkflowSection() {
  return (
    <section className="bg-background w-full py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <h2 className="font-headline font-bold text-3xl md:text-4xl lg:text-5xl text-on-surface">
            The Ascelo Workflow
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative grid grid-cols-1 md:grid-cols-4 gap-0"
        >
          {/* Connector line - desktop */}
          <div
            className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/40 via-tertiary/30 to-primary/40"
            aria-hidden="true"
          />

          {WORKFLOW_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              variants={staggerItem}
              className="flex flex-col items-center text-center px-6 pb-8 md:pb-0"
            >
              {/* Step number circle */}
              <div className="relative z-10 w-16 h-16 rounded-full border-2 border-primary/50 bg-background flex items-center justify-center mb-6">
                <span className="font-headline font-bold text-2xl text-primary leading-none">
                  {i + 1}
                </span>
              </div>

              <h3 className="font-headline font-bold text-base text-on-surface mb-2">
                {step.title}
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed max-w-[220px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─── TESTIMONIALS ─── */

function TestimonialsSection() {
  return (
    <section className="bg-surface-container-lowest w-full py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <h2 className="font-headline font-bold text-3xl md:text-4xl lg:text-5xl text-on-surface">
            What Our Clients Say
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              className="flex flex-col p-6 rounded-2xl border border-outline-variant/40 bg-surface-container-low h-full"
            >
              {/* Star rating */}
              <div className="flex items-center gap-1 mb-4" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-secondary fill-secondary"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="flex-1 text-on-surface/80 text-sm leading-relaxed italic mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/30">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-headline font-bold text-sm">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="font-headline font-semibold text-on-surface text-sm">{t.name}</p>
                  <p className="text-on-surface-variant text-xs">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─── FINAL CTA ─── */

function FinalCtaSection() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-background overflow-hidden">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(76,215,246,0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 60% 60%, rgba(0,225,171,0.04) 0%, transparent 50%)',
        }}
      />

      {/* Top separator */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          {...fadeUp(0.1)}
          className="font-headline font-bold text-4xl md:text-5xl lg:text-6xl text-on-surface"
        >
          Ready to Grow Your Business?
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-4 text-on-surface-variant text-base md:text-lg max-w-xl mx-auto"
        >
          Get a data-backed roadmap for global domination. No fluff, no commitments, just growth
          strategy.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold px-8 py-4 rounded-xl text-base md:text-lg transition-all duration-300 cursor-pointer shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Get Your Free AI Audit
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-outline-variant hover:border-on-surface-variant text-on-surface font-headline font-semibold px-8 py-4 rounded-xl text-base md:text-lg transition-all duration-300 cursor-pointer hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Talk to a Specialist
          </Link>
        </motion.div>

        <motion.p
          {...fadeUp(0.4)}
          className="mt-8 text-on-surface-variant/70 text-sm"
        >
          No long-term contracts. Performance-based guarantees.
        </motion.p>
      </div>
    </section>
  )
}
