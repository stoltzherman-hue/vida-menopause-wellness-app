export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { MedicationList } from '@/components/medication/MedicationList'

export const metadata: Metadata = { title: 'Medications & HRT · Vida' }

export default async function MedicationPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const today = new Date().toISOString().split('T')[0]

  const [{ data: meds }, { data: adherence }] = await Promise.all([
    supabase
      .from('medications')
      .select('id, name, type, dose, frequency, time_of_day, start_date, notes')
      .eq('user_id', user!.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true }),
    supabase
      .from('medication_adherence')
      .select('medication_id, status')
      .eq('user_id', user!.id)
      .eq('scheduled_for', today)
      .eq('status', 'taken'),
  ])

  const takenTodaySet = new Set((adherence ?? []).map((a) => a.medication_id))

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '28px 16px 100px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#3d2c35', margin: 0 }}>Medications & HRT</h1>
        <p style={{ color: '#8a7a72', marginTop: 6, fontSize: 14 }}>Track your prescriptions, HRT, and supplements in one place.</p>
      </div>
      <MedicationList initialMeds={meds ?? []} takenTodayIds={Array.from(takenTodaySet)} />
    </div>
  )
}
