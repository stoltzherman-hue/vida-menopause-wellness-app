import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db/client'
import { verifyWebhookSecret, verifySessionToken } from '@/lib/vapi'
import { billingPeriodStart } from '@/lib/entitlements'

export const dynamic = 'force-dynamic'

// Vapi server webhook — we care about end-of-call-report to record minutes used.
export async function POST(req: NextRequest) {
  const secretOk = verifyWebhookSecret(req.headers.get('x-vapi-secret'))

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const msg = (body.message ?? body) as Record<string, unknown>
  const type = msg?.type

  if (type !== 'end-of-call-report') {
    return NextResponse.json({ received: true })
  }

  // Resolve the user from the signed token we placed in call metadata.
  // The token is HMAC-signed by us, so it authenticates the report on its own
  // when no shared-secret header is configured in the Vapi dashboard.
  const call = (msg.call ?? {}) as { metadata?: Record<string, unknown> }
  const token = typeof call.metadata?.token === 'string' ? (call.metadata.token as string) : null
  const session = token ? verifySessionToken(token) : null
  if (!session) {
    // No valid secret header and no attributable token — reject.
    if (!secretOk) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ received: true })
  }

  // Duration: prefer explicit seconds, else derive from timestamps
  let seconds = 0
  const durationSeconds = msg.durationSeconds ?? msg.duration
  if (typeof durationSeconds === 'number') {
    seconds = Math.round(durationSeconds)
  } else {
    const started = msg.startedAt ? Date.parse(String(msg.startedAt)) : NaN
    const ended = msg.endedAt ? Date.parse(String(msg.endedAt)) : NaN
    if (!Number.isNaN(started) && !Number.isNaN(ended) && ended > started) {
      seconds = Math.round((ended - started) / 1000)
    }
  }
  if (seconds <= 0) return NextResponse.json({ received: true })

  const supabase = createAdminClient()

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('current_period_start')
    .eq('user_id', session.uid)
    .maybeSingle()

  const period = billingPeriodStart(sub?.current_period_start)

  const { data: existing } = await supabase
    .from('voice_usage')
    .select('seconds_used')
    .eq('user_id', session.uid)
    .eq('period_start', period)
    .maybeSingle()

  await supabase.from('voice_usage').upsert({
    user_id: session.uid,
    period_start: period,
    seconds_used: (existing?.seconds_used ?? 0) + seconds,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,period_start' })

  return NextResponse.json({ received: true })
}
