import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/session'
import { createAdminClient } from '@/lib/db/client'
import { vapiConfig, signSessionToken } from '@/lib/vapi'
import { voiceMinutesForTier, billingPeriodStart } from '@/lib/entitlements'
import type { ConversationMode } from '@/lib/ai/modes'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: { message: 'You must be signed in.' } }, { status: 401 })
    }

    let mode: ConversationMode = 'supportive_friend'
    try {
      const body = await req.json()
      if (typeof body?.mode === 'string') mode = body.mode
    } catch {
      // no body — default mode
    }

    const admin = createAdminClient()
    const { data: sub } = await admin
      .from('subscriptions')
      .select('tier, status, current_period_start')
      .eq('user_id', user.id)
      .maybeSingle()

    const tier = sub?.status === 'active' ? sub?.tier : 'free'
    const allowanceMinutes = voiceMinutesForTier(tier)
    if (allowanceMinutes <= 0) {
      return NextResponse.json(
        { error: { message: 'Voice companion is available on the Voice plan. Upgrade to start talking with Vida.' } },
        { status: 403 },
      )
    }

    const period = billingPeriodStart(sub?.current_period_start)
    const { data: usage } = await admin
      .from('voice_usage')
      .select('seconds_used')
      .eq('user_id', user.id)
      .eq('period_start', period)
      .maybeSingle()

    const usedSeconds = usage?.seconds_used ?? 0
    const remainingSeconds = allowanceMinutes * 60 - usedSeconds
    if (remainingSeconds <= 20) {
      return NextResponse.json(
        { error: { message: `You've used your ${allowanceMinutes} voice minutes for this month. They reset at the start of your next billing period.` } },
        { status: 403 },
      )
    }

    // Explicit config check with a precise message (temporary diagnostics)
    const missing: string[] = []
    if (!process.env.VAPI_SECRET) missing.push('VAPI_SECRET')
    if (!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY) missing.push('NEXT_PUBLIC_VAPI_PUBLIC_KEY')
    if (!process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID) missing.push('NEXT_PUBLIC_VAPI_ASSISTANT_ID')
    if (missing.length) {
      return NextResponse.json({ error: { message: `Voice config missing: ${missing.join(', ')}` } }, { status: 503 })
    }

    const { publicKey, assistantId } = vapiConfig()
    if (!publicKey || !assistantId) {
      return NextResponse.json({ error: { message: 'Voice is not configured yet. Please try again soon.' } }, { status: 503 })
    }

    // Cap this call at whatever the user has left (never longer than 20 min in one go)
    const maxDurationSeconds = Math.min(remainingSeconds, 1200)
    const token = signSessionToken({
      uid: user.id,
      mode,
      exp: Math.floor(Date.now() / 1000) + 60 * 30,
    })

    return NextResponse.json({
      data: {
        publicKey,
        assistantId,
        token,
        maxDurationSeconds,
        remainingMinutes: Math.floor(remainingSeconds / 60),
      },
    })
  } catch (err) {
    console.error('vapi start error', err)
    return NextResponse.json({ error: { message: 'Could not start voice session. Please try again.' } }, { status: 500 })
  }
}
