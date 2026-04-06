import { checkSafeBrowsing } from '@/lib/google/safebrowsing'
import { getCruxData } from '@/lib/google/crux'
import { checkKnowledgeGraph } from '@/lib/google/knowledge-graph'

export interface TeaserResults {
  homepage_loads: boolean
  https: boolean
  safe_browsing_clean: boolean
  title_present: boolean
  title_length: number | null
  meta_description: boolean
  h1_count: number
  og_image: boolean
  viewport_meta: boolean
  robots_txt: boolean
  sitemap: boolean
  knowledge_panel: boolean
  crux_lcp_rating: 'good' | 'needs-improvement' | 'poor' | 'no-data'
  screenshot_url: string | null
  score: number
  load_time_ms: number | null
}

export async function runTeaser(url: string, companyName?: string): Promise<TeaserResults> {
  const results: TeaserResults = {
    homepage_loads: false,
    https: false,
    safe_browsing_clean: true,
    title_present: false,
    title_length: null,
    meta_description: false,
    h1_count: 0,
    og_image: false,
    viewport_meta: false,
    robots_txt: false,
    sitemap: false,
    knowledge_panel: false,
    crux_lcp_rating: 'no-data',
    screenshot_url: null,
    score: 0,
    load_time_ms: null,
  }

  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`
  const domain = normalizedUrl.replace(/^https?:\/\//, '').split('/')[0]

  // Run all checks in parallel
  await Promise.allSettled([
    // Homepage fetch + HTML checks
    (async () => {
      const start = Date.now()
      const res = await fetch(normalizedUrl, {
        headers: { 'User-Agent': 'AsceloAIAuditBot/1.0' },
        signal: AbortSignal.timeout(10000),
      })
      results.load_time_ms = Date.now() - start
      if (!res.ok) return
      results.homepage_loads = true
      results.https = normalizedUrl.startsWith('https://')

      const html = await res.text()

      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      results.title_present = !!titleMatch
      results.title_length = titleMatch ? titleMatch[1].trim().length : null

      results.meta_description = /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{10}/i.test(html)
      results.og_image = /<meta[^>]+property=["']og:image["'][^>]+content=["'][^"']+["']/i.test(html)
      results.viewport_meta = /<meta[^>]+name=["']viewport["']/i.test(html)

      const h1Matches = html.match(/<h1[^>]*>/gi)
      results.h1_count = h1Matches ? h1Matches.length : 0
    })(),

    // Robots.txt
    fetch(`https://${domain}/robots.txt`, { signal: AbortSignal.timeout(5000) })
      .then((r) => { results.robots_txt = r.ok })
      .catch(() => {}),

    // Sitemap
    fetch(`https://${domain}/sitemap.xml`, { signal: AbortSignal.timeout(5000) })
      .then((r) => { results.sitemap = r.ok })
      .catch(() => {}),

    // Safe Browsing
    checkSafeBrowsing(normalizedUrl)
      .then((r) => { results.safe_browsing_clean = r.clean })
      .catch(() => {}),

    // CrUX
    getCruxData(normalizedUrl)
      .then((r) => {
        results.crux_lcp_rating = r.available && r.lcp ? r.lcp.rating : 'no-data'
      })
      .catch(() => {}),

    // Knowledge Graph (use company name if available, else domain)
    checkKnowledgeGraph(companyName ?? domain)
      .then((r) => { results.knowledge_panel = r.found })
      .catch(() => {}),
  ])

  // Weighted score
  let score = 0
  if (results.homepage_loads) score += 20
  if (results.https) score += 10
  if (results.safe_browsing_clean) score += 10
  if (results.title_present && results.title_length && results.title_length >= 10 && results.title_length <= 60) score += 10
  if (results.meta_description) score += 10
  if (results.h1_count === 1) score += 10
  if (results.og_image) score += 5
  if (results.viewport_meta) score += 5
  if (results.robots_txt) score += 5
  if (results.sitemap) score += 5
  if (results.knowledge_panel) score += 5
  if (results.crux_lcp_rating === 'good') score += 5
  else if (results.crux_lcp_rating === 'needs-improvement') score += 2

  results.score = Math.min(100, score)
  return results
}
