export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import type { BlogPost } from '@/lib/types'
import { SeoHead } from '@/components/SeoHead'
import { generateSeoMetadata } from '@/lib/seo'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { BlogCard } from '@/components/shared/BlogCard'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return generateSeoMetadata('/blog', params.locale, {
    title: 'Blog | Ascelo AI',
    description: 'Marketing insights, strategy, and AI-powered growth ideas from the Ascelo AI team — for ambitious businesses worldwide.',
  })
}

export default async function BlogPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = params.locale ?? 'en'

  let posts: BlogPost[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Blog] Missing env vars — NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set on this host')
  } else {
    try {
      // Use direct supabase-js client — no cookies needed for reading public posts
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Try locale-specific posts first
      const { data: localePosts, error: localeError } = await supabase
        .from('agp_blog_posts')
        .select('*')
        .eq('locale', locale)
        .eq('published', true)
        .order('published_at', { ascending: false })

      if (localeError) {
        console.error('[Blog] Locale query error:', localeError.message)
      }

      if (localePosts && localePosts.length > 0) {
        posts = localePosts as BlogPost[]
        console.log(`[Blog] Loaded ${posts.length} posts for locale=${locale}`)
      } else {
        // Fallback: all English posts (or all posts if English has none)
        const { data: allPosts, error: allError } = await supabase
          .from('agp_blog_posts')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false })

        if (allError) {
          console.error('[Blog] Fallback query error:', allError.message)
        } else {
          posts = (allPosts ?? []) as BlogPost[]
          console.log(
            `[Blog] No posts for locale=${locale}, loaded ${posts.length} total`
          )
        }
      }
    } catch (err) {
      console.error('[Blog] Unexpected error:', err)
    }
  }

  return (
    <main className="pt-20 md:pt-24 bg-[#FDF2F8] min-h-screen">
      <SeoHead pagePath="/blog" locale={locale} />
      <SectionWrapper>
        <SectionHeader
          eyebrow="Blog"
          heading="Insights & Ideas"
          subheading="Strategy, research, and marketing intelligence from the Ascelo AI team — for ambitious businesses worldwide."
          centered
        />
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-body text-[#0A0F1E]/40 text-lg">
              No posts yet — check back soon.
            </p>
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
