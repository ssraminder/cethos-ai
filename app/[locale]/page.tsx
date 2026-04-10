import type { Metadata } from 'next'
import { HomePageContent } from '@/components/sections/home/HomePageContent'

interface Props {
  params: { locale: string }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'AI-Powered Marketing & Automation | Ascelo AI',
    description:
      'We market your business and automate your operations across Canada, India & UAE. AI-powered speed. Human-managed strategy.',
  }
}

export default function HomePage({ params: { locale } }: Props) {
  return <HomePageContent />
}
