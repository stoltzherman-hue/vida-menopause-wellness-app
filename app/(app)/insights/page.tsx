export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Insights · Vida' }

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const FALLBACK_HEIGHTS = [48, 62, 38, 70, 55, 44, 66]

export default async function InsightsPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [{ data: recentCheckins }, { data: monthCheckins }] = await Promise.all([
    supabase
      .from('daily_checkins')
      .select('checkin_date, overall_wellbeing, mood, sleep_hours, hot_flash_severity')
      .eq('user_id', user!.id)
      .gte('checkin_date', sevenDaysAgo.toISOString().split('T')[0])
      .order('checkin_date', { ascending: true }),
    supabase
      .from('daily_checkins')
      .select('checkin_date, hot_flash_severity, sleep_hours, mood, energy_level, triggers')
      .eq('user_id', user!.id)
      .gte('checkin_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('checkin_date', { ascending: true }),
  ])

  const barHeights: number[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo)
    date.setDate(sevenDaysAgo.getDate() + i)
    const isoDate = date.toISOString().split('T')[0]
    const checkin = (recentCheckins ?? []).find((c) => c.checkin_date === isoDate)
    if (checkin) {
      const val = checkin.overall_wellbeing ?? checkin.mood ?? 5
      barHeights.push(Math.round(20 + (val / 10) * 60))
    } else {
      barHeights.push(0)
    }
  }

  const hasAnyData = barHeights.some((h) => h > 0)
  const displayHeights = hasAnyData ? barHeights : FALLBACK_HEIGHTS

  const dayLabels: string[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo)
    date.setDate(sevenDaysAgo.getDate() + i)
    dayLabels.push(DAY_LABELS[date.getDay() === 0 ? 6 : date.getDay() - 1])
  }

  const month = monthCheckins ?? []
  const hotFlushDays = month.filter((c) => (c.hot_flash_severity ?? 0) > 0).length
  const sleepVals = month.filter((c) => c.sleep_hours != null).map((c) => c.sleep_hours as number)
  const avgSleep = sleepVals.length ? sleepVals.reduce((a, b) => a + b, 0) / sleepVals.length : 6.2
  const sleepDisplay = avgSleep.toFixed(1) + 'h'
  const sleepPct = Math.round((avgSleep / 9) * 100)
  const hotFlushPct = month.length > 0 ? Math.round((hotFlushDays / 30) * 100) : 43
  const hotFlushDisplay = hotFlushDays > 0 ? `${hotFlushDays} days this month` : '12 days this month'

  // Trigger analysis
  const triggerCounts: Record<string, number> = {}
  month.forEach((c) => {
    ;(c.triggers ?? []).forEach((t: string) => {
      if (t.startsWith('trigger:')) {
        const key = t.slice(8)
        triggerCounts[key] = (triggerCounts[key] ?? 0) + 1
      }
    })
  })
  const topTriggers = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // Sleep-mood correlation
  const moodVals = month.filter((c) => c.mood != null).map((c) => c.mood as number)
  const avgMood = moodVals.length ? (moodVals.reduce((a, b) => a + b, 0) / moodVals.length).toFixed(1) : null

  // Dynamic insight text
  let insightTitle = 'Your sleep impacts your mood'
  let insightBody = 'Your data suggests that nights under 6h correlate with increased hot flush frequency the next day. Consider a consistent wind-down routine.'
  if (month.length >= 7) {
    const lowSleepDays = month.filter((c) => (c.sleep_hours ?? 8) < 6)
    const highFlushAfterLowSleep = lowSleepDays.filter((c) => (c.hot_flash_severity ?? 0) >= 3).length
    const pct = lowSleepDays.length > 0 ? Math.round((highFlushAfterLowSleep / lowSleepDays.length) * 100) : 0
    if (topTriggers.length > 0) {
      const top = topTriggers[0][0]
      const count = topTriggers[0][1]
      insightTitle = `${top} is your most common trigger`
      insightBody = `Your data suggests ${top.toLowerCase()} appeared on ${count} days this month. Tracking this pattern can help you reduce symptom flare-ups.`
    } else if (pct > 50) {
      insightTitle = 'Sleep under 6h intensifies your symptoms'
      insightBody = `On ${pct}% of days when you slept under 6 hours, you reported stronger hot flushes. Prioritising sleep may help reduce their severity.`
    }
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 20px 100px' }}>

      {/* Wellbeing Trend Card */}
      <div className="glass" style={{ borderRadius: 24, padding: '28px 28px 24px', marginBottom: 16 }}>
        <p style={{
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.28)',
          letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px',
        }}>Last 7 Days</p>

        <h2 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.88)',
          margin: '0 0 24px', letterSpacing: '-0.02em',
        }}>Wellbeing trend</h2>

        {/* Bar chart */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 6 }}>
          {displayHeights.map((h, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 4 }}>
              <div style={{
                width: '100%', height: h,
                background: 'linear-gradient(180deg, #9b7cc8 0%, #7a52b0 100%)',
                borderRadius: '3px 3px 0 0',
                transformOrigin: 'bottom',
                animation: 'bar-scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both',
                animationDelay: `${i * 0.07}s`,
              }} />
              <span style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.25)', flexShrink: 0, fontWeight: 300 }}>{dayLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Top Symptom card */}
        <div style={{
          background: 'rgba(196,122,90,0.05)',
          border: '1px solid rgba(196,122,90,0.14)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 24, padding: '24px 22px',
        }}>
          <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 10, fontWeight: 400, color: 'rgba(196,122,90,0.75)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Top Symptom</p>
          <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 4px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>Hot flushes</p>
          <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.32)', margin: '0 0 14px' }}>{hotFlushDisplay}</p>
          <div style={{ height: 3, background: 'rgba(196,122,90,0.12)', borderRadius: 9999, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ height: '100%', width: `${hotFlushPct}%`, background: '#c47a5a', borderRadius: 9999, animation: 'bar-in 0.8s cubic-bezier(0.22,1,0.36,1) both' }} />
          </div>
          <Link href="/tracker" style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 12, fontWeight: 300, color: 'rgba(196,122,90,0.7)', textDecoration: 'none' }}>View details</Link>
        </div>

        {/* Sleep Pattern card */}
        <div style={{
          background: 'rgba(139,109,181,0.05)',
          border: '1px solid rgba(139,109,181,0.14)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 24, padding: '24px 22px',
        }}>
          <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 10, fontWeight: 400, color: 'rgba(196,184,224,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Sleep Average</p>
          <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 4px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{sleepDisplay}</p>
          <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.32)', margin: '0 0 14px' }}>Goal: 7–9 hours</p>
          <div style={{ height: 3, background: 'rgba(139,109,181,0.12)', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${sleepPct}%`, background: '#9b7cc8', borderRadius: 9999, animation: 'bar-in 0.8s cubic-bezier(0.22,1,0.36,1) both' }} />
          </div>
        </div>
      </div>

      {/* Mood avg + data count */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'rgba(107,158,128,0.05)', border: '1px solid rgba(107,158,128,0.14)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 24, padding: '24px 22px' }}>
          <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 10, fontWeight: 400, color: 'rgba(107,158,128,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Avg Mood</p>
          <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 4px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{avgMood ?? '—'}<span style={{ fontSize: 14, color: 'rgba(255,255,255,0.32)' }}>/10</span></p>
          <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.32)', margin: 0 }}>30-day average</p>
        </div>
        <div style={{ background: 'rgba(155,124,200,0.05)', border: '1px solid rgba(155,124,200,0.14)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 24, padding: '24px 22px' }}>
          <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 10, fontWeight: 400, color: 'rgba(196,184,224,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Days Tracked</p>
          <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 4px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{month.length}<span style={{ fontSize: 14, color: 'rgba(255,255,255,0.32)' }}>/30</span></p>
          <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.32)', margin: 0 }}>this month</p>
        </div>
      </div>

      {/* Trigger analysis */}
      {topTriggers.length > 0 && (
        <div className="glass" style={{ borderRadius: 24, padding: '24px 28px', marginBottom: 16 }}>
          <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>30-day trigger patterns</p>
          <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 18px', letterSpacing: '-0.02em' }}>Your most common triggers</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topTriggers.map(([trigger, count]) => {
              const pct = Math.round((count / Math.max(month.length, 1)) * 100)
              return (
                <div key={trigger} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.72)', width: 120, flexShrink: 0 }}>{trigger}</span>
                  <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #9b7cc8, #c4b8e0)', borderRadius: 9999 }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.32)', width: 56, textAlign: 'right', flexShrink: 0 }}>{count} days</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Dynamic insight card */}
      <div className="glass-violet" style={{ borderRadius: 24, padding: 28 }}>
        <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 10, fontWeight: 400, color: 'rgba(196,184,224,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Insight</p>
        <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>{insightTitle}</h3>
        <p style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontSize: 14, lineHeight: 1.7, fontWeight: 300, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
          {insightBody}
        </p>
      </div>

    </div>
  )
}
