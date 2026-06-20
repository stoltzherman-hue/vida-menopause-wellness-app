import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { forumPostSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: { message: 'Invalid JSON' } }, { status: 400 })
  }

  const parsed = forumPostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: { message: parsed.error.issues[0].message } }, { status: 422 })
  }

  const { data: profile } = await supabase
    .from('community_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: { message: 'Community profile required' } }, { status: 403 })
  }

  const { data, error } = await supabase.from('forum_posts').insert({
    author_id: profile.id,
    category_id: parsed.data.categoryId,
    title: parsed.data.title,
    body: parsed.data.body,
  }).select('id').single()

  if (error) {
    console.error('[community/posts] insert error', { code: error.code })
    return NextResponse.json({ error: { message: 'Failed to create post' } }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
