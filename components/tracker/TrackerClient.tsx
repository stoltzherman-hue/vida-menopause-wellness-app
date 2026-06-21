'use client'
import { useState } from 'react'
import { SymptomTrendChart } from './SymptomTrendChart'
import { TriggerCorrelation } from './TriggerCorrelation'
import { CheckInHistory } from './CheckInHistory'

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

interface Props { checkins: CheckinPoint[]; streak: number; monthCount: number }

const METRICS: { key: Metric; label: string; color: string }[] = [
  { key: 'mood', label: 'Mood', color: '#6b9e80' },
  { key: 'energy_level', label: 'Energy', color: '#c47a5a' },
  { key: 'sleep_quality', label: 'Sleep', color: '#c4959e' },
  { key: 'hot_flash_severity', label: 'Hot flashes', color: '#e07a5f' },
]

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.82)',
  border: '1.5px solid rgba(237,224,216,0.7)',
  borderRadius: 20,
  backdropFilter: 'blur(12px)',
  padding: '18px 20px',
}

export function TrackerClient({ checkins, streak, monthCount }: Props) {
  const [activeMetric, setActiveMetric] = useState<Metric>('mood')
  const [tab, setTab] = useState<'trends' | 'history' | 'triggers'>('trends')

  const avg = (key: Metric) => {
    const vals = checkins.map((c) => c[key]).filter((v): v is number => v !== null)
    return vals.length ? (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1) : '—'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ ...card, textAlign: 'center' }}>
          <p style={{ fontSize: 34, fontWeight: 800, color: '#6b9e80', margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif' }}>{streak || '—'}</p>
          <p style={{ fontSize: 12, color: '#8a7a72', marginTop: 4 }}>Day streak 🔥</p>
        </div>
        <div style={{ ...card, textAlign: 'center' }}>
          <p style={{ fontSize: 34, fontWeight: 800, color: '#c47a5a', margin: 0, fontFamily: 'var(--font-playfair), Georgia, serif' }}>{monthCount || '—'}</p>
          <p style={{ fontSize: 12, color: '#8a7a72', marginTop: 4 }}>Check-ins this month</p>
        </div>
      </div>

      {/* 30-day averages */}
      <div style={card}>
        <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 15, fontWeight: 700, color: '#3d2c35', marginBottom: 14 }}>30-day averages</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {METRICS.map((m) => (
            <div key={m.key} style={{ textAlign: 'center', background: 'rgba(253,248,244,0.8)', borderRadius: 12, padding: '10px 4px' }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: m.color, margin: 0 }}>{avg(m.key)}</p>
              <p style={{ fontSize: 11, color: '#8a7a72', marginTop: 4 }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'rgba(237,224,216,0.4)', borderRadius: 16, padding: 4, gap: 4 }}>
        {(['trends', 'history', 'triggers'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '10px 4px', borderRadius: 12, border: 'none',
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? '#3d2c35' : '#8a7a72',
              fontSize: 13, fontWeight: tab === t ? 700 : 500,
              cursor: 'pointer',
              boxShadow: tab === t ? '0 2px 8px rgba(61,44,53,0.08)' : 'none',
              transition: 'all 0.18s',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              textTransform: 'capitalize' as const,
            }}
          >{t}</button>
        ))}
      </div>

      {tab === 'trends' && (
        <div style={card}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {METRICS.map((m) => (
              <button
                key={m.key}
                onClick={() => setActiveMetric(m.key)}
                style={{
                  borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600,
                  border: activeMetric === m.key ? 'none' : '1.5px solid #ede0d8',
                  background: activeMetric === m.key ? m.color : 'white',
                  color: activeMetric === m.key ? 'white' : '#8a7a72',
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                }}
              >{m.label}</button>
            ))}
          </div>
          <SymptomTrendChart data={checkins} metric={activeMetric} />
        </div>
      )}

      {tab === 'history' && (
        <div style={card}>
          <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 15, fontWeight: 700, color: '#3d2c35', marginBottom: 14 }}>Recent check-ins</p>
          <CheckInHistory data={checkins} />
        </div>
      )}

      {tab === 'triggers' && (
        <div style={card}>
          <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 15, fontWeight: 700, color: '#3d2c35', marginBottom: 14 }}>Trigger patterns</p>
          <TriggerCorrelation data={checkins} />
        </div>
      )}
    </div>
  )
}
