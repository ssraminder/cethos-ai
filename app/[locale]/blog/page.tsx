import type { Metadata } from 'next'
import { BlogPageClient } from './BlogPageClient'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Strategy, research, and marketing intelligence from the Ascelo AI team.',
}

export default function BlogPage() {
  return <BlogPageClient />
}
