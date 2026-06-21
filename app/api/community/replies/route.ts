import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { forumReplySchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: { message: 'Invalid JSON' } }, { status: 400 })
  }

  const parsed = forumReplySchema.safeParse(body)
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

  const { data: post } = await supabase
    .from('forum_posts')
    .select('id, reply_count')
    .eq('id', parsed.data.postId)
    .eq('is_removed', false)
    .single()

  if (!post) {
    return NextResponse.json({ error: { message: 'Post not found' } }, { status: 404 })
  }

  const { data, error } = await supabase.from('forum_replies').insert({
    post_id: parsed.data.postId,
    author_id: profile.id,
    body: parsed.data.body,
  }).select('id').single()

  if (error) {
    console.error('[community/replies] insert error', { code: error.code })
    return NextResponse.json({ error: { message: 'Failed to post reply' } }, { status: 500 })
  }

  await supabase
    .from('forum_posts')
    .update({ reply_count: (post.reply_count ?? 0) + 1 })
    .eq('id', post.id)

  return NextResponse.json({ data }, { status: 201 })
}
