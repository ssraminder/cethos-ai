import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { CheckCircle, AlertTriangle, Shield, Globe, TrendingUp, Zap } from 'lucide-react'
import type { TeaserResults } from '@/lib/audit/teaser'

interface Props {
  searchParams: { id?: string }
}

function scoreColor(score: number) {
  if (score >= 70) return { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', ring: '#10b981' }
  if (score >= 45) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', ring: '#f59e0b' }
  return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', ring: '#ef4444' }
}

function CheckRow({ label, pass, note }: { label: string; pass: boolean; note?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#0A0F1E]/5 last:border-0">
      <div>
        <p className="font-body text-[#0A0F1E] text-sm">{label}</p>
        {note && <p className="font-body text-[#0A0F1E]/40 text-xs mt-0.5">{note}</p>}
      </div>
      {pass
        ? <span className="flex items-center gap-1 text-green-600 font-heading font-semibold text-xs"><CheckCircle className="w-4 h-4" /> Pass</span>
        : <span className="flex items-center gap-1 text-red-500 font-heading font-semibold text-xs"><AlertTriangle className="w-4 h-4" /> Fail</span>
      }
    </div>
  )
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const id = searchParams.id
  if (!id) notFound()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: request } = await supabase
    .from('agp_audit_requests')
    .select('id, website_url, full_name, teaser_results, screenshot_url, report_token, status, email_verified')
    .eq('id', id)
    .single()

  if (!request || !request.email_verified) notFound()

  const teaser = request.teaser_results as TeaserResults | null
  const score = teaser?.score ?? 0
  const colors = scoreColor(score)

  const UPGRADE_FEATURES = [
    '50-page deep crawl',
    'Duplicate title & meta detection',
    'Canonical + noindex audit',
    'Redirect chain analysis',
    'Schema markup detection',
    'Domain Authority score',
    'Backlink profile summary',
    'Top 10 ranking keywords',
    'Full Google PageSpeed report',
    'Natural Language content analysis',
    'AI-written fix recommendations',
    'Shareable PDF report',
  ]

  return (
    <main className="min-h-screen bg-[#f9fafb] pt-20 md:pt-24">
      {/* Banner */}
      <div className="bg-[#0A0F1E] py-8 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 text-sm font-heading font-semibold px-4 py-2 rounded-full mb-3">
          <CheckCircle className="w-4 h-4" /> Email Verified
        </div>
        <p className="font-heading font-bold text-white text-xl">Your free audit is being prepared</p>
        <p className="font-body text-white/50 text-sm mt-1">Check your inbox in ~5 minutes · <span className="text-[#EC4899]">{request.website_url}</span></p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Teaser results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Screenshot */}
            {request.screenshot_url && (
              <div className="rounded-2xl overflow-hidden border border-[#0A0F1E]/10 shadow-sm">
                <div className="bg-[#0A0F1E]/5 px-4 py-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0A0F1E]/40" />
                  <span className="font-body text-[#0A0F1E]/50 text-xs truncate">{request.website_url}</span>
                </div>
                <div className="relative h-48 w-full">
                  <Image src={request.screenshot_url} alt={`${request.website_url} screenshot`} fill className="object-cover object-top" />
                </div>
              </div>
            )}

            {/* Score */}
            {teaser && (
              <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-6 text-center`}>
                <p className="font-body text-[#0A0F1E]/60 text-sm mb-2">Overall SEO Health Score</p>
                <p className={`font-heading font-bold text-6xl ${colors.text}`}>{score}</p>
                <p className="font-body text-[#0A0F1E]/40 text-sm mt-1">out of 100</p>
              </div>
            )}

            {/* Teaser checks */}
            {teaser && (
              <div className="bg-white rounded-2xl border border-[#0A0F1E]/8 p-6">
                <h2 className="font-heading font-bold text-[#0A0F1E] text-lg mb-4">Quick Findings</h2>
                <CheckRow label="Site Accessible (HTTP 200)" pass={teaser.homepage_loads} />
                <CheckRow label="HTTPS / SSL" pass={teaser.https} />
                <CheckRow
                  label="Google Safe Browsing"
                  pass={teaser.safe_browsing_clean}
                  note={teaser.safe_browsing_clean ? 'No threats detected' : 'Domain may be flagged'}
                />
                <CheckRow
                  label="Title Tag"
                  pass={teaser.title_present}
                  note={teaser.title_length ? `${teaser.title_length} characters` : undefined}
                />
                <CheckRow label="Meta Description" pass={teaser.meta_description} />
                <CheckRow
                  label="H1 Tag"
                  pass={teaser.h1_count === 1}
                  note={teaser.h1_count === 0 ? 'Missing' : teaser.h1_count > 1 ? `${teaser.h1_count} found — should be 1` : undefined}
                />
                <CheckRow label="OG Image (Social Preview)" pass={teaser.og_image} />
                <CheckRow label="Mobile Viewport Meta" pass={teaser.viewport_meta} />
                <CheckRow label="Robots.txt" pass={teaser.robots_txt} />
                <CheckRow label="Sitemap.xml" pass={teaser.sitemap} />
                {teaser.knowledge_panel && (
                  <CheckRow label="Google Knowledge Panel" pass={teaser.knowledge_panel} note="Business has a Google entity" />
                )}
                {teaser.crux_lcp_rating !== 'no-data' && (
                  <CheckRow
                    label="Real User LCP (Chrome Data)"
                    pass={teaser.crux_lcp_rating === 'good'}
                    note={`Rating: ${teaser.crux_lcp_rating}`}
                  />
                )}
              </div>
            )}
          </div>

          {/* Right: Upgrade CTA */}
          <div className="lg:col-span-1 space-y-6">
            {/* Safe Browsing badge */}
            {teaser && (
              <div className={`rounded-2xl p-4 flex items-center gap-3 ${teaser.safe_browsing_clean ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <Shield className={`w-6 h-6 flex-shrink-0 ${teaser.safe_browsing_clean ? 'text-green-600' : 'text-red-500'}`} />
                <div>
                  <p className={`font-heading font-semibold text-sm ${teaser.safe_browsing_clean ? 'text-green-800' : 'text-red-800'}`}>
                    {teaser.safe_browsing_clean ? 'No security threats' : 'Security issue detected'}
                  </p>
                  <p className={`font-body text-xs mt-0.5 ${teaser.safe_browsing_clean ? 'text-green-600' : 'text-red-600'}`}>
                    {teaser.safe_browsing_clean ? 'Verified by Google Safe Browsing' : 'Domain may be flagged by Google'}
                  </p>
                </div>
              </div>
            )}

            {/* Upgrade card */}
            <div className="bg-[#0A0F1E] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-[#EC4899]" />
                <span className="font-heading font-semibold text-[#EC4899] text-xs uppercase tracking-widest">Upgrade</span>
              </div>
              <h3 className="font-heading font-bold text-white text-xl mb-1">Comprehensive Audit</h3>
              <p className="font-heading font-bold text-[#06B6D4] text-3xl mb-4">$7.99 <span className="text-white/40 text-base font-normal line-through">$49</span></p>

              <ul className="space-y-2 mb-6">
                {UPGRADE_FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-2 text-white/70 text-sm font-body">
                    <Zap className="w-3.5 h-3.5 text-[#EC4899] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <UpgradeButton auditRequestId={request.id} />
            </div>

            {/* Social proof */}
            <div className="bg-white rounded-2xl border border-[#0A0F1E]/8 p-5 text-center">
              <p className="font-heading font-bold text-[#0A0F1E] text-2xl">1,200+</p>
              <p className="font-body text-[#0A0F1E]/50 text-sm">businesses audited worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function UpgradeButton({ auditRequestId }: { auditRequestId: string }) {
  return (
    <form action="/api/audit/checkout" method="POST">
      <input type="hidden" name="auditRequestId" value={auditRequestId} />
      <button
        type="submit"
        className="w-full bg-[#06B6D4] text-white font-heading font-semibold py-3.5 px-6 rounded-xl text-base hover:bg-[#06B6D4]/90 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
      >
        Upgrade for $7.99 →
      </button>
    </form>
  )
}
