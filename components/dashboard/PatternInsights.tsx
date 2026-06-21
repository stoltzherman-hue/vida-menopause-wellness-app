'use client'

interface CheckinData {
  checkin_date: string
  overall_wellbeing: number | null
  energy_level: number | null
  sleep_hours: number | null
  hot_flash_severity: number | null
  hot_flash_count: number | null
  triggers: string[] | null
}

interface PatternInsightsProps {
  checkins: CheckinData[]
}

interface Insight {
  icon: string
  prefix: string
  bold: string
  bg: string
  border: string
  color: string
}

function avg(vals: number[]): number | null {
  if (!vals.length) return null
  return vals.reduce((s, v) => s + v, 0) / vals.length
}

function deriveInsights(checkins: CheckinData[]): Insight[] {
  const insights: Insight[] = []

  // 1. Sleep-hotflash correlation
  const withSleepAndFlash = checkins.filter(
    (c) => c.sleep_hours != null && c.hot_flash_severity != null
  )
  if (withSleepAndFlash.length >= 4) {
    const poorSleep = withSleepAndFlash
      .filter((c) => (c.sleep_hours ?? 0) < 6)
      .map((c) => c.hot_flash_severity as number)
    const goodSleep = withSleepAndFlash
      .filter((c) => (c.sleep_hours ?? 0) >= 6)
      .map((c) => c.hot_flash_severity as number)
    const avgPoor = avg(poorSleep)
    const avgGood = avg(goodSleep)
    if (avgPoor != null && avgGood != null && avgPoor - avgGood > 1) {
      insights.push({
        icon: '🌙',
        prefix: 'Your data suggests',
        bold: 'hot flashes are more intense on nights with less than 6 hours sleep',
        bg: 'rgba(155,138,184,0.08)',
        border: 'rgba(155,138,184,0.22)',
        color: '#7c5c8a',
      })
    }
  }

  // 2. Stress-energy correlation
  const withStressTrigger = checkins.filter(
    (c) => c.triggers?.includes('stress') && c.energy_level != null
  )
  const withoutStress = checkins.filter(
    (c) => !c.triggers?.includes('stress') && c.energy_level != null
  )
  if (withStressTrigger.length >= 3 && withoutStress.length >= 3) {
    const stressEnergy = avg(withStressTrigger.map((c) => c.energy_level as number))
    const noStressEnergy = avg(withoutStress.map((c) => c.energy_level as number))
    if (stressEnergy != null && noStressEnergy != null && noStressEnergy - stressEnergy > 1) {
      insights.push({
        icon: '⚡',
        prefix: 'Your data suggests',
        bold: 'stress appears on your lower-energy days',
        bg: 'rgba(224,122,95,0.07)',
        border: 'rgba(224,122,95,0.20)',
        color: '#c47a5a',
      })
    }
  }

  // 3. Wellbeing trend last 7 vs prior 7
  const sorted = [...checkins].sort((a, b) =>
    a.checkin_date.localeCompare(b.checkin_date)
  )
  const last7 = sorted.slice(-7).filter((c) => c.overall_wellbeing != null)
  const prior7 = sorted.slice(-14, -7).filter((c) => c.overall_wellbeing != null)
  if (last7.length >= 3 && prior7.length >= 3) {
    const recentAvg = avg(last7.map((c) => c.overall_wellbeing as number))
    const priorAvg = avg(prior7.map((c) => c.overall_wellbeing as number))
    if (recentAvg != null && priorAvg != null) {
      if (recentAvg - priorAvg > 0.5) {
        insights.push({
          icon: '📈',
          prefix: 'Your data suggests',
          bold: 'your wellbeing has been trending upward this week',
          bg: 'rgba(45,139,122,0.07)',
          border: 'rgba(45,139,122,0.20)',
          color: '#2d8b7a',
        })
      } else if (priorAvg - recentAvg > 0.5) {
        insights.push({
          icon: '💜',
          prefix: 'Your data suggests',
          bold: 'your wellbeing dipped this week — your body may need extra care',
          bg: 'rgba(196,149,158,0.08)',
          border: 'rgba(196,149,158,0.22)',
          color: '#c4959e',
        })
      }
    }
  }

  // 4. Consistent tracker
  const last10Dates = sorted.slice(-10).map((c) => c.checkin_date)
  if (last10Dates.length >= 7) {
    insights.push({
      icon: '🌱',
      prefix: 'You\'ve been consistent',
      bold: 'patterns become clearer with daily data',
      bg: 'rgba(201,169,110,0.07)',
      border: 'rgba(201,169,110,0.20)',
      color: '#c9a96e',
    })
  }

  return insights.slice(0, 3)
}

export function PatternInsights({ checkins }: PatternInsightsProps) {
  const sectionStyle: React.CSSProperties = {
    marginTop: 8,
  }

  const dividerStyle: React.CSSProperties = {
    width: '100%',
    height: 1,
    background: 'rgba(200,185,180,0.25)',
    marginBottom: 16,
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: '#b8a9a0',
    letterSpacing: '0.07em',
    textTransform: 'uppercase' as const,
    margin: '0 0 14px',
  }

  if (checkins.length < 5) {
    return (
      <div style={sectionStyle}>
        <p style={titleStyle}>Your patterns</p>
        <div style={dividerStyle} />
        <div style={{
          background: 'rgba(255,255,255,0.28)',
          border: '1.5px solid rgba(200,185,180,0.30)',
          borderRadius: 16,
          padding: '20px 18px',
          textAlign: 'center',
          color: '#b8a9a0',
          fontSize: 14,
          lineHeight: 1.6,
        }}>
          Not enough data yet — keep checking in daily for personalised insights
        </div>
      </div>
    )
  }

  const insights = deriveInsights(checkins)

  if (insights.length === 0) {
    return (
      <div style={sectionStyle}>
        <p style={titleStyle}>Your patterns</p>
        <div style={dividerStyle} />
        <div style={{
          background: 'rgba(255,255,255,0.28)',
          border: '1.5px solid rgba(200,185,180,0.30)',
          borderRadius: 16,
          padding: '20px 18px',
          textAlign: 'center',
          color: '#b8a9a0',
          fontSize: 14,
          lineHeight: 1.6,
        }}>
          Keep checking in daily — your personalised patterns will appear here soon
        </div>
      </div>
    )
  }

  return (
    <div style={sectionStyle}>
      <p style={titleStyle}>Your patterns</p>
      <div style={dividerStyle} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {insights.map((insight, i) => (
          <div
            key={i}
            style={{
              background: insight.bg,
              border: `1.5px solid ${insight.border}`,
              borderRadius: 18,
              padding: '16px 18px',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.2, marginTop: 1 }}>
              {insight.icon}
            </span>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#3d2c35' }}>
              <em style={{ color: '#b8a9a0', fontStyle: 'italic', fontWeight: 400 }}>
                {insight.prefix} —{' '}
              </em>
              <strong style={{ color: insight.color, fontWeight: 700 }}>
                {insight.bold}
              </strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
