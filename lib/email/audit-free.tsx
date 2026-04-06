import type { FreeAuditResults } from '@/lib/audit/free-audit'

function scoreColor(score: number): string {
  if (score >= 70) return '#10b981'
  if (score >= 45) return '#f59e0b'
  return '#ef4444'
}

function check(pass: boolean): string {
  return pass
    ? '<span style="color:#10b981;font-weight:600">✓ Pass</span>'
    : '<span style="color:#ef4444;font-weight:600">✗ Fail</span>'
}

export function renderFreeAuditEmail(
  fullName: string,
  websiteUrl: string,
  auditId: string,
  results: FreeAuditResults,
  screenshotUrl: string | null,
  siteBaseUrl = 'https://ascelo.ai'
): string {
  const score = results.score
  const upgradeUrl = `${siteBaseUrl}/audit/confirmation?id=${auditId}`

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 20px">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
      <!-- Header -->
      <tr><td style="background:#0A0F1E;padding:32px 40px;text-align:center">
        <p style="margin:0;color:#EC4899;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase">Ascelo AI</p>
        <h1 style="margin:8px 0 0;color:#ffffff;font-size:26px;font-weight:700">Your Free Website Audit</h1>
        <p style="margin:8px 0 0;color:#9ca3af;font-size:14px">${websiteUrl}</p>
      </td></tr>

      <!-- Screenshot -->
      ${screenshotUrl ? `<tr><td style="padding:0"><img src="${screenshotUrl}" alt="${websiteUrl} screenshot" width="600" style="width:100%;display:block;max-height:300px;object-fit:cover"></td></tr>` : ''}

      <!-- Score -->
      <tr><td style="padding:40px 40px 24px;text-align:center">
        <p style="margin:0 0 8px;color:#6b7280;font-size:13px;letter-spacing:1px;text-transform:uppercase">Overall SEO Health Score</p>
        <p style="margin:0;font-size:72px;font-weight:800;color:${scoreColor(score)};line-height:1">${score}</p>
        <p style="margin:4px 0 0;color:#9ca3af;font-size:14px">out of 100</p>
      </td></tr>

      <!-- Key Checks -->
      <tr><td style="padding:0 40px 32px">
        <h2 style="margin:0 0 16px;color:#0A0F1E;font-size:18px;font-weight:700">Key Findings</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${[
            ['HTTPS / SSL', results.ssl_valid],
            ['Title Tag', !!results.homepage.title],
            ['Meta Description', !!results.homepage.meta_description],
            ['Single H1 Tag', results.homepage.h1_count === 1],
            ['OG Image', results.homepage.og_image],
            ['Robots.txt', results.robots_txt],
            ['Sitemap.xml', results.sitemap_xml],
            ['Safe Browsing (Google)', results.safe_browsing.clean],
          ].map(([label, pass]) => `
          <tr>
            <td style="padding:8px 0;color:#374151;font-size:14px;border-bottom:1px solid #f3f4f6">${label}</td>
            <td style="padding:8px 0;text-align:right;border-bottom:1px solid #f3f4f6;font-size:14px">${check(Boolean(pass))}</td>
          </tr>`).join('')}
        </table>
      </td></tr>

      <!-- PageSpeed -->
      ${results.pagespeed ? `
      <tr><td style="padding:0 40px 32px">
        <h2 style="margin:0 0 16px;color:#0A0F1E;font-size:18px;font-weight:700">Google PageSpeed</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;padding:12px">
              <p style="margin:0;font-size:32px;font-weight:800;color:${scoreColor(results.pagespeed.mobile.performance)}">${results.pagespeed.mobile.performance}</p>
              <p style="margin:4px 0 0;color:#6b7280;font-size:12px">Mobile Performance</p>
            </td>
            <td style="text-align:center;padding:12px">
              <p style="margin:0;font-size:32px;font-weight:800;color:${scoreColor(results.pagespeed.mobile.seo)}">${results.pagespeed.mobile.seo}</p>
              <p style="margin:4px 0 0;color:#6b7280;font-size:12px">SEO Score</p>
            </td>
            <td style="text-align:center;padding:12px">
              <p style="margin:0;font-size:32px;font-weight:800;color:${scoreColor(results.pagespeed.desktop.performance)}">${results.pagespeed.desktop.performance}</p>
              <p style="margin:4px 0 0;color:#6b7280;font-size:12px">Desktop Performance</p>
            </td>
          </tr>
        </table>
      </td></tr>` : ''}

      <!-- CrUX -->
      ${results.crux?.available ? `
      <tr><td style="padding:0 40px 32px">
        <h2 style="margin:0 0 8px;color:#0A0F1E;font-size:18px;font-weight:700">Real User Data (Chrome UX)</h2>
        <p style="margin:0 0 16px;color:#6b7280;font-size:13px">Based on actual Chrome users visiting your site</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${results.crux.lcp ? `<tr><td style="padding:6px 0;color:#374151;font-size:14px">Largest Contentful Paint (LCP)</td><td style="text-align:right;font-size:14px;color:${results.crux.lcp.rating === 'good' ? '#10b981' : results.crux.lcp.rating === 'needs-improvement' ? '#f59e0b' : '#ef4444'};font-weight:600">${results.crux.lcp.rating} (${Math.round(results.crux.lcp.p75 / 100) / 10}s)</td></tr>` : ''}
          ${results.crux.cls ? `<tr><td style="padding:6px 0;color:#374151;font-size:14px">Cumulative Layout Shift (CLS)</td><td style="text-align:right;font-size:14px;color:${results.crux.cls.rating === 'good' ? '#10b981' : results.crux.cls.rating === 'needs-improvement' ? '#f59e0b' : '#ef4444'};font-weight:600">${results.crux.cls.rating}</td></tr>` : ''}
          ${results.crux.inp ? `<tr><td style="padding:6px 0;color:#374151;font-size:14px">Interaction to Next Paint (INP)</td><td style="text-align:right;font-size:14px;color:${results.crux.inp.rating === 'good' ? '#10b981' : results.crux.inp.rating === 'needs-improvement' ? '#f59e0b' : '#ef4444'};font-weight:600">${results.crux.inp.rating}</td></tr>` : ''}
        </table>
      </td></tr>` : ''}

      <!-- Top Issues -->
      ${results.top_issues.length > 0 ? `
      <tr><td style="padding:0 40px 32px">
        <h2 style="margin:0 0 16px;color:#0A0F1E;font-size:18px;font-weight:700">Top Issues to Fix</h2>
        ${results.top_issues.map((issue, i) => `
        <div style="display:flex;gap:12px;margin-bottom:12px;padding:12px 16px;background:#fef2f2;border-left:4px solid #ef4444;border-radius:0 8px 8px 0">
          <span style="color:#ef4444;font-weight:700;font-size:14px;min-width:20px">${i + 1}.</span>
          <span style="color:#374151;font-size:14px">${issue}</span>
        </div>`).join('')}
      </td></tr>` : ''}

      <!-- Upgrade CTA -->
      <tr><td style="padding:0 40px 40px">
        <div style="background:linear-gradient(135deg,#0A0F1E,#1a1f35);border-radius:12px;padding:32px;text-align:center">
          <p style="margin:0 0 8px;color:#EC4899;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase">Want the full picture?</p>
          <h3 style="margin:0 0 12px;color:#ffffff;font-size:22px;font-weight:700">Comprehensive Audit — $7.99</h3>
          <p style="margin:0 0 24px;color:#9ca3af;font-size:14px;line-height:1.6">
            50-page crawl · Domain Authority · Backlink profile · Top keywords · AI-written fix plan · Shareable PDF report
          </p>
          <a href="${upgradeUrl}" style="display:inline-block;background:#06B6D4;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px">Upgrade for $7.99 →</a>
        </div>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:0 40px 32px;text-align:center;border-top:1px solid #f3f4f6">
        <p style="margin:16px 0 0;color:#9ca3af;font-size:12px">
          Ascelo AI · 421 7 Ave SW, Floor 30, Calgary, AB T2P 4K9<br>
          <a href="mailto:info@ascelo.ai" style="color:#EC4899">info@ascelo.ai</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}
