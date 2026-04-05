import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/lib/types'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { BlogCard } from '@/components/shared/BlogCard'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = params.locale
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
  params,
}: {
  params: { locale: string }
}) {
  const locale = params.locale ?? 'en'

  let posts: BlogPost[] = []
  let debugInfo = ''

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Blog] Missing Supabase env vars:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
    })
    debugInfo = 'env-missing'
  } else {
    try {
      const supabase = createClient()

      // First try locale-specific posts
      const { data: localePosts, error: localeError } = await supabase
        .from('agp_blog_posts')
        .select('*')
        .eq('locale', locale)
        .eq('published', true)
        .order('published_at', { ascending: false })

      if (localeError) {
        console.error('[Blog] Locale query error:', localeError)
      }

      if (localePosts && localePosts.length > 0) {
        posts = localePosts
        console.log(`[Blog] Loaded ${posts.length} posts for locale=${locale}`)
      } else {
        // Fallback: fetch all published posts (no locale filter)
        const { data: allPosts, error: allError } = await supabase
          .from('agp_blog_posts')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false })

        if (allError) {
          console.error('[Blog] All posts query error:', allError)
        } else {
          posts = allPosts ?? []
          console.log(`[Blog] No posts for locale=${locale}, loaded ${posts.length} total posts`)
        }
      }
    } catch (err) {
      console.error('[Blog] Unexpected error:', err)
    }
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
            {process.env.NODE_ENV === 'development' && debugInfo && (
              <p className="font-mono text-red-500 text-sm mt-4">Debug: {debugInfo}</p>
            )}
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
