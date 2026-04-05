import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/lib/types'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { BlogCard } from '@/components/shared/BlogCard'
import type { Metadata } from 'next'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return {
    title: 'Blog | Cethos Media',
    description: 'Marketing insights, strategy, and AI-powered growth ideas from the Cethos Media team — for businesses in India, UAE, and Canada.',
    openGraph: {
      title: 'Blog | Cethos Media',
      description: 'Marketing insights for India, UAE, and Canada.',
      locale,
    },
  }
}

export default async function BlogPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  let posts: BlogPost[] = []
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('agp_blog_posts')
      .select('*')
      .eq('locale', locale)
      .eq('published', true)
      .order('published_at', { ascending: false })
    posts = data ?? []
  } catch {
    posts = []
  }

  return (
    <main className="pt-20 md:pt-24 bg-[#FDF2F8] min-h-screen">
      <SectionWrapper>
        <SectionHeader
          eyebrow="Blog"
          heading="Insights & Ideas"
          subheading="Strategy, research, and marketing intelligence from the Cethos Media team — for businesses in India, UAE, and Canada."
          centered
        />
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-body text-[#0A0F1E]/40 text-lg">No posts yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
        )}
      </SectionWrapper>
    </main>
  )
}
