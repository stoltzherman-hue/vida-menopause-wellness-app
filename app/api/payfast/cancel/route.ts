import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/db/client'
import { writeAuditLog } from '@/lib/analytics/audit'
import { payfastConfig, pfApiSignature, PAYFAST_API_HOST, PAYFAST_SANDBOX } from '@/lib/payfast'

export async function POST(_req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: { message: 'You must be signed in.' } }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data: sub } = await admin
      .from('subscriptions')
      .select('stripe_subscription_id, tier, status, cancel_at_period_end')
      .eq('user_id', user.id)
      .maybeSingle()

    // stripe_subscription_id column carries the PayFast subscription token
    const token = sub?.stripe_subscription_id
    if (!sub || sub.tier !== 'premium' || !token) {
      return NextResponse.json({ error: { message: 'No active Premium subscription found.' } }, { status: 400 })
    }
    if (sub.cancel_at_period_end) {
      return NextResponse.json({ error: { message: 'Your subscription is already set to cancel at the end of the billing period.' } }, { status: 400 })
    }

    const { merchantId, passphrase } = payfastConfig()
    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, '')

    const headers: Record<string, string> = {
      'merchant-id': merchantId,
      version: 'v1',
      timestamp,
    }
    const signature = pfApiSignature(headers, passphrase)

    const res = await fetch(
      `${PAYFAST_API_HOST}/subscriptions/${token}/cancel${PAYFAST_SANDBOX ? '?testing=true' : ''}`,
      { method: 'PUT', headers: { ...headers, signature } }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('payfast cancel failed', res.status, text)
      return NextResponse.json({ error: { message: 'Could not cancel with PayFast. Please email support@vidaapp.co.za and we will cancel it for you.' } }, { status: 502 })
    }

    await admin.from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('user_id', user.id)

    await writeAuditLog({
      userId: user.id,
      action: 'subscription.updated',
      resource: 'subscription',
      resourceId: token,
      metadata: { status: 'cancel_requested', provider: 'payfast' },
    })

    return NextResponse.json({ data: { canceled: true } })
  } catch (err) {
    console.error('payfast cancel error', err)
    return NextResponse.json({ error: { message: 'Could not cancel. Please try again or email support@vidaapp.co.za.' } }, { status: 500 })
  }
}
