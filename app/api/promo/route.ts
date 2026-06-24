import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db/client'
import { getUser } from '@/lib/auth/session'

const PROMO_CODE = process.env.PROMO_CODE ?? 'VIDA100'
const PROMO_LIMIT = 100

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: { message: 'You must be signed in to redeem a code.' } }, { status: 401 })
    }

    const { code } = await req.json()
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: { message: 'Please enter a promo code.' } }, { status: 400 })
    }

    if (code.trim().toUpperCase() !== PROMO_CODE.toUpperCase()) {
      return NextResponse.json({ error: { message: 'That code isn\'t valid. Check the spelling and try again.' } }, { status: 400 })
    }

    const admin = createAdminClient()

    // Check if user already has premium
    const { data: existing } = await admin
      .from('subscriptions')
      .select('tier, status')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existing?.tier === 'premium' && existing?.status === 'active') {
      return NextResponse.json({ error: { message: 'Your account already has Premium access.' } }, { status: 400 })
    }

    // Count total promo redemptions (active premium subs with no stripe id = promo grants)
    const { count } = await admin
      .from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('tier', 'premium')
      .eq('status', 'active')
      .is('stripe_subscription_id', null)

    if ((count ?? 0) >= PROMO_LIMIT) {
      return NextResponse.json({ error: { message: 'Sorry — all 100 founding member spots have been claimed. Follow us for future offers.' } }, { status: 400 })
    }

    // Grant premium
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1) // 1 year free

    if (existing) {
      await admin.from('subscriptions').update({
        tier: 'premium',
        status: 'active',
        current_period_end: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id)
    } else {
      await admin.from('subscriptions').insert({
        user_id: user.id,
        tier: 'premium',
        status: 'active',
        current_period_end: expiresAt.toISOString(),
      })
    }

    return NextResponse.json({ data: { message: 'Welcome, founding member! You have 1 year of Premium free.' } })
  } catch (err) {
    console.error('promo route error', err)
    return NextResponse.json({ error: { message: 'Something went wrong. Please try again.' } }, { status: 500 })
  }
}
