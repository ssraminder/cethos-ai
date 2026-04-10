import type { Metadata } from 'next'
import { ServicesPageClient } from './ServicesPageClient'

interface Props {
  params: { locale: string }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Services',
    description:
      'AI-powered, human-managed marketing across every channel — built for ambitious businesses worldwide.',
  }
}

export default function ServicesPage({ params: { locale } }: Props) {
  const prefix = locale === 'en' ? '' : `/${locale}`

  return <ServicesPageClient prefix={prefix} />
}
