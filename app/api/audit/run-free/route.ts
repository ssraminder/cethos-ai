import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { runFreeAudit } from '@/lib/audit/free-audit'
import { captureScreenshot } from '@/lib/audit/screenshot'
import { getResend } from '@/lib/resend'
import { renderFreeAuditEmail } from '@/lib/email/audit-free'
import type { TeaserResults } from '@/lib/audit/teaser'

export const maxDuration = 300 // 5 min Netlify function timeout

export async function POST(req: NextRequest) {
  // Validate internal secret
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

  // Get request
  const { data: request } = await supabase
    .from('agp_audit_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (!request || !request.email_verified) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Idempotency: skip if already past this stage
  if (['free_complete', 'paid_pending', 'paid_running', 'paid_complete'].includes(request.status)) {
    return NextResponse.json({ success: true, message: 'Already complete' })
  }

  try {
    await supabase.from('agp_audit_requests').update({ status: 'free_running' }).eq('id', id)

    // Screenshot (if not already captured during teaser)
    let screenshotUrl = request.screenshot_url
    if (!screenshotUrl) {
      screenshotUrl = await captureScreenshot(request.website_url, id)
      if (screenshotUrl) {
        await supabase.from('agp_audit_requests').update({ screenshot_url: screenshotUrl }).eq('id', id)
      }
    }

    const teaser = (request.teaser_results ?? {}) as TeaserResults

    // Run free audit
    const results = await runFreeAudit(request.website_url, teaser)

    // Store results
    await supabase.from('agp_audit_requests').update({
      free_audit_results: results,
      status: 'free_complete',
    }).eq('id', id)

    // Send email
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ascelo.ai'
    const html = renderFreeAuditEmail(
      request.full_name,
      request.website_url,
      id,
      results,
      screenshotUrl,
      baseUrl
    )

    const resend = getResend()
    await resend.emails.send({
      from: 'Ascelo AI Audit <noreply@ascelo.ai>',
      to: request.email,
      subject: `Your Free SEO Audit — ${request.website_url} scored ${results.score}/100`,
      html,
    })

    return NextResponse.json({ success: true, score: results.score })
  } catch (err) {
    console.error('run-free error:', err)
    await supabase.from('agp_audit_requests').update({ status: 'failed' }).eq('id', id)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
