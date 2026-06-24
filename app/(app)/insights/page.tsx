export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getUser } from '@/lib/auth/session'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import Link from 'next/link'
import { TreatmentEfficacy } from '@/components/insights/TreatmentEfficacy'

export const metadata: Metadata = { title: 'Insights · Vida' }

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function avg(vals: number[]): number | null {
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
}

function pearson(xs: number[], ys: number[]): number | null {
  if (xs.length < 4 || xs.length !== ys.length) return null
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length
  const my = ys.reduce((a, b) => a + b, 0) / ys.length
  let num = 0, dx2 = 0, dy2 = 0
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - mx) * (ys[i] - my)
    dx2 += (xs[i] - mx) ** 2
    dy2 += (ys[i] - my) ** 2
  }
  const denom = Math.sqrt(dx2 * dy2)
  return denom === 0 ? null : num / denom
}

const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PF = 'var(--font-playfair), Georgia, serif'

export default async function InsightsPage() {
  const user = await getUser()
  const supabase = await createSupabaseServerClient()

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [{ data: recentCheckins }, { data: monthCheckins }, { data: profileData }, { data: allCheckins }] = await Promise.all([
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
    supabase
      .from('user_profiles')
      .select('lifestyle')
      .eq('user_id', user!.id)
      .maybeSingle(),
    supabase
      .from('daily_checkins')
      .select('checkin_date, mood, sleep_hours, hot_flash_severity')
      .eq('user_id', user!.id)
      .order('checkin_date', { ascending: true }),
  ])

  // Treatment efficacy data
  const lifestyle = typeof profileData?.lifestyle === 'object' && profileData.lifestyle !== null
    ? profileData.lifestyle as Record<string, unknown>
    : {}
  const treatmentStartDate = typeof lifestyle.treatment_start_date === 'string'
    ? lifestyle.treatment_start_date
    : null

  let beforeStats = null
  let afterStats = null
  let hasEfficacyData = false

  if (treatmentStartDate && allCheckins) {
    const beforeCheckins = allCheckins.filter((c) => c.checkin_date < treatmentStartDate)
    const afterCheckins = allCheckins.filter((c) => c.checkin_date >= treatmentStartDate)
    hasEfficacyData = beforeCheckins.length >= 5 && afterCheckins.length >= 5

    const calcStats = (rows: typeof allCheckins) => {
      const moodVals = rows.filter((c) => c.mood != null).map((c) => c.mood as number)
      const sleepVals = rows.filter((c) => c.sleep_hours != null).map((c) => c.sleep_hours as number)
      return {
        avgMood: moodVals.length ? moodVals.reduce((a, b) => a + b, 0) / moodVals.length : null,
        avgSleep: sleepVals.length ? sleepVals.reduce((a, b) => a + b, 0) / sleepVals.length : null,
        hotFlushDays: rows.filter((c) => (c.hot_flash_severity ?? 0) > 0).length,
        totalDays: rows.length,
      }
    }

    if (beforeCheckins.length > 0) beforeStats = calcStats(beforeCheckins)
    if (afterCheckins.length > 0) afterStats = calcStats(afterCheckins)
  }

  const month = monthCheckins ?? []
  const hasData = month.length >= 3

  // 7-day bar chart
  const barHeights: number[] = []
  const dayLabels: string[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo)
    date.setDate(sevenDaysAgo.getDate() + i)
    const isoDate = date.toISOString().split('T')[0]
    const checkin = (recentCheckins ?? []).find((c) => c.checkin_date === isoDate)
    barHeights.push(checkin ? Math.round(20 + ((checkin.overall_wellbeing ?? checkin.mood ?? 5) / 10) * 60) : 0)
    dayLabels.push(DAY_LABELS[date.getDay() === 0 ? 6 : date.getDay() - 1])
  }
  const hasBarData = barHeights.some((h) => h > 0)

  // Stats
  const hotFlushDays = month.filter((c) => (c.hot_flash_severity ?? 0) > 0).length
  const sleepVals = month.filter((c) => c.sleep_hours != null).map((c) => c.sleep_hours as number)
  const moodVals = month.filter((c) => c.mood != null).map((c) => c.mood as number)
  const avgSleep = avg(sleepVals)
  const avgMood = avg(moodVals)
  const sleepDisplay = avgSleep != null ? avgSleep.toFixed(1) + 'h' : '—'
  const sleepPct = avgSleep != null ? Math.min(Math.round((avgSleep / 9) * 100), 100) : 0
  const hotFlushPct = month.length > 0 ? Math.round((hotFlushDays / 30) * 100) : 0

  // Real correlation: sleep hours vs mood (next-day if possible, same-day as fallback)
  const sleepMoodPairs = month.filter((c) => c.sleep_hours != null && c.mood != null)
  const sleepMoodR = pearson(
    sleepMoodPairs.map((c) => c.sleep_hours as number),
    sleepMoodPairs.map((c) => c.mood as number),
  )

  // Trend: compare first half vs second half of month
  const half = Math.floor(month.length / 2)
  const firstHalfMood = avg(month.slice(0, half).filter((c) => c.mood != null).map((c) => c.mood as number))
  const secondHalfMood = avg(month.slice(half).filter((c) => c.mood != null).map((c) => c.mood as number))
  const moodTrend = firstHalfMood != null && secondHalfMood != null ? secondHalfMood - firstHalfMood : null
  const trendLabel = moodTrend == null ? null : moodTrend > 0.5 ? 'improving' : moodTrend < -0.5 ? 'declining' : 'stable'

  // Best day of week
  const dayMoods: Record<number, number[]> = {}
  month.forEach((c) => {
    if (c.mood == null) return
    const dow = new Date(c.checkin_date).getDay()
    if (!dayMoods[dow]) dayMoods[dow] = []
    dayMoods[dow].push(c.mood)
  })
  const dayAvgs = Object.entries(dayMoods)
    .map(([d, vals]) => ({ day: parseInt(d), avg: vals.reduce((a, b) => a + b, 0) / vals.length }))
    .filter((d) => dayMoods[d.day].length >= 2)
    .sort((a, b) => b.avg - a.avg)
  const bestDay = dayAvgs[0]
  const worstDay = dayAvgs[dayAvgs.length - 1]
  const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // Trigger analysis — both trigger: and symptom: prefixed entries
  const triggerCounts: Record<string, number> = {}
  month.forEach((c) => {
    ;(c.triggers ?? []).forEach((t: string) => {
      if (t.startsWith('trigger:')) {
        const key = t.slice(8)
        triggerCounts[key] = (triggerCounts[key] ?? 0) + 1
      }
      if (t.startsWith('symptom:')) {
        const key = t.slice(8)
        triggerCounts[key] = (triggerCounts[key] ?? 0) + 1
      }
    })
  })
  const topTriggers = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // Low sleep vs hot flash
  const lowSleepDays = month.filter((c) => (c.sleep_hours ?? 8) < 6)
  const lowSleepHighFlush = lowSleepDays.filter((c) => (c.hot_flash_severity ?? 0) >= 3).length
  const lowSleepFlushPct = lowSleepDays.length >= 3 ? Math.round((lowSleepHighFlush / lowSleepDays.length) * 100) : null

  // Build the primary insight
  let insightTitle = ''
  let insightBody = ''

  if (!hasData) {
    insightTitle = 'Track a few more days to unlock insights'
    insightBody = 'After 3+ check-ins, Vida will analyse your sleep, mood, and symptom patterns to surface meaningful connections — specific to you.'
  } else if (sleepMoodR != null && sleepMoodR > 0.4) {
    const strength = sleepMoodR > 0.65 ? 'strongly' : 'noticeably'
    insightTitle = `Sleep is ${strength} linked to your mood`
    insightBody = `Your data suggests that on days following better sleep, your mood is ${strength} higher. The correlation in your data is ${(sleepMoodR * 100).toFixed(0)}%. Prioritising sleep may be one of the most effective levers for how you feel.`
  } else if (lowSleepFlushPct != null && lowSleepFlushPct > 50) {
    insightTitle = 'Sleep under 6h intensifies your hot flushes'
    insightBody = `On ${lowSleepFlushPct}% of days when you slept under 6 hours, you reported stronger hot flushes. Your data suggests that improving sleep could reduce their severity.`
  } else if (trendLabel === 'improving' && moodTrend != null) {
    insightTitle = 'Your mood is trending upward'
    insightBody = `Your average mood in the second half of this month is ${Math.abs(moodTrend).toFixed(1)} points higher than the first half. Whatever you're doing — keep going.`
  } else if (trendLabel === 'declining' && moodTrend != null) {
    insightTitle = 'Your mood has dipped this month'
    insightBody = `Your average mood has dropped ${Math.abs(moodTrend).toFixed(1)} points compared to earlier this month. It may be worth discussing patterns with your care team.`
  } else if (topTriggers.length > 0) {
    const [top, count] = topTriggers[0]
    insightTitle = `${top} is your most frequent pattern`
    insightBody = `Your data suggests ${top.toLowerCase()} appeared on ${count} days this month. Tracking this consistently helps you identify what to bring to your next appointment.`
  } else if (bestDay && worstDay && bestDay.day !== worstDay.day) {
    insightTitle = `${DOW[bestDay.day]}s tend to be your best days`
    insightBody = `Your average mood on ${DOW[bestDay.day]}s (${bestDay.avg.toFixed(1)}/10) is noticeably higher than ${DOW[worstDay.day]}s (${worstDay.avg.toFixed(1)}/10). Keep tracking to understand what drives this pattern.`
  } else {
    insightTitle = 'Your data is building a picture'
    insightBody = 'Keep checking in daily — patterns around sleep, mood, and symptoms become clearer with more data and will surface as specific, personalised insights.'
  }

  // Empty state
  if (!hasData) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(139,109,181,0.1)',
          border: '1px solid rgba(155,124,200,0.2)',
          margin: '0 auto 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: PF, fontSize: 24, fontWeight: 300, color: '#9b7cc8' }}>v</span>
        </div>
        <h2 style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
          Your insights are on their way
        </h2>
        <p style={{ fontFamily: DM, fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.42)', margin: '0 0 32px', lineHeight: 1.7 }}>
          After a few daily check-ins, Vida will surface real patterns — sleep vs mood, trigger correlations, trend direction. All specific to you.
        </p>
        <Link href="/check-in" style={{
          display: 'inline-block',
          background: 'rgba(139,109,181,0.15)',
          border: '1px solid rgba(155,124,200,0.3)',
          borderRadius: 14, padding: '13px 28px',
          fontFamily: DM, fontSize: 14, fontWeight: 300,
          color: '#c4b8e0', textDecoration: 'none',
        }}>
          Do today&apos;s check-in
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 20px 100px' }}>

      {/* Wellbeing Trend */}
      <div className="glass" style={{ borderRadius: 24, padding: '28px 28px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <p style={{ fontFamily: DM, fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Last 7 days</p>
            <h2 style={{ fontFamily: PF, fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: 0, letterSpacing: '-0.02em' }}>Wellbeing trend</h2>
          </div>
          {trendLabel && (
            <div style={{
              background: trendLabel === 'improving' ? 'rgba(107,158,128,0.12)' : trendLabel === 'declining' ? 'rgba(196,122,90,0.12)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${trendLabel === 'improving' ? 'rgba(107,158,128,0.3)' : trendLabel === 'declining' ? 'rgba(196,122,90,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 9999, padding: '5px 14px',
            }}>
              <span style={{
                fontFamily: DM, fontSize: 11, fontWeight: 300,
                color: trendLabel === 'improving' ? 'rgba(107,158,128,0.9)' : trendLabel === 'declining' ? 'rgba(196,122,90,0.9)' : 'rgba(255,255,255,0.38)',
              }}>
                {trendLabel === 'improving' ? '↑ Improving' : trendLabel === 'declining' ? '↓ Declining' : '→ Stable'}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 6 }}>
          {(hasBarData ? barHeights : [48, 62, 38, 70, 55, 44, 66]).map((h, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 4 }}>
              <div style={{
                width: '100%', height: h,
                background: h === 0
                  ? 'rgba(255,255,255,0.06)'
                  : 'linear-gradient(180deg, #9b7cc8 0%, #7a52b0 100%)',
                borderRadius: '3px 3px 0 0',
                animation: 'bar-scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both',
                animationDelay: `${i * 0.07}s`,
              }} />
              <span style={{ fontFamily: DM, fontSize: 10, color: 'rgba(255,255,255,0.25)', flexShrink: 0, fontWeight: 300 }}>{dayLabels[i]}</span>
            </div>
          ))}
        </div>
        {!hasBarData && (
          <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.22)', textAlign: 'center', marginTop: 10 }}>
            Check in daily to populate this chart
          </p>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'rgba(196,122,90,0.05)', border: '1px solid rgba(196,122,90,0.14)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 24, padding: '24px 22px' }}>
          <p style={{ fontFamily: DM, fontSize: 10, fontWeight: 400, color: 'rgba(196,122,90,0.75)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Hot flushes</p>
          <p style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 4px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {hotFlushDays > 0 ? `${hotFlushDays} days` : 'None logged'}
          </p>
          <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.32)', margin: '0 0 14px' }}>
            {hotFlushDays > 0 ? `${hotFlushPct}% of this month` : 'this month'}
          </p>
          <div style={{ height: 3, background: 'rgba(196,122,90,0.12)', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${hotFlushPct}%`, background: '#c47a5a', borderRadius: 9999 }} />
          </div>
        </div>

        <div style={{ background: 'rgba(139,109,181,0.05)', border: '1px solid rgba(139,109,181,0.14)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 24, padding: '24px 22px' }}>
          <p style={{ fontFamily: DM, fontSize: 10, fontWeight: 400, color: 'rgba(196,184,224,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Sleep average</p>
          <p style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 4px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {sleepDisplay}
          </p>
          <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.32)', margin: '0 0 14px' }}>
            {avgSleep != null && avgSleep >= 7 ? 'Within healthy range' : avgSleep != null ? 'Below recommended 7h' : 'Goal: 7–9 hours'}
          </p>
          <div style={{ height: 3, background: 'rgba(139,109,181,0.12)', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${sleepPct}%`, background: '#9b7cc8', borderRadius: 9999 }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'rgba(107,158,128,0.05)', border: '1px solid rgba(107,158,128,0.14)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 24, padding: '24px 22px' }}>
          <p style={{ fontFamily: DM, fontSize: 10, fontWeight: 400, color: 'rgba(107,158,128,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Avg mood</p>
          <p style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 4px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {avgMood != null ? avgMood.toFixed(1) : '—'}<span style={{ fontSize: 14, color: 'rgba(255,255,255,0.32)' }}>/10</span>
          </p>
          <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.32)', margin: 0 }}>30-day average</p>
        </div>
        <div style={{ background: 'rgba(155,124,200,0.05)', border: '1px solid rgba(155,124,200,0.14)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 24, padding: '24px 22px' }}>
          <p style={{ fontFamily: DM, fontSize: 10, fontWeight: 400, color: 'rgba(196,184,224,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>Days tracked</p>
          <p style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 4px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {month.length}<span style={{ fontSize: 14, color: 'rgba(255,255,255,0.32)' }}>/30</span>
          </p>
          <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.32)', margin: 0 }}>this month</p>
        </div>
      </div>

      {/* Sleep-mood correlation callout */}
      {sleepMoodR != null && Math.abs(sleepMoodR) > 0.3 && (
        <div style={{
          background: 'rgba(139,109,181,0.06)',
          border: '1px solid rgba(155,124,200,0.18)',
          borderRadius: 18, padding: '16px 20px',
          marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(139,109,181,0.15)', border: '1px solid rgba(155,124,200,0.25)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: DM, fontSize: 14, color: '#c4b8e0' }}>r</span>
          </div>
          <p style={{ fontFamily: DM, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.6 }}>
            <span style={{ color: 'rgba(196,184,224,0.88)' }}>Sleep ↔ Mood correlation: {(sleepMoodR * 100).toFixed(0)}%</span>
            {' '}— {sleepMoodR > 0 ? 'better sleep predicts better mood' : 'unexpected inverse pattern'} in your data
          </p>
        </div>
      )}

      {/* Day of week pattern */}
      {bestDay && worstDay && bestDay.day !== worstDay.day && (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18, padding: '16px 20px',
          marginBottom: 16,
          display: 'flex', gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ fontFamily: DM, fontSize: 10, color: 'rgba(107,158,128,0.7)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 400 }}>Best day</p>
            <p style={{ fontFamily: PF, fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 2px' }}>{DOW[bestDay.day]}</p>
            <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.32)', margin: 0 }}>avg mood {bestDay.avg.toFixed(1)}/10</p>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.07)', alignSelf: 'stretch' }} />
          <div>
            <p style={{ fontFamily: DM, fontSize: 10, color: 'rgba(196,122,90,0.7)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 400 }}>Lowest day</p>
            <p style={{ fontFamily: PF, fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 2px' }}>{DOW[worstDay.day]}</p>
            <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.32)', margin: 0 }}>avg mood {worstDay.avg.toFixed(1)}/10</p>
          </div>
        </div>
      )}

      {/* Treatment efficacy */}
      <TreatmentEfficacy
        treatmentStartDate={treatmentStartDate}
        before={beforeStats}
        after={afterStats}
        hasEnoughData={hasEfficacyData}
      />

      {/* Trigger patterns */}
      {topTriggers.length > 0 && (
        <div className="glass" style={{ borderRadius: 24, padding: '24px 28px', marginBottom: 16 }}>
          <p style={{ fontFamily: DM, fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>30-day patterns</p>
          <h3 style={{ fontFamily: PF, fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 18px', letterSpacing: '-0.02em' }}>Most frequent symptoms & triggers</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topTriggers.map(([trigger, count]) => {
              const pct = Math.round((count / Math.max(month.length, 1)) * 100)
              return (
                <div key={trigger} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontFamily: DM, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.72)', width: 130, flexShrink: 0 }}>{trigger}</span>
                  <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #9b7cc8, #c4b8e0)', borderRadius: 9999 }} />
                  </div>
                  <span style={{ fontFamily: DM, fontSize: 12, color: 'rgba(255,255,255,0.32)', width: 60, textAlign: 'right', flexShrink: 0 }}>{pct}% of days</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Primary insight card */}
      <div className="glass-violet" style={{ borderRadius: 24, padding: 28 }}>
        <p style={{ fontFamily: DM, fontSize: 10, fontWeight: 400, color: 'rgba(196,184,224,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>
          {hasData ? 'Pattern detected' : 'Getting started'}
        </p>
        <h3 style={{ fontFamily: PF, fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>{insightTitle}</h3>
        <p style={{ fontFamily: DM, fontSize: 14, lineHeight: 1.7, fontWeight: 300, color: 'rgba(255,255,255,0.48)', margin: '0 0 18px' }}>
          {insightBody}
        </p>
        <Link href="/companion" style={{
          fontFamily: DM, fontSize: 12, fontWeight: 300,
          color: 'rgba(196,184,224,0.65)', textDecoration: 'none',
        }}>
          Discuss with AI companion →
        </Link>
      </div>

    </div>
  )
}
