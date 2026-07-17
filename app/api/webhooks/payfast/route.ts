import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db/client'
import { writeAuditLog } from '@/lib/analytics/audit'
import { payfastConfig, verifyItnSignature, validateItnWithPayfast } from '@/lib/payfast'

export const dynamic = 'force-dynamic'

// PayFast ITN (Instant Transaction Notification) handler
export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  const orderedParams: Array<[string, string]> = []
  for (const pair of rawBody.split('&')) {
    const idx = pair.indexOf('=')
    if (idx === -1) continue
    const k = decodeURIComponent(pair.slice(0, idx))
    const v = decodeURIComponent(pair.slice(idx + 1).replace(/\+/g, ' '))
    orderedParams.push([k, v])
  }
  const data = Object.fromEntries(orderedParams)

  let passphrase: string
  try {
    passphrase = payfastConfig().passphrase
  } catch {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  if (!verifyItnSignature(orderedParams, passphrase)) {
    console.error('[payfast-itn] Signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (data.merchant_id !== payfastConfig().merchantId) {
    console.error('[payfast-itn] Merchant id mismatch')
    return NextResponse.json({ error: 'Merchant mismatch' }, { status: 400 })
  }

  const confirmed = await validateItnWithPayfast(rawBody)
  if (!confirmed) {
    console.error('[payfast-itn] PayFast server validation failed')
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
  }

  const userId = data.custom_str1
  if (!userId) return NextResponse.json({ received: true })

  // custom_str2 carries which plan was purchased
  const purchasedTier = data.custom_str2 === 'voice' ? 'voice' : 'premium'

  const supabase = createAdminClient()
  const token = data.token ?? null
  const pfPaymentId = data.pf_payment_id ?? null

  if (data.payment_status === 'COMPLETE') {
    const periodStart = new Date()
    const periodEnd = new Date(periodStart)
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    // stripe_subscription_id column carries the PayFast subscription token
    await supabase.from('subscriptions').upsert({
      user_id: userId,
      stripe_subscription_id: token,
      tier: purchasedTier,
      status: 'active',
      current_period_start: periodStart.toISOString(),
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: false,
    }, { onConflict: 'user_id' })

    await writeAuditLog({
      userId,
      action: 'subscription.updated',
      resource: 'subscription',
      resourceId: token ?? pfPaymentId ?? 'payfast',
      metadata: { status: 'active', provider: 'payfast', pf_payment_id: pfPaymentId },
    })
  } else if (data.payment_status === 'CANCELLED') {
    // Keep premium access until current_period_end; the daily cron downgrades after that
    await supabase.from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('user_id', userId)

    await writeAuditLog({
      userId,
      action: 'subscription.updated',
      resource: 'subscription',
      resourceId: token ?? pfPaymentId ?? 'payfast',
      metadata: { status: 'canceled', provider: 'payfast' },
    })
  }

  return NextResponse.json({ received: true })
}
