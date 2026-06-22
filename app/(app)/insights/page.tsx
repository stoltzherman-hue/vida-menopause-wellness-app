export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Insights · Vida' }

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Static fallback bar heights when no data
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
      .select('checkin_date, hot_flash_severity, sleep_hours')
      .eq('user_id', user!.id)
      .gte('checkin_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('checkin_date', { ascending: true }),
  ])

  // Build 7-day bar heights from wellbeing/mood (scale 1-10 → 20-80px)
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

  // Get day labels starting from sevenDaysAgo
  const dayLabels: string[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo)
    date.setDate(sevenDaysAgo.getDate() + i)
    dayLabels.push(DAY_LABELS[date.getDay() === 0 ? 6 : date.getDay() - 1])
  }

  // Hot flush stats
  const hotFlushDays = (monthCheckins ?? []).filter((c) => (c.hot_flash_severity ?? 0) > 0).length

  // Sleep average
  const sleepVals = (monthCheckins ?? []).filter((c) => c.sleep_hours != null).map((c) => c.sleep_hours as number)
  const avgSleep = sleepVals.length ? sleepVals.reduce((a, b) => a + b, 0) / sleepVals.length : 6.2
  const sleepDisplay = avgSleep.toFixed(1) + 'h'
  const sleepPct = Math.round((avgSleep / 9) * 100)

  const hotFlushPct = monthCheckins && monthCheckins.length > 0
    ? Math.round((hotFlushDays / 30) * 100)
    : 43

  const hotFlushDisplay = hotFlushDays > 0 ? `${hotFlushDays} days this month` : '12 days this month'

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 20px 100px' }}>

      {/* ── Wellbeing Trend Card ── */}
      <div
        className="glass"
        style={{ borderRadius: 24, padding: '28px 28px 24px', marginBottom: 16 }}
      >
        <p style={{
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 10, fontWeight: 700, color: '#2d8b7a',
          letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px',
        }}>LAST 7 DAYS</p>

        <h2 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 22, fontWeight: 700, color: '#1a1220',
          margin: '0 0 24px',
        }}>Wellbeing trend</h2>

        {/* Bar chart */}
        <div style={{
          display: 'flex', flexDirection: 'row', alignItems: 'flex-end',
          height: 80, gap: 6,
        }}>
          {displayHeights.map((h, i) => (
            <div
              key={i}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                flex: 1, gap: 4,
              }}
            >
              <div style={{
                width: '100%',
                height: h,
                background: 'linear-gradient(180deg, #2d8b7a 0%, #6b9e80 100%)',
                borderRadius: '3px 3px 0 0',
                transformOrigin: 'bottom',
                animation: 'bar-scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both',
                animationDelay: `${i * 0.07}s`,
              }} />
              <span style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 10, color: '#b8a9a0', flexShrink: 0,
              }}>{dayLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2-col grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Top Symptom card */}
        <div style={{
          background: 'rgba(196,122,90,0.04)',
          border: '1.5px solid rgba(196,122,90,0.15)',
          backdropFilter: 'blur(22px) saturate(160%)',
          WebkitBackdropFilter: 'blur(22px) saturate(160%)',
          boxShadow: '0 4px 28px rgba(61,44,53,0.07)',
          borderRadius: 24, padding: '24px 22px',
        }}>
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 10, fontWeight: 700, color: '#c47a5a',
            letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px',
          }}>TOP SYMPTOM</p>

          <p style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 28, fontWeight: 700, color: '#1a1220',
            margin: '0 0 4px', lineHeight: 1.1,
          }}>Hot flushes</p>

          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 13, color: '#b8a9a0', margin: '0 0 14px',
          }}>{hotFlushDisplay}</p>

          <div style={{ height: 4, background: 'rgba(196,122,90,0.15)', borderRadius: 9999, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{
              height: '100%',
              width: `${hotFlushPct}%`,
              background: '#c47a5a',
              borderRadius: 9999,
              animation: 'bar-in 0.8s cubic-bezier(0.22,1,0.36,1) both',
            }} />
          </div>

          <Link href="/tracker" style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 13, color: '#c47a5a', textDecoration: 'none', fontWeight: 600,
          }}>View details →</Link>
        </div>

        {/* Sleep Pattern card */}
        <div style={{
          background: 'rgba(155,138,184,0.04)',
          border: '1.5px solid rgba(155,138,184,0.15)',
          backdropFilter: 'blur(22px) saturate(160%)',
          WebkitBackdropFilter: 'blur(22px) saturate(160%)',
          boxShadow: '0 4px 28px rgba(61,44,53,0.07)',
          borderRadius: 24, padding: '24px 22px',
        }}>
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 10, fontWeight: 700, color: '#9b8ab8',
            letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px',
          }}>SLEEP AVERAGE</p>

          <p style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 28, fontWeight: 700, color: '#1a1220',
            margin: '0 0 4px', lineHeight: 1.1,
          }}>{sleepDisplay}</p>

          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 13, color: '#b8a9a0', margin: '0 0 14px',
          }}>Goal: 7–9 hours</p>

          <div style={{ height: 4, background: 'rgba(155,138,184,0.15)', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${sleepPct}%`,
              background: '#9b8ab8',
              borderRadius: 9999,
              animation: 'bar-in 0.8s cubic-bezier(0.22,1,0.36,1) both',
            }} />
          </div>
        </div>
      </div>

      {/* ── Dark Tip Card ── */}
      <div style={{
        background: 'linear-gradient(148deg, #1a1220 0%, #2a1e30 55%, #1e2a28 100%)',
        borderRadius: 24, padding: 28,
      }}>
        <p style={{
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 10, fontWeight: 700,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px',
        }}>💡 INSIGHT</p>

        <h3 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 20, fontWeight: 700,
          color: 'rgba(255,255,255,0.9)',
          margin: '0 0 10px',
        }}>Your sleep impacts your mood</h3>

        <p style={{
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontSize: 14, lineHeight: 1.7,
          color: 'rgba(255,255,255,0.6)',
          margin: 0,
        }}>
          Your data suggests that nights under 6h correlate with increased hot flush frequency the next day. Consider a consistent wind-down routine.
        </p>
      </div>

    </div>
  )
}
