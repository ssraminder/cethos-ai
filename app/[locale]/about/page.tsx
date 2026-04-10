import type { Metadata } from 'next'
import { generateSeoMetadata } from '@/lib/seo'
import { SeoHead } from '@/components/SeoHead'
import { AboutPageClient } from '@/components/sections/about/AboutPageClient'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return generateSeoMetadata('/about', locale, {
    title: 'About',
    description:
      'We started because we were frustrated with agencies that overpromised and underdelivered. So we built something different.',
  })
}

export default function AboutPage({ params: { locale } }: Props) {
  return (
    <>
      <SeoHead pagePath="/about" locale={locale} />
      <AboutPageClient />
    </>
  )
}
