export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { CycleCalendar } from '@/components/cycle/CycleCalendar'

export const metadata: Metadata = { title: 'Cycle Calendar · Vida' }

export default async function CyclePage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const { data: checkins } = await supabase
    .from('daily_checkins')
    .select('checkin_date, period_status')
    .eq('user_id', user!.id)
    .gte('checkin_date', ninetyDaysAgo.toISOString().split('T')[0])
    .order('checkin_date', { ascending: true })

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 16px 100px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 26, fontWeight: 700, color: '#3d2c35', margin: 0,
        }}>Cycle Calendar</h1>
        <p style={{ color: '#8a7a72', marginTop: 6, fontSize: 14 }}>
          Track your period and predict future cycles.
        </p>
      </div>
      <CycleCalendar checkins={checkins ?? []} />
    </div>
  )
}
