import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/db/client'
import { payfastConfig, pfSignature, PAYFAST_HOST, PREMIUM_MONTHLY_ZAR } from '@/lib/payfast'

// Redirect GET (e.g. old links) back to the upgrade page
export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/settings/upgrade', req.url))
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: { message: 'You must be signed in.' } }, { status: 401 })
    }

    const admin = createAdminClient()

    const { data: sub } = await admin
      .from('subscriptions')
      .select('tier, status')
      .eq('user_id', user.id)
      .maybeSingle()

    if (sub?.tier === 'premium' && sub?.status === 'active') {
      return NextResponse.json({ error: { message: 'Your account already has Premium access.' } }, { status: 400 })
    }

    if (!sub) {
      await admin.from('subscriptions').insert({ user_id: user.id, tier: 'free', status: 'active' })
    }

    const { merchantId, merchantKey, passphrase } = payfastConfig()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${req.headers.get('host')}`

    // Field order matters for the PayFast signature — keep this order.
    const params: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${appUrl}/settings?upgraded=1`,
      cancel_url: `${appUrl}/settings/upgrade`,
      notify_url: `${appUrl}/api/webhooks/payfast`,
      email_address: user.email ?? '',
      m_payment_id: `vida-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      amount: PREMIUM_MONTHLY_ZAR,
      item_name: 'Vida Premium Monthly',
      custom_str1: user.id,
      subscription_type: '1',
      recurring_amount: PREMIUM_MONTHLY_ZAR,
      frequency: '3',
      cycles: '0',
    }
    params.signature = pfSignature(params, passphrase)

    // PayFast expects a POSTed form, not a GET redirect
    return NextResponse.json({ data: { action: `${PAYFAST_HOST}/eng/process`, params } })
  } catch (err) {
    console.error('payfast checkout error', err)
    return NextResponse.json({ error: { message: 'Could not start checkout. Please try again.' } }, { status: 500 })
  }
}
