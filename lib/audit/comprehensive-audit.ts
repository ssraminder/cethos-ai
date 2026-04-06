import { parse } from 'node-html-parser'
import { runFreeAudit, type FreeAuditResults, type PageAudit } from './free-audit'
import { getDataForSEO } from './dataforseo'
import { analyzeContent } from '@/lib/google/natural-language'
import { analyzeImages } from '@/lib/google/vision'
import { getAnthropic } from '@/lib/anthropic'
import type { TeaserResults } from './teaser'

export interface ComprehensiveAuditResults extends FreeAuditResults {
  // Extra crawl checks (50 pages)
  duplicate_titles: { title: string; pages: string[] }[]
  duplicate_meta_descriptions: { desc: string; pages: string[] }[]
  canonical_issues: { url: string; issue: string }[]
  noindex_pages: string[]
  redirect_chains: { start: string; chain: string[] }[]
  h1_issues: { url: string; count: number }[]
  schema_markup: { url: string; types: string[] }[]
  internal_link_graph: { most_linked: string[]; least_linked: string[] }
  // Google API enrichments
  natural_language: {
    homepage: Awaited<ReturnType<typeof analyzeContent>> | null
    pages: { url: string; result: Awaited<ReturnType<typeof analyzeContent>> }[]
  }
  vision: Awaited<ReturnType<typeof analyzeImages>> | null
  // DataForSEO
  seo_intelligence: Awaited<ReturnType<typeof getDataForSEO>>
  // AI
  ai_recommendations: string[]
  pdf_url: string | null
}

async function crawlPage50(url: string): Promise<PageAudit & { schema_types: string[]; redirect_chain: string[] }> {
  const chain: string[] = [url]
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AsceloAIAuditBot/1.0' },
      signal: AbortSignal.timeout(12000),
      redirect: 'follow',
    })
    // Detect redirect chain by comparing initial url to final
    const finalUrl = res.url
    if (finalUrl !== url) chain.push(finalUrl)

    const html = await res.text()
    const root = parse(html)

    const title = root.querySelector('title')?.text?.trim() ?? null
    const metaDesc = root.querySelector('meta[name="description"]')?.getAttribute('content') ?? null
    const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null
    const noindexMeta = root.querySelector('meta[name="robots"]')?.getAttribute('content') ?? ''
    const h1s = root.querySelectorAll('h1')
    const h2s = root.querySelectorAll('h2')
    const images = root.querySelectorAll('img')
    const imagesWithoutAlt = images.filter(img => !img.getAttribute('alt')?.trim())

    // Extract schema types
    const schemaScripts = root.querySelectorAll('script[type="application/ld+json"]')
    const schema_types: string[] = []
    for (const script of schemaScripts) {
      try {
        const obj = JSON.parse(script.text)
        const type = obj['@type']
        if (type) schema_types.push(Array.isArray(type) ? type.join(',') : type)
      } catch {}
    }

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
      og_image: !!root.querySelector('meta[property="og:image"]'),
      twitter_card: !!root.querySelector('meta[name="twitter:card"]'),
      canonical,
      noindex: noindexMeta.toLowerCase().includes('noindex'),
      images_total: images.length,
      images_missing_alt: imagesWithoutAlt.length,
      internal_links: internalLinks,
      broken: !res.ok,
      schema_types,
      redirect_chain: chain,
    }
  } catch {
    return {
      url, status: null, title: null, title_length: null, meta_description: null,
      meta_description_length: null, h1_count: 0, h2_count: 0, og_image: false,
      twitter_card: false, canonical: null, noindex: false, images_total: 0,
      images_missing_alt: 0, internal_links: [], broken: true, schema_types: [], redirect_chain: chain,
    }
  }
}

