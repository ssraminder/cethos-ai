import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const KEY_PAGES = [
  { path: '/', name: 'Home' },
  { path: '/services', name: 'Services' },
  { path: '/case-studies', name: 'Case Studies' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/ar', name: 'Arabic Home' },
  { path: '/fr', name: 'French Home' },
  { path: '/hi', name: 'Hindi Home' },
  { path: '/pa', name: 'Punjabi Home' },
]

// ─── Google API helpers ────────────────────────────────────────────────────

async function getPageSpeed(url: string, apiKey: string) {
  try {
    const [mobile, desktop] = await Promise.all([
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&key=${apiKey}`).then(r => r.json()),
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&key=${apiKey}`).then(r => r.json()),
    ])

    const extractScores = (data: any) => ({
      performance: Math.round((data.lighthouseResult?.categories?.performance?.score ?? 0) * 100),
      seo: Math.round((data.lighthouseResult?.categories?.seo?.score ?? 0) * 100),
      accessibility: Math.round((data.lighthouseResult?.categories?.accessibility?.score ?? 0) * 100),
      best_practices: Math.round((data.lighthouseResult?.categories?.['best-practices']?.score ?? 0) * 100),
      lcp: data.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue ?? null,
      cls: data.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue ?? null,
      fid: data.lighthouseResult?.audits?.['total-blocking-time']?.displayValue ?? null,
    })

    return { mobile: extractScores(mobile), desktop: extractScores(desktop) }
  } catch {
    return null
  }
}

async function getCrux(url: string, apiKey: string) {
  try {
    const res = await fetch(
      `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, metrics: ['largest_contentful_paint', 'cumulative_layout_shift', 'interaction_to_next_paint', 'first_contentful_paint', 'experimental_time_to_first_byte'] }),
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    const metrics = data.record?.metrics ?? {}
    const rating = (metric: any) => metric?.histogram?.[0]?.density > 0.75 ? 'good' : metric?.histogram?.[2]?.density > 0.1 ? 'poor' : 'needs-improvement'
    return {
      lcp: { rating: rating(metrics.largest_contentful_paint), p75: metrics.largest_contentful_paint?.percentiles?.p75 },
      cls: { rating: rating(metrics.cumulative_layout_shift), p75: metrics.cumulative_layout_shift?.percentiles?.p75 },
      inp: { rating: rating(metrics.interaction_to_next_paint), p75: metrics.interaction_to_next_paint?.percentiles?.p75 },
      fcp: { rating: rating(metrics.first_contentful_paint), p75: metrics.first_contentful_paint?.percentiles?.p75 },
      ttfb: { rating: rating(metrics.experimental_time_to_first_byte), p75: metrics.experimental_time_to_first_byte?.percentiles?.p75 },
    }
  } catch {
    return null
  }
}

async function checkSafeBrowsing(url: string, apiKey: string) {
  try {
    const res = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: { clientId: 'ascelo-ai-seo-agent', clientVersion: '1.0' },
          threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }],
          },
        }),
      }
    )
    const data = await res.json()
    return { clean: !data.matches || data.matches.length === 0, threats: data.matches ?? [] }
  } catch {
    return { clean: true, threats: [] }
  }
}

async function checkKnowledgeGraph(query: string, apiKey: string) {
  try {
    const res = await fetch(
      `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(query)}&limit=1&key=${apiKey}`
    )
    const data = await res.json()
    const entity = data.itemListElement?.[0]?.result
    if (!entity) return { found: false }
    return {
      found: true,
      name: entity.name,
      types: entity['@type'] ?? [],
      description: entity.detailedDescription?.articleBody ?? entity.description ?? null,
      url: entity.url ?? null,
    }
  } catch {
    return { found: false }
  }
}

async function getIndexedPageCount(domain: string, apiKey: string, cseId: string) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?cx=${cseId}&q=site:${domain}&key=${apiKey}&num=1`
    )
    const data = await res.json()
    const count = parseInt(data.searchInformation?.totalResults ?? '0', 10)
    return { count, formatted: data.searchInformation?.formattedTotalResults ?? '0' }
  } catch {
    return { count: 0, formatted: '0' }
  }
}

