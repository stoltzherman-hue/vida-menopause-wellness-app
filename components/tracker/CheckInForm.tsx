'use client'
import { useState } from 'react'

const TRIGGERS = [
  'Alcohol', 'Caffeine', 'Spicy food', 'Sugar', 'Stress', 'Poor sleep',
  'Heat', 'Exercise', 'Missed medication', 'Travel', 'Conflict', 'Workload', 'Illness',
]

function ScaleBtn({ value, selected, onClick, color = '#6b9e80' }: { value: number; selected: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 40, height: 40, borderRadius: '50%',
        border: selected ? 'none' : '2px solid #ede0d8',
        background: selected ? color : 'white',
        color: selected ? 'white' : '#8a7a72',
        fontSize: 14, fontWeight: selected ? 700 : 500,
        cursor: 'pointer',
        transition: 'all 0.15s',
        flexShrink: 0,
        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        boxShadow: selected ? `0 2px 10px ${color}55` : 'none',
      }}
    >{value}</button>
  )
}

const section: React.CSSProperties = {
  background: 'rgba(255,255,255,0.82)',
  border: '1.5px solid rgba(237,224,216,0.7)',
  borderRadius: 20,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  padding: '18px 20px',
}

const sLabel: React.CSSProperties = {
  fontFamily: 'var(--font-playfair), Georgia, serif',
  fontSize: 15, fontWeight: 700, color: '#3d2c35', marginBottom: 14,
}

export function CheckInForm() {
  const [mood, setMood] = useState<number | null>(null)
  const [energy, setEnergy] = useState<number | null>(null)
  const [sleepHours, setSleepHours] = useState<number | null>(null)
  const [sleepQuality, setSleepQuality] = useState<number | null>(null)
  const [hotFlash, setHotFlash] = useState<number | null>(null)
  const [triggers, setTriggers] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleTrigger(t: string) {
    setTriggers((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkinDate: new Date().toISOString().split('T')[0], mood, energyLevel: energy, sleepHours, sleepQuality, hotFlashSeverity: hotFlash, triggers }),
      })
      if (res.ok) {
        setSaved(true)
      } else {
        const json = await res.json().catch(() => ({}))
        setError(json?.error?.message ?? `Something went wrong (${res.status}). Please try again.`)
      }
    } catch {
      setError('Network error — please check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  if (saved) {
    return (
      <div style={{ ...section, textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
        <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 22, fontWeight: 700, color: '#3d2c35', marginBottom: 8 }}>Check-in saved!</h2>
        <p style={{ color: '#8a7a72', fontSize: 15, marginBottom: 24 }}>Great job tracking today. Every entry helps reveal your patterns.</p>
        <button
          onClick={() => setSaved(false)}
          style={{ height: 46, borderRadius: 14, border: '1.5px solid #ede0d8', background: 'white', color: '#6b9e80', fontSize: 15, fontWeight: 600, padding: '0 28px', cursor: 'pointer', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}
        >Log another</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Mood */}
      <div style={section}>
        <p style={sLabel}>Mood</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[1,2,3,4,5,6,7,8,9,10].map((v) => <ScaleBtn key={v} value={v} selected={mood === v} onClick={() => setMood(v)} color="#6b9e80" />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#b8a9a0', marginTop: 8 }}>
          <span>Low</span><span>Great</span>
        </div>
      </div>

      {/* Energy */}
      <div style={section}>
        <p style={sLabel}>Energy level</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[1,2,3,4,5,6,7,8,9,10].map((v) => <ScaleBtn key={v} value={v} selected={energy === v} onClick={() => setEnergy(v)} color="#c47a5a" />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#b8a9a0', marginTop: 8 }}>
          <span>Exhausted</span><span>Energised</span>
        </div>
      </div>

      {/* Sleep */}
      <div style={section}>
        <p style={sLabel}>Sleep last night</p>
        <p style={{ fontSize: 13, color: '#8a7a72', marginBottom: 10 }}>Hours</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {[4,5,6,7,8,9,10].map((v) => <ScaleBtn key={v} value={v} selected={sleepHours === v} onClick={() => setSleepHours(v)} color="#c4959e" />)}
        </div>
        <p style={{ fontSize: 13, color: '#8a7a72', marginBottom: 10 }}>Quality</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[1,2,3,4,5].map((v) => <ScaleBtn key={v} value={v} selected={sleepQuality === v} onClick={() => setSleepQuality(v)} color="#c4959e" />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#b8a9a0', marginTop: 8 }}>
          <span>Poor</span><span>Excellent</span>
        </div>
      </div>

      {/* Hot flashes */}
      <div style={section}>
        <p style={sLabel}>Hot flashes today?</p>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1,2,3,4,5].map((v) => <ScaleBtn key={v} value={v} selected={hotFlash === v} onClick={() => setHotFlash(v)} color="#e07a5f" />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#b8a9a0', marginTop: 8 }}>
          <span>Mild / none</span><span>Severe</span>
        </div>
      </div>

      {/* Triggers */}
      <div style={section}>
        <p style={sLabel}>Any triggers today?</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TRIGGERS.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => toggleTrigger(t)}
              style={{
                borderRadius: 20, padding: '8px 16px', fontSize: 13, fontWeight: 500,
                border: triggers.includes(t) ? 'none' : '1.5px solid #ede0d8',
                background: triggers.includes(t) ? '#6b9e80' : 'white',
                color: triggers.includes(t) ? 'white' : '#8a7a72',
                cursor: 'pointer', minHeight: 38,
                transition: 'all 0.15s',
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                boxShadow: triggers.includes(t) ? '0 2px 8px rgba(107,158,128,0.35)' : 'none',
              }}
            >{t}</button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(201,82,82,0.07)', border: '1px solid rgba(201,82,82,0.25)', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#c0392b', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        style={{
          height: 54, borderRadius: 16, border: 'none',
          background: 'linear-gradient(135deg, #6b9e80 0%, #4a7a5b 100%)',
          color: 'white', fontSize: 16, fontWeight: 700,
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.7 : 1,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          boxShadow: '0 4px 20px rgba(107,158,128,0.35)',
          transition: 'all 0.2s',
          marginTop: 4,
        }}
      >{saving ? 'Saving…' : 'Save check-in 🌿'}</button>
    </form>
  )
}
