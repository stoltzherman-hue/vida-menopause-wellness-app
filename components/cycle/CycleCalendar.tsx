'use client'

import { useState, useMemo } from 'react'

interface CheckIn {
  checkin_date: string
  period_status: string | null
}

interface Props {
  checkins: CheckIn[]
}

const PERIOD_STATUSES = new Set(['spotting', 'light', 'normal', 'heavy'])

const PERIOD_COLORS: Record<string, string> = {
  spotting: 'rgba(196,149,158,0.3)',
  light: 'rgba(196,149,158,0.55)',
  normal: 'rgba(196,149,158,0.8)',
  heavy: '#c4959e',
}

const PERIOD_TEXT_COLORS: Record<string, string> = {
  spotting: 'rgba(255,255,255,0.82)',
  light: 'rgba(255,255,255,0.82)',
  normal: '#ffffff',
  heavy: '#ffffff',
}

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getMotivationalMessage(streak: number): string {
  if (streak === 0) return 'Start your streak today'
  if (streak === 1) return 'Day 1 — great start!'
  if (streak >= 30) return '30 days — you\'re unstoppable!'
  if (streak >= 14) return 'Two weeks — incredible!'
  if (streak >= 7) return 'One week! You\'re building a habit'
  if (streak >= 3) return '3 days strong!'
  return `${streak} days — keep going!`
}

