import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db/client'

export const dynamic = 'force-dynamic'

// Daily cron: downgrade subscriptions that were cancelled and whose paid period has lapsed
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ tier: 'free', status: 'canceled' })
    .eq('tier', 'premium')
    .eq('cancel_at_period_end', true)
    .lt('current_period_end', new Date().toISOString())
    .select('user_id')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, downgraded: data?.length ?? 0 })
}
