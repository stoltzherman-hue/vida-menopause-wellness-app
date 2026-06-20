import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 })

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: checkins, error } = await supabase
    .from('daily_checkins')
    .select('checkin_date, mood, energy_level, sleep_hours, sleep_quality, hot_flash_severity, triggers')
    .eq('user_id', user.id)
    .gte('checkin_date', thirtyDaysAgo.toISOString().split('T')[0])
    .order('checkin_date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: { message: 'Failed to fetch stats' } }, { status: 500 })
  }

  const today = new Date().toISOString().split('T')[0]
  const dateSet = new Set((checkins ?? []).map((c) => c.checkin_date))
  let streak = 0
  const cursor = new Date()
  if (dateSet.has(today)) {
    while (true) {
      const d = cursor.toISOString().split('T')[0]
      if (!dateSet.has(d)) break
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }
  } else {
    cursor.setDate(cursor.getDate() - 1)
    while (true) {
      const d = cursor.toISOString().split('T')[0]
      if (!dateSet.has(d)) break
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }
  }

  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthCount = (checkins ?? []).filter((c) => c.checkin_date.startsWith(thisMonth)).length

  return NextResponse.json({
    data: {
      checkins: checkins ?? [],
      streak,
      monthCount,
    },
  })
}
