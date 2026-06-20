import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { TrackerClient } from '@/components/tracker/TrackerClient'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Symptom Tracker' }

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
  const monthCount = list.filter((c) => c.checkin_date.startsWith(thisMonth)).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2d3748]">Symptom tracker</h1>
          <p className="text-[#718096] mt-1 text-sm">Last 30 days of your wellness data</p>
        </div>
        <Link href="/check-in">
          <Button size="sm">+ Check-in</Button>
        </Link>
      </div>

      <TrackerClient checkins={list} streak={streak} monthCount={monthCount} />
    </div>
  )
}
