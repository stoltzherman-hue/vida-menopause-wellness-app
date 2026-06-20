import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { medicationSchema } from '@/lib/validations'
import { writeAuditLog } from '@/lib/analytics/audit'

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 })
  const { data, error } = await supabase.from('medications').select('*').eq('user_id', user.id).eq('active', true).order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: { message: 'Failed to fetch' } }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 })
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: { message: 'Invalid JSON' } }, { status: 400 }) }
  const parsed = medicationSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: { message: 'Validation failed', details: parsed.error.flatten() } }, { status: 422 })
  const { data: med, error } = await supabase.from('medications').insert({ user_id: user.id, ...parsed.data, time_of_day: parsed.data.timeOfDay }).select().single()
  if (error) return NextResponse.json({ error: { message: 'Failed to create' } }, { status: 500 })
  await writeAuditLog({ userId: user.id, action: 'medication.created', resource: 'medication', resourceId: med.id })
  return NextResponse.json({ data: med }, { status: 201 })
}