async function analyzeContent(text: string, apiKey: string) {
  try {
    const [entities, sentiment, categories] = await Promise.all([
      fetch(`https://language.googleapis.com/v1/documents:analyzeEntities?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document: { type: 'PLAIN_TEXT', content: text.slice(0, 5000) }, encodingType: 'UTF8' }),
      }).then(r => r.json()),
      fetch(`https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document: { type: 'PLAIN_TEXT', content: text.slice(0, 5000) } }),
      }).then(r => r.json()),
      fetch(`https://language.googleapis.com/v1/documents:classifyText?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document: { type: 'PLAIN_TEXT', content: text.slice(0, 5000) } }),
      }).then(r => r.json()),
    ])

    return {
      top_entities: (entities.entities ?? []).slice(0, 8).map((e: any) => ({ name: e.name, type: e.type, salience: e.salience })),
      sentiment: {
        score: sentiment.documentSentiment?.score ?? 0,
        magnitude: sentiment.documentSentiment?.magnitude ?? 0,
        label: (sentiment.documentSentiment?.score ?? 0) > 0.2 ? 'positive' : (sentiment.documentSentiment?.score ?? 0) < -0.2 ? 'negative' : 'neutral',
      },
      categories: (categories.categories ?? []).slice(0, 3).map((c: any) => ({ name: c.name, confidence: c.confidence })),
    }
  } catch {
    return null
  }
}

async function analyzeImages(imageUrls: string[], apiKey: string) {
  if (imageUrls.length === 0) return []
  const batch = imageUrls.slice(0, 10)
  try {
    const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: batch.map(url => ({
          image: { source: { imageUri: url } },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 5 },
            { type: 'SAFE_SEARCH_DETECTION' },
          ],
        })),
      }),
    })
    const data = await res.json()
    return (data.responses ?? []).map((r: any, i: number) => ({
      url: batch[i],
      labels: (r.labelAnnotations ?? []).slice(0, 5).map((l: any) => l.description),
      safe: r.safeSearchAnnotation?.adult === 'VERY_UNLIKELY' && r.safeSearchAnnotation?.violence === 'VERY_UNLIKELY',
    }))
  } catch {
    return []
  }
}

// ─── Claude AI audit ────────────────────────────────────────────────────────

async function claudeAudit(pageHtml: string, pageName: string, pageUrl: string, googleData: any, anthropicKey: string) {
  const googleContext = googleData ? `
Google API Signals for this domain:
- PageSpeed Mobile: ${googleData.pagespeed?.mobile?.performance ?? 'N/A'}/100 | Desktop: ${googleData.pagespeed?.desktop?.performance ?? 'N/A'}/100
- Core Web Vitals (real users): LCP ${googleData.crux?.lcp?.rating ?? 'N/A'} | CLS ${googleData.crux?.cls?.rating ?? 'N/A'} | INP ${googleData.crux?.inp?.rating ?? 'N/A'}
- Safe Browsing: ${googleData.safe_browsing?.clean ? 'Clean' : 'THREATS DETECTED'}
- Knowledge Panel: ${googleData.knowledge_graph?.found ? `Found — ${googleData.knowledge_graph.name}` : 'Not found'}
- Indexed pages: ${googleData.indexed_pages?.formatted ?? 'Unknown'}
- NL Content Category: ${googleData.nl_analysis?.categories?.[0]?.name ?? 'N/A'}
- Content Sentiment: ${googleData.nl_analysis?.sentiment?.label ?? 'N/A'} (${googleData.nl_analysis?.sentiment?.score ?? 0})
` : ''

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are an expert SEO specialist auditing Ascelo AI — an AI-powered digital marketing agency serving clients globally in 5 languages (EN, AR, FR, HI, PA).

Audit this page: ${pageName} (${pageUrl})

${googleContext}

HTML/Content snippet:
${pageHtml.slice(0, 4000)}

Return ONLY valid JSON (no markdown, no backticks):
{
  "score": <number 0-100>,
  "critical_issues": [{"issue": "...", "fix": "...", "impact": "high|medium|low"}],
  "keyword_gaps": ["keyword1", "keyword2"],
  "meta_suggestions": {"title": "...", "description": "..."},
  "content_recommendations": ["recommendation1", "recommendation2"],
  "technical_issues": ["issue1", "issue2"],
  "multilingual_notes": "notes specific to multilingual/hreflang setup",
  "quick_wins": ["actionable fix that can be done in <1 hour"]
}`,
      }],
    }),
  })

  const data = await res.json()
  const text = data.content?.[0]?.text ?? '{}'
  return JSON.parse(text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim())
}

