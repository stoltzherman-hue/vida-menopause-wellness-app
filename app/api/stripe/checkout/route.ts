import { NextRequest, NextResponse } from 'next/server'
import { stripe, PREMIUM_MONTHLY_PRICE_ID } from '@/lib/stripe'
import { getUser } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/db/client'

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
      .select('stripe_customer_id, tier, status')
      .eq('user_id', user.id)
      .maybeSingle()

    if (sub?.tier === 'premium' && sub?.status === 'active') {
      return NextResponse.json({ error: { message: 'Your account already has Premium access.' } }, { status: 400 })
    }

    let customerId = sub?.stripe_customer_id as string | undefined

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      })
      customerId = customer.id
      // Store the customer id so future calls don't create duplicates
      if (sub) {
        await admin.from('subscriptions').update({ stripe_customer_id: customerId }).eq('user_id', user.id)
      } else {
        await admin.from('subscriptions').insert({
          user_id: user.id,
          stripe_customer_id: customerId,
          tier: 'free',
          status: 'active',
        })
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${req.headers.get('host')}`

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: PREMIUM_MONTHLY_PRICE_ID, quantity: 1 }],
      success_url: `${appUrl}/settings?upgraded=1`,
      cancel_url: `${appUrl}/settings/upgrade`,
      subscription_data: { trial_period_days: 7 },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })

    return NextResponse.json({ data: { url: session.url } })
  } catch (err) {
    console.error('stripe checkout error', err)
    return NextResponse.json({ error: { message: 'Could not start checkout. Please try again.' } }, { status: 500 })
  }
}
