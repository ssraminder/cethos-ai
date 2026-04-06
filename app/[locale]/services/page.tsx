export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { SeoHead } from '@/components/SeoHead'
import { generateSeoMetadata } from '@/lib/seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { ServiceCard } from '@/components/shared/ServiceCard'
import { CtaBannerSimple } from '@/components/shared/CtaBannerSimple'
import { StaggerCards } from '@/components/shared/StaggerCards'
import { services as fallbackServices } from '@/lib/data/services'
import type { Service } from '@/lib/types'
import { getPageGraphics, getGraphic } from '@/lib/graphics'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return generateSeoMetadata('/services', locale, {
    title: 'Services | Ascelo AI',
    description: 'AI-powered digital marketing and automation services — Performance Marketing, Social Media, SEO, AI Content, WhatsApp & more. Serving businesses worldwide.',
  })
}

export default async function ServicesPage({ params: { locale } }: Props) {
  let serviceList: Service[] = []
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      const supabase = createClient(url, key)
      const { data } = await supabase
        .from('agp_services')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })
      serviceList = (data as Service[]) ?? []
    }
  } catch {
    serviceList = []
  }

  const displayServices = serviceList.length > 0
    ? serviceList
    : (fallbackServices as unknown as Service[])

  const prefix = locale === 'en' ? '' : `/${locale}`

  const graphics = await getPageGraphics('/services', locale)
  const heroBg = getGraphic(graphics, 'hero', 'background')

  return (
    <main className="pt-20 md:pt-24 bg-white min-h-screen">
      <SeoHead pagePath="/services" locale={locale} />
      <PageHero
        eyebrow="What We Do"
        heading="Our Services"
        subheading="AI-powered, human-managed marketing across every channel — built for ambitious businesses worldwide."
        ctaLabel="Get a Free Strategy Audit"
        ctaHref={`${prefix}/contact`}
        backgroundUrl={heroBg?.image_url ?? undefined}
      />

      <SectionWrapper className="bg-white">
        <SectionHeader
          eyebrow="Full-Service Agency"
          heading="Everything You Need to Grow"
          subheading="From political campaigns to performance marketing — we have the expertise, tools, and track record to deliver results."
          centered
        />
        <StaggerCards className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {displayServices.map((service) => (
            <ServiceCard
              key={service.id ?? service.slug}
              service={service}
              variant="full"
              locale={locale}
            />
          ))}
        </StaggerCards>
      </SectionWrapper>

      {/* Why Choose Us */}
      <SectionWrapper className="bg-[#FDF2F8]">
        <StaggerCards className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'AI-Powered Speed', desc: 'Our AI pipeline produces content, ads, and analysis at 5× traditional agency speed — without sacrificing quality.' },
            { title: 'Human-Managed Strategy', desc: 'Every campaign is overseen by an experienced strategist. AI handles scale, humans handle judgement.' },
            { title: 'Multilingual & Local', desc: 'Native-language campaigns in English, Arabic, French, Hindi and Punjabi — rooted in local market insight.' },
          ].map((item) => (
            <div key={item.title} className="p-6 bg-white rounded-2xl border border-[#EC4899]/10">
              <h3 className="font-heading font-bold text-[#0A0F1E] text-lg mb-3">{item.title}</h3>
              <p className="font-body text-[#0A0F1E]/60 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </StaggerCards>
      </SectionWrapper>

      <CtaBannerSimple locale={locale} />
    </main>
  )
}
