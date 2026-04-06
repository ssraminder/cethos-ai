import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { runFreeAudit } from '@/lib/audit/free-audit'
import { runComprehensiveAudit } from '@/lib/audit/comprehensive-audit'
import { getResend } from '@/lib/resend'
import { renderPaidAuditEmail } from '@/lib/email/audit-paid'
import type { TeaserResults } from '@/lib/audit/teaser'
import type { FreeAuditResults } from '@/lib/audit/free-audit'

export const maxDuration = 300

export async function POST(req: NextRequest) {
  const secret = req.headers.get('X-Internal-Secret')
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: request } = await supabase
    .from('agp_audit_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (request.status === 'paid_complete') {
    return NextResponse.json({ success: true, message: 'Already complete' })
  }

  try {
    await supabase.from('agp_audit_requests').update({ status: 'paid_running' }).eq('id', id)

    const teaser = (request.teaser_results ?? {}) as TeaserResults

    // Use existing free results if available, otherwise run free audit first
    const freeResults: FreeAuditResults = request.free_audit_results
      ?? await runFreeAudit(request.website_url, teaser)

    // Run comprehensive audit
    const results = await runComprehensiveAudit(request.website_url, teaser, freeResults)

    // Store results
    await supabase.from('agp_audit_requests').update({
      paid_audit_results: results,
      status: 'paid_complete',
    }).eq('id', id)

    // Get report token
    const { data: updated } = await supabase
      .from('agp_audit_requests')
      .select('report_token')
      .eq('id', id)
      .single()

    const reportToken = updated?.report_token ?? id

    // Send paid audit email
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ascelo.ai'
    const html = renderPaidAuditEmail(
      request.full_name,
      request.website_url,
      reportToken,
      results,
      request.screenshot_url,
      results.pdf_url,
      baseUrl
    )

    const resend = getResend()
    await resend.emails.send({
      from: 'Ascelo AI Audit <noreply@ascelo.ai>',
      to: request.email,
      subject: `Your Comprehensive SEO Report — ${request.website_url}`,
      html,
    })

    return NextResponse.json({ success: true, score: results.score })
  } catch (err) {
    console.error('run-comprehensive error:', err)
    await supabase.from('agp_audit_requests').update({ status: 'failed' }).eq('id', id)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
