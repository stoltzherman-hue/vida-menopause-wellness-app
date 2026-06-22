export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import Link from 'next/link'
import { NotificationSetup } from '@/components/notifications/NotificationSetup'
import { WellnessCard } from '@/components/dashboard/WellnessCard'

export const metadata: Metadata = { title: 'Dashboard · Vida' }

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

  const totalCheckins = dateSet.size
  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthCount = list.filter((c) => c.checkin_date.startsWith(thisMonth)).length

  // Averages for insight bars
  const withMood = list.filter((c) => c.mood != null)
  const withEnergy = list.filter((c) => c.energy_level != null)
  const withSleep = list.filter((c) => c.sleep_hours != null)
  const avgMood = withMood.length ? withMood.reduce((s, c) => s + (c.mood ?? 0), 0) / withMood.length : null
  const avgEnergy = withEnergy.length ? withEnergy.reduce((s, c) => s + (c.energy_level ?? 0), 0) / withEnergy.length : null
  const avgSleepHours = withSleep.length ? withSleep.reduce((s, c) => s + (c.sleep_hours ?? 0), 0) / withSleep.length : null
  const consistency = Math.round((monthCount / 30) * 100)

  const moodPct = avgMood ? Math.round((avgMood / 10) * 100) : 78
  const energyPct = avgEnergy ? Math.round((avgEnergy / 10) * 100) : 65
  const consistencyPct = consistency || 82
  const sleepDisplay = avgSleepHours ? avgSleepHours.toFixed(1) : (todayCheckin?.sleep_hours ?? 6.2)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = (profile?.display_name ?? '').split(' ')[0] || null
  const dateLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  const wellbeing = todayCheckin?.overall_wellbeing as number | null ?? null
  const sleepHours = todayCheckin?.sleep_hours as number | null ?? null

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 80px' }}>

      {/* Notification prompt */}
      <div style={{ marginBottom: 20 }}>
        <NotificationSetup />
      </div>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
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

      {/* 3-column grid */}
      <div className="dash-3col">

        {/* ── COL 1: Today's Wellness ── */}
        <WellnessCard
          todayLogged={todayLogged}
          wellbeing={wellbeing}
          namedSymptoms={namedSymptoms}
          sleepHours={sleepHours}
        />

        {/* ── COL 2: Dark Insights ── */}
        <div
          className="insight-card"
          style={{ border: '1.5px solid rgba(255,255,255,0.07)' }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Eyebrow */}
            <p style={{
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.11em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              margin: '0 0 8px',
            }}>
              Patterns
            </p>

            {/* Heading */}
            <h3 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 20,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.9)',
              margin: '0 0 26px',
              lineHeight: 1.2,
            }}>
              Your insights
            </h3>

            {/* Insight bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { label: 'Mood', display: `${moodPct}%`, pct: moodPct, color: '#2d8b7a' },
                { label: 'Energy', display: `${energyPct}%`, pct: energyPct, color: '#c47a5a' },
                { label: 'Sleep', display: `${sleepDisplay}h`, pct: Math.min(Number(sleepDisplay) / 12 * 100, 100), color: '#9b8ab8' },
                { label: 'Consistency', display: `${consistencyPct}%`, pct: consistencyPct, color: '#c9a96e' },
              ].map(({ label, display, pct, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={{
                      fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.55)',
                      fontWeight: 500,
                    }}>
                      {label}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                      fontSize: 18,
                      fontWeight: 700,
                      color,
                    }}>
                      {display}
                    </span>
                  </div>
                  <div className="insight-bar-track" style={{ height: 4, marginTop: 0 }}>
                    <div
                      className="insight-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${color}99, ${color})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── COL 3: Right sidebar stack ── */}
        <div className="dash-3col-sidebar">

          {/* 2×2 stat grid */}
          <div className="dash-stat-grid">
            <div
              className="glass-sm dash-stat-card"
              style={{ borderRadius: 18 }}
            >
              <p style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 24,
                fontWeight: 700,
                color: '#1a1220',
                margin: 0,
                lineHeight: 1,
              }}>
                {totalCheckins}
              </p>
              <p style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 12,
                color: '#b8a9a0',
                margin: '6px 0 0',
                fontWeight: 500,
              }}>
                Check-ins
              </p>
            </div>
            <div
              className="glass-sm dash-stat-card"
              style={{ borderRadius: 18 }}
            >
              <p style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 24,
                fontWeight: 700,
                color: '#1a1220',
                margin: 0,
                lineHeight: 1,
              }}>
                {avgSleepHours ? `${avgSleepHours.toFixed(1)}h` : `${sleepHours ?? '—'}h`}
              </p>
              <p style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 12,
                color: '#b8a9a0',
                margin: '6px 0 0',
                fontWeight: 500,
              }}>
                Avg sleep
              </p>
            </div>
          </div>

          {/* AI Insight card */}
          <div style={{
            background: 'rgba(155,138,184,0.08)',
            border: '1px solid rgba(155,138,184,0.20)',
            borderRadius: 20,
            padding: 20,
          }}>
            <p style={{
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontSize: 11,
              fontWeight: 700,
              color: '#9b8ab8',
              margin: '0 0 10px',
              letterSpacing: '0.06em',
            }}>
              ✨ AI Insight
            </p>
            <p style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 14,
              fontStyle: 'italic',
              color: '#4a3558',
              margin: '0 0 14px',
              lineHeight: 1.6,
            }}>
              {list.length >= 7
                ? 'Your data suggests consistent patterns worth exploring with your care team.'
                : 'Track daily to unlock personalised insights about your symptoms and wellbeing.'}
            </p>
            <Link
              href="/companion"
              style={{
                display: 'inline-block',
                border: '1px solid rgba(45,139,122,0.25)',
                color: '#2d8b7a',
                borderRadius: 9999,
                padding: '8px 16px',
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                background: 'transparent',
              }}
            >
              Ask AI companion →
            </Link>
          </div>

          {/* Community card */}
          <div className="glass-sm" style={{ borderRadius: 18, padding: '18px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#2d8b7a',
                display: 'inline-block',
                animation: 'dot-pulse 2.4s infinite',
              }} />
              <p style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 11,
                fontWeight: 700,
                color: '#b8a9a0',
                margin: 0,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                Community
              </p>
            </div>
            <p style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 14,
              fontStyle: 'italic',
              color: '#5a4a6a',
              margin: '0 0 12px',
              lineHeight: 1.55,
            }}>
              Today in Perimenopause Circles...
            </p>
            <Link
              href="/community"
              style={{
                display: 'inline-block',
                border: '1px solid rgba(45,139,122,0.25)',
                color: '#2d8b7a',
                borderRadius: 9999,
                padding: '8px 16px',
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                background: 'transparent',
              }}
            >
              Join community →
            </Link>
          </div>

          {/* Quick tools row */}
          <div className="dash-quick-tools">
            {[
              { href: '/tools', emoji: '🫁', label: 'Breathe' },
              { href: '/tools', emoji: '🌡️', label: 'Cool down' },
              { href: '/tools', emoji: '🌿', label: 'Ground' },
            ].map(({ href, emoji, label }) => (
              <Link
                key={label}
                href={href}
                className="glass-sm dash-quick-tool"
              >
                <span style={{ fontSize: 24, lineHeight: 1 }}>{emoji}</span>
                <span style={{
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  fontSize: 11,
                  fontWeight: 500,
                  color: '#5a4a6a',
                }}>
                  {label}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#c8bdb8', marginTop: 44, lineHeight: 1.6 }}>
        Vida provides educational support only. Always discuss medical decisions with your healthcare provider.
      </p>
    </div>
  )
}
