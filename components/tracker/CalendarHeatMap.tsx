'use client'
import { useState } from 'react'

interface CheckinPoint {
  checkin_date: string
  mood: number | null
}

interface Props { checkins: CheckinPoint[] }

function moodCell(mood: number | null): string {
  if (mood === null) return 'cal-cell-empty'
  if (mood >= 8)  return 'cal-cell-great'
  if (mood >= 6)  return 'cal-cell-good'
  if (mood >= 4)  return 'cal-cell-ok'
  if (mood >= 2)  return 'cal-cell-low'
  return 'cal-cell-rough'
}

function moodLabel(mood: number | null): string {
  if (mood === null) return 'Not logged'
  if (mood >= 8)  return `Mood ${mood}/10 · Great day`
  if (mood >= 6)  return `Mood ${mood}/10 · Good day`
  if (mood >= 4)  return `Mood ${mood}/10 · OK day`
  if (mood >= 2)  return `Mood ${mood}/10 · Tough day`
  return `Mood ${mood}/10 · Rough day`
}

export function CalendarHeatMap({ checkins }: Props) {
  const [tooltip, setTooltip] = useState<{ date: string; mood: number | null } | null>(null)

  // Build 35-day grid ending today
  const map = new Map(checkins.map((c) => [c.checkin_date, c.mood]))
  const today = new Date()
  const days: { date: string; iso: string; mood: number | null; future: boolean }[] = []

  for (let i = 34; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().split('T')[0]
    const dayNum = d.getDate()
    days.push({
      date: `${d.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })}`,
      iso,
      mood: map.has(iso) ? (map.get(iso) ?? null) : null,
      future: false,
    })
  }

  const legend = [
    { cls: 'cal-cell-great', label: 'Great' },
    { cls: 'cal-cell-good',  label: 'Good' },
    { cls: 'cal-cell-ok',    label: 'OK' },
    { cls: 'cal-cell-low',   label: 'Tough' },
    { cls: 'cal-cell-rough', label: 'Rough' },
    { cls: 'cal-cell-empty', label: 'Not logged' },
  ]

  return (
    <div>
      {/* Day-of-week headers */}
      <div className="cal-grid" style={{ marginBottom: 4 }}>
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 9, fontWeight: 700,
            color: '#c4b5ae', letterSpacing: '0.04em',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            paddingBottom: 4,
          }}>{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="cal-grid" style={{ position: 'relative' }}>
        {days.map(({ date, iso, mood }) => (
          <div
            key={iso}
            className={`cal-cell ${moodCell(mood)}`}
            onMouseEnter={() => setTooltip({ date, mood })}
            onMouseLeave={() => setTooltip(null)}
            title={`${date}: ${moodLabel(mood)}`}
          />
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          marginTop: 12, padding: '10px 14px',
          background: 'rgba(26,18,32,0.82)', backdropFilter: 'blur(12px)',
          borderRadius: 12, fontSize: 13, color: 'white', fontWeight: 500,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          textAlign: 'center',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', marginRight: 8 }}>{tooltip.date}</span>
          {moodLabel(tooltip.mood)}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: tooltip ? 8 : 20, alignItems: 'center', justifyContent: 'center' }}>
        {legend.map(({ cls, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div className={`cal-cell ${cls}`} style={{ width: 12, height: 12, borderRadius: 3, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: '#b8a9a0', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
