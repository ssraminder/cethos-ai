import { parse } from 'node-html-parser'
import { getPageSpeed } from '@/lib/google/pagespeed'
import { getCruxData } from '@/lib/google/crux'
import { checkSafeBrowsing } from '@/lib/google/safebrowsing'
import { checkKnowledgeGraph } from '@/lib/google/knowledge-graph'
import { getIndexedPageCount } from '@/lib/google/custom-search'
import type { TeaserResults } from './teaser'

export interface PageAudit {
  url: string
  status: number | null
  title: string | null
  title_length: number | null
  meta_description: string | null
  meta_description_length: number | null
  h1_count: number
  h2_count: number
  og_image: boolean
  twitter_card: boolean
  canonical: string | null
  noindex: boolean
  images_total: number
  images_missing_alt: number
  internal_links: string[]
  broken: boolean
}

export interface FreeAuditResults {
  pages_crawled: number
  homepage: PageAudit
  all_pages: PageAudit[]
  broken_links: string[]
  ssl_valid: boolean
  ssl_days_remaining: number | null
  robots_txt: boolean
  sitemap_xml: boolean
  pagespeed: Awaited<ReturnType<typeof getPageSpeed>> | null
  crux: Awaited<ReturnType<typeof getCruxData>> | null
  safe_browsing: Awaited<ReturnType<typeof checkSafeBrowsing>>
  knowledge_panel: Awaited<ReturnType<typeof checkKnowledgeGraph>>
  indexed_pages: number | null
  score: number
  top_issues: string[]
}

async function crawlPage(url: string): Promise<PageAudit> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AsceloAIAuditBot/1.0' },
      signal: AbortSignal.timeout(10000),
      redirect: 'follow',
    })
    const html = await res.text()
    const root = parse(html)

    const title = root.querySelector('title')?.text?.trim() ?? null
    const metaDesc = root.querySelector('meta[name="description"]')?.getAttribute('content') ?? null
    const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null
    const noindexMeta = root.querySelector('meta[name="robots"]')?.getAttribute('content') ?? ''
    const ogImage = !!root.querySelector('meta[property="og:image"]')
    const twitterCard = !!root.querySelector('meta[name="twitter:card"]')
    const h1s = root.querySelectorAll('h1')
    const h2s = root.querySelectorAll('h2')
    const images = root.querySelectorAll('img')
    const imagesWithoutAlt = images.filter(img => !img.getAttribute('alt')?.trim())
    const internalLinks = root.querySelectorAll('a[href]')
      .map(a => a.getAttribute('href') ?? '')
      .filter(href => href.startsWith('/') || href.includes(new URL(url).hostname))
      .slice(0, 50)

    return {
      url,
      status: res.status,
      title,
      title_length: title ? title.length : null,
      meta_description: metaDesc,
      meta_description_length: metaDesc ? metaDesc.length : null,
      h1_count: h1s.length,
      h2_count: h2s.length,
      og_image: ogImage,
      twitter_card: twitterCard,
      canonical,
      noindex: noindexMeta.toLowerCase().includes('noindex'),
      images_total: images.length,
      images_missing_alt: imagesWithoutAlt.length,
      internal_links: internalLinks,
      broken: !res.ok,
    }
  } catch {
    return {
      url, status: null, title: null, title_length: null, meta_description: null,
      meta_description_length: null, h1_count: 0, h2_count: 0, og_image: false,
      twitter_card: false, canonical: null, noindex: false, images_total: 0,
      images_missing_alt: 0, internal_links: [], broken: true,
    }
  }
}

