'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SymptomTrendChart } from './SymptomTrendChart'
import { TriggerCorrelation } from './TriggerCorrelation'
import { CheckInHistory } from './CheckInHistory'
import { cn } from '@/lib/utils'

type Metric = 'mood' | 'energy_level' | 'sleep_quality' | 'hot_flash_severity'

interface CheckinPoint {
  checkin_date: string
  mood: number | null
  energy_level: number | null
  sleep_hours: number | null
  sleep_quality: number | null
  hot_flash_severity: number | null
  triggers: string[] | null
}

interface Props {
  checkins: CheckinPoint[]
  streak: number
  monthCount: number
}

const METRICS: { key: Metric; label: string; color: string }[] = [
  { key: 'mood', label: 'Mood', color: '#5a8a6b' },
  { key: 'energy_level', label: 'Energy', color: '#c47a5a' },
  { key: 'sleep_quality', label: 'Sleep', color: '#c4959e' },
  { key: 'hot_flash_severity', label: 'Hot flashes', color: '#e07a5f' },
]

export function TrackerClient({ checkins, streak, monthCount }: Props) {
  const [activeMetric, setActiveMetric] = useState<Metric>('mood')
  const [tab, setTab] = useState<'trends' | 'history' | 'triggers'>('trends')

  const avg = (key: Metric) => {
    const vals = checkins.map((c) => c[key]).filter((v): v is number => v !== null)
    return vals.length ? (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1) : '—'
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-[#5a8a6b]">{streak}</p>
            <p className="text-xs text-[#718096] mt-1">Day streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-[#c47a5a]">{monthCount}</p>
            <p className="text-xs text-[#718096] mt-1">Check-ins this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">30-day averages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {METRICS.map((m) => (
              <div key={m.key} className="text-center">
                <p className="text-lg font-bold" style={{ color: m.color }}>{avg(m.key)}</p>
                <p className="text-xs text-[#718096]">{m.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex rounded-xl bg-[#f0ece4] p-1 gap-1">
        {(['trends', 'history', 'triggers'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              tab === t ? 'bg-white text-[#2d3748] shadow-sm' : 'text-[#718096]'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'trends' && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex gap-2 flex-wrap">
              {METRICS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setActiveMetric(m.key)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                    activeMetric === m.key
                      ? 'text-white border-transparent'
                      : 'border-[#e2d9d0] text-[#718096]'
                  )}
                  style={activeMetric === m.key ? { backgroundColor: m.color, borderColor: m.color } : undefined}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <SymptomTrendChart data={checkins} metric={activeMetric} />
          </CardContent>
        </Card>
      )}

      {tab === 'history' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckInHistory data={checkins} />
          </CardContent>
        </Card>
      )}

      {tab === 'triggers' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Trigger patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <TriggerCorrelation data={checkins} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
