import type { Metadata } from 'next'
import { generateSeoMetadata } from '@/lib/seo'
import { SeoHead } from '@/components/SeoHead'
import { ContactPageClient } from '@/components/sections/contact/ContactPageClient'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return generateSeoMetadata('/contact', locale, {
    title: 'Contact',
    description:
      "Tell us about your business and goals. We'll come back with a free strategy audit and a clear plan to grow your revenue.",
  })
}

export default function ContactPage({ params: { locale } }: Props) {
  return (
    <>
      <SeoHead pagePath="/contact" locale={locale} />
      <ContactPageClient />
    </>
  )
}