export async function runFreeAudit(websiteUrl: string, teaser: TeaserResults): Promise<FreeAuditResults> {
  const normalizedUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`
  const domain = new URL(normalizedUrl).hostname

  // Crawl up to 15 pages
  const homepageAudit = await crawlPage(normalizedUrl)
  const discoveredUrls = new Set<string>([normalizedUrl])
  const toVisit: string[] = []

  // Discover links from homepage
  for (const href of homepageAudit.internal_links) {
    try {
      const absolute = href.startsWith('http') ? href : `${normalizedUrl.replace(/\/$/, '')}${href}`
      const parsed = new URL(absolute)
      if (parsed.hostname === domain && !discoveredUrls.has(parsed.href)) {
        toVisit.push(parsed.href)
        discoveredUrls.add(parsed.href)
      }
    } catch {}
  }

  // Crawl up to 14 more pages
  const additionalPages = await Promise.allSettled(
    toVisit.slice(0, 14).map(url => crawlPage(url))
  )
  const allPages: PageAudit[] = [
    homepageAudit,
    ...additionalPages.filter(r => r.status === 'fulfilled').map(r => (r as PromiseFulfilledResult<PageAudit>).value),
  ]

  const brokenLinks = allPages.filter(p => p.broken).map(p => p.url)

  // SSL check (simple: if HTTPS loads)
  const ssl_valid = normalizedUrl.startsWith('https://') && homepageAudit.status !== null && !homepageAudit.broken

  // Robots + sitemap
  const [robotsRes, sitemapRes] = await Promise.allSettled([
    fetch(`https://${domain}/robots.txt`, { signal: AbortSignal.timeout(5000) }),
    fetch(`https://${domain}/sitemap.xml`, { signal: AbortSignal.timeout(5000) }),
  ])
  const robots_txt = robotsRes.status === 'fulfilled' && (robotsRes.value as Response).ok
  const sitemap_xml = sitemapRes.status === 'fulfilled' && (sitemapRes.value as Response).ok

  // Google APIs in parallel
  const [pagespeed, crux, safeBrowsing, knowledgePanel, indexedPages] = await Promise.allSettled([
    getPageSpeed(normalizedUrl),
    getCruxData(normalizedUrl),
    checkSafeBrowsing(normalizedUrl),
    checkKnowledgeGraph(domain),
    getIndexedPageCount(domain),
  ])

  const psResult = pagespeed.status === 'fulfilled' ? pagespeed.value : null
  const cruxResult = crux.status === 'fulfilled' ? crux.value : null
  const sbResult = safeBrowsing.status === 'fulfilled' ? safeBrowsing.value : { clean: true, threats: [] }
  const kgResult = knowledgePanel.status === 'fulfilled' ? knowledgePanel.value : { found: false, name: null, description: null, types: [], wikipedia_url: null, image_url: null }
  const indexResult = indexedPages.status === 'fulfilled' ? indexedPages.value.indexed_count : null

  // Compute score
  let score = teaser.score // start from teaser
  if (robots_txt && !teaser.robots_txt) score += 3
  if (sitemap_xml && !teaser.sitemap) score += 3
  if (ssl_valid) score = Math.max(score, score + 2)
  if (psResult && psResult.mobile.performance >= 50) score += 5
  if (psResult && psResult.mobile.seo >= 80) score += 5
  score = Math.min(100, score)

  // Top issues
  const top_issues: string[] = []
  if (!homepageAudit.title) top_issues.push('Missing title tag on homepage')
  else if (homepageAudit.title_length && (homepageAudit.title_length < 10 || homepageAudit.title_length > 60))
    top_issues.push(`Title tag length (${homepageAudit.title_length} chars) — ideal 10–60`)
  if (!homepageAudit.meta_description) top_issues.push('Missing meta description on homepage')
  if (homepageAudit.h1_count === 0) top_issues.push('No H1 tag on homepage')
  if (homepageAudit.h1_count > 1) top_issues.push(`${homepageAudit.h1_count} H1 tags found — only 1 recommended`)
  if (!ssl_valid) top_issues.push('Site not served over HTTPS')
  if (!robots_txt) top_issues.push('Missing robots.txt')
  if (!sitemap_xml) top_issues.push('Missing sitemap.xml')
  if (!sbResult.clean) top_issues.push('Domain flagged in Google Safe Browsing')
  if (brokenLinks.length > 0) top_issues.push(`${brokenLinks.length} broken page(s) detected`)
  if (psResult && psResult.mobile.performance < 50) top_issues.push(`Low mobile performance score (${psResult.mobile.performance}/100)`)
  if (homepageAudit.images_missing_alt > 0) top_issues.push(`${homepageAudit.images_missing_alt} image(s) missing alt text`)

  return {
    pages_crawled: allPages.length,
    homepage: homepageAudit,
    all_pages: allPages,
    broken_links: brokenLinks,
    ssl_valid,
    ssl_days_remaining: null,
    robots_txt,
    sitemap_xml,
    pagespeed: psResult,
    crux: cruxResult,
    safe_browsing: sbResult,
    knowledge_panel: kgResult,
    indexed_pages: indexResult,
    score,
    top_issues: top_issues.slice(0, 5),
  }
}
