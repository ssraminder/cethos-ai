import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { CheckCircle, AlertTriangle, Globe, TrendingUp, Link2, Zap, Share2, FileText } from 'lucide-react'
import type { ComprehensiveAuditResults } from '@/lib/audit/comprehensive-audit'
import type { FreeAuditResults } from '@/lib/audit/free-audit'

interface Props {
  params: { token: string; locale: string }
  searchParams: { google?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'SEO Audit Report | Ascelo AI',
    description: 'Comprehensive SEO audit report powered by Ascelo AI',
    robots: 'noindex', // Don't index individual reports
  }
}

function scoreColor(score: number) {
  if (score >= 70) return { text: 'text-green-600', ring: '#10b981', label: 'Good' }
  if (score >= 45) return { text: 'text-amber-600', ring: '#f59e0b', label: 'Needs Work' }
  return { text: 'text-red-600', ring: '#ef4444', label: 'Critical' }
}

function PassFail({ label, pass, note }: { label: string; pass: boolean; note?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#0A0F1E]/5 last:border-0">
      <div>
        <p className="font-body text-[#0A0F1E] text-sm">{label}</p>
        {note && <p className="font-body text-[#0A0F1E]/40 text-xs mt-0.5">{note}</p>}
      </div>
      {pass
        ? <span className="flex items-center gap-1 text-green-600 font-heading font-semibold text-xs"><CheckCircle className="w-4 h-4" /> Pass</span>
        : <span className="flex items-center gap-1 text-red-500 font-heading font-semibold text-xs"><AlertTriangle className="w-4 h-4" /> Issue</span>
      }
    </div>
  )
}

