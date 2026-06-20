import { createSupabaseServerClient } from '@/lib/db/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReplyClient from '@/components/community/ReplyClient'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string; postId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params
  return { title: `Post · Community · Vida` }
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

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #6b9e80, #c4959e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.38,
      fontWeight: 700,
      color: 'white',
      flexShrink: 0,
    }}>
      {name[0].toUpperCase()}
    </div>
  )
}

export default async function PostDetailPage({ params }: Props) {
  const { slug, postId } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: post }, { data: myProfile }] = await Promise.all([
    supabase
      .from('forum_posts')
      .select('id, title, body, created_at, is_pinned, author:community_profiles(username, is_anonymous), category:forum_categories(name, slug)')
      .eq('id', postId)
      .eq('is_removed', false)
      .maybeSingle(),
    supabase.from('community_profiles').select('username').eq('user_id', user!.id).maybeSingle(),
  ])

  if (!post) notFound()

  const { data: replies } = await supabase
    .from('forum_replies')
    .select('id, body, created_at, author:community_profiles(username, is_anonymous)')
    .eq('post_id', postId)
    .eq('is_removed', false)
    .order('created_at', { ascending: true })

  const postAuthor = Array.isArray(post.author) ? post.author[0] : post.author
  const postAuthorName = postAuthor?.is_anonymous ? 'Anonymous' : (postAuthor?.username ?? 'Someone')
  const category = Array.isArray(post.category) ? post.category[0] : post.category

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 16px 100px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginBottom: 20 }}>
        <Link href="/community" style={{ color: '#6b9e80', textDecoration: 'none', fontWeight: 600 }}>Community</Link>
        <span style={{ color: '#b8a9a0' }}>›</span>
        <Link href={`/community/${slug}`} style={{ color: '#6b9e80', textDecoration: 'none', fontWeight: 600 }}>
          {category?.name ?? slug}
        </Link>
      </div>

      {/* Post card */}
      <div style={{
        background: 'rgba(255,255,255,0.82)',
        border: '1.5px solid rgba(237,224,216,0.8)',
        borderRadius: 22,
        padding: '24px 24px 20px',
        backdropFilter: 'blur(12px)',
        marginBottom: 24,
      }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 22,
          fontWeight: 700,
          color: '#3d2c35',
          marginTop: 0,
          marginBottom: 16,
          lineHeight: 1.3,
        }}>{post.title}</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Avatar name={postAuthorName} />
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, color: '#3d2c35', margin: 0 }}>{postAuthorName}</p>
            <p style={{ fontSize: 12, color: '#b8a9a0', margin: 0 }}>{timeAgo(post.created_at)}</p>
          </div>
        </div>

        <p style={{ fontSize: 15, color: '#5a4a52', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
          {post.body}
        </p>
      </div>

      {/* Replies */}
      <h2 style={{
        fontFamily: 'var(--font-playfair), Georgia, serif',
        fontSize: 18,
        fontWeight: 700,
        color: '#3d2c35',
        marginBottom: 14,
      }}>
        {(replies ?? []).length} {(replies ?? []).length === 1 ? 'reply' : 'replies'}
      </h2>

      {(replies ?? []).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {(replies ?? []).map((reply) => {
            const author = Array.isArray(reply.author) ? reply.author[0] : reply.author
            const name = author?.is_anonymous ? 'Anonymous' : (author?.username ?? 'Someone')
            return (
              <div key={reply.id} style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1.5px solid rgba(237,224,216,0.7)',
                borderRadius: 18,
                padding: '16px 20px',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Avatar name={name} size={30} />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#3d2c35' }}>{name}</span>
                    <span style={{ fontSize: 12, color: '#b8a9a0', marginLeft: 8 }}>{timeAgo(reply.created_at)}</span>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#5a4a52', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {reply.body}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Reply form or prompt */}
      {myProfile ? (
        <div style={{
          background: 'rgba(255,255,255,0.82)',
          border: '1.5px solid rgba(237,224,216,0.8)',
          borderRadius: 20,
          padding: '20px',
          backdropFilter: 'blur(12px)',
        }}>
          <ReplyClient postId={postId} username={myProfile.username} />
        </div>
      ) : (
        <Link href="/community/setup" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            background: '#e8f2ec',
            borderRadius: 16,
            padding: '16px 20px',
            fontSize: 14,
            color: '#4a7a5b',
            fontWeight: 500,
            textAlign: 'center',
          }}>
            🌿 Set up your community profile to reply →
          </div>
        </Link>
      )}
    </div>
  )
}
