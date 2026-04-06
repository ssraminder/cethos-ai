import type { ComprehensiveAuditResults } from '@/lib/audit/comprehensive-audit'

function scoreColor(score: number): string {
  if (score >= 70) return '#10b981'
  if (score >= 45) return '#f59e0b'
  return '#ef4444'
}

export function renderPaidAuditEmail(
  fullName: string,
  websiteUrl: string,
  reportToken: string,
  results: ComprehensiveAuditResults,
  screenshotUrl: string | null,
  pdfUrl: string | null,
  siteBaseUrl = 'https://ascelo.ai'
): string {
  const reportUrl = `${siteBaseUrl}/audit/report/${reportToken}`
  const score = results.score
  const dfs = results.seo_intelligence

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 20px">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
      <!-- Header -->
      <tr><td style="background:#0A0F1E;padding:32px 40px;text-align:center">
        <p style="margin:0;color:#EC4899;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase">Ascelo AI · Comprehensive Audit</p>
        <h1 style="margin:8px 0 0;color:#ffffff;font-size:26px;font-weight:700">Your Full SEO Report</h1>
        <p style="margin:8px 0 0;color:#9ca3af;font-size:14px">${websiteUrl}</p>
      </td></tr>

      ${screenshotUrl ? `<tr><td style="padding:0"><img src="${screenshotUrl}" alt="${websiteUrl}" width="600" style="width:100%;display:block;max-height:280px;object-fit:cover"></td></tr>` : ''}

      <!-- Score + View Report -->
      <tr><td style="padding:40px;text-align:center">
        <p style="margin:0 0 8px;color:#6b7280;font-size:13px;letter-spacing:1px;text-transform:uppercase">Overall SEO Health Score</p>
        <p style="margin:0;font-size:72px;font-weight:800;color:${scoreColor(score)};line-height:1">${score}</p>
        <p style="margin:4px 0 24px;color:#9ca3af;font-size:14px">out of 100 · ${results.pages_crawled} pages analysed</p>
        <a href="${reportUrl}" style="display:inline-block;background:#EC4899;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px;margin-right:12px">View Full Report →</a>
        ${pdfUrl ? `<a href="${pdfUrl}" style="display:inline-block;background:#f3f4f6;color:#374151;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px">Download PDF</a>` : ''}
      </td></tr>

      <!-- SEO Intelligence (DataForSEO) -->
      <tr><td style="padding:0 40px 32px">
        <h2 style="margin:0 0 16px;color:#0A0F1E;font-size:18px;font-weight:700">SEO Intelligence</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;padding:12px;background:#f9fafb;border-radius:8px;margin:4px">
              <p style="margin:0;font-size:28px;font-weight:800;color:#0A0F1E">${dfs.domain_authority ?? '—'}</p>
              <p style="margin:4px 0 0;color:#6b7280;font-size:12px">Domain Authority</p>
            </td>
            <td width="8"></td>
            <td style="text-align:center;padding:12px;background:#f9fafb;border-radius:8px">
              <p style="margin:0;font-size:28px;font-weight:800;color:#0A0F1E">${dfs.backlinks_total?.toLocaleString() ?? '—'}</p>
              <p style="margin:4px 0 0;color:#6b7280;font-size:12px">Total Backlinks</p>
            </td>
            <td width="8"></td>
            <td style="text-align:center;padding:12px;background:#f9fafb;border-radius:8px">
              <p style="margin:0;font-size:28px;font-weight:800;color:#0A0F1E">${dfs.referring_domains?.toLocaleString() ?? '—'}</p>
              <p style="margin:4px 0 0;color:#6b7280;font-size:12px">Referring Domains</p>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Top Keywords -->
      ${dfs.top_keywords.length > 0 ? `
      <tr><td style="padding:0 40px 32px">
        <h2 style="margin:0 0 16px;color:#0A0F1E;font-size:18px;font-weight:700">Top Ranking Keywords</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
          <tr style="background:#f9fafb">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600">Keyword</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600">Position</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600">Monthly Searches</th>
          </tr>
          ${dfs.top_keywords.slice(0, 8).map(k => `
          <tr style="border-top:1px solid #e5e7eb">
            <td style="padding:10px 12px;font-size:13px;color:#374151">${k.keyword}</td>
            <td style="padding:10px 12px;font-size:13px;color:#374151;text-align:center;font-weight:600">#${k.position}</td>
            <td style="padding:10px 12px;font-size:13px;color:#374151;text-align:right">${k.monthly_searches?.toLocaleString() ?? '—'}</td>
          </tr>`).join('')}
        </table>
      </td></tr>` : ''}

      <!-- Technical Issues -->
      <tr><td style="padding:0 40px 32px">
        <h2 style="margin:0 0 16px;color:#0A0F1E;font-size:18px;font-weight:700">Technical Findings</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${[
            ['Duplicate Title Tags', results.duplicate_titles.length === 0],
            ['Duplicate Meta Descriptions', results.duplicate_meta_descriptions.length === 0],
            ['Canonical Issues', results.canonical_issues.length === 0],
            ['noindex Pages', results.noindex_pages.length === 0],
            ['Redirect Chains', results.redirect_chains.length === 0],
            ['Schema Markup Present', results.schema_markup.length > 0],
          ].map(([label, pass]) => `
          <tr>
            <td style="padding:8px 0;color:#374151;font-size:14px;border-bottom:1px solid #f3f4f6">${label}</td>
            <td style="padding:8px 0;text-align:right;border-bottom:1px solid #f3f4f6;font-size:14px">${pass ? '<span style="color:#10b981;font-weight:600">✓ Good</span>' : '<span style="color:#ef4444;font-weight:600">✗ Issues found</span>'}</td>
          </tr>`).join('')}
        </table>
      </td></tr>

      <!-- AI Recommendations -->
      ${results.ai_recommendations.length > 0 ? `
      <tr><td style="padding:0 40px 32px">
        <h2 style="margin:0 0 16px;color:#0A0F1E;font-size:18px;font-weight:700">AI-Powered Recommendations</h2>
        ${results.ai_recommendations.map((rec, i) => `
        <div style="margin-bottom:12px;padding:14px 16px;background:#f0fdf4;border-left:4px solid #10b981;border-radius:0 8px 8px 0">
          <span style="color:#10b981;font-weight:700;font-size:13px">${i + 1}. </span>
          <span style="color:#374151;font-size:14px">${rec}</span>
        </div>`).join('')}
      </td></tr>` : ''}

      <!-- Share CTA -->
      <tr><td style="padding:0 40px 40px">
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:24px;text-align:center">
          <p style="margin:0 0 8px;color:#0A0F1E;font-size:15px;font-weight:700">Share your report</p>
          <p style="margin:0 0 16px;color:#6b7280;font-size:13px">Send this link to your team, board, or agency</p>
          <a href="${reportUrl}" style="display:inline-block;background:#0A0F1E;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:13px;font-weight:600">Copy Report Link →</a>
        </div>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:0 40px 32px;text-align:center;border-top:1px solid #f3f4f6">
        <p style="margin:16px 0 4px;color:#6b7280;font-size:14px">Want us to implement these fixes?</p>
        <a href="https://ascelo.ai/contact" style="color:#EC4899;font-size:14px;font-weight:600">Talk to the Ascelo AI team →</a>
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
