import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard · Vida' }

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.42)',
  border: '1.5px solid rgba(255,255,255,0.65)',
  borderRadius: 22,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: '0 2px 20px rgba(42,30,38,0.06)',
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
      .select('display_name, goals, menopause_stage')
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
  const stage = profile?.menopause_stage ?? 'Perimenopause'

  const avgMood = list.length
    ? Math.round(list.reduce((s, c) => s + (c.mood ?? 0), 0) / list.filter(c => c.mood).length)
    : null
  const avgEnergy = list.length
    ? Math.round(list.reduce((s, c) => s + (c.energy_level ?? 0), 0) / list.filter(c => c.energy_level).length)
    : null

  const FEATURES = [
    {
      href: '/tracker',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      bg: 'rgba(196,122,90,0.10)',
      iconColor: '#c47a5a',
      title: 'Symptom tracker',
      desc: list.length > 0 ? `${list.length} entries this month` : 'View trends and patterns',
    },
    {
      href: '/medication',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>
        </svg>
      ),
      bg: 'rgba(155,138,184,0.12)',
      iconColor: '#9b8ab8',
      title: 'Medications & HRT',
      desc: 'Manage and track adherence',
    },
    {
      href: '/companion',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      bg: 'rgba(90,143,110,0.10)',
      iconColor: '#3d7a58',
      title: 'AI Companion',
      desc: 'Your personal wellness coach',
      badge: 'Premium',
    },
    {
      href: '/community',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      bg: 'rgba(45,139,122,0.10)',
      iconColor: '#2d8b7a',
      title: 'Community',
      desc: 'Connect with women who get it',
    },
  ]

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto' }}>

      {/* ── Teal health status header ─────────────────────────────────────── */}
      <div className="health-status-header">
        {/* Greeting row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, position: 'relative', zIndex: 1 }}>
          <div>
            <p style={{
              fontSize: 15, color: 'rgba(255,255,255,0.72)', margin: 0,
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            }}>{greeting}{firstName ? `, ${firstName}` : ''}</p>
            <h1 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 28, fontWeight: 700, color: 'white', margin: '2px 0 0',
              letterSpacing: '-0.02em',
            }}>Your Wellness Today</h1>
          </div>
          <div style={{
            width: 46, height: 46, borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            border: '1.5px solid rgba(255,255,255,0.32)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, cursor: 'pointer', flexShrink: 0,
          }}>👤</div>
        </div>

        {/* Health stage */}
        <div style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
            Current health status
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="status-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'white', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                {stage}
              </span>
            </div>
            <Link href="/settings" className="status-pill" style={{ fontSize: 13, color: 'rgba(255,255,255,0.80)', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', textDecoration: 'none' }}>
              Update status
            </Link>
          </div>
        </div>

        {/* Quick action chips */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <Link href="/check-in" className="quick-chip">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {todayLogged ? 'Update check-in' : 'Log check-in'}
          </Link>
          <Link href="/tracker" className="quick-chip">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            Wellbeing
          </Link>
          <Link href="/tracker" className="quick-chip">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Triggers
          </Link>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div style={{ padding: '22px 20px 80px' }}>

        {/* Today's snapshot or CTA */}
        {!todayLogged ? (
          <Link href="/check-in" style={{ textDecoration: 'none', display: 'block', marginBottom: 14 }}>
            <div style={{
              ...clickGlass,
              border: '1.5px solid rgba(90,143,110,0.28)',
              padding: '20px 22px',
              background: 'linear-gradient(135deg, rgba(90,143,110,0.10) 0%, rgba(255,255,255,0.38) 100%)',
            }} className="dash-card-hover">
              <div style={{
                width: 54, height: 54, borderRadius: 18,
                background: 'linear-gradient(135deg, #3d7a58 0%, #2d8b7a 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: '0 4px 16px rgba(45,139,122,0.35)',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: '#1a1220', fontSize: 16, margin: 0 }}>Log today&apos;s check-in</p>
                <p style={{ color: '#7a6a72', fontSize: 13, marginTop: 3 }}>Track how you&apos;re feeling — takes under 2 minutes</p>
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: 'rgba(90,143,110,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, color: '#3d7a58',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          </Link>
        ) : latestCheckin ? (
          <div style={{ ...glass, padding: '22px 22px', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(90,143,110,0.18) 0%, rgba(90,143,110,0.08) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3d7a58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <p style={{ fontWeight: 700, color: '#1a1220', fontSize: 15, margin: 0 }}>Today&apos;s snapshot</p>
              <span style={{
                marginLeft: 4, fontSize: 11, fontWeight: 700, color: '#3d7a58',
                background: 'rgba(90,143,110,0.10)', borderRadius: 99, padding: '3px 10px',
              }}>Logged ✓</span>
              <Link href="/check-in" style={{
                marginLeft: 'auto', fontSize: 12, color: '#5a8f6e', fontWeight: 600,
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              }}>Edit →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                { label: 'Mood', value: latestCheckin.mood, color: '#3d7a58', bg: 'rgba(90,143,110,0.08)' },
                { label: 'Energy', value: latestCheckin.energy_level, color: '#c47a5a', bg: 'rgba(196,122,90,0.08)' },
                { label: 'Sleep', value: latestCheckin.sleep_quality, color: '#9b8ab8', bg: 'rgba(155,138,184,0.10)' },
                { label: 'Hot flash', value: latestCheckin.hot_flash_severity, color: '#2d8b7a', bg: 'rgba(45,139,122,0.08)' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} style={{
                  textAlign: 'center',
                  background: bg,
                  border: '1px solid rgba(255,255,255,0.70)',
                  borderRadius: 18, padding: '14px 8px',
                }}>
                  <p style={{ fontSize: 26, fontWeight: 800, color, margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                    {value ?? '—'}
                  </p>
                  <p style={{ fontSize: 10, color: '#8a7a72', marginTop: 5, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ── Stats strip ────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 14 }}>
          <div className="stat-card">
            <p style={{
              fontSize: 44, fontWeight: 800, margin: 0, lineHeight: 1,
              fontFamily: 'var(--font-playfair), Georgia, serif',
              background: 'linear-gradient(135deg, #3d7a58, #2d8b7a)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{streak || '—'}</p>
            <p style={{ fontSize: 12, color: '#8a7a72', marginTop: 8, fontWeight: 600, letterSpacing: '0.02em' }}>Day streak 🔥</p>
            {streak > 0 && <div style={{ marginTop: 8 }}><span className="trend-up">↑ Keep going</span></div>}
          </div>
          <div className="stat-card">
            <p style={{
              fontSize: 44, fontWeight: 800, margin: 0, lineHeight: 1,
              fontFamily: 'var(--font-playfair), Georgia, serif',
              background: 'linear-gradient(135deg, #c47a5a, #c4959e)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{monthCount || '—'}</p>
            <p style={{ fontSize: 12, color: '#8a7a72', marginTop: 8, fontWeight: 600, letterSpacing: '0.02em' }}>Check-ins this month</p>
            {avgMood && <div style={{ marginTop: 8 }}><span className="trend-up">Avg mood: {avgMood}/10</span></div>}
          </div>
        </div>

        {/* ── Dashboard grid ─────────────────────────────────────────────── */}
        <div className="dash-grid">
          {/* Left: feature cards (mobile) + insight dark card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Dark insights card */}
            {avgMood && avgEnergy ? (
              <div className="viz-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>30-day insights</p>
                    <p style={{ fontSize: 17, fontWeight: 700, color: 'white', margin: '4px 0 0', fontFamily: 'var(--font-playfair), Georgia, serif' }}>Your data suggests</p>
                  </div>
                  <Link href="/tracker" style={{
                    fontSize: 12, color: '#5aaa88', fontWeight: 600, textDecoration: 'none',
                    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  }}>View all →</Link>
                </div>

                {[
                  { label: 'Average mood', value: avgMood, max: 10, color: '#3d7a58' },
                  { label: 'Average energy', value: avgEnergy, max: 10, color: '#9b8ab8' },
                  { label: 'Days tracked', value: monthCount, max: 30, color: '#c47a5a' },
                ].map(({ label, value, max, color }) => (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{label}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'var(--font-playfair), Georgia, serif' }}>{value}<span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>/{max}</span></span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(value / max) * 100}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="viz-card" style={{ textAlign: 'center', padding: '32px 24px' }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>📊</div>
                <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 8 }}>
                  Insights coming soon
                </p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 20 }}>
                  Log a few check-ins and your personalised data patterns will appear here.
                </p>
                <Link href="/check-in" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: 'rgba(90,143,110,0.25)', border: '1px solid rgba(90,143,110,0.40)',
                  borderRadius: 99, padding: '10px 22px', fontSize: 13, fontWeight: 600, color: '#7dcca0',
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', textDecoration: 'none',
                }}>Start tracking →</Link>
              </div>
            )}

            {/* Feature cards on mobile */}
            <div className="dash-features-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FEATURES.map(({ href, icon, bg, iconColor, title, desc, badge }) => (
                <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                  <div style={{ ...clickGlass, padding: '16px 20px' }} className="dash-card-hover">
                    <div style={{
                      width: 48, height: 48, borderRadius: 15, background: bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, color: iconColor,
                    }}>{icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <p style={{ fontWeight: 700, color: '#1a1220', fontSize: 15, margin: 0 }}>{title}</p>
                        {badge && (
                          <span style={{
                            fontSize: 10, fontWeight: 700, color: '#a8843a',
                            background: 'rgba(201,169,110,0.12)',
                            border: '1px solid rgba(201,169,110,0.28)',
                            borderRadius: 8, padding: '2px 7px', letterSpacing: '0.03em',
                          }}>PREMIUM</span>
                        )}
                      </div>
                      <p style={{ color: '#8a7a72', fontSize: 13, marginTop: 3 }}>{desc}</p>
                    </div>
                    <span style={{ color: '#c4b5ae' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </span>
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
            {FEATURES.map(({ href, icon, bg, iconColor, title, desc, badge }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{ ...clickGlass, padding: '15px 18px' }} className="dash-card-hover">
                  <div style={{
                    width: 44, height: 44, borderRadius: 14, background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: iconColor,
                  }}>{icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <p style={{ fontWeight: 600, color: '#1a1220', fontSize: 14, margin: 0 }}>{title}</p>
                      {badge && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: '#a8843a',
                          background: 'rgba(201,169,110,0.12)',
                          border: '1px solid rgba(201,169,110,0.28)',
                          borderRadius: 7, padding: '2px 6px', letterSpacing: '0.03em',
                        }}>PREMIUM</span>
                      )}
                    </div>
                    <p style={{ color: '#8a7a72', fontSize: 12, marginTop: 2 }}>{desc}</p>
                  </div>
                  <span style={{ color: '#c4b5ae' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#c8bdb8', marginTop: 40, lineHeight: 1.7 }}>
          Vida provides educational support only. Always discuss medical decisions with your healthcare provider.
        </p>
      </div>
    </div>
  )
}
