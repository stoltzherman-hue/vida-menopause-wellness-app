'use client'
import { useState } from 'react'
import { SymptomTrendChart } from './SymptomTrendChart'
import { TriggerCorrelation } from './TriggerCorrelation'
import { CheckInHistory } from './CheckInHistory'
import { CalendarHeatMap } from './CalendarHeatMap'

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
  { key: 'mood',              label: 'Mood',        color: '#6b9e80' },
  { key: 'energy_level',      label: 'Energy',      color: '#c47a5a' },
  { key: 'sleep_quality',     label: 'Sleep',       color: '#c4959e' },
  { key: 'hot_flash_severity', label: 'Hot flashes', color: '#e07a5f' },
]

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.82)',
  border: '1.5px solid rgba(237,224,216,0.7)',
  borderRadius: 20,
  backdropFilter: 'blur(12px)',
  padding: '18px 20px',
}

// SVG progress ring
function ProgressRing({
  pct, color, size = 80, stroke = 8, label, value,
}: { pct: number; color: string; size?: number; stroke?: number; label: string; value: string | number }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = Math.max(0, Math.min(1, pct / 100)) * circ
  const gap  = circ - dash
  const isMilestone = pct >= 100 || (typeof value === 'number' && (value === 7 || value === 14 || value === 30))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size }} className={isMilestone ? 'ring-glow' : ''}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(237,224,216,0.5)" strokeWidth={stroke} />
          {/* Fill */}
          <circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            className="ring-fill-anim"
            style={{ '--ring-full': circ } as React.CSSProperties}
          />
        </svg>
        {/* Center value */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 18, fontWeight: 800, color,
            fontFamily: 'var(--font-playfair), Georgia, serif', lineHeight: 1,
          }}>{value}</span>
          {isMilestone && <span style={{ fontSize: 10 }}>🔥</span>}
        </div>
      </div>
      <span style={{ fontSize: 11, color: '#8a7a72', fontWeight: 600, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', textAlign: 'center' }}>{label}</span>
    </div>
  )
}

export function TrackerClient({ checkins, streak, monthCount }: Props) {
  const [activeMetric, setActiveMetric] = useState<Metric>('mood')
  const [tab, setTab] = useState<'calendar' | 'trends' | 'history' | 'triggers'>('calendar')

  const avg = (key: Metric) => {
    const vals = checkins.map((c) => c[key]).filter((v): v is number => v !== null)
    return vals.length ? (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1) : '—'
  }

  const consistency = Math.round((monthCount / 30) * 100)

  // Top symptom from triggers
  const symptomCounts: Record<string, number> = {}
  checkins.forEach((c) => {
    (c.triggers ?? []).forEach((t) => {
      if (t.startsWith('symptom:')) {
        const s = t.slice(8)
        symptomCounts[s] = (symptomCounts[s] ?? 0) + 1
      }
    })
  })
  const topSymptom = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Milestone banner — appears at 7, 14, 30 day streaks */}
      {(streak === 7 || streak === 14 || streak === 30) && (
        <div className="milestone-card">
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 44 }}>
              {streak === 7 ? '🌱' : streak === 14 ? '🌿' : '🏆'}
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 17, color: 'white', margin: 0 }}>
                {streak}-day streak!
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: '4px 0 0', lineHeight: 1.45 }}>
                {streak === 7  ? 'One week of consistent tracking — your data is starting to tell a story.' : ''}
                {streak === 14 ? 'Two weeks strong. Your pattern data is becoming meaningful.' : ''}
                {streak === 30 ? 'A whole month! You have powerful insights ready to explore.' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress rings row */}
      <div style={{ ...card, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <ProgressRing
          pct={streak >= 30 ? 100 : (streak / 30) * 100}
          color="#2d8b7a" value={streak || '—'} label="Day streak"
        />
        <ProgressRing
          pct={consistency} color="#c47a5a"
          value={`${consistency}%`} label="Monthly consistency"
        />
        <ProgressRing
          pct={checkins.length > 0 ? Math.min((parseFloat(avg('mood')) / 10) * 100, 100) : 0}
          color="#9b8ab8" value={avg('mood')} label="Avg mood"
        />
        <ProgressRing
          pct={checkins.length > 0 ? Math.min((parseFloat(avg('sleep_quality')) / 5) * 100, 100) : 0}
          color="#c4959e" value={avg('sleep_quality')} label="Avg sleep"
        />
      </div>

      {/* Top symptom insight */}
      {topSymptom && (
        <div style={{
          ...card, display: 'flex', alignItems: 'center', gap: 14,
          background: 'rgba(155,138,184,0.08)',
          border: '1.5px solid rgba(155,138,184,0.20)',
        }} className="fade-in">
          <div style={{
            width: 42, height: 42, borderRadius: 13, flexShrink: 0,
            background: 'rgba(155,138,184,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9b8ab8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#b8a9a0', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 3px' }}>Your data suggests</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#3d2c35', margin: 0 }}>
              <strong>{topSymptom[0]}</strong> appeared in {topSymptom[1]} of your recent check-ins
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'rgba(237,224,216,0.4)', borderRadius: 18, padding: 4, gap: 3 }}>
        {(['calendar', 'trends', 'history', 'triggers'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '9px 4px', borderRadius: 14, border: 'none',
            background: tab === t ? 'white' : 'transparent',
            color: tab === t ? '#3d2c35' : '#8a7a72',
            fontSize: 12, fontWeight: tab === t ? 700 : 500,
            cursor: 'pointer',
            boxShadow: tab === t ? '0 2px 8px rgba(61,44,53,0.08)' : 'none',
            transition: 'all 0.18s',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            textTransform: 'capitalize' as const,
          }}>{t}</button>
        ))}
      </div>

      {tab === 'calendar' && (
        <div key="calendar" className="step-enter" style={card}>
          <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 15, fontWeight: 700, color: '#3d2c35', marginBottom: 4 }}>
            35-day wellness calendar
          </p>
          <p style={{ fontSize: 12, color: '#b8a9a0', marginBottom: 16, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
            Coloured by mood — hover a day to see details
          </p>
          {checkins.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗓️</div>
              <p style={{ fontSize: 14, color: '#8a7a72', lineHeight: 1.6 }}>
                Your calendar will appear here as you log check-ins.<br/>
                <a href="/check-in" style={{ color: '#2d8b7a', fontWeight: 600 }}>Start tracking →</a>
              </p>
            </div>
          ) : (
            <CalendarHeatMap checkins={checkins} />
          )}
        </div>
      )}

      {tab === 'trends' && (
        <div key="trends" className="step-enter" style={card}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {METRICS.map((m) => (
              <button key={m.key} onClick={() => setActiveMetric(m.key)} style={{
                borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600,
                border: activeMetric === m.key ? 'none' : '1.5px solid #ede0d8',
                background: activeMetric === m.key ? m.color : 'white',
                color: activeMetric === m.key ? 'white' : '#8a7a72',
                cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              }}>{m.label}</button>
            ))}
          </div>
          <SymptomTrendChart data={checkins} metric={activeMetric} />
        </div>
      )}

      {tab === 'history' && (
        <div key="history" className="step-enter" style={card}>
          <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 15, fontWeight: 700, color: '#3d2c35', marginBottom: 14 }}>Recent check-ins</p>
          <CheckInHistory data={checkins} />
        </div>
      )}

      {tab === 'triggers' && (
        <div key="triggers" className="step-enter" style={card}>
          <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 15, fontWeight: 700, color: '#3d2c35', marginBottom: 14 }}>Trigger patterns</p>
          <TriggerCorrelation data={checkins} />
        </div>
      )}
    </div>
  )
}
