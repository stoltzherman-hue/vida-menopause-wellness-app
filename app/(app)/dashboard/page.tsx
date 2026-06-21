import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard · Vida' }

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.55)',
  border: '1.5px solid rgba(237,224,216,0.6)',
  borderRadius: 22,
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  padding: '20px 22px',
}

const clickCard: React.CSSProperties = {
  ...card,
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  cursor: 'pointer',
  transition: 'transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease',
}

export default async function DashboardPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [{ data: checkins }, { data: profile }] = await Promise.all([
    supabase
      .from('daily_checkins')
      .select('checkin_date, mood, energy_level, sleep_quality, hot_flash_severity')
      .eq('user_id', user!.id)
      .gte('checkin_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('checkin_date', { ascending: true }),
    supabase
      .from('user_profiles')
      .select('display_name, goals')
      .eq('user_id', user!.id)
      .maybeSingle(),
  ])

  const list = checkins ?? []
  const dateSet = new Set(list.map((c) => c.checkin_date))
  const today = new Date().toISOString().split('T')[0]

  let streak = 0
  const cursor = new Date()
  if (dateSet.has(today)) {
    while (true) {
      const d = cursor.toISOString().split('T')[0]
      if (!dateSet.has(d)) break
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }
  } else {
    cursor.setDate(cursor.getDate() - 1)
    while (true) {
      const d = cursor.toISOString().split('T')[0]
      if (!dateSet.has(d)) break
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }
  }

  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthCount = list.filter((c) => c.checkin_date.startsWith(thisMonth)).length
  const todayLogged = dateSet.has(today)
  const latestCheckin = list.at(-1)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = (profile?.display_name ?? '').split(' ')[0] || null

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '28px 16px 100px' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 28,
          fontWeight: 700,
          color: '#3d2c35',
          margin: 0,
        }}>
          {greeting}{firstName ? `, ${firstName}` : ''} 🌿
        </h1>
        <p style={{ color: '#8a7a72', marginTop: 6, fontSize: 15 }}>
          {todayLogged ? "You've already logged today — well done!" : "How are you feeling today?"}
        </p>
      </div>

      {/* Check-in CTA or today's snapshot */}
      {!todayLogged ? (
        <Link href="/check-in" style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
          <div style={{
            ...clickCard,
            background: 'rgba(255,255,255,0.55)',
            border: '1.5px solid rgba(107,158,128,0.22)',
            padding: '22px 24px',
          }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'rgba(107,158,128,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0,
            }}>🤍</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, color: '#3d2c35', fontSize: 16, margin: 0 }}>Log today's check-in</p>
              <p style={{ color: '#8a7a72', fontSize: 14, marginTop: 3 }}>Track how you're feeling — takes under 2 minutes</p>
            </div>
            <span style={{ fontSize: 20, color: '#6b9e80' }}>→</span>
          </div>
        </Link>
      ) : latestCheckin ? (
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>🌿</span>
            <p style={{ fontWeight: 700, color: '#3d2c35', fontSize: 15, margin: 0 }}>Today's snapshot</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Mood', value: latestCheckin.mood, color: '#6b9e80' },
              { label: 'Energy', value: latestCheckin.energy_level, color: '#c47a5a' },
              { label: 'Sleep', value: latestCheckin.sleep_quality, color: '#c4959e' },
              { label: 'Hot flash', value: latestCheckin.hot_flash_severity, color: '#b8a9c9' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center', background: 'rgba(253,248,244,0.8)', borderRadius: 14, padding: '12px 8px' }}>
                <p style={{ fontSize: 22, fontWeight: 800, color, margin: 0 }}>{value ?? '—'}</p>
                <p style={{ fontSize: 11, color: '#8a7a72', marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ ...card, textAlign: 'center', padding: '20px 16px' }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: '#6b9e80', margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            {streak || '—'}
          </p>
          <p style={{ fontSize: 12, color: '#8a7a72', marginTop: 4 }}>Day streak 🔥</p>
        </div>
        <div style={{ ...card, textAlign: 'center', padding: '20px 16px' }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: '#c47a5a', margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            {monthCount || '—'}
          </p>
          <p style={{ fontSize: 12, color: '#8a7a72', marginTop: 4 }}>Check-ins this month</p>
        </div>
      </div>

      {/* Feature links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          {
            href: '/tracker',
            emoji: '📈',
            bg: 'rgba(196,122,90,0.10)',
            title: 'Symptom tracker',
            desc: list.length > 0 ? `${list.length} entries — view trends and patterns` : 'View trends and patterns',
          },
          {
            href: '/medication',
            emoji: '💊',
            bg: 'rgba(196,149,158,0.10)',
            title: 'Medications & HRT',
            desc: 'Manage and track adherence',
          },
          {
            href: '/companion',
            emoji: '💬',
            bg: 'rgba(184,169,201,0.12)',
            title: 'AI Companion',
            desc: 'Your personal wellness coach',
            badge: 'Premium',
          },
          {
            href: '/community',
            emoji: '👥',
            bg: 'rgba(107,158,128,0.10)',
            title: 'Community',
            desc: 'Connect with women who get it',
          },
        ].map(({ href, emoji, bg, title, desc, badge }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div style={clickCard} className="dash-card-hover">
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}>{emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{ fontWeight: 600, color: '#3d2c35', fontSize: 15, margin: 0 }}>{title}</p>
                  {badge && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#c9a96e',
                      background: 'rgba(201,169,110,0.12)',
                      border: '1px solid rgba(201,169,110,0.3)',
                      borderRadius: 8,
                      padding: '2px 7px',
                      letterSpacing: '0.03em',
                    }}>PREMIUM</span>
                  )}
                </div>
                <p style={{ color: '#8a7a72', fontSize: 13, marginTop: 3 }}>{desc}</p>
              </div>
              <span style={{ fontSize: 18, color: '#b8a9a0' }}>›</span>
            </div>
          </Link>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#c8bdb8', marginTop: 32, lineHeight: 1.6 }}>
        Vida provides educational support only.<br />Always discuss medical decisions with your healthcare provider.
      </p>
    </div>
  )
}
