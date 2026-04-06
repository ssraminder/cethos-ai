'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { getResend } from '@/lib/resend'
import { renderOtpEmail } from '@/lib/email/audit-otp'
import { runTeaser } from '@/lib/audit/teaser'
import { captureScreenshot } from '@/lib/audit/screenshot'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function normalizeUrl(raw: string): string {
  let url = raw.trim().toLowerCase()
  if (!url.startsWith('http')) url = `https://${url}`
  try {
    const parsed = new URL(url)
    // Block private IPs
    const hostname = parsed.hostname
    if (/^(127\.|10\.|192\.168\.|localhost)/.test(hostname))
      throw new Error('Private IP addresses are not allowed')
    return parsed.origin + (parsed.pathname === '/' ? '' : parsed.pathname)
  } catch {
    throw new Error('Invalid website URL')
  }
}

// ─── submitAuditRequest ────────────────────────────────────────────────────
export async function submitAuditRequest(formData: FormData) {
  const honeypot = formData.get('website_confirm') as string
  if (honeypot) return // Silently reject bots

  const websiteUrl = formData.get('website_url') as string
  const fullName = formData.get('full_name') as string
  const email = formData.get('email') as string
  const companyName = (formData.get('company_name') as string) || null
  const phone = (formData.get('phone') as string) || null
  const country = (formData.get('country') as string) || null
  const consent = formData.get('consent') === 'on'

  if (!websiteUrl || !fullName || !email || !consent) {
    throw new Error('Please fill in all required fields and accept the terms.')
  }

  let normalizedUrl: string
  try {
    normalizedUrl = normalizeUrl(websiteUrl)
  } catch (e) {
    throw new Error('Please enter a valid website URL.')
  }

  const supabase = getServiceClient()
  const headersList = headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? headersList.get('x-real-ip') ?? null

  const now = new Date()
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()

  // Rate limiting checks
  if (ip) {
    const { count: ipCount } = await supabase
      .from('agp_audit_requests')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', dayAgo)
    if ((ipCount ?? 0) >= 3) throw new Error('Too many requests from this IP. Please try again tomorrow.')
  }

  const { count: emailCount } = await supabase
    .from('agp_audit_requests')
    .select('*', { count: 'exact', head: true })
    .eq('email', email.toLowerCase())
    .gte('created_at', dayAgo)
  if ((emailCount ?? 0) >= 2) throw new Error('Too many requests from this email. Please try again tomorrow.')

  const domain = new URL(normalizedUrl).hostname
  const { count: domainCount } = await supabase
    .from('agp_audit_requests')
    .select('*', { count: 'exact', head: true })
    .ilike('website_url', `%${domain}%`)
    .gte('created_at', dayAgo)
  if ((domainCount ?? 0) >= 1) throw new Error('This domain was already audited in the last 24 hours.')

  // Create audit request
  const { data: auditRequest, error: insertError } = await supabase
    .from('agp_audit_requests')
    .insert({
      website_url: normalizedUrl,
      full_name: fullName,
      email: email.toLowerCase(),
      company_name: companyName,
      phone,
      country,
      consent,
      ip_address: ip,
      status: 'pending_verify',
    })
    .select('id')
    .single()

  if (insertError || !auditRequest) throw new Error('Failed to create audit request. Please try again.')

  // Generate and store OTP
  const otp = generateOtp()
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString()

  await supabase.from('agp_audit_otps').insert({
    audit_request_id: auditRequest.id,
    otp_code: otp,
    expires_at: expiresAt,
  })

  // Send OTP email
  const resend = getResend()
  await resend.emails.send({
    from: 'Ascelo AI <noreply@ascelo.ai>',
    to: email,
    subject: `${otp} — Your Ascelo AI verification code`,
    html: renderOtpEmail(otp, normalizedUrl, fullName),
  })

  redirect(`/audit/verify?id=${auditRequest.id}`)
}

