import type { Metadata } from 'next'
import { CaseStudiesContent } from './CaseStudiesContent'

interface Props {
  params: { locale: string }
}

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    "Numbers don't lie. Here's what we've delivered for our clients across multiple markets.",
}

export default function CaseStudiesPage({ params: { locale } }: Props) {
  const prefix = locale === 'en' ? '' : `/${locale}`

  return <CaseStudiesContent prefix={prefix} />
}
