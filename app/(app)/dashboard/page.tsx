import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard · Vida' }

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.30)',
  border: '1.5px solid rgba(255,255,255,0.55)',
  borderRadius: 22,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: '0 2px 20px rgba(61,44,53,0.06)',
}

const clickGlass: React.CSSProperties = {
  ...glass,
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

  const FEATURES = [
    {
      href: '/tracker',
      emoji: '📈',
      bg: 'rgba(196,122,90,0.12)',
      title: 'Symptom tracker',
      desc: list.length > 0 ? `${list.length} entries this month` : 'View trends and patterns',
    },
    {
      href: '/medication',
      emoji: '💊',
      bg: 'rgba(196,149,158,0.12)',
      title: 'Medications & HRT',
      desc: 'Manage and track adherence',
    },
    {
      href: '/companion',
      emoji: '💬',
      bg: 'rgba(184,169,201,0.15)',
      title: 'AI Companion',
      desc: 'Your personal wellness coach',
      badge: 'Premium',
    },
    {
      href: '/community',
      emoji: '👥',
      bg: 'rgba(107,158,128,0.12)',
      title: 'Community',
      desc: 'Connect with women who get it',
    },
  ]

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', padding: '36px 28px 80px' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 32, fontWeight: 700, color: '#3d2c35', margin: 0,
        }}>
          {greeting}{firstName ? `, ${firstName}` : ''} 🌿
        </h1>
        <p style={{ color: '#8a7a72', marginTop: 6, fontSize: 15 }}>
          {todayLogged ? "You've already logged today — well done!" : "How are you feeling today?"}
        </p>
      </div>

      {/* Two-column grid */}
      <div className="dash-grid">

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Check-in CTA or today snapshot */}
          {!todayLogged ? (
            <Link href="/check-in" style={{ textDecoration: 'none' }}>
              <div style={{
                ...clickGlass,
                border: '1.5px solid rgba(107,158,128,0.32)',
                padding: '22px 24px',
              }} className="dash-card-hover">
                <div style={{
                  width: 56, height: 56, borderRadius: 18,
                  background: 'linear-gradient(135deg, rgba(107,158,128,0.20) 0%, rgba(107,158,128,0.08) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0,
                }}>🤍</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: '#3d2c35', fontSize: 17, margin: 0 }}>Log today's check-in</p>
                  <p style={{ color: '#8a7a72', fontSize: 14, marginTop: 4 }}>Track how you're feeling — takes under 2 minutes</p>
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: 12,
                  background: 'rgba(107,158,128,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, color: '#6b9e80', flexShrink: 0,
                }}>→</div>
              </div>
            </Link>
          ) : latestCheckin ? (
            <div style={{ ...glass, padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 12,
                  background: 'rgba(107,158,128,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>🌿</div>
                <p style={{ fontWeight: 700, color: '#3d2c35', fontSize: 15, margin: 0 }}>Today's snapshot</p>
                <Link href="/check-in" style={{
                  marginLeft: 'auto', fontSize: 12, color: '#6b9e80', fontWeight: 600,
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                }}>Edit →</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {[
                  { label: 'Mood', value: latestCheckin.mood, color: '#6b9e80' },
                  { label: 'Energy', value: latestCheckin.energy_level, color: '#c47a5a' },
                  { label: 'Sleep', value: latestCheckin.sleep_quality, color: '#c4959e' },
                  { label: 'Hot flash', value: latestCheckin.hot_flash_severity, color: '#b8a9c9' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{
                    textAlign: 'center',
                    background: 'rgba(253,248,244,0.55)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    borderRadius: 16, padding: '14px 8px',
                  }}>
                    <p style={{ fontSize: 24, fontWeight: 800, color, margin: 0 }}>{value ?? '—'}</p>
                    <p style={{ fontSize: 11, color: '#8a7a72', marginTop: 5 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ ...glass, textAlign: 'center', padding: '24px 16px' }}>
              <p style={{
                fontSize: 42, fontWeight: 800, color: '#6b9e80', margin: 0,
                fontFamily: 'var(--font-playfair), Georgia, serif',
              }}>{streak || '—'}</p>
              <p style={{ fontSize: 13, color: '#8a7a72', marginTop: 6 }}>Day streak 🔥</p>
            </div>
            <div style={{ ...glass, textAlign: 'center', padding: '24px 16px' }}>
              <p style={{
                fontSize: 42, fontWeight: 800, color: '#c47a5a', margin: 0,
                fontFamily: 'var(--font-playfair), Georgia, serif',
              }}>{monthCount || '—'}</p>
              <p style={{ fontSize: 13, color: '#8a7a72', marginTop: 6 }}>Check-ins this month</p>
            </div>
          </div>

          {/* Feature cards on mobile */}
          <div className="dash-features-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FEATURES.map(({ href, emoji, bg, title, desc, badge }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{ ...clickGlass, padding: '16px 20px' }} className="dash-card-hover">
                  <div style={{
                    width: 46, height: 46, borderRadius: 14, background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, flexShrink: 0,
                  }}>{emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <p style={{ fontWeight: 600, color: '#3d2c35', fontSize: 15, margin: 0 }}>{title}</p>
                      {badge && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: '#c9a96e',
                          background: 'rgba(201,169,110,0.12)',
                          border: '1px solid rgba(201,169,110,0.28)',
                          borderRadius: 8, padding: '2px 7px', letterSpacing: '0.03em',
                        }}>PREMIUM</span>
                      )}
                    </div>
                    <p style={{ color: '#8a7a72', fontSize: 13, marginTop: 3 }}>{desc}</p>
                  </div>
                  <span style={{ fontSize: 18, color: '#c4b5ae' }}>›</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column — desktop only */}
        <div className="dash-right-col" style={{ flexDirection: 'column', gap: 10 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: '#b8a9a0', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 4,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>Quick access</p>
          {FEATURES.map(({ href, emoji, bg, title, desc, badge }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{ ...clickGlass, padding: '16px 18px' }} className="dash-card-hover">
                <div style={{
                  width: 42, height: 42, borderRadius: 13, background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>{emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <p style={{ fontWeight: 600, color: '#3d2c35', fontSize: 14, margin: 0 }}>{title}</p>
                    {badge && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, color: '#c9a96e',
                        background: 'rgba(201,169,110,0.12)',
                        border: '1px solid rgba(201,169,110,0.28)',
                        borderRadius: 7, padding: '2px 6px', letterSpacing: '0.03em',
                      }}>PREMIUM</span>
                    )}
                  </div>
                  <p style={{ color: '#8a7a72', fontSize: 12, marginTop: 2 }}>{desc}</p>
                </div>
                <span style={{ fontSize: 16, color: '#c4b5ae' }}>›</span>
              </div>
            </Link>
          ))}
        </div>

      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#c8bdb8', marginTop: 40, lineHeight: 1.6 }}>
        Vida provides educational support only. Always discuss medical decisions with your healthcare provider.
      </p>
    </div>
  )
}
