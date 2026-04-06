import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auditRequestId = body.auditRequestId ?? (await req.formData().catch(() => new FormData())).get('auditRequestId')

    if (!auditRequestId) return NextResponse.json({ error: 'Missing auditRequestId' }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: request } = await supabase
      .from('agp_audit_requests')
      .select('id, email, email_verified, status, website_url')
      .eq('id', auditRequestId)
      .single()

    if (!request || !request.email_verified) {
      return NextResponse.json({ error: 'Invalid or unverified request' }, { status: 400 })
    }

    if (['paid_pending', 'paid_running', 'paid_complete'].includes(request.status)) {
      return NextResponse.json({ error: 'Already purchased' }, { status: 400 })
    }

    const stripe = getStripe()
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ascelo.ai'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price: process.env.STRIPE_AUDIT_PRICE_ID!,
        quantity: 1,
      }],
      customer_email: request.email,
      success_url: `${baseUrl}/audit/success?id=${auditRequestId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/audit/confirmation?id=${auditRequestId}`,
      metadata: { auditRequestId },
      payment_intent_data: { metadata: { auditRequestId } },
    })

    await supabase.from('agp_audit_requests')
      .update({ stripe_session_id: session.id })
      .eq('id', auditRequestId)

    // If it's a form POST, redirect directly
    const contentType = req.headers.get('content-type') ?? ''
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      return NextResponse.redirect(session.url!, 303)
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('checkout error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
