import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { onboardingSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: { message: 'Invalid JSON' } }, { status: 400 })
  }

  const parsed = onboardingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: { message: 'Validation failed', details: parsed.error.flatten() } }, { status: 422 })
  }

  const d = parsed.data

  const { error: profileError } = await supabase.from('user_profiles').upsert({
    user_id: user.id,
    age_range: d.ageRange,
    menopause_stage: d.menopauseStage,
    primary_symptoms: d.primarySymptoms,
    medical_history: d.medicalHistory,
    lifestyle: d.lifestyle,
    goals: d.goals,
    onboarding_completed: true,
  }, { onConflict: 'user_id' })

  if (profileError) {
    console.error('[onboarding] profile upsert error', { code: profileError.code })
    return NextResponse.json({ error: { message: 'Failed to save profile' } }, { status: 500 })
  }

  await supabase.from('health_profiles').upsert({
    user_id: user.id,
    hrt_status: d.hrtStatus,
    consent_health_data: d.consentHealthData,
    consent_ai_analysis: d.consentAiAnalysis,
    consent_notifications: d.consentNotifications,
    consent_marketing: d.consentMarketing,
  }, { onConflict: 'user_id' })

  return NextResponse.json({ data: { success: true } })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { displayName, menopauseStage, dateOfBirth, goals } = body as Record<string, unknown>

  const { error } = await supabase.from('user_profiles').upsert({
    user_id: user.id,
    display_name: typeof displayName === 'string' ? displayName : undefined,
    menopause_stage: typeof menopauseStage === 'string' ? menopauseStage : undefined,
    date_of_birth: typeof dateOfBirth === 'string' && dateOfBirth ? dateOfBirth : undefined,
    goals: Array.isArray(goals) ? goals : undefined,
  }, { onConflict: 'user_id' })

  if (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
