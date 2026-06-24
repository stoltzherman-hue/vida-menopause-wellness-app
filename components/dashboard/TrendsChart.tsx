'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface CheckinPoint {
  checkin_date: string
  overall_wellbeing: number | null
  energy_level: number | null
  sleep_hours: number | null
  hot_flash_severity: number | null
}

interface TrendsChartProps {
  checkins: CheckinPoint[]
}

function shortDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short' })
}

export function TrendsChart({ checkins }: TrendsChartProps) {
  const data = checkins.map((c) => ({
    day: shortDay(c.checkin_date),
    date: c.checkin_date,
    wellbeing: c.overall_wellbeing ?? undefined,
    energy: c.energy_level ?? undefined,
    sleep: c.sleep_hours != null ? Math.min(c.sleep_hours, 10) : undefined,
  }))

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 22,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    boxShadow: '0 2px 20px rgba(0,0,0,0.18)',
    padding: '22px 20px 18px',
  }

  if (checkins.length < 3) {
    return (
      <div style={cardStyle}>
        <p style={{
          fontSize: 13,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.32)',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          margin: '0 0 14px',
        }}>
          14-day trends
        </p>
        <div style={{
          textAlign: 'center',
          padding: '32px 16px',
          color: 'rgba(255,255,255,0.32)',
          fontSize: 14,
          lineHeight: 1.6,
        }}>
          Keep checking in to see your trends
        </div>
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      {/* Title + legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <p style={{
          fontSize: 13,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.32)',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          14-day trends
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {[
            { color: '#9b7cc8', label: 'Wellbeing' },
            { color: '#c4b8e0', label: 'Energy' },
            { color: '#7a52b0', label: 'Sleep hrs' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 22, height: 2.5, borderRadius: 2, background: color }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 6, right: 4, left: -28, bottom: 0 }}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.32)', fontFamily: 'inherit' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.32)', fontFamily: 'inherit' }}
            axisLine={false}
            tickLine={false}
            ticks={[0, 5, 10]}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 12,
              fontSize: 12,
              color: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
            }}
            itemStyle={{ fontWeight: 300, color: 'rgba(255,255,255,0.82)' }}
            labelStyle={{ color: 'rgba(255,255,255,0.32)', marginBottom: 4, fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="wellbeing"
            stroke="#9b7cc8"
            strokeWidth={2}
            dot={false}
            strokeLinecap="round"
            strokeLinejoin="round"
            connectNulls
            name="Wellbeing"
          />
          <Line
            type="monotone"
            dataKey="energy"
            stroke="#c4b8e0"
            strokeWidth={2}
            dot={false}
            strokeLinecap="round"
            strokeLinejoin="round"
            connectNulls
            name="Energy"
          />
          <Line
            type="monotone"
            dataKey="sleep"
            stroke="#7a52b0"
            strokeWidth={2}
            dot={false}
            strokeLinecap="round"
            strokeLinejoin="round"
            connectNulls
            name="Sleep hrs"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
