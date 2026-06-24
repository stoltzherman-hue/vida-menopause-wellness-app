import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { getUser } from '@/lib/auth/session'
import { z } from 'zod'

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').nullable(),
})

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid date format' }, { status: 422 })

  const supabase = await createSupabaseServerClient()

  // Read existing lifestyle to merge
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('lifestyle')
    .eq('user_id', user.id)
    .maybeSingle()

  const lifestyle = typeof existing?.lifestyle === 'object' && existing.lifestyle !== null
    ? existing.lifestyle as Record<string, unknown>
    : {}

  if (parsed.data.date === null) {
    delete lifestyle.treatment_start_date
  } else {
    lifestyle.treatment_start_date = parsed.data.date
  }

  const { error } = await supabase
    .from('user_profiles')
    .update({ lifestyle })
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: 'Failed to save' }, { status: 500 })

  return NextResponse.json({ success: true })
}
