import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHero } from '@/components/shared/PageHero'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { CtaBannerSimple } from '@/components/shared/CtaBannerSimple'
import { services as fallbackServices } from '@/lib/data/services'
import { faqs as fallbackFaqs } from '@/lib/data/faqs'
import { caseStudies as fallbackCaseStudies } from '@/lib/data/case-studies'
import { CaseStudyCard } from '@/components/shared/CaseStudyCard'
import type { Service, ServiceDeliverable, FAQ, CaseStudy } from '@/lib/types'
import { CheckCircle, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: { locale: string; slug: string }
}

async function getService(slug: string): Promise<{ service: Service; deliverables: ServiceDeliverable[] } | null> {
  try {
    const supabase = createClient()
    const { data: service } = await supabase
      .from('agp_services')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()

    if (!service) {
      // Fallback to static data
      const found = fallbackServices.find(s => s.slug === slug)
      if (!found) return null
      return { service: { ...found, id: slug } as Service, deliverables: [] }
    }

    const { data: deliverables } = await supabase
      .from('agp_service_deliverables')
      .select('*')
      .eq('service_id', service.id)
      .order('sort_order', { ascending: true })

    return { service, deliverables: deliverables ?? [] }
  } catch {
    const found = fallbackServices.find(s => s.slug === slug)
    if (!found) return null
    return { service: { ...found, id: slug } as Service, deliverables: [] }
  }
}

export async function generateMetadata({ params: { slug, locale } }: Props): Promise<Metadata> {
  const result = await getService(slug)
  if (!result) return { title: 'Service Not Found | Cethos Media' }
  return {
    title: `${result.service.title} | Cethos Media`,
    description: result.service.short_desc ?? undefined,
    openGraph: {
      title: `${result.service.title} | Cethos Media`,
      description: result.service.short_desc ?? undefined,
      locale,
    },
  }
}

export default async function ServiceDetailPage({ params: { locale, slug } }: Props) {
  const result = await getService(slug)
  if (!result) notFound()

  const { service, deliverables } = result
  const prefix = locale === 'en' ? '' : `/${locale}`

  // Get related case studies (first 2)
  const displayCaseStudies = (fallbackCaseStudies as unknown as CaseStudy[]).slice(0, 2)

  // Get FAQs relevant to this service or global
  const displayFaqs = fallbackFaqs.slice(0, 4)

  // Generic process steps for any service
  const processSteps = [
    { num: '01', title: 'Discovery & Strategy', desc: 'We audit your current position, research your market, and build a tailored strategy with clear KPIs.' },
    { num: '02', title: 'Creative Production', desc: 'Our AI-powered pipeline produces assets at scale — reviewed and refined by senior human strategists.' },
    { num: '03', title: 'Launch & Execute', desc: 'Campaigns go live across all agreed channels with real-time monitoring from day one.' },
    { num: '04', title: 'Optimise & Report', desc: 'Weekly performance reviews, A/B testing, and transparent reporting. We iterate until we beat targets.' },
  ]

  return (
    <main className="pt-20 md:pt-24 bg-white min-h-screen">
      <PageHero
        eyebrow="Our Services"
        heading={service.title}
        subheading={service.short_desc ?? undefined}
        ctaLabel="Get a Free Audit"
        ctaHref={`${prefix}/contact`}
      />

      {/* Long description */}
      {service.long_desc && (
        <SectionWrapper className="bg-white">
          <div className="max-w-3xl">
            <p className="font-heading text-[#EC4899] font-semibold text-sm uppercase tracking-widest mb-4">What We Do</p>
            <p className="font-body text-[#0A0F1E]/70 text-lg leading-relaxed">{service.long_desc}</p>
          </div>
        </SectionWrapper>
      )}

      {/* Deliverables */}
      <SectionWrapper className="bg-[#FDF2F8]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <SectionHeader
              eyebrow="What's Included"
              heading="Deliverables"
              subheading="Everything you get as part of this service engagement."
            />
            <ul className="mt-8 space-y-3">
              {(deliverables.length > 0 ? deliverables.map(d => d.label) : [
                'Dedicated account strategist',
                'Weekly performance reports',
                'Monthly strategy review call',
                'Real-time dashboard access',
                'A/B testing & continuous optimisation',
                'Multilingual creative assets',
              ]).map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#06B6D4] flex-shrink-0 mt-0.5" />
                  <span className="font-body text-[#0A0F1E]/80 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Results snapshot */}
          <div className="bg-[#0A0F1E] rounded-2xl p-8">
            <p className="font-heading font-bold text-white text-lg mb-6">Typical Results</p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '3–6×', label: 'Average ROI' },
                { value: '30 days', label: 'To first results' },
                { value: '95%', label: 'Client retention' },
                { value: '24h', label: 'Response time' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-3xl text-[#EC4899] tracking-wide">{stat.value}</p>
                  <p className="font-heading text-white/50 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                href={`${prefix}/contact`}
                className="block w-full text-center bg-[#06B6D4] text-white px-6 py-3 rounded-lg font-heading font-semibold text-sm hover:bg-[#06B6D4]/90 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
              >
                Start This Service
              </Link>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Process */}
      <SectionWrapper className="bg-white">
        <SectionHeader
          eyebrow="How We Work"
          heading="Our Process"
          subheading="A proven 4-step framework we apply to every engagement."
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {processSteps.map((step) => (
            <div key={step.num} className="relative p-6 bg-[#FDF2F8] rounded-2xl border border-[#EC4899]/10">
              <span className="font-display text-5xl text-[#EC4899]/20 leading-none">{step.num}</span>
              <h3 className="font-heading font-bold text-[#0A0F1E] text-base mt-2 mb-2">{step.title}</h3>
              <p className="font-body text-[#0A0F1E]/60 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Related case studies */}
      <SectionWrapper className="bg-[#FDF2F8]">
        <SectionHeader
          eyebrow="Proof of Work"
          heading="Related Results"
          subheading="Real campaigns. Real numbers. See what we've delivered."
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {displayCaseStudies.map((cs) => (
            <CaseStudyCard key={cs.slug} caseStudy={cs} locale={locale} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href={`${prefix}/case-studies`}
            className="inline-flex items-center gap-2 text-[#EC4899] font-heading font-semibold text-sm hover:gap-3 transition-all duration-200 cursor-pointer"
          >
            View all case studies
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </SectionWrapper>

      {/* FAQs */}
      <SectionWrapper className="bg-white">
        <SectionHeader
          eyebrow="Common Questions"
          heading="FAQs"
          subheading="Everything you need to know before getting started."
          centered
        />
        <div className="max-w-2xl mx-auto mt-12 space-y-3">
          {displayFaqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-[#FDF2F8] rounded-xl border border-[#EC4899]/10 overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-heading font-semibold text-[#0A0F1E] text-sm list-none">
                {faq.question}
                <ChevronDown className="w-4 h-4 text-[#EC4899] group-open:rotate-180 transition-transform duration-200 flex-shrink-0 ml-4" />
              </summary>
              <div className="px-6 pb-5">
                <p className="font-body text-[#0A0F1E]/60 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </SectionWrapper>

      <CtaBannerSimple locale={locale} />
    </main>
  )
}