// ─── verifyOtp ────────────────────────────────────────────────────────────
export async function verifyOtp(formData: FormData) {
  const auditRequestId = formData.get('audit_request_id') as string
  const otpCode = (formData.get('otp_code') as string)?.trim()

  if (!auditRequestId || !otpCode || otpCode.length !== 6) {
    throw new Error('Please enter the 6-digit code.')
  }

  const supabase = getServiceClient()

  // Get valid OTP
  const { data: otpRecord } = await supabase
    .from('agp_audit_otps')
    .select('id, otp_code, attempts')
    .eq('audit_request_id', auditRequestId)
    .eq('verified', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!otpRecord) throw new Error('Code expired or not found. Please request a new one.')
  if (otpRecord.attempts >= 5) throw new Error('Too many failed attempts. Please request a new code.')

  // Increment attempts
  await supabase.from('agp_audit_otps').update({ attempts: otpRecord.attempts + 1 }).eq('id', otpRecord.id)

  if (otpRecord.otp_code !== otpCode) throw new Error('Incorrect code. Please try again.')

  // Mark OTP verified
  await supabase.from('agp_audit_otps').update({ verified: true }).eq('id', otpRecord.id)

  // Mark email verified
  await supabase.from('agp_audit_requests')
    .update({ email_verified: true, status: 'verified' })
    .eq('id', auditRequestId)

  // Get request data for teaser
  const { data: request } = await supabase
    .from('agp_audit_requests')
    .select('website_url, company_name')
    .eq('id', auditRequestId)
    .single()

  if (request) {
    // Run teaser + screenshot synchronously (fast)
    const [teaserResult, screenshotUrl] = await Promise.allSettled([
      runTeaser(request.website_url, request.company_name ?? undefined),
      captureScreenshot(request.website_url, auditRequestId),
    ])

    const teaser = teaserResult.status === 'fulfilled' ? teaserResult.value : null
    const screenshot = screenshotUrl.status === 'fulfilled' ? screenshotUrl.value : null

    await supabase.from('agp_audit_requests').update({
      teaser_results: teaser,
      screenshot_url: screenshot,
    }).eq('id', auditRequestId)

    // Fire-and-forget free audit
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ascelo.ai'
    fetch(`${baseUrl}/api/audit/run-free?id=${auditRequestId}`, {
      method: 'POST',
      headers: { 'X-Internal-Secret': process.env.INTERNAL_API_SECRET ?? '' },
    }).catch(console.error)
  }

  redirect(`/audit/confirmation?id=${auditRequestId}`)
}

// ─── resendOtp ────────────────────────────────────────────────────────────
export async function resendOtp(auditRequestId: string) {
  const supabase = getServiceClient()

  const { data: request } = await supabase
    .from('agp_audit_requests')
    .select('email, full_name, website_url, created_at')
    .eq('id', auditRequestId)
    .eq('email_verified', false)
    .single()

  if (!request) throw new Error('Request not found.')

  // Check resend throttle: 1 per 60s
  const { data: lastOtp } = await supabase
    .from('agp_audit_otps')
    .select('created_at')
    .eq('audit_request_id', auditRequestId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (lastOtp) {
    const diff = Date.now() - new Date(lastOtp.created_at).getTime()
    if (diff < 60 * 1000) throw new Error('Please wait 60 seconds before requesting a new code.')
  }

  // Check max 3 resends
  const { count } = await supabase
    .from('agp_audit_otps')
    .select('*', { count: 'exact', head: true })
    .eq('audit_request_id', auditRequestId)
  if ((count ?? 0) >= 4) throw new Error('Maximum resends reached. Please start a new audit request.')

  // Expire old OTPs
  await supabase.from('agp_audit_otps')
    .update({ expires_at: new Date().toISOString() })
    .eq('audit_request_id', auditRequestId)
    .eq('verified', false)

  // Generate new OTP
  const otp = generateOtp()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  await supabase.from('agp_audit_otps').insert({
    audit_request_id: auditRequestId,
    otp_code: otp,
    expires_at: expiresAt,
  })

  const resend = getResend()
  await resend.emails.send({
    from: 'Ascelo AI <noreply@ascelo.ai>',
    to: request.email,
    subject: `${otp} — Your new Ascelo AI verification code`,
    html: renderOtpEmail(otp, request.website_url, request.full_name),
  })
}
