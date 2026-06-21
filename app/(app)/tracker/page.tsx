export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { TrackerClient } from '@/components/tracker/TrackerClient'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Symptom Tracker · Vida' }

export default async function TrackerPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: checkins } = await supabase
    .from('daily_checkins')
    .select('checkin_date, mood, energy_level, sleep_hours, sleep_quality, hot_flash_severity, triggers')
    .eq('user_id', user!.id)
    .gte('checkin_date', thirtyDaysAgo.toISOString().split('T')[0])
    .order('checkin_date', { ascending: true })

  const list = checkins ?? []
  const dateSet = new Set(list.map((c) => c.checkin_date))

  let streak = 0
  const cursor = new Date()
  const today = cursor.toISOString().split('T')[0]
  if (dateSet.has(today)) {
    while (true) { const d = cursor.toISOString().split('T')[0]; if (!dateSet.has(d)) break; streak++; cursor.setDate(cursor.getDate() - 1) }
  } else {
    cursor.setDate(cursor.getDate() - 1)
    while (true) { const d = cursor.toISOString().split('T')[0]; if (!dateSet.has(d)) break; streak++; cursor.setDate(cursor.getDate() - 1) }
  }

  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthCount = list.filter((c) => c.checkin_date.startsWith(thisMonth)).length

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '28px 16px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#3d2c35', margin: 0 }}>Symptom tracker</h1>
          <p style={{ color: '#8a7a72', marginTop: 6, fontSize: 14 }}>Your last 30 days of wellness data</p>
        </div>
        <Link href="/check-in" style={{
          background: 'linear-gradient(135deg, #6b9e80 0%, #4a7a5b 100%)',
          color: 'white', borderRadius: 14, padding: '10px 18px',
          fontSize: 14, fontWeight: 600, textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44,
        }}>+ Check-in</Link>
      </div>
      <TrackerClient checkins={list} streak={streak} monthCount={monthCount} />
    </div>
  )
}
