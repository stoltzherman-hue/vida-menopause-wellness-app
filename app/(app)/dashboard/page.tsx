export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import Link from 'next/link'
import { NotificationSetup } from '@/components/notifications/NotificationSetup'
import { StreakCard } from '@/components/dashboard/StreakCard'
import { TrendsChart } from '@/components/dashboard/TrendsChart'
import { PatternInsights } from '@/components/dashboard/PatternInsights'

export const metadata: Metadata = { title: 'Dashboard · Vida' }

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.32)',
  border: '1.5px solid rgba(255,255,255,0.58)',
  borderRadius: 22,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: '0 2px 20px rgba(26,18,32,0.07)',
}

const WELLBEING_EMOJI = ['', '😞', '😔', '😐', '🙂', '😊']
const WELLBEING_LABEL = ['', 'Rough day', 'Struggling', 'Getting by', 'Pretty good', 'Feeling great']
const WELLBEING_COLOR = ['', '#e07a5f', '#c47a5a', '#b8a9a0', '#6b9e80', '#2d8b7a']

export default async function DashboardPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const today = new Date().toISOString().split('T')[0]

  const [{ data: checkins }, { data: profile }, { data: todayCheckin }] = await Promise.all([
    supabase
      .from('daily_checkins')
      .select('checkin_date, mood, overall_wellbeing, energy_level, sleep_hours, sleep_quality, hot_flash_severity, hot_flash_count, triggers')
      .eq('user_id', user!.id)
      .gte('checkin_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('checkin_date', { ascending: true }),
    supabase
      .from('user_profiles')
      .select('display_name, goals')
      .eq('user_id', user!.id)
      .maybeSingle(),
    supabase
      .from('daily_checkins')
      .select('overall_wellbeing, mood, energy_level, sleep_hours, sleep_quality, hot_flash_severity, night_sweats_severity, triggers')
      .eq('user_id', user!.id)
      .eq('checkin_date', today)
      .maybeSingle(),
  ])

  const list = checkins ?? []
  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
  const fourteenDaysAgoStr = fourteenDaysAgo.toISOString().split('T')[0]
  const last14 = list.filter((c) => c.checkin_date >= fourteenDaysAgoStr)
  const dateSet = new Set(list.map((c) => c.checkin_date))
  const todayLogged = !!todayCheckin

  // Parse named symptoms from triggers
  const namedSymptoms: string[] = []
  if (todayCheckin?.triggers) {
    const triggers = todayCheckin.triggers as string[]
    triggers.forEach((t: string) => {
      if (t.startsWith('symptom:')) namedSymptoms.push(t.slice(8))
    })
    if (todayCheckin.hot_flash_severity) namedSymptoms.unshift('Hot flushes')
    if (todayCheckin.night_sweats_severity) namedSymptoms.unshift('Night sweats')
  }

  // Streak
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

  // Longest streak calculation (all-time, across full dateSet)
  let longestStreak = streak
  {
    let run = 0
    const allDates = Array.from(dateSet).sort()
    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) { run = 1 } else {
        const prev = new Date(allDates[i - 1] + 'T00:00:00')
        const curr = new Date(allDates[i] + 'T00:00:00')
        const diff = (curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000)
        if (diff === 1) { run++ } else { run = 1 }
      }
      if (run > longestStreak) longestStreak = run
    }
  }
  const totalCheckins = dateSet.size

  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthCount = list.filter((c) => c.checkin_date.startsWith(thisMonth)).length

  const withMood = list.filter((c) => c.mood != null)
  const withEnergy = list.filter((c) => c.energy_level != null)
  const withSleep = list.filter((c) => c.sleep_quality != null)
  const avgMood = withMood.length ? withMood.reduce((s, c) => s + (c.mood ?? 0), 0) / withMood.length : null
  const avgEnergy = withEnergy.length ? withEnergy.reduce((s, c) => s + (c.energy_level ?? 0), 0) / withEnergy.length : null
  const avgSleep = withSleep.length ? withSleep.reduce((s, c) => s + (c.sleep_quality ?? 0), 0) / withSleep.length : null
  const consistency = Math.round((monthCount / 30) * 100)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = (profile?.display_name ?? '').split(' ')[0] || null

  const dateLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  // Time-of-day wellness tip
  const timeCard = hour >= 6 && hour < 12
    ? { icon: '🌅', title: 'Morning moment', body: 'Take 3 slow breaths before you check your phone. Starting calm sets your nervous system for the day.', color: '#c9a96e', bg: 'rgba(201,169,110,0.08)', border: 'rgba(201,169,110,0.22)' }
    : hour >= 12 && hour < 17
    ? { icon: '💧', title: 'Afternoon hydration check', body: 'Staying hydrated can help reduce hot flush intensity. How\'s your water intake today?', color: '#2d8b7a', bg: 'rgba(45,139,122,0.07)', border: 'rgba(45,139,122,0.20)' }
    : hour >= 17 && hour < 21
    ? { icon: '🌙', title: 'Evening wind-down', body: 'Cooling your room to 18°C before sleep can significantly reduce night sweats. Your body will thank you.', color: '#9b8ab8', bg: 'rgba(155,138,184,0.08)', border: 'rgba(155,138,184,0.22)' }
    : { icon: '✨', title: 'Sleep prep', body: 'Wearing lightweight, breathable fabrics and keeping a window slightly open can ease night symptoms.', color: '#c4959e', bg: 'rgba(196,149,158,0.08)', border: 'rgba(196,149,158,0.20)' }

  const wellbeing = todayCheckin?.overall_wellbeing as number | null ?? null

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', padding: '28px 20px 80px' }}>

      {/* ── Notification prompt ── */}
      <div style={{ marginBottom: 20 }}>
        <NotificationSetup />
      </div>

      {/* ── Streak card ── */}
      <StreakCard streak={streak} longestStreak={longestStreak} totalCheckins={totalCheckins} />

      {/* ── Trends chart ── */}
      <div style={{ marginBottom: 16 }}>
        <TrendsChart checkins={last14} />
      </div>

      {/* ── Pattern insights ── */}
      <div style={{ marginBottom: 24 }}>
        <PatternInsights checkins={list} />
      </div>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: '#b8a9a0', fontWeight: 500, margin: '0 0 4px', letterSpacing: '0.01em' }}>
          {dateLabel}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(22px, 3.5vw, 30px)',
            fontWeight: 700,
            color: '#1a1220',
            margin: 0,
            lineHeight: 1.15,
          }}>
            {greeting}{firstName ? `, ${firstName}` : ''}
          </h1>
          {streak > 1 && (
            <div style={{
              flexShrink: 0,
              background: 'rgba(45,139,122,0.10)',
              border: '1.5px solid rgba(45,139,122,0.22)',
              borderRadius: 14,
              padding: '8px 16px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#2d8b7a', margin: 0, lineHeight: 1, fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                {streak}🔥
              </p>
              <p style={{ fontSize: 10, color: '#5a8a7a', margin: '2px 0 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Day streak</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Two-column grid ── */}
      <div className="dash-grid">

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* TODAY CARD — how are you / or today summary */}
          {!todayLogged ? (
            /* Not logged yet — warm invitation */
            <div style={{ ...glass, padding: '28px 24px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#b8a9a0', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                Today&apos;s check-in
              </p>
              <p style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 21,
                fontWeight: 700,
                color: '#1a1220',
                margin: '0 0 6px',
                lineHeight: 1.3,
              }}>
                How are you feeling today?
              </p>
              <p style={{ fontSize: 14, color: '#8a7a72', margin: '0 0 24px', lineHeight: 1.6 }}>
                Tracking daily helps you spot patterns and understand what helps most.
              </p>
              <Link href="/check-in" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #2d8b7a, #1e6b55)',
                color: 'white', borderRadius: 14, padding: '14px 24px',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(45,139,122,0.30)',
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Start today&apos;s check-in
              </Link>
            </div>
          ) : (
            /* Logged — wellness summary */
            <div style={{ ...glass, padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 11,
                    background: 'rgba(45,139,122,0.14)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2d8b7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p style={{ fontWeight: 700, color: '#3d2c35', fontSize: 15, margin: 0 }}>Today&apos;s wellness</p>
                </div>
                <Link href="/check-in" style={{
                  fontSize: 13, color: '#2d8b7a', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none',
                }}>
                  Edit
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>

              {/* Wellbeing pulse */}
              {wellbeing && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20,
                  background: `${WELLBEING_COLOR[wellbeing]}10`,
                  border: `1.5px solid ${WELLBEING_COLOR[wellbeing]}25`,
                  borderRadius: 16, padding: '14px 18px',
                }}>
                  <span style={{ fontSize: 36 }}>{WELLBEING_EMOJI[wellbeing]}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 16, color: WELLBEING_COLOR[wellbeing], margin: 0 }}>
                      {WELLBEING_LABEL[wellbeing]}
                    </p>
                    <p style={{ fontSize: 13, color: '#8a7a72', margin: '2px 0 0' }}>Overall wellbeing</p>
                  </div>
                </div>
              )}

              {/* Named symptoms */}
              {namedSymptoms.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#b8a9a0', margin: '0 0 8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Symptoms today
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {namedSymptoms.map((s) => (
                      <span key={s} style={{
                        fontSize: 13, fontWeight: 500, color: '#6a5a6e',
                        background: 'rgba(155,138,184,0.12)',
                        border: '1px solid rgba(155,138,184,0.25)',
                        borderRadius: 20, padding: '5px 13px',
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {namedSymptoms.length === 0 && !wellbeing && (
                <p style={{ fontSize: 14, color: '#8a7a72', margin: '0 0 8px' }}>Check-in logged ✓</p>
              )}

              {/* Quick metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 4 }}>
                {[
                  { label: 'Energy', value: todayCheckin?.energy_level, suffix: '/10', color: '#c47a5a' },
                  { label: 'Sleep', value: todayCheckin?.sleep_hours, suffix: 'h', color: '#9b8ab8' },
                  { label: 'Sleep quality', value: todayCheckin?.sleep_quality, suffix: '/5', color: '#c4959e' },
                ].filter(m => m.value != null).map(({ label, value, suffix, color }) => (
                  <div key={label} style={{
                    textAlign: 'center',
                    background: 'rgba(253,248,244,0.55)',
                    border: '1px solid rgba(255,255,255,0.65)',
                    borderRadius: 14, padding: '12px 6px',
                  }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color, margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif', lineHeight: 1 }}>
                      {value}
                    </p>
                    <p style={{ fontSize: 10, color: '#b8a9a0', margin: '1px 0 0' }}>{suffix}</p>
                    <p style={{ fontSize: 10, color: '#8a7a72', margin: '3px 0 0', fontWeight: 500 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RIGHT NOW TOOLS ── */}
          <div style={{ ...glass, padding: '18px 20px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#b8a9a0', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              Right now
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { href: '/tools', icon: '🫁', label: 'Breathing', color: '#2d8b7a', bg: 'rgba(45,139,122,0.09)' },
                { href: '/tools', icon: '🌡️', label: 'Hot flush', color: '#e07a5f', bg: 'rgba(224,122,95,0.09)' },
                { href: '/tools', icon: '🌿', label: 'Grounding', color: '#9b8ab8', bg: 'rgba(155,138,184,0.09)' },
              ].map(({ href, icon, label, color, bg }) => (
                <Link key={label} href={href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: bg, border: `1px solid ${color}20`,
                    borderRadius: 14, padding: '14px 10px', textAlign: 'center',
                    transition: 'transform 0.15s',
                  }} className="dash-card-hover">
                    <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>{icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color, display: 'block' }}>{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── TIME-OF-DAY TIP ── */}
          <div style={{
            background: timeCard.bg,
            border: `1.5px solid ${timeCard.border}`,
            borderRadius: 18, padding: '16px 18px',
          }} className="fade-in fade-in-d1">
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{timeCard.icon}</span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: timeCard.color, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                  {timeCard.title}
                </p>
                <p style={{ fontSize: 13, color: '#5a6a6a', margin: 0, lineHeight: 1.6 }}>
                  {timeCard.body}
                </p>
              </div>
            </div>
          </div>

          {/* ── WELLNESS ACTIVITIES ── */}
          <div style={{ ...glass, padding: '22px 20px' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#b8a9a0', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 14px' }}>
              Wellness today
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                {
                  href: '/companion',
                  color: '#9b8ab8',
                  bg: 'rgba(155,138,184,0.10)',
                  title: 'Ask your AI companion',
                  desc: todayLogged && namedSymptoms.length > 0
                    ? `Get tips for ${namedSymptoms[0].toLowerCase()}`
                    : 'Get personalised support',
                  badge: 'Premium',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9b8ab8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  ),
                },
                {
                  href: '/community',
                  color: '#2d8b7a',
                  bg: 'rgba(45,139,122,0.10)',
                  title: 'Community',
                  desc: 'Connect with women who get it',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d8b7a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  ),
                },
                {
                  href: '/tracker',
                  color: '#c47a5a',
                  bg: 'rgba(196,122,90,0.10)',
                  title: 'Symptom trends',
                  desc: list.length > 0 ? `${list.length} entries tracked this month` : 'View your patterns over time',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c47a5a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  ),
                },
                {
                  href: '/medication',
                  color: '#c4959e',
                  bg: 'rgba(196,149,158,0.10)',
                  title: 'Medications & HRT',
                  desc: 'Manage and track adherence',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4959e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="4"/>
                      <path d="M12 8v8m-4-4h8"/>
                    </svg>
                  ),
                },
                {
                  href: '/report',
                  color: '#c9a96e',
                  bg: 'rgba(201,169,110,0.10)',
                  title: 'Doctor Report',
                  desc: 'Generate a symptom summary for your GP',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  ),
                },
              ].map(({ href, color, bg, title, desc, badge, icon }) => (
                <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: bg,
                    border: `1.5px solid ${color}22`,
                    borderRadius: 16, padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }} className="dash-card-hover">
                    <div style={{
                      width: 42, height: 42, borderRadius: 13,
                      background: 'rgba(255,255,255,0.55)',
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
                      <p style={{ color: '#8a7a72', fontSize: 13, margin: '2px 0 0' }}>{desc}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c4b5ae" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── TRACKING STATS — mobile ── */}
          <div className="dash-features-mobile">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ ...glass, textAlign: 'center', padding: '20px 12px' }}>
                <p style={{ fontSize: 36, fontWeight: 800, color: '#2d8b7a', margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif', lineHeight: 1 }}>
                  {streak || '—'}
                </p>
                <p style={{ fontSize: 11, color: '#8a7a72', marginTop: 6, fontWeight: 500 }}>Day streak 🔥</p>
              </div>
              <div style={{ ...glass, textAlign: 'center', padding: '20px 12px' }}>
                <p style={{ fontSize: 36, fontWeight: 800, color: '#c47a5a', margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif', lineHeight: 1 }}>
                  {monthCount || '—'}
                </p>
                <p style={{ fontSize: 11, color: '#8a7a72', marginTop: 6, fontWeight: 500 }}>Check-ins this month</p>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN — desktop only ── */}
        <div className="dash-right-col" style={{ flexDirection: 'column', gap: 14 }}>

          {/* Tracking stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ ...glass, textAlign: 'center', padding: '18px 12px' }}>
              <p style={{ fontSize: 34, fontWeight: 800, color: '#2d8b7a', margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif', lineHeight: 1 }}>
                {streak || '—'}
              </p>
              <p style={{ fontSize: 11, color: '#8a7a72', marginTop: 5, fontWeight: 500 }}>Day streak 🔥</p>
            </div>
            <div style={{ ...glass, textAlign: 'center', padding: '18px 12px' }}>
              <p style={{ fontSize: 34, fontWeight: 800, color: '#c47a5a', margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif', lineHeight: 1 }}>
                {monthCount || '—'}
              </p>
              <p style={{ fontSize: 11, color: '#8a7a72', marginTop: 5, fontWeight: 500 }}>This month</p>
            </div>
          </div>

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

          {/* Encouragement / pattern tip */}
          {list.length >= 7 && (
            <div style={{
              background: 'rgba(45,139,122,0.08)',
              border: '1.5px solid rgba(45,139,122,0.20)',
              borderRadius: 18, padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 11,
                  background: 'rgba(45,139,122,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d8b7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4l3 3"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#1e3d35', margin: '0 0 4px' }}>
                    Your data suggests patterns
                  </p>
                  <p style={{ fontSize: 13, color: '#4a7a6a', margin: 0, lineHeight: 1.55 }}>
                    {monthCount >= 14
                      ? `Great consistency — ${monthCount} entries this month. Visit Symptom trends to explore your patterns.`
                      : 'Keep logging daily to unlock meaningful insights about your cycle.'}
                  </p>
                  <Link href="/tracker" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10,
                    fontSize: 13, fontWeight: 600, color: '#2d8b7a', textDecoration: 'none',
                  }}>
                    View trends
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#c8bdb8', marginTop: 44, lineHeight: 1.6 }}>
        Vida provides educational support only. Always discuss medical decisions with your healthcare provider.
      </p>
    </div>
  )
}
