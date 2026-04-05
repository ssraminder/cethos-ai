import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/lib/types'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { BlogCard } from '@/components/shared/BlogCard'

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
    <SectionWrapper>
      <SectionHeader
        eyebrow="Blog"
        heading="Insights & Ideas"
        subheading="Strategy, research, and marketing intelligence from the Cethos Media team."
        centered
      />
      {posts.length === 0 ? (
        <div className="text-center py-20 text-[#831843]/50 font-body">
          No posts yet — check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} locale={locale} />
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
