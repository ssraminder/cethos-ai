import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) return NextResponse.json({ error: 'No webhook secret' }, { status: 500 })

  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as { metadata?: { auditRequestId?: string }; payment_intent?: string }
  const auditRequestId = session.metadata?.auditRequestId
  if (!auditRequestId) return NextResponse.json({ received: true })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Idempotency check
  const { data: request } = await supabase
    .from('agp_audit_requests')
    .select('id, status')
    .eq('id', auditRequestId)
    .single()

  if (!request || ['paid_pending', 'paid_running', 'paid_complete'].includes(request.status)) {
    return NextResponse.json({ received: true })
  }

  await supabase.from('agp_audit_requests').update({
    stripe_payment_intent_id: String(session.payment_intent ?? ''),
    status: 'paid_pending',
  }).eq('id', auditRequestId)

  // Fire-and-forget comprehensive audit
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ascelo.ai'
  fetch(`${baseUrl}/api/audit/run-comprehensive?id=${auditRequestId}`, {
    method: 'POST',
    headers: { 'X-Internal-Secret': process.env.INTERNAL_API_SECRET ?? '' },
  }).catch(console.error)

  return NextResponse.json({ received: true })
}