export default async function ReportPage({ params: { token, locale }, searchParams }: Props) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: request } = await supabase
    .from('agp_audit_requests')
    .select('*')
    .eq('report_token', token)
    .single()

  if (!request || request.status !== 'paid_complete') notFound()

  const results = request.paid_audit_results as ComprehensiveAuditResults
  const freeResults = results as unknown as FreeAuditResults
  const score = results.score
  const colors = scoreColor(score)
  const dfs = results.seo_intelligence
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ascelo.ai'
  const reportUrl = `${siteUrl}/audit/report/${token}`

  return (
    <main className="min-h-screen bg-[#f9fafb] pt-20 md:pt-24">
      {/* Header */}
      <div className="bg-[#0A0F1E] py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-[#EC4899] font-heading font-semibold text-xs uppercase tracking-widest mb-2">Ascelo AI · Comprehensive Audit</p>
              <h1 className="font-heading font-bold text-white text-2xl md:text-3xl">{request.website_url}</h1>
              <p className="font-body text-white/40 text-sm mt-1">{results.pages_crawled} pages crawled · {new Date(request.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-3">
              {results.pdf_url && (
                <a href={results.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-heading font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer">
                  <FileText className="w-4 h-4" /> PDF
                </a>
              )}
              <ShareButton reportUrl={reportUrl} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Score + Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-[#0A0F1E]/8 p-8 text-center">
            <p className="font-body text-[#0A0F1E]/50 text-sm mb-2">SEO Health Score</p>
            <p className={`font-heading font-bold text-6xl ${colors.text}`}>{score}</p>
            <p className="font-body text-[#0A0F1E]/40 text-sm mt-1">{colors.label} · out of 100</p>
          </div>
          {request.screenshot_url && (
            <div className="md:col-span-2 rounded-2xl overflow-hidden border border-[#0A0F1E]/8 relative h-48">
              <div className="absolute top-0 left-0 right-0 bg-[#0A0F1E]/5 px-4 py-2 flex items-center gap-2 z-10">
                <Globe className="w-4 h-4 text-[#0A0F1E]/40" />
                <span className="font-body text-[#0A0F1E]/50 text-xs truncate">{request.website_url}</span>
              </div>
              <Image src={request.screenshot_url} alt={request.website_url} fill className="object-cover object-top" />
            </div>
          )}
        </div>

        {/* SEO Intelligence */}
        {dfs && (
          <div className="bg-white rounded-2xl border border-[#0A0F1E]/8 p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-[#EC4899]" />
              <h2 className="font-heading font-bold text-[#0A0F1E] text-lg">SEO Intelligence</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Domain Authority', value: dfs.domain_authority ?? '—' },
                { label: 'Total Backlinks', value: dfs.backlinks_total?.toLocaleString() ?? '—' },
                { label: 'Referring Domains', value: dfs.referring_domains?.toLocaleString() ?? '—' },
                { label: 'Est. Organic Traffic', value: dfs.organic_traffic_estimate?.toLocaleString() ?? '—' },
              ].map(stat => (
                <div key={stat.label} className="bg-[#f9fafb] rounded-xl p-4 text-center">
                  <p className="font-heading font-bold text-[#0A0F1E] text-2xl">{stat.value}</p>
                  <p className="font-body text-[#0A0F1E]/50 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            {dfs.top_keywords.length > 0 && (
              <div>
                <h3 className="font-heading font-semibold text-[#0A0F1E] text-sm uppercase tracking-widest mb-3">Top Ranking Keywords</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#0A0F1E]/8">
                        <th className="text-left font-heading font-semibold text-[#0A0F1E]/40 text-xs uppercase pb-2">Keyword</th>
                        <th className="text-center font-heading font-semibold text-[#0A0F1E]/40 text-xs uppercase pb-2">Position</th>
                        <th className="text-right font-heading font-semibold text-[#0A0F1E]/40 text-xs uppercase pb-2">Monthly Searches</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dfs.top_keywords.map((k, i) => (
                        <tr key={i} className="border-b border-[#0A0F1E]/5 last:border-0">
                          <td className="py-2.5 font-body text-[#0A0F1E] text-sm">{k.keyword}</td>
                          <td className="py-2.5 text-center font-heading font-bold text-[#EC4899] text-sm">#{k.position}</td>
                          <td className="py-2.5 text-right font-body text-[#0A0F1E]/60 text-sm">{k.monthly_searches?.toLocaleString() ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Performance */}
        {freeResults.pagespeed && (
          <div className="bg-white rounded-2xl border border-[#0A0F1E]/8 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Zap className="w-5 h-5 text-[#06B6D4]" />
              <h2 className="font-heading font-bold text-[#0A0F1E] text-lg">Google PageSpeed</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Mobile Performance', value: freeResults.pagespeed.mobile.performance },
                { label: 'Desktop Performance', value: freeResults.pagespeed.desktop.performance },
                { label: 'SEO Score', value: freeResults.pagespeed.mobile.seo },
                { label: 'Accessibility', value: freeResults.pagespeed.mobile.accessibility },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#f9fafb] rounded-xl p-4 text-center">
                  <p className={`font-heading font-bold text-2xl ${scoreColor(value).text}`}>{value}</p>
                  <p className="font-body text-[#0A0F1E]/50 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Audit */}
        <div className="bg-white rounded-2xl border border-[#0A0F1E]/8 p-6">
          <h2 className="font-heading font-bold text-[#0A0F1E] text-lg mb-5">Technical Audit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <PassFail label="HTTPS / SSL" pass={freeResults.ssl_valid} />
              <PassFail label="Robots.txt" pass={freeResults.robots_txt} />
              <PassFail label="Sitemap.xml" pass={freeResults.sitemap_xml} />
              <PassFail label="Safe Browsing" pass={freeResults.safe_browsing.clean} />
              <PassFail label="Title Tag" pass={!!freeResults.homepage.title} />
              <PassFail label="Meta Description" pass={!!freeResults.homepage.meta_description} />
            </div>
            <div>
              <PassFail label="Duplicate Titles" pass={results.duplicate_titles.length === 0} note={results.duplicate_titles.length > 0 ? `${results.duplicate_titles.length} duplicates found` : undefined} />
              <PassFail label="Canonical Tags" pass={results.canonical_issues.length === 0} note={results.canonical_issues.length > 0 ? `${results.canonical_issues.length} issues` : undefined} />
              <PassFail label="noindex Pages" pass={results.noindex_pages.length === 0} note={results.noindex_pages.length > 0 ? `${results.noindex_pages.length} pages` : undefined} />
              <PassFail label="Redirect Chains" pass={results.redirect_chains.length === 0} />
              <PassFail label="Schema Markup" pass={results.schema_markup.length > 0} />
              <PassFail label="H1 Tags" pass={results.h1_issues.length === 0} note={results.h1_issues.length > 0 ? `${results.h1_issues.length} pages with issues` : undefined} />
            </div>
          </div>
        </div>

        {/* Backlinks */}
        {dfs?.top_backlinks && dfs.top_backlinks.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#0A0F1E]/8 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Link2 className="w-5 h-5 text-[#EC4899]" />
              <h2 className="font-heading font-bold text-[#0A0F1E] text-lg">Top Backlinks</h2>
            </div>
            <div className="space-y-3">
              {dfs.top_backlinks.slice(0, 8).map((bl, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-[#0A0F1E]/5 last:border-0">
                  <div className="min-w-0">
                    <p className="font-body text-[#0A0F1E] text-sm truncate">{bl.url}</p>
                    <p className="font-body text-[#0A0F1E]/40 text-xs mt-0.5">Anchor: {bl.anchor || '(none)'}</p>
                  </div>
                  <span className="font-heading font-bold text-[#EC4899] text-sm flex-shrink-0">DR {bl.domain_rank}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {results.ai_recommendations.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#0A0F1E]/8 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Zap className="w-5 h-5 text-[#EC4899]" />
              <h2 className="font-heading font-bold text-[#0A0F1E] text-lg">AI-Powered Recommendations</h2>
            </div>
            <div className="space-y-3">
              {results.ai_recommendations.map((rec, i) => (
                <div key={i} className="flex gap-4 p-4 bg-[#f0fdf4] rounded-xl border border-green-100">
                  <span className="font-heading font-bold text-green-600 text-sm flex-shrink-0 w-6">{i + 1}.</span>
                  <p className="font-body text-[#0A0F1E] text-sm leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-[#0A0F1E] rounded-2xl p-8 text-center">
          <p className="font-body text-white/60 text-sm mb-2">Want us to implement these fixes?</p>
          <h3 className="font-heading font-bold text-white text-2xl mb-4">Talk to the Ascelo AI team</h3>
          <Link
            href="/contact"
            className="inline-flex bg-[#EC4899] text-white px-8 py-3.5 rounded-xl font-heading font-semibold text-base hover:bg-[#EC4899]/90 transition-colors duration-300 cursor-pointer"
          >
            Get a Free Strategy Call →
          </Link>
          <p className="font-body text-white/30 text-xs mt-4">No commitment · We&apos;ll review this report together</p>
        </div>

      </div>
    </main>
  )
}

function ShareButton({ reportUrl }: { reportUrl: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-heading font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer" title="Share report">
      <Share2 className="w-4 h-4" />
      <span>Share</span>
    </div>
  )
}
