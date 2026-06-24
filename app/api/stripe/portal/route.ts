import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getUser } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/db/client'

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: { message: 'You must be signed in.' } }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data: sub } = await admin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: { message: 'No billing account found.' } }, { status: 404 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${req.headers.get('host')}`

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id as string,
      return_url: `${appUrl}/settings`,
    })

    return NextResponse.json({ data: { url: session.url } })
  } catch (err) {
    console.error('stripe portal error', err)
    return NextResponse.json({ error: { message: 'Could not open billing portal. Please try again.' } }, { status: 500 })
  }
}
