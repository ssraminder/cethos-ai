export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { SeoHead } from '@/components/SeoHead'
import { generateSeoMetadata } from '@/lib/seo'
import { PageHero } from '@/components/shared/PageHero'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { CaseStudyCard } from '@/components/shared/CaseStudyCard'
import { CtaBannerSimple } from '@/components/shared/CtaBannerSimple'
import { caseStudies as fallbackCaseStudies } from '@/lib/data/case-studies'
import type { CaseStudy } from '@/lib/types'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return generateSeoMetadata('/case-studies', locale, {
    title: 'Case Studies | Ascelo AI',
    description: 'Real results from real campaigns — see how Ascelo AI drives growth for ambitious businesses worldwide.',
  })
}

export default async function CaseStudiesPage({ params: { locale } }: Props) {
  let caseStudyList: CaseStudy[] = []
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      const supabase = createClient(url, key)
      const { data } = await supabase
        .from('agp_case_studies')
        .select('*, metrics:agp_case_study_metrics(*)')
        .eq('published', true)
        .order('sort_order', { ascending: true })
      caseStudyList = (data as CaseStudy[]) ?? []
    }
  } catch {
    caseStudyList = []
  }

  const displayCaseStudies = caseStudyList.length > 0
    ? caseStudyList
    : (fallbackCaseStudies as unknown as CaseStudy[])

  const prefix = locale === 'en' ? '' : `/${locale}`

  return (
    <main className="pt-20 md:pt-24 bg-white min-h-screen">
      <SeoHead pagePath="/case-studies" locale={locale} />
      <PageHero
        eyebrow="Proven Results"
        heading="Case Studies"
        subheading="Numbers don't lie. Here's what we've delivered for our clients across multiple markets."
        ctaLabel="Start Your Success Story"
        ctaHref={`${prefix}/contact`}
      />

      {/* Stats bar */}
      <div className="bg-[#EC4899] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '50+', label: 'Campaigns Delivered' },
              { value: '5', label: 'Languages Supported' },
              { value: '10×', label: 'Average ROI' },
              { value: '95%', label: 'Client Retention' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl md:text-5xl text-white tracking-wide">{stat.value}</p>
                <p className="font-heading text-white/80 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionWrapper className="bg-[#FDF2F8]">
        <SectionHeader
          eyebrow="Portfolio"
          heading="Client Success Stories"
          subheading="Each case study represents a real challenge solved, a real business grown, and a real relationship built."
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {displayCaseStudies.map((cs) => (
            <CaseStudyCard
              key={cs.id ?? cs.slug}
              caseStudy={cs}
              locale={locale}
            />
          ))}
        </div>
      </SectionWrapper>

      <CtaBannerSimple locale={locale} />
    </main>
  )
}
