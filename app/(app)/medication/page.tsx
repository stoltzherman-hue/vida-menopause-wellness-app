import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { MedicationList } from '@/components/medication/MedicationList'

export const metadata: Metadata = { title: 'Medications & HRT' }

export default async function MedicationPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const { data: meds } = await supabase
    .from('medications')
    .select('id, name, type, dose, frequency, time_of_day, start_date, notes')
    .eq('user_id', user!.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3748]">Medications & HRT</h1>
        <p className="text-[#718096] mt-1 text-sm">Track your prescriptions, HRT, and supplements in one place.</p>
      </div>
      <MedicationList initialMeds={meds ?? []} />
    </div>
  )
}
