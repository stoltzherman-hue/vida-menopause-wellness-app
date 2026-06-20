import { createSupabaseServerClient } from '@/lib/db/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: `${slug} · Community · Vida` }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: category }, { data: myProfile }] = await Promise.all([
    supabase.from('forum_categories').select('id, name, description').eq('slug', slug).eq('is_active', true).maybeSingle(),
    supabase.from('community_profiles').select('username').eq('user_id', user!.id).maybeSingle(),
  ])

  if (!category) notFound()

  const { data: posts } = await supabase
    .from('forum_posts')
    .select('id, title, created_at, reply_count, is_pinned, author:community_profiles(username, is_anonymous)')
    .eq('category_id', category.id)
    .eq('is_removed', false)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 16px 100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 24 }}>
        <div>
          <Link href="/community" style={{ fontSize: 13, color: '#6b9e80', textDecoration: 'none', fontWeight: 600 }}>
            ← Community
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 26,
            fontWeight: 700,
            color: '#3d2c35',
            marginTop: 6,
            marginBottom: 4,
          }}>{category.name}</h1>
          {category.description && (
            <p style={{ color: '#8a7a72', fontSize: 14, margin: 0 }}>{category.description}</p>
          )}
        </div>
        {myProfile && (
          <Link href={`/community/${slug}/new`} style={{
            flexShrink: 0,
            background: 'linear-gradient(135deg, #6b9e80 0%, #4a7a5b 100%)',
            color: 'white',
            borderRadius: 14,
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}>
            + New post
          </Link>
        )}
      </div>

      {/* No profile prompt */}
      {!myProfile && (
        <Link href="/community/setup" style={{ textDecoration: 'none', display: 'block', marginBottom: 18 }}>
          <div style={{
            background: '#e8f2ec',
            borderRadius: 16,
            padding: '14px 18px',
            fontSize: 14,
            color: '#4a7a5b',
            fontWeight: 500,
          }}>
            🌿 Set up a community profile to post →
          </div>
        </Link>
      )}

      {/* Posts list */}
      {(posts ?? []).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#b8a9a0' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>💬</p>
          <p style={{ fontSize: 15 }}>No posts yet — be the first!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(posts ?? []).map((post) => {
            const author = Array.isArray(post.author) ? post.author[0] : post.author
            const displayName = author?.is_anonymous ? 'Anonymous' : (author?.username ?? 'Someone')
            return (
              <Link key={post.id} href={`/community/${slug}/${post.id}`} className="post-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  {post.is_pinned && (
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#c9a96e',
                      background: 'rgba(201,169,110,0.12)',
                      borderRadius: 8,
                      padding: '2px 8px',
                      flexShrink: 0,
                      marginTop: 2,
                    }}>📌 Pinned</span>
                  )}
                  <p style={{ fontWeight: 600, color: '#3d2c35', fontSize: 15, margin: 0, flex: 1 }}>
                    {post.title}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <div style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6b9e80, #c4959e)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'white',
                    flexShrink: 0,
                  }}>
                    {displayName[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, color: '#8a7a72' }}>{displayName}</span>
                  <span style={{ fontSize: 13, color: '#b8a9a0' }}>·</span>
                  <span style={{ fontSize: 13, color: '#b8a9a0' }}>{timeAgo(post.created_at)}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 13, color: '#8a7a72' }}>
                    💬 {post.reply_count ?? 0}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
