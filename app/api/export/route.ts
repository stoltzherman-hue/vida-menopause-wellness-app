import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { getUser } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createSupabaseServerClient()

  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const [{ data: checkins }, { data: meds }] = await Promise.all([
    supabase
      .from('daily_checkins')
      .select('checkin_date,overall_wellbeing,mood,energy_level,sleep_hours,sleep_quality,hot_flash_count,hot_flash_severity,night_sweats_count,night_sweats_severity,period_status,triggers')
      .eq('user_id', user.id)
      .gte('checkin_date', ninetyDaysAgo.toISOString().split('T')[0])
      .order('checkin_date', { ascending: false }),
    supabase
      .from('medications')
      .select('name,category,dose,frequency,status,start_date')
      .eq('user_id', user.id),
  ])

  const rows = [
    ['Date', 'Wellbeing (1-5)', 'Mood (1-10)', 'Energy (1-10)', 'Sleep hours', 'Sleep quality (1-5)', 'Hot flashes', 'Hot flash severity', 'Night sweats', 'Night sweat severity', 'Period status', 'Triggers'],
    ...(checkins ?? []).map((c) => [
      c.checkin_date,
      c.overall_wellbeing ?? '',
      c.mood ?? '',
      c.energy_level ?? '',
      c.sleep_hours ?? '',
      c.sleep_quality ?? '',
      c.hot_flash_count ?? '',
      c.hot_flash_severity ?? '',
      c.night_sweats_count ?? '',
      c.night_sweats_severity ?? '',
      c.period_status ?? '',
      ((c.triggers as string[]) ?? []).filter((t: string) => !t.startsWith('symptom:') && !t.startsWith('helped:')).join('; '),
    ]),
  ]

  const medRows = [
    [],
    ['Medications'],
    ['Name', 'Category', 'Dose', 'Frequency', 'Status', 'Start date'],
    ...(meds ?? []).map((m) => [m.name, m.category, m.dose ?? '', m.frequency, m.status, m.start_date ?? '']),
  ]

  const csv = [...rows, ...medRows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="vida-health-data-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
