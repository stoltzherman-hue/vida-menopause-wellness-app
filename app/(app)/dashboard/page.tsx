import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard · Vida' }

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.32)',
  border: '1.5px solid rgba(255,255,255,0.58)',
  borderRadius: 22,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: '0 2px 20px rgba(26,18,32,0.07)',
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

  // 30-day averages for insight card
  const withMood = list.filter((c) => c.mood != null)
  const withEnergy = list.filter((c) => c.energy_level != null)
  const withSleep = list.filter((c) => c.sleep_quality != null)
  const avgMood = withMood.length ? (withMood.reduce((s, c) => s + (c.mood ?? 0), 0) / withMood.length) : null
  const avgEnergy = withEnergy.length ? (withEnergy.reduce((s, c) => s + (c.energy_level ?? 0), 0) / withEnergy.length) : null
  const avgSleep = withSleep.length ? (withSleep.reduce((s, c) => s + (c.sleep_quality ?? 0), 0) / withSleep.length) : null
  const consistency = Math.round((monthCount / 30) * 100)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = (profile?.display_name ?? '').split(' ')[0] || null

  const FEATURES = [
    {
      href: '/tracker',
      color: '#c47a5a',
      iconBg: 'rgba(196,122,90,0.13)',
      title: 'Symptom tracker',
      desc: list.length > 0 ? `${list.length} entries this month` : 'View trends and patterns',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c47a5a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
    },
    {
      href: '/medication',
      color: '#c4959e',
      iconBg: 'rgba(196,149,158,0.13)',
      title: 'Medications & HRT',
      desc: 'Manage and track adherence',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c4959e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4"/>
          <path d="M12 8v8m-4-4h8"/>
        </svg>
      ),
    },
    {
      href: '/companion',
      color: '#9b8ab8',
      iconBg: 'rgba(155,138,184,0.13)',
      title: 'AI Companion',
      desc: 'Your personal wellness coach',
      badge: 'Premium',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9b8ab8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
    {
      href: '/community',
      color: '#2d8b7a',
      iconBg: 'rgba(45,139,122,0.13)',
      title: 'Community',
      desc: 'Connect with women who get it',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d8b7a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
  ]

  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', padding: '28px 20px 80px' }}>

      {/* ── Bold teal hero header ── */}
      <div className="dash-hero" style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Top row: greeting + streak */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6, gap: 12 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.65)', margin: '0 0 6px', letterSpacing: '0.01em' }}>
                {dateLabel}
              </p>
              <h1 style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(24px, 4vw, 34px)',
                fontWeight: 700,
                color: 'white',
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}>
                {greeting}{firstName ? `, ${firstName}` : ''} 🌿
              </h1>
            </div>
            {/* Streak badge */}
            {streak > 0 && (
              <div style={{
                flexShrink: 0,
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 16,
                padding: '10px 18px',
                textAlign: 'center',
                backdropFilter: 'blur(8px)',
              }}>
                <p style={{ fontSize: 26, fontWeight: 800, color: 'white', margin: 0, lineHeight: 1, fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {streak}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: '3px 0 0', fontWeight: 500 }}>Day streak 🔥</p>
              </div>
            )}
          </div>

          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', margin: '10px 0 24px', lineHeight: 1.5 }}>
            {todayLogged ? 'Check-in logged — you\'re building momentum.' : 'How are you feeling today? Your data tells your story.'}
          </p>

          {/* Quick action chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Link href="/check-in" className={`dash-chip${todayLogged ? '' : ' dash-chip-active'}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {todayLogged ? 'Update check-in' : 'Log check-in'}
            </Link>
            <Link href="/tracker" className="dash-chip">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Symptom trends
            </Link>
            <Link href="/companion" className="dash-chip">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Ask AI
            </Link>
          </div>
        </div>
      </div>

      {/* ── Two-column grid ── */}
      <div className="dash-grid">

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Today snapshot or check-in CTA */}
          {!todayLogged ? (
            <Link href="/check-in" style={{ textDecoration: 'none' }}>
              <div style={{
                ...clickGlass,
                border: '1.5px solid rgba(45,139,122,0.28)',
                padding: '22px 24px',
                background: 'rgba(45,139,122,0.06)',
              }} className="dash-card-hover">
                <div style={{
                  width: 56, height: 56, borderRadius: 18,
                  background: 'linear-gradient(135deg, rgba(45,139,122,0.18) 0%, rgba(30,107,85,0.10) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2d8b7a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: '#1e3d35', fontSize: 17, margin: 0 }}>Log today's check-in</p>
                  <p style={{ color: '#4a7a6a', fontSize: 14, marginTop: 4 }}>Takes under 2 minutes — track mood, sleep, energy</p>
                </div>
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: 'rgba(45,139,122,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d8b7a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </Link>
          ) : latestCheckin ? (
            <div style={{ ...glass, padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: 'rgba(45,139,122,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d8b7a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p style={{ fontWeight: 700, color: '#3d2c35', fontSize: 16, margin: 0 }}>Today&apos;s snapshot</p>
                <Link href="/check-in" style={{
                  marginLeft: 'auto', fontSize: 13, color: '#2d8b7a', fontWeight: 600,
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  Edit
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {[
                  { label: 'Mood', value: latestCheckin.mood, color: '#2d8b7a', max: 10 },
                  { label: 'Energy', value: latestCheckin.energy_level, color: '#c47a5a', max: 10 },
                  { label: 'Sleep quality', value: latestCheckin.sleep_quality, color: '#c4959e', max: 5 },
                  { label: 'Hot flash', value: latestCheckin.hot_flash_severity, color: '#9b8ab8', max: 5 },
                ].map(({ label, value, color, max }) => (
                  <div key={label} style={{
                    textAlign: 'center',
                    background: 'rgba(253,248,244,0.60)',
                    border: '1px solid rgba(255,255,255,0.65)',
                    borderRadius: 16, padding: '14px 8px',
                  }}>
                    <p style={{ fontSize: 26, fontWeight: 800, color, margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                      {value ?? '—'}
                    </p>
                    <p style={{ fontSize: 10, color: '#b8a9a0', marginTop: 4, fontWeight: 500 }}>/{max}</p>
                    <p style={{ fontSize: 10, color: '#8a7a72', marginTop: 2 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ ...glass, textAlign: 'center', padding: '22px 16px' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: 'rgba(45,139,122,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d8b7a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
                </svg>
              </div>
              <p style={{ fontSize: 38, fontWeight: 800, color: '#2d8b7a', margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif', lineHeight: 1 }}>
                {streak || '—'}
              </p>
              <p style={{ fontSize: 12, color: '#8a7a72', marginTop: 6, fontWeight: 500 }}>Day streak 🔥</p>
            </div>
            <div style={{ ...glass, textAlign: 'center', padding: '22px 16px' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: 'rgba(196,122,90,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c47a5a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <p style={{ fontSize: 38, fontWeight: 800, color: '#c47a5a', margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif', lineHeight: 1 }}>
                {monthCount || '—'}
              </p>
              <p style={{ fontSize: 12, color: '#8a7a72', marginTop: 6, fontWeight: 500 }}>Check-ins this month</p>
            </div>
          </div>

          {/* Feature cards — mobile only */}
          <div className="dash-features-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FEATURES.map(({ href, icon, iconBg, color, title, desc, badge }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{ ...clickGlass, padding: '16px 20px' }} className="dash-card-hover">
                  <div style={{
                    width: 48, height: 48, borderRadius: 15, background: iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{icon}</div>
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
                    <div style={{ height: 3, borderRadius: 9999, background: `${color}20`, marginTop: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '40%', background: color, borderRadius: 9999 }} />
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4b5ae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column — desktop only */}
        <div className="dash-right-col" style={{ flexDirection: 'column', gap: 14 }}>

          {/* Dark insights card */}
          <div className="insight-card">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 12,
                  background: 'rgba(45,139,122,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5cbfa8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'white', fontSize: 15, margin: 0 }}>30-day insights</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{list.length} entries tracked</p>
                </div>
              </div>

              {list.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
                  Start logging to see your patterns here
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {[
                    { label: 'Avg mood', value: avgMood, max: 10, color: '#5cbfa8', pct: avgMood ? (avgMood / 10) * 100 : 0 },
                    { label: 'Avg energy', value: avgEnergy, max: 10, color: '#c47a5a', pct: avgEnergy ? (avgEnergy / 10) * 100 : 0 },
                    { label: 'Sleep quality', value: avgSleep, max: 5, color: '#9b8ab8', pct: avgSleep ? (avgSleep / 5) * 100 : 0 },
                    { label: 'Consistency', value: consistency, max: 100, color: '#c9a96e', pct: consistency, suffix: '%' },
                  ].map(({ label, value, color, pct, suffix }) => (
                    <div key={label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{label}</span>
                        <span style={{ fontSize: 13, color: 'white', fontWeight: 700 }}>
                          {value != null ? (typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(1) : value) : '—'}{suffix ?? ''}
                        </span>
                      </div>
                      <div className="insight-bar-track">
                        <div
                          className="insight-bar-fill"
                          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}aa, ${color})` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick access label */}
          <p style={{
            fontSize: 11, fontWeight: 700, color: '#b8a9a0', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 0, marginTop: 4,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>Quick access</p>

          {/* Feature cards */}
          {FEATURES.map(({ href, icon, iconBg, color, title, desc, badge }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{ ...clickGlass, padding: '15px 18px' }} className="dash-card-hover">
                <div style={{
                  width: 42, height: 42, borderRadius: 13, background: iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{icon}</div>
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
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c4b5ae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>

      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#c8bdb8', marginTop: 44, lineHeight: 1.6 }}>
        Vida provides educational support only. Always discuss medical decisions with your healthcare provider.
      </p>
    </div>
  )
}
