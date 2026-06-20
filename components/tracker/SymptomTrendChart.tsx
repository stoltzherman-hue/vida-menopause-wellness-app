'use client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface CheckinPoint {
  checkin_date: string
  mood: number | null
  energy_level: number | null
  sleep_hours: number | null
  sleep_quality: number | null
  hot_flash_severity: number | null
}

interface Props {
  data: CheckinPoint[]
  metric: 'mood' | 'energy_level' | 'sleep_quality' | 'hot_flash_severity'
}

const METRIC_CONFIG = {
  mood: { label: 'Mood', color: '#5a8a6b', domain: [1, 10] as [number, number] },
  energy_level: { label: 'Energy', color: '#c47a5a', domain: [1, 10] as [number, number] },
  sleep_quality: { label: 'Sleep quality', color: '#c4959e', domain: [1, 5] as [number, number] },
  hot_flash_severity: { label: 'Hot flash severity', color: '#e07a5f', domain: [1, 5] as [number, number] },
}

function fmt(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
}

export function SymptomTrendChart({ data, metric }: Props) {
  const config = METRIC_CONFIG[metric]
  const chartData = data
    .filter((d) => d[metric] !== null)
    .map((d) => ({ date: fmt(d.checkin_date), value: d[metric] }))

  if (chartData.length < 2) {
    return (
      <div className="h-48 flex items-center justify-center text-[#a0aec0] text-sm">
        Log at least 2 check-ins to see your trend
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#a0aec0' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={config.domain}
          tick={{ fontSize: 11, fill: '#a0aec0' }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2d9d0' }}
          itemStyle={{ color: config.color }}
          labelStyle={{ color: '#2d3748', fontWeight: 600 }}
        />
        <Line
          type="monotone"
          dataKey="value"
          name={config.label}
          stroke={config.color}
          strokeWidth={2}
          dot={{ r: 3, fill: config.color }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