async function generateAIRecommendations(auditSummary: string): Promise<string[]> {
  try {
    const anthropic = getAnthropic()
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are an expert SEO consultant. Based on these website audit findings, write exactly 10 prioritized, actionable recommendations. Be specific, practical, and use plain language — no jargon. Each recommendation should be 1-2 sentences max.

Audit findings:
${auditSummary}

Return ONLY a JSON array of 10 strings: ["recommendation 1", "recommendation 2", ...]`,
      }],
    })
    const text = message.content[0].type === 'text' ? message.content[0].text : '[]'
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) return []
    return JSON.parse(match[0]) as string[]
  } catch {
    return []
  }
}

export async function runComprehensiveAudit(
  websiteUrl: string,
  teaser: TeaserResults,
  freeResults: FreeAuditResults
): Promise<ComprehensiveAuditResults> {
  const normalizedUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`
  const domain = new URL(normalizedUrl).hostname

  // Crawl 50 pages starting from discovered links
  const discoveredUrls = new Set<string>([normalizedUrl])
  const toVisit: string[] = []

  for (const page of freeResults.all_pages) {
    for (const href of page.internal_links) {
      try {
        const absolute = href.startsWith('http') ? href : `${normalizedUrl.replace(/\/$/, '')}${href}`
        const parsed = new URL(absolute)
        if (parsed.hostname === domain && !discoveredUrls.has(parsed.href)) {
          toVisit.push(parsed.href)
          discoveredUrls.add(parsed.href)
        }
      } catch {}
    }
  }

  const additionalResults = await Promise.allSettled(
    toVisit.slice(0, 35).map(url => crawlPage50(url))
  )
  const homepageExtended = await crawlPage50(normalizedUrl)
  const allExtended = [
    homepageExtended,
    ...additionalResults
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<Awaited<ReturnType<typeof crawlPage50>>>).value),
  ]
  const allPages = await Promise.all(allExtended)

  // Duplicate title detection
  const titleMap = new Map<string, string[]>()
  for (const p of allPages) {
    if (p.title) {
      const existing = titleMap.get(p.title) ?? []
      titleMap.set(p.title, [...existing, p.url])
    }
  }
  const duplicate_titles = Array.from(titleMap.entries())
    .filter(([, pages]) => pages.length > 1)
    .map(([title, pages]) => ({ title, pages }))

  // Duplicate meta descriptions
  const metaMap = new Map<string, string[]>()
  for (const p of allPages) {
    if (p.meta_description) {
      const existing = metaMap.get(p.meta_description) ?? []
      metaMap.set(p.meta_description, [...existing, p.url])
    }
  }
  const duplicate_meta_descriptions = Array.from(metaMap.entries())
    .filter(([, pages]) => pages.length > 1)
    .map(([desc, pages]) => ({ desc, pages }))

  // Canonical issues
  const canonical_issues: { url: string; issue: string }[] = []
  for (const p of allPages) {
    if (!p.canonical) canonical_issues.push({ url: p.url, issue: 'Missing canonical tag' })
    else if (p.canonical !== p.url && !p.canonical.startsWith('http'))
      canonical_issues.push({ url: p.url, issue: `Relative canonical: ${p.canonical}` })
  }

  // noindex pages
  const noindex_pages = allPages.filter(p => p.noindex).map(p => p.url)

  // Redirect chains
  const redirect_chains = allPages
    .filter(p => (p as PageAudit & { redirect_chain: string[] }).redirect_chain?.length > 1)
    .map(p => ({ start: p.url, chain: (p as PageAudit & { redirect_chain: string[] }).redirect_chain }))

  // H1 issues
  const h1_issues = allPages
    .filter(p => p.h1_count !== 1)
    .map(p => ({ url: p.url, count: p.h1_count }))

  // Schema markup
  const schema_markup = allPages
    .filter(p => (p as PageAudit & { schema_types: string[] }).schema_types?.length > 0)
    .map(p => ({ url: p.url, types: (p as PageAudit & { schema_types: string[] }).schema_types }))

  // Internal link graph
  const linkCount = new Map<string, number>()
  for (const p of allPages) {
    for (const link of p.internal_links) {
      linkCount.set(link, (linkCount.get(link) ?? 0) + 1)
    }
  }
  const sorted = Array.from(linkCount.entries()).sort((a, b) => b[1] - a[1])
  const internal_link_graph = {
    most_linked: sorted.slice(0, 5).map(([url]) => url),
    least_linked: sorted.slice(-5).map(([url]) => url),
  }

  // Collect all image URLs from crawled pages
  const allImageUrls: string[] = []
  for (const p of allPages.slice(0, 5)) {
    // We'd need to re-parse — using homepage only for now
    if (p.url === normalizedUrl && homepageExtended) {
      try {
        const res = await fetch(normalizedUrl, { signal: AbortSignal.timeout(5000) })
        const html = await res.text()
        const root = parse(html)
        root.querySelectorAll('img[src]').forEach(img => {
          const src = img.getAttribute('src') ?? ''
          if (src.startsWith('http')) allImageUrls.push(src)
        })
      } catch {}
    }
  }

  // Run enrichments in parallel
  const [nlHomepage, nlPages, visionResult, dfsResult] = await Promise.allSettled([
    analyzeContent(
      (() => {
        try { return allPages[0]?.title ?? '' } catch { return '' }
      })()
    ),
    Promise.allSettled(
      allPages.slice(1, 4).map(async p => ({
        url: p.url,
        result: await analyzeContent(p.title ?? ''),
      }))
    ),
    analyzeImages(allImageUrls.slice(0, 20)),
    getDataForSEO(domain),
  ])

  const nlHomepageResult = nlHomepage.status === 'fulfilled' ? nlHomepage.value : null
  const nlPagesResult = nlPages.status === 'fulfilled'
    ? nlPages.value.filter(r => r.status === 'fulfilled').map(r => (r as PromiseFulfilledResult<{ url: string; result: Awaited<ReturnType<typeof analyzeContent>> }>).value)
    : []
  const visionRes = visionResult.status === 'fulfilled' ? visionResult.value : null
  const dfsRes = dfsResult.status === 'fulfilled' ? dfsResult.value : {
    domain_authority: null, organic_traffic_estimate: null, paid_traffic_estimate: null,
    backlinks_total: null, referring_domains: null, top_backlinks: [], top_keywords: [],
  }

  // Build audit summary for AI
  const auditSummary = `
Website: ${websiteUrl}
Pages crawled: ${allPages.length}
Broken pages: ${freeResults.broken_links.length}
Duplicate titles: ${duplicate_titles.length}
Duplicate meta descriptions: ${duplicate_meta_descriptions.length}
Canonical issues: ${canonical_issues.length}
noindex pages: ${noindex_pages.length}
Pages missing H1: ${h1_issues.filter(h => h.count === 0).length}
Pages with multiple H1s: ${h1_issues.filter(h => h.count > 1).length}
SSL valid: ${freeResults.ssl_valid}
Robots.txt present: ${freeResults.robots_txt}
Sitemap present: ${freeResults.sitemap_xml}
Safe Browsing: ${freeResults.safe_browsing.clean ? 'Clean' : 'FLAGGED'}
Mobile PageSpeed: ${freeResults.pagespeed?.mobile.performance ?? 'N/A'}/100
Mobile SEO score: ${freeResults.pagespeed?.mobile.seo ?? 'N/A'}/100
LCP rating: ${freeResults.crux?.lcp?.rating ?? 'no data'}
Domain Authority: ${dfsRes.domain_authority ?? 'N/A'}
Backlinks: ${dfsRes.backlinks_total ?? 'N/A'}
Referring domains: ${dfsRes.referring_domains ?? 'N/A'}
Top keyword: ${dfsRes.top_keywords[0]?.keyword ?? 'N/A'} (pos ${dfsRes.top_keywords[0]?.position ?? 'N/A'})
Schema markup present: ${schema_markup.length > 0}
Knowledge Panel: ${freeResults.knowledge_panel.found}
Images missing alt text on homepage: ${allPages[0]?.images_missing_alt ?? 0}
Top issues: ${freeResults.top_issues.join('; ')}
`.trim()

  const ai_recommendations = await generateAIRecommendations(auditSummary)

  return {
    ...freeResults,
    pages_crawled: allPages.length,
    all_pages: allPages,
    duplicate_titles,
    duplicate_meta_descriptions,
    canonical_issues,
    noindex_pages,
    redirect_chains,
    h1_issues,
    schema_markup,
    internal_link_graph,
    natural_language: { homepage: nlHomepageResult, pages: nlPagesResult },
    vision: visionRes,
    seo_intelligence: dfsRes,
    ai_recommendations,
    pdf_url: null,
  }
}
