import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: { message: 'Invalid JSON' } }, { status: 400 })
  }

  const { username, bio, stage, isAnonymous } = body as Record<string, unknown>

  if (typeof username !== 'string' || !/^[a-z0-9_]{2,30}$/.test(username)) {
    return NextResponse.json({ error: { message: 'Invalid username — use 2–30 lowercase letters, numbers, or underscores.' } }, { status: 422 })
  }

  const { data, error } = await supabase.from('community_profiles').insert({
    user_id: user.id,
    username,
    bio: typeof bio === 'string' ? bio.slice(0, 300) : null,
    stage: typeof stage === 'string' && stage ? stage : null,
    is_anonymous: isAnonymous === true,
  }).select('id').single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: { message: 'That username is already taken — try another.' } }, { status: 409 })
    }
    console.error('[community/profile] insert error', { code: error.code })
    return NextResponse.json({ error: { message: 'Failed to create profile' } }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
