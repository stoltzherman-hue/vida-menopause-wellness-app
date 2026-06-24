export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { redirect } from 'next/navigation'
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

  // Redirect new users to onboarding if not completed
  const { data: profileCheck } = await supabase
    .from('user_profiles')
    .select('onboarding_completed')
    .eq('user_id', user!.id)
    .maybeSingle()

  if (!profileCheck || profileCheck.onboarding_completed === false) {
    redirect('/onboarding')
  }

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

  const namedSymptoms: string[] = []
  if (todayCheckin?.triggers) {
    const triggers = todayCheckin.triggers as string[]
    triggers.forEach((t: string) => {
      if (t.startsWith('symptom:')) namedSymptoms.push(t.slice(8))
    })
    if (todayCheckin.hot_flash_severity) namedSymptoms.unshift('Hot flushes')
    if (todayCheckin.night_sweats_severity) namedSymptoms.unshift('Night sweats')
  }

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

      <div style={{ marginBottom: 20 }}>
        <NotificationSetup />
      </div>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', fontWeight: 300, margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {dateLabel}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(22px, 3.5vw, 30px)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.88)',
            margin: 0, lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>
            {greeting}{firstName ? `, ${firstName}` : ''}
          </h1>
          {streak > 1 && (
            <div style={{
              flexShrink: 0,
              background: 'rgba(139,109,181,0.10)',
              border: '1px solid rgba(139,109,181,0.2)',
              borderRadius: 14, padding: '8px 16px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 20, fontWeight: 300, color: '#c4b8e0', margin: 0, lineHeight: 1, fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                {streak}
              </p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', margin: '2px 0 0', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Day streak</p>
            </div>
          )}
        </div>
      </div>

      {/* 3-column grid */}
      <div className="dash-3col">

        {/* COL 1: Today's Wellness */}
        <WellnessCard
          todayLogged={todayLogged}
          wellbeing={wellbeing}
          namedSymptoms={namedSymptoms}
          sleepHours={sleepHours}
        />

        {/* COL 2: Dark Insights */}
        <div className="insight-card">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontSize: 10, fontWeight: 400, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
              margin: '0 0 8px',
            }}>
              Patterns
            </p>
            <h3 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 20, fontWeight: 300,
              color: 'rgba(255,255,255,0.88)',
              margin: '0 0 26px', lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}>
              Your insights
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { label: 'Mood', display: `${moodPct}%`, pct: moodPct, color: '#9b7cc8' },
                { label: 'Energy', display: `${energyPct}%`, pct: energyPct, color: '#c47a5a' },
                { label: 'Sleep', display: `${sleepDisplay}h`, pct: Math.min(Number(sleepDisplay) / 12 * 100, 100), color: '#c4b8e0' },
                { label: 'Consistency', display: `${consistencyPct}%`, pct: consistencyPct, color: '#c9a96e' },
              ].map(({ label, display, pct, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.38)', fontWeight: 300 }}>
                      {label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 18, fontWeight: 300, color }}>
                      {display}
                    </span>
                  </div>
                  <div className="insight-bar-track" style={{ height: 3, marginTop: 0 }}>
                    <div className="insight-bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}60, ${color})` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COL 3: Right sidebar */}
        <div className="dash-3col-sidebar">

          {/* 2x2 stat grid */}
          <div className="dash-stat-grid">
            {[
              { value: totalCheckins, label: 'Check-ins' },
              { value: avgSleepHours ? `${avgSleepHours.toFixed(1)}h` : `${sleepHours ?? '—'}h`, label: 'Avg sleep' },
            ].map(({ value, label }) => (
              <div key={label} className="glass dash-stat-card" style={{ borderRadius: 18 }}>
                <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: 0, lineHeight: 1 }}>
                  {value}
                </p>
                <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.28)', margin: '6px 0 0', fontWeight: 300 }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* AI Insight card */}
          <div className="glass-violet" style={{ borderRadius: 20, padding: 20 }}>
            <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 10, fontWeight: 400, color: 'rgba(196,184,224,0.6)', margin: '0 0 10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              AI Insight
            </p>
            <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.62)', margin: '0 0 14px', lineHeight: 1.65, fontWeight: 300 }}>
              {list.length >= 7
                ? 'Your data suggests consistent patterns worth exploring with your care team.'
                : 'Track daily to unlock personalised insights about your symptoms and wellbeing.'}
            </p>
            <Link href="/companion" style={{
              display: 'inline-block',
              border: '1px solid rgba(139,109,181,0.28)',
              color: 'rgba(196,184,224,0.8)',
              borderRadius: 9999, padding: '8px 16px',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontSize: 12, fontWeight: 300, textDecoration: 'none',
            }}>
              Ask AI companion
            </Link>
          </div>

          {/* Community card */}
          <div className="glass" style={{ borderRadius: 18, padding: '18px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9b7cc8', display: 'inline-block', animation: 'dot-pulse 2.4s infinite' }} />
              <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.28)', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Community
              </p>
            </div>
            <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.55)', margin: '0 0 12px', lineHeight: 1.55, fontWeight: 300 }}>
              Today in Perimenopause Circles...
            </p>
            <Link href="/community" style={{
              display: 'inline-block',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.45)',
              borderRadius: 9999, padding: '8px 16px',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontSize: 12, fontWeight: 300, textDecoration: 'none',
            }}>
              Join community
            </Link>
          </div>

          {/* Quick tools */}
          <div className="dash-quick-tools">
            {[
              { href: '/tools', label: 'Breathe' },
              { href: '/tools', label: 'Cool down' },
              { href: '/tools', label: 'Ground' },
            ].map(({ href, label }) => (
              <Link key={label} href={href} className="glass dash-quick-tool">
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(139,109,181,0.12)',
                  border: '1px solid rgba(139,109,181,0.2)',
                }} />
                <span style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.42)' }}>
                  {label}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.14)', marginTop: 44, lineHeight: 1.6, fontWeight: 300 }}>
        Vida provides educational support only. Always discuss medical decisions with your healthcare provider.
      </p>
    </div>
  )
}