export function CycleCalendar({ checkins }: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth()) // 0-indexed

  // Build lookup maps
  const periodMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const c of checkins) {
      if (c.period_status && PERIOD_STATUSES.has(c.period_status)) {
        map[c.checkin_date] = c.period_status
      }
    }
    return map
  }, [checkins])

  // Calculate average cycle length from period data
  const { avgCycleLength, predictedDays, cycleDay, cycleLength } = useMemo(() => {
    const periodDates = Object.keys(periodMap).sort()
    if (periodDates.length < 2) {
      return { avgCycleLength: 28, predictedDays: new Set<string>(), cycleDay: null, cycleLength: 28 }
    }

    // Find period start dates (days where period starts after a gap)
    const startDates: Date[] = []
    for (let i = 0; i < periodDates.length; i++) {
      const prev = i > 0 ? new Date(periodDates[i - 1] + 'T00:00:00') : null
      const curr = new Date(periodDates[i] + 'T00:00:00')
      if (!prev || (curr.getTime() - prev.getTime()) > 2 * 24 * 60 * 60 * 1000) {
        startDates.push(curr)
      }
    }

    let avgCycle = 28
    if (startDates.length >= 2) {
      let total = 0
      for (let i = 1; i < startDates.length; i++) {
        total += (startDates[i].getTime() - startDates[i - 1].getTime()) / (24 * 60 * 60 * 1000)
      }
      avgCycle = Math.round(total / (startDates.length - 1))
      avgCycle = Math.max(21, Math.min(35, avgCycle))
    }

    // Predict next period start from last period start
    const lastStart = startDates[startDates.length - 1]
    const todayMs = new Date(today.toISOString().split('T')[0] + 'T00:00:00').getTime()
    const lastStartMs = lastStart.getTime()

    // Calculate current cycle day
    const daysSinceLastStart = Math.floor((todayMs - lastStartMs) / (24 * 60 * 60 * 1000))
    const currentCycleDay = (daysSinceLastStart % avgCycle) + 1

    // Next predicted start
    const cyclesElapsed = Math.floor(daysSinceLastStart / avgCycle)
    const nextStartMs = lastStartMs + (cyclesElapsed + 1) * avgCycle * 24 * 60 * 60 * 1000

    // Generate predicted days (5 days of predicted period)
    const predicted = new Set<string>()
    for (let d = 0; d < 5; d++) {
      const date = new Date(nextStartMs + d * 24 * 60 * 60 * 1000)
      predicted.add(date.toISOString().split('T')[0])
    }

    return {
      avgCycleLength: avgCycle,
      predictedDays: predicted,
      cycleDay: currentCycleDay,
      cycleLength: avgCycle,
    }
  }, [periodMap, today])

  // Build calendar grid
  const { days, firstDayOffset } = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    // getDay() returns 0=Sun, we want Mon=0
    let dow = firstDay.getDay() - 1
    if (dow < 0) dow = 6
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    return { days: daysInMonth, firstDayOffset: dow }
  }, [viewYear, viewMonth])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const todayStr = today.toISOString().split('T')[0]

  const totalCells = firstDayOffset + days
  const gridCells = Math.ceil(totalCells / 7) * 7

  return (
    <div>
      {/* Phase indicator */}
      {cycleDay && (
        <div style={{
          background: 'rgba(155,124,200,0.06)',
          border: '1px solid rgba(155,124,200,0.15)',
          borderRadius: 18,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(196,149,158,0.2)', border: '1px solid rgba(196,149,158,0.35)',
          }} />
          <div>
            <p style={{ fontWeight: 300, color: 'rgba(255,255,255,0.88)', fontSize: 16, margin: 0 }}>
              Estimated cycle day {cycleDay} of {cycleLength}
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '2px 0 0' }}>
              Average cycle length: {avgCycleLength} days · Your data suggests patterns
            </p>
          </div>
        </div>
      )}

      {/* Calendar card */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 24,
        padding: '20px',
        backdropFilter: 'blur(24px)',
      }}>
        {/* Month navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <button
            onClick={prevMonth}
            style={{
              width: 40, height: 40, borderRadius: 12, border: '1px solid rgba(255,255,255,0.09)',
              background: 'rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.55)',
            }}
            aria-label="Previous month"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <p style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: 0,
          }}>{monthName}</p>
          <button
            onClick={nextMonth}
            style={{
              width: 40, height: 40, borderRadius: 12, border: '1px solid rgba(255,255,255,0.09)',
              background: 'rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.55)',
            }}
            aria-label="Next month"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="cycle-grid" style={{ marginBottom: 6 }}>
          {DAY_HEADERS.map(h => (
            <div key={h} style={{
              textAlign: 'center', fontSize: 11, fontWeight: 300,
              color: 'rgba(255,255,255,0.32)', letterSpacing: '0.06em', padding: '4px 0',
            }}>{h}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="cycle-grid">
          {Array.from({ length: gridCells }).map((_, idx) => {
            const dayNum = idx - firstDayOffset + 1
            if (dayNum < 1 || dayNum > days) {
              return <div key={idx} className="cycle-day" style={{ background: 'transparent' }} />
            }
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
            const periodStatus = periodMap[dateStr]
            const isToday = dateStr === todayStr
            const isPredicted = predictedDays.has(dateStr) && !periodStatus

            let cellBg = 'rgba(255,255,255,0.03)'
            let cellColor = 'rgba(255,255,255,0.82)'
            let border = '1px solid transparent'
            let boxShadow = 'none'

            if (periodStatus) {
              cellBg = PERIOD_COLORS[periodStatus] ?? 'rgba(196,149,158,0.55)'
              cellColor = PERIOD_TEXT_COLORS[periodStatus] ?? 'rgba(255,255,255,0.88)'
            } else if (isPredicted) {
              cellBg = 'rgba(196,149,158,0.08)'
              border = '1px dashed rgba(196,149,158,0.35)'
            }

            if (isToday) {
              boxShadow = '0 0 0 2.5px #9b7cc8'
            }

            return (
              <div
                key={idx}
                className={[
                  'cycle-day',
                  periodStatus ? 'cycle-day-period' : '',
                  isToday ? 'cycle-day-today' : '',
                  isPredicted ? 'cycle-day-predicted' : '',
                ].filter(Boolean).join(' ')}
                style={{ background: cellBg, color: cellColor, border, boxShadow }}
              >
                <span style={{ fontSize: 13, fontWeight: isToday ? 300 : 300 }}>{dayNum}</span>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '10px 20px',
          marginTop: 20, paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: 'rgba(196,149,158,0.8)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>Period</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: 'rgba(196,149,158,0.08)', border: '1px dashed rgba(196,149,158,0.35)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>Predicted</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.03)', boxShadow: '0 0 0 2.5px #9b7cc8' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>Today</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 4, width: '100%', flexWrap: 'wrap', gap: '6px 14px' }}>
            {Object.entries(PERIOD_COLORS).map(([status, color]) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: color }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', textTransform: 'capitalize' }}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.32)', marginTop: 24, lineHeight: 1.6 }}>
        Predictions are estimates based on your logged data. Always discuss cycle changes with your healthcare provider.
      </p>
    </div>
  )
}
