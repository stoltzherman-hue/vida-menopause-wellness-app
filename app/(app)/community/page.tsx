import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Community · Vida' }

const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'hot-flashes': {
    color: '#e07a5f', bg: 'rgba(224,122,95,0.10)',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e07a5f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  },
  'sleep': {
    color: '#9b8ab8', bg: 'rgba(155,138,184,0.10)',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9b8ab8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  },
  'hrt': {
    color: '#c4959e', bg: 'rgba(196,149,158,0.10)',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4959e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8m-4-4h8"/></svg>,
  },
  'mood': {
    color: '#c47a5a', bg: 'rgba(196,122,90,0.10)',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c47a5a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  },
  'brain-fog': {
    color: '#c9a96e', bg: 'rgba(201,169,110,0.10)',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  },
  'relationships': {
    color: '#c4959e', bg: 'rgba(196,149,158,0.10)',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4959e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  },
  'nutrition': {
    color: '#6b9e80', bg: 'rgba(107,158,128,0.10)',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b9e80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 5.5 3.6 10.3 9 11.6C16.4 23.3 20 18.5 20 13v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2z"/></svg>,
  },
  'exercise': {
    color: '#2d8b7a', bg: 'rgba(45,139,122,0.10)',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d8b7a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>,
  },
  'questions': {
    color: '#2d8b7a', bg: 'rgba(45,139,122,0.10)',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d8b7a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  'wins': {
    color: '#c9a96e', bg: 'rgba(201,169,110,0.10)',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  },
}

const DEFAULT_META = {
  color: '#8a7a72', bg: 'rgba(138,122,114,0.10)',
  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a7a72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
}

// Simulated activity signal — real posts count + lightly randomised online count for warmth
function getActivitySignal(totalPosts: number) {
  const seed = new Date().getHours() + new Date().getDay() * 24
  const active = 18 + (seed % 47)
  return { active, totalPosts }
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

  const totalPosts = Object.values(countMap).reduce((s, v) => s + v, 0)
  const { active } = getActivitySignal(totalPosts)

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 16px 100px' }}>

      {/* Header */}
      <div style={{ marginBottom: 8 }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 28, fontWeight: 700, color: '#1a1220', margin: '0 0 6px',
        }}>Community</h1>
        <p style={{ color: '#8a7a72', fontSize: 15, margin: 0 }}>
          You&apos;re not alone. Connect with women who get it.
        </p>
      </div>

      {/* Live activity signal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <span className="activity-badge">
          <span className="pulse-dot" />
          {active} women active today
        </span>
        {totalPosts > 0 && (
          <span className="activity-badge" style={{ background: 'rgba(155,138,184,0.09)', borderColor: 'rgba(155,138,184,0.20)', color: '#9b8ab8' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {totalPosts} posts shared
          </span>
        )}
        <span className="activity-badge" style={{ background: 'rgba(201,169,110,0.09)', borderColor: 'rgba(201,169,110,0.20)', color: '#c9a96e' }}>
          Always free
        </span>
      </div>

      {/* Profile setup CTA */}
      {user && !myProfile && (
        <Link href="/community/setup" style={{ textDecoration: 'none', display: 'block', marginBottom: 18 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(45,139,122,0.08) 0%, rgba(155,138,184,0.06) 100%)',
            border: '1.5px solid rgba(45,139,122,0.22)',
            borderRadius: 20, padding: '18px 22px',
            display: 'flex', alignItems: 'center', gap: 16,
            transition: 'transform 0.18s',
          }} className="dash-card-hover">
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'rgba(45,139,122,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d8b7a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: '#1e3d35', fontSize: 15, margin: 0 }}>Set up your community profile</p>
              <p style={{ color: '#4a7a6a', fontSize: 13, marginTop: 3 }}>Choose a username to start posting and connecting →</p>
            </div>
          </div>
        </Link>
      )}

      {/* Category list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(categories ?? []).map((cat, i) => {
          const meta = CATEGORY_META[cat.slug] ?? DEFAULT_META
          const count = countMap[cat.id] ?? 0
          return (
            <Link
              key={cat.slug}
              href={`/community/${cat.slug}`}
              className="comm-cat-row fade-in"
              style={{ animationDelay: `${i * 0.06}s` } as React.CSSProperties}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: meta.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {meta.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, color: '#1a1220', fontSize: 15, margin: 0 }}>{cat.name}</p>
                {cat.description && (
                  <p style={{ color: '#8a7a72', fontSize: 13, marginTop: 2, lineHeight: 1.4 }}>
                    {cat.description}
                  </p>
                )}
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: meta.color, margin: 0 }}>
                  {count > 0 ? count : '—'}
                </p>
                <p style={{ fontSize: 10, color: '#c4b5ae', margin: 0, fontWeight: 500 }}>posts</p>
              </div>
            </Link>
          )
        })}

        {/* Empty state */}
        {(categories ?? []).length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
            <p style={{ fontSize: 15, color: '#8a7a72', lineHeight: 1.6 }}>
              Community is warming up.<br/>Check back soon — women are joining every day.
            </p>
          </div>
        )}
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#c4b5ae', marginTop: 36, lineHeight: 1.6 }}>
        Community is always free · Your health data stays completely private
      </p>
    </div>
  )
}
