import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { checkinSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: { message: 'Invalid JSON' } }, { status: 400 })
  }

  const parsed = checkinSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: { message: 'Validation failed', details: parsed.error.flatten() } }, { status: 422 })

  const data = parsed.data
  const { data: checkin, error } = await supabase
    .from('daily_checkins')
    .upsert({
      user_id: user.id,
      checkin_date: data.checkinDate,
      overall_wellbeing: data.overallWellbeing ?? null,
      mood: data.mood ?? null,
      sleep_hours: data.sleepHours ?? null,
      sleep_quality: data.sleepQuality ?? null,
      energy_level: data.energyLevel ?? null,
      hot_flash_count: data.hotFlashCount ?? null,
      hot_flash_severity: data.hotFlashSeverity ?? null,
      night_sweats_count: data.nightSweatsCount ?? null,
      night_sweats_severity: data.nightSweatsSeverity ?? null,
      period_status: data.periodStatus ?? null,
      triggers: data.triggers,
    }, { onConflict: 'user_id,checkin_date' })
    .select().single()

  if (error) { console.error('[checkin] DB error', { code: error.code }); return NextResponse.json({ error: { message: 'Failed to save check-in' } }, { status: 500 }) }
  return NextResponse.json({ data: checkin })
}

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '30'), 90)

  const { data, error } = await supabase
    .from('daily_checkins')
    .select('id,checkin_date,mood,energy_level,sleep_hours,sleep_quality,hot_flash_severity,triggers,created_at')
    .eq('user_id', user.id)
    .order('checkin_date', { ascending: false })
    .limit(limit)

  if (error) return NextResponse.json({ error: { message: 'Failed to fetch' } }, { status: 500 })
  return NextResponse.json({ data })
}
