import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: medicationId } = await params
  const supabase = await createSupabaseServerClient()

  const today = new Date().toISOString().split('T')[0]
  const now = new Date().toISOString()

  // Verify the medication belongs to this user
  const { data: med } = await supabase
    .from('medications')
    .select('id')
    .eq('id', medicationId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!med) {
    return NextResponse.json({ error: 'Medication not found' }, { status: 404 })
  }

  // Upsert to handle idempotent requests (already taken today)
  const { error } = await supabase
    .from('medication_adherence')
    .upsert(
      {
        user_id: user.id,
        medication_id: medicationId,
        scheduled_for: today,
        taken_at: now,
        status: 'taken',
      },
      { onConflict: 'user_id,medication_id,scheduled_for' }
    )

  if (error) {
    // If upsert fails (no unique constraint), try insert then ignore conflict
    const { error: insertError } = await supabase
      .from('medication_adherence')
      .insert({
        user_id: user.id,
        medication_id: medicationId,
        scheduled_for: today,
        taken_at: now,
        status: 'taken',
      })
    if (insertError && !insertError.message.includes('duplicate')) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
