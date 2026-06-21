export const dynamic = 'force-dynamic'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Community · Vida' }

const CATEGORY_ICONS: Record<string, string> = {
  'hot-flashes': '🔥',
  'sleep': '🌙',
  'hrt': '💊',
  'mood': '🌸',
  'brain-fog': '💭',
  'relationships': '💕',
  'nutrition': '🥗',
  'exercise': '🏃',
  'questions': '✨',
  'wins': '🎉',
}

export default async function CommunityPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: myProfile }, { data: categories }] = await Promise.all([
    user
      ? supabase.from('community_profiles').select('username').eq('user_id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from('forum_categories').select('id, name, slug, description, sort_order').eq('is_active', true).order('sort_order'),
  ])

  const categoryIds = (categories ?? []).map((c) => c.id)
  const { data: postCounts } = categoryIds.length
    ? await supabase.from('forum_posts').select('category_id').in('category_id', categoryIds).eq('is_removed', false)
    : { data: [] }

  const countMap: Record<string, number> = {}
  for (const p of postCounts ?? []) {
    countMap[p.category_id] = (countMap[p.category_id] ?? 0) + 1
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 16px 100px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 28, fontWeight: 700, color: '#3d2c35', margin: 0 }}>
          Community
        </h1>
        <p style={{ color: '#8a7a72', fontSize: 15, marginTop: 6 }}>
          You&apos;re not alone. Connect with women who get it.
        </p>
      </div>

      {user && !myProfile && (
        <Link href="/community/setup" style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
          <div style={{
            background: 'linear-gradient(135deg, #e8f2ec 0%, #faf0f2 100%)',
            border: '1.5px solid rgba(107,158,128,0.3)',
            borderRadius: 20,
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <span style={{ fontSize: 28 }}>🌿</span>
            <div>
              <p style={{ fontWeight: 700, color: '#3d2c35', fontSize: 15, margin: 0 }}>Set up your community profile</p>
              <p style={{ color: '#6b9e80', fontSize: 13, marginTop: 3 }}>Choose a username to start posting and replying →</p>
            </div>
          </div>
        </Link>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(categories ?? []).map((cat) => (
          <Link key={cat.slug} href={`/community/${cat.slug}`} className="comm-cat-row">
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #e8f2ec, #faf0f2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
            }}>
              {CATEGORY_ICONS[cat.slug] ?? '💬'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, color: '#3d2c35', fontSize: 15, margin: 0 }}>{cat.name}</p>
              {cat.description && (
                <p style={{ color: '#8a7a72', fontSize: 13, marginTop: 2, lineHeight: 1.4 }}>
                  {cat.description}
                </p>
              )}
            </div>
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#6b9e80', margin: 0 }}>
                {countMap[cat.id] ?? 0}
              </p>
              <p style={{ fontSize: 11, color: '#b8a9a0', margin: 0 }}>posts</p>
            </div>
          </Link>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#b8a9a0', marginTop: 32 }}>
        Community is always free · Your health data stays private
      </p>
    </div>
  )
}
