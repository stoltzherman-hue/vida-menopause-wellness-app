import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/db/client'
import { writeAuditLog } from '@/lib/analytics/audit'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    console.error('[stripe-webhook] Signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string
      const { data: existingSub } = await supabase.from('subscriptions').select('user_id').eq('stripe_customer_id', customerId).single()
      if (!existingSub?.user_id) break
      const subAny = sub as unknown as { current_period_start?: number; current_period_end?: number }
      await supabase.from('subscriptions').upsert({
        user_id: existingSub.user_id,
        stripe_customer_id: customerId,
        stripe_subscription_id: sub.id,
        tier: sub.status === 'active' || sub.status === 'trialing' ? 'premium' : 'free',
        status: sub.status,
        current_period_start: subAny.current_period_start ? new Date(subAny.current_period_start * 1000).toISOString() : null,
        current_period_end: subAny.current_period_end ? new Date(subAny.current_period_end * 1000).toISOString() : null,
        cancel_at_period_end: sub.cancel_at_period_end,
      }, { onConflict: 'user_id' })
      await writeAuditLog({ userId: existingSub.user_id, action: 'subscription.updated', resource: 'subscription', resourceId: sub.id, metadata: { status: sub.status, event: event.type } })
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase.from('subscriptions').update({ tier: 'free', status: 'canceled' }).eq('stripe_customer_id', sub.customer as string)
      break
    }
  }
  return NextResponse.json({ received: true })
}