// ─── Extract text and images from HTML ──────────────────────────────────────

function extractText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractImageUrls(html: string, baseUrl: string): string[] {
  const matches = [...html.matchAll(/src="(https?:\/\/[^"]+\.(jpg|jpeg|png|webp|gif))"/gi)]
  return [...new Set(matches.map(m => m[1]))].slice(0, 10)
}

// ─── Main handler ─────────────────────────────────────────────────────────

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY')!
    const cseId = Deno.env.get('GOOGLE_CUSTOM_SEARCH_ENGINE_ID') ?? ''
    const resendKey = Deno.env.get('RESEND_API_KEY')!
    const ceoEmail = Deno.env.get('CEO_EMAIL')!
    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://ascelo.ai'

    const domain = new URL(siteUrl).hostname

    // ── Step 1: Fetch all page HTML in parallel ──
    const pageHtmlMap: Record<string, string> = {}
    await Promise.all(
      KEY_PAGES.map(async (page) => {
        const url = `${siteUrl}${page.path}`
        try {
          const res = await fetch(url, { headers: { 'User-Agent': 'AsceloAISEOBot/1.0' } })
          pageHtmlMap[page.path] = await res.text()
        } catch {
          pageHtmlMap[page.path] = `Could not fetch ${url}`
        }
      })
    )

    const homepageHtml = pageHtmlMap['/'] ?? ''
    const homepageText = extractText(homepageHtml)
    const homepageUrl = `${siteUrl}/`
    const homepageImages = extractImageUrls(homepageHtml, siteUrl)

    // ── Step 2: Run all Google APIs in parallel ──
    const [pagespeed, crux, safe_browsing, knowledge_graph, indexed_pages, nl_analysis, vision_results] = await Promise.all([
      getPageSpeed(homepageUrl, googleApiKey),
      getCrux(homepageUrl, googleApiKey),
      checkSafeBrowsing(homepageUrl, googleApiKey),
      checkKnowledgeGraph('Ascelo AI', googleApiKey),
      cseId ? getIndexedPageCount(domain, googleApiKey, cseId) : Promise.resolve({ count: 0, formatted: 'N/A' }),
      analyzeContent(homepageText, googleApiKey),
      analyzeImages(homepageImages, googleApiKey),
    ])

    const googleData = { pagespeed, crux, safe_browsing, knowledge_graph, indexed_pages, nl_analysis, vision_results }

    // ── Step 3: Claude audit for each page ──
    const auditResults = []
    let totalScore = 0

    for (const page of KEY_PAGES) {
      const pageUrl = `${siteUrl}${page.path}`
      const html = pageHtmlMap[page.path] ?? ''

      let audit: any = {}
      try {
        // Only pass Google data to homepage audit (it's domain-level data)
        audit = await claudeAudit(html, page.name, pageUrl, page.path === '/' ? googleData : null, anthropicKey)
      } catch (err) {
        console.error(`Audit failed for ${page.name}:`, err)
        audit = { score: 0, critical_issues: [], keyword_gaps: [], meta_suggestions: {}, content_recommendations: [], technical_issues: [], multilingual_notes: '', quick_wins: [] }
      }

      totalScore += audit.score ?? 0

      const { data: saved } = await supabase.from('agp_seo_audits').insert({
        page_url: pageUrl,
        score: audit.score,
        issues: audit.critical_issues,
        recommendations: {
          keyword_gaps: audit.keyword_gaps,
          meta_suggestions: audit.meta_suggestions,
          content_recommendations: audit.content_recommendations,
          technical_issues: audit.technical_issues,
          multilingual_notes: audit.multilingual_notes,
          quick_wins: audit.quick_wins,
          google_data: page.path === '/' ? googleData : undefined,
        },
        status: 'open',
      }).select().single()

      auditResults.push({ page: page.name, url: pageUrl, score: audit.score ?? 0, audit, id: saved?.id })
    }

    const avgScore = Math.round(totalScore / KEY_PAGES.length)

    const criticalIssues = auditResults.flatMap(r =>
      (r.audit.critical_issues ?? []).filter((i: any) => i.impact === 'high').map((i: any) => ({
        page: r.page, issue: i.issue, fix: i.fix,
      }))
    )

    const quickWins = auditResults.flatMap(r =>
      (r.audit.quick_wins ?? []).map((w: string) => ({ page: r.page, win: w }))
    )

    // ── Step 4: Build email report ──
    const scoreColor = (s: number) => s >= 70 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444'
    const ratingBadge = (r: string) => r === 'good' ? '🟢 Good' : r === 'needs-improvement' ? '🟡 Needs Work' : '🔴 Poor'

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:'Plus Jakarta Sans',Helvetica,sans-serif;background:#f9fafb;margin:0;padding:0">
<div style="max-width:700px;margin:0 auto;background:white;border-radius:16px;overflow:hidden">

  <!-- Header -->
  <div style="background:#0A0F1E;padding:32px 40px">
    <p style="color:#EC4899;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">Ascelo AI · Monthly SEO Audit</p>
    <h1 style="color:white;font-size:28px;margin:0 0 4px">SEO Performance Report</h1>
    <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0">${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
  </div>

  <div style="padding:32px 40px">

    <!-- Overall Score -->
    <div style="text-align:center;padding:32px;background:#f9fafb;border-radius:16px;margin-bottom:32px">
      <p style="color:#6b7280;font-size:13px;margin:0 0 8px">Overall SEO Health Score</p>
      <p style="font-size:72px;font-weight:800;color:${scoreColor(avgScore)};margin:0;line-height:1">${avgScore}</p>
      <p style="color:#9ca3af;font-size:13px;margin:8px 0 0">out of 100 · ${KEY_PAGES.length} pages audited</p>
    </div>

    <!-- Page Scores -->
    <h2 style="font-size:16px;color:#0A0F1E;margin:0 0 16px">Page Scores</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
      <tr style="background:#0A0F1E">
        <th style="padding:10px 14px;text-align:left;color:white;font-size:12px">Page</th>
        <th style="padding:10px 14px;text-align:right;color:white;font-size:12px">Score</th>
      </tr>
      ${auditResults.map(r => `
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:10px 14px;font-size:13px;color:#0A0F1E">${r.page}</td>
        <td style="padding:10px 14px;text-align:right;font-weight:700;font-size:13px;color:${scoreColor(r.score)}">${r.score}/100</td>
      </tr>`).join('')}
    </table>

    <!-- Google PageSpeed -->
    ${pagespeed ? `
    <h2 style="font-size:16px;color:#0A0F1E;margin:0 0 16px">Google PageSpeed (Homepage)</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
      <tr style="background:#f3f4f6">
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase">Metric</th>
        <th style="padding:8px 12px;text-align:center;font-size:11px;color:#6b7280;text-transform:uppercase">Mobile</th>
        <th style="padding:8px 12px;text-align:center;font-size:11px;color:#6b7280;text-transform:uppercase">Desktop</th>
      </tr>
      ${[
        ['Performance', pagespeed.mobile.performance, pagespeed.desktop.performance],
        ['SEO', pagespeed.mobile.seo, pagespeed.desktop.seo],
        ['Accessibility', pagespeed.mobile.accessibility, pagespeed.desktop.accessibility],
        ['Best Practices', pagespeed.mobile.best_practices, pagespeed.desktop.best_practices],
      ].map(([label, mob, desk]) => `
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:10px 12px;font-size:13px;color:#0A0F1E">${label}</td>
        <td style="padding:10px 12px;text-align:center;font-weight:700;font-size:13px;color:${scoreColor(mob as number)}">${mob}</td>
        <td style="padding:10px 12px;text-align:center;font-weight:700;font-size:13px;color:${scoreColor(desk as number)}">${desk}</td>
      </tr>`).join('')}
    </table>` : ''}

    <!-- Core Web Vitals -->
    ${crux ? `
    <h2 style="font-size:16px;color:#0A0F1E;margin:0 0 8px">Core Web Vitals (Real Users)</h2>
    <p style="font-size:12px;color:#9ca3af;margin:0 0 16px">Field data from Chrome users visiting your site</p>
    <div style="display:grid;gap:12px;margin-bottom:32px">
      ${[
        ['LCP', crux.lcp],
        ['CLS', crux.cls],
        ['INP', crux.inp],
        ['FCP', crux.fcp],
        ['TTFB', crux.ttfb],
      ].map(([key, val]: any) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#f9fafb;border-radius:8px">
        <span style="font-size:13px;color:#0A0F1E;font-weight:600">${key}</span>
        <span style="font-size:13px">${ratingBadge(val?.rating ?? 'N/A')} · p75: ${val?.p75 ?? 'N/A'}</span>
      </div>`).join('')}
    </div>` : ''}

    <!-- Domain Intelligence -->
    <h2 style="font-size:16px;color:#0A0F1E;margin:0 0 16px">Domain Intelligence</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:10px 14px;font-size:13px;color:#6b7280">Safe Browsing</td>
        <td style="padding:10px 14px;font-size:13px;font-weight:600;color:${safe_browsing?.clean ? '#10b981' : '#ef4444'}">${safe_browsing?.clean ? '✓ Clean — no threats detected' : '⚠ THREATS DETECTED'}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:10px 14px;font-size:13px;color:#6b7280">Knowledge Panel</td>
        <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#0A0F1E">${knowledge_graph?.found ? `✓ Found — ${knowledge_graph.name}` : '✗ Not found on Google'}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:10px 14px;font-size:13px;color:#6b7280">Indexed Pages</td>
        <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#0A0F1E">${indexed_pages?.formatted ?? 'N/A'}</td>
      </tr>
      ${nl_analysis ? `
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:10px 14px;font-size:13px;color:#6b7280">Content Category</td>
        <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#0A0F1E">${nl_analysis.categories?.[0]?.name ?? 'N/A'}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:13px;color:#6b7280">Content Sentiment</td>
        <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#0A0F1E">${nl_analysis.sentiment?.label ?? 'N/A'} (${nl_analysis.sentiment?.score?.toFixed(2) ?? '0'})</td>
      </tr>` : ''}
    </table>

    ${nl_analysis?.top_entities?.length ? `
    <h2 style="font-size:16px;color:#0A0F1E;margin:0 0 12px">Top Homepage Entities (Natural Language API)</h2>
    <div style="margin-bottom:32px">
      ${nl_analysis.top_entities.map((e: any) => `
      <span style="display:inline-block;background:#f3f4f6;border-radius:6px;padding:4px 10px;margin:3px;font-size:12px;color:#374151">${e.name} <span style="color:#9ca3af">(${e.type})</span></span>
      `).join('')}
    </div>` : ''}

    ${vision_results?.length ? `
    <h2 style="font-size:16px;color:#0A0F1E;margin:0 0 12px">Image Analysis (Cloud Vision API)</h2>
    <p style="font-size:13px;color:#6b7280;margin:0 0 16px">${vision_results.length} images analysed from homepage</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
      ${vision_results.map((img: any) => `
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:8px 12px;font-size:11px;color:#6b7280;max-width:200px;overflow:hidden;text-overflow:ellipsis">${img.url?.split('/').pop() ?? img.url}</td>
        <td style="padding:8px 12px;font-size:12px;color:#0A0F1E">${(img.labels ?? []).join(', ')}</td>
        <td style="padding:8px 12px;font-size:12px;color:${img.safe ? '#10b981' : '#ef4444'}">${img.safe ? '✓ Safe' : '⚠ Review'}</td>
      </tr>`).join('')}
    </table>` : ''}

    <!-- Critical Issues -->
    ${criticalIssues.length > 0 ? `
    <h2 style="font-size:16px;color:#0A0F1E;margin:0 0 16px">Critical Issues (${criticalIssues.length})</h2>
    <ul style="margin:0 0 32px;padding-left:0;list-style:none">
      ${criticalIssues.map(i => `
      <li style="padding:12px 16px;background:#fef2f2;border-left:3px solid #ef4444;border-radius:4px;margin-bottom:8px">
        <p style="font-weight:700;font-size:13px;color:#0A0F1E;margin:0 0 4px">${i.page}: ${i.issue}</p>
        <p style="font-size:12px;color:#6b7280;margin:0">Fix: ${i.fix}</p>
      </li>`).join('')}
    </ul>` : `
    <div style="padding:16px;background:#f0fdf4;border-radius:8px;margin-bottom:32px;text-align:center">
      <p style="font-weight:700;color:#10b981;margin:0">No critical issues found</p>
    </div>`}

    <!-- Quick Wins -->
    <h2 style="font-size:16px;color:#0A0F1E;margin:0 0 16px">Quick Wins</h2>
    <ul style="margin:0 0 32px;padding-left:0;list-style:none">
      ${quickWins.slice(0, 10).map(w => `
      <li style="padding:10px 14px;background:#f0fdf4;border-left:3px solid #10b981;border-radius:4px;margin-bottom:6px;font-size:13px;color:#0A0F1E">
        <strong>${w.page}:</strong> ${w.win}
      </li>`).join('')}
    </ul>

    <!-- Multilingual Notes -->
    <h2 style="font-size:16px;color:#0A0F1E;margin:0 0 16px">Multilingual SEO Notes</h2>
    <ul style="margin:0 0 32px;padding-left:0;list-style:none">
      ${auditResults.filter(r => r.audit.multilingual_notes).map(r => `
      <li style="padding:10px 14px;background:#f9fafb;border-radius:4px;margin-bottom:6px;font-size:13px;color:#0A0F1E">
        <strong>${r.page}:</strong> ${r.audit.multilingual_notes}
      </li>`).join('')}
    </ul>

  </div>

  <!-- Footer -->
  <div style="background:#0A0F1E;padding:24px 40px;text-align:center">
    <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0">Generated by Ascelo AI SEO Agent · ${new Date().toISOString()}</p>
    <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:4px 0 0">Powered by Claude Sonnet + 7 Google APIs</p>
  </div>

</div>
</body>
</html>
    `

    // ── Step 5: Send email via Resend ──
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ascelo AI SEO Agent <noreply@ascelo.ai>',
        to: [ceoEmail],
        subject: `Monthly SEO Audit — Score: ${avgScore}/100 · ${criticalIssues.length} Critical Issues · ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`,
        html: emailHtml,
      }),
    })

    return new Response(
      JSON.stringify({
        success: true,
        pages_audited: KEY_PAGES.length,
        avg_score: avgScore,
        critical_issues: criticalIssues.length,
        google_apis: {
          pagespeed: !!pagespeed,
          crux: !!crux,
          safe_browsing: !!safe_browsing,
          knowledge_graph: !!knowledge_graph,
          indexed_pages: indexed_pages?.count ?? 0,
          nl_analysis: !!nl_analysis,
          vision_images_analyzed: vision_results?.length ?? 0,
        },
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('SEO Agent error:', err)
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
