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

const SEO_AUDIT_PROMPT = (pageHtml: string, pageName: string, pageUrl: string) => `
You are an expert SEO specialist auditing a digital marketing agency website.
Agency: Cethos Media — targets India, UAE, Canada. 5 languages: EN, AR, FR, HI, PA.

Audit the following page: ${pageName} (${pageUrl})

HTML/Content snippet:
${pageHtml.slice(0, 4000)}

Perform a comprehensive SEO audit and return ONLY valid JSON:
{
  "score": <number 0-100>,
  "critical_issues": [{"issue": "...", "fix": "...", "impact": "high|medium|low"}],
  "keyword_gaps": ["keyword1", "keyword2"],
  "meta_suggestions": {"title": "...", "description": "..."},
  "content_recommendations": ["recommendation1", "recommendation2"],
  "technical_issues": ["issue1", "issue2"],
  "multilingual_notes": "notes specific to multilingual/hreflang setup",
  "quick_wins": ["actionable fix that can be done in <1 hour"]
}
`

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const openaiKey = Deno.env.get('OPENAI_API_KEY')!
    const brevoKey = Deno.env.get('BREVO_API_KEY')!
    const ceoEmail = Deno.env.get('CEO_EMAIL')!
    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://cethosmedia.com'

    const auditResults = []
    let totalScore = 0

    for (const page of KEY_PAGES) {
      const pageUrl = `${siteUrl}${page.path}`
      let pageHtml = ''
      try {
        const res = await fetch(pageUrl, { headers: { 'User-Agent': 'CethosMediaSEOBot/1.0' } })
        pageHtml = await res.text()
      } catch {
        pageHtml = `Could not fetch ${pageUrl}`
      }

      const auditResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: SEO_AUDIT_PROMPT(pageHtml, page.name, pageUrl) }],
          temperature: 0.3,
          max_tokens: 1500,
          response_format: { type: 'json_object' },
        }),
      })
      const auditData = await auditResponse.json()
      const audit = JSON.parse(auditData.choices[0].message.content)

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
        },
        status: 'open',
      }).select().single()

      auditResults.push({ page: page.name, url: pageUrl, score: audit.score, audit, id: saved?.id })
    }

    const avgScore = Math.round(totalScore / KEY_PAGES.length)

    // Build email report
    const criticalIssues = auditResults.flatMap(r =>
      (r.audit.critical_issues ?? []).filter((i: any) => i.impact === 'high').map((i: any) => ({
        page: r.page, issue: i.issue, fix: i.fix
      }))
    )

    const quickWins = auditResults.flatMap(r =>
      (r.audit.quick_wins ?? []).map((w: string) => ({ page: r.page, win: w }))
    )

    const emailHtml = `
<h1>📊 Monthly SEO Audit Report — Cethos Media</h1>
<p><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
<h2>Overall SEO Score: ${avgScore}/100</h2>
<table border="1" cellpadding="8" style="border-collapse:collapse;width:100%">
  <tr style="background:#0A0F1E;color:white"><th>Page</th><th>Score</th></tr>
  ${auditResults.map(r => `<tr><td>${r.page}</td><td style="color:${r.score >= 70 ? 'green' : r.score >= 50 ? 'orange' : 'red'}">${r.score}/100</td></tr>`).join('')}
</table>

<h2>🚨 Critical Issues (${criticalIssues.length})</h2>
<ul>${criticalIssues.map(i => `<li><strong>${i.page}:</strong> ${i.issue}<br/><em>Fix: ${i.fix}</em></li>`).join('')}</ul>

<h2>⚡ Quick Wins</h2>
<ul>${quickWins.slice(0, 10).map(w => `<li><strong>${w.page}:</strong> ${w.win}</li>`).join('')}</ul>

<h2>🌐 Multilingual SEO Notes</h2>
<ul>${auditResults.filter(r => r.audit.multilingual_notes).map(r => `<li><strong>${r.page}:</strong> ${r.audit.multilingual_notes}</li>`).join('')}</ul>

<p style="color:#999;font-size:12px;">Generated by Cethos Media SEO Agent • ${new Date().toISOString()}</p>
    `

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Cethos Media SEO Agent', email: 'noreply@cethos.com' },
        to: [{ email: ceoEmail }],
        subject: `📊 Monthly SEO Audit — Overall Score: ${avgScore}/100 | ${criticalIssues.length} Critical Issues`,
        htmlContent: emailHtml,
      }),
    })

    return new Response(
      JSON.stringify({ success: true, pages_audited: KEY_PAGES.length, avg_score: avgScore, critical_issues: criticalIssues.length }),
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
