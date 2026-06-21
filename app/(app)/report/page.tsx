import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { DoctorReport } from '@/components/report/DoctorReport'

export const metadata: Metadata = { title: 'Doctor Report · Vida' }

export default async function ReportPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const [{ data: checkins }, { data: profile }] = await Promise.all([
    supabase
      .from('daily_checkins')
      .select('checkin_date, overall_wellbeing, mood, energy_level, sleep_hours, sleep_quality, hot_flash_severity, hot_flash_count, night_sweats_severity, night_sweats_count, period_status, triggers')
      .eq('user_id', user!.id)
      .gte('checkin_date', ninetyDaysAgo.toISOString().split('T')[0])
      .order('checkin_date', { ascending: true }),
    supabase
      .from('user_profiles')
      .select('display_name, menopause_stage, goals')
      .eq('user_id', user!.id)
      .maybeSingle(),
  ])

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px 100px' }}>
      <DoctorReport
        checkins={checkins ?? []}
        profile={profile}
        generatedDate={new Date().toISOString()}
      />
    </div>
  )
}
