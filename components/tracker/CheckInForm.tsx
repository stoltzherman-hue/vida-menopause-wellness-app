'use client'
import { useState } from 'react'

// ── Symptom categories ────────────────────────────────────────────────────────
const SYMPTOM_CATEGORIES = [
  {
    id: 'physical',
    label: 'Physical',
    color: '#e07a5f',
    bg: 'rgba(224,122,95,0.10)',
    selectedBg: '#e07a5f',
    symptoms: [
      'Hot flushes', 'Night sweats', 'Fatigue', 'Joint pain',
      'Headaches', 'Palpitations', 'Bloating', 'Breast tenderness',
    ],
  },
  {
    id: 'emotional',
    label: 'Emotional',
    color: '#9b8ab8',
    bg: 'rgba(155,138,184,0.10)',
    selectedBg: '#9b8ab8',
    symptoms: [
      'Anxiety', 'Low mood', 'Irritability', 'Mood swings',
      'Emotional sensitivity', 'Lack of motivation',
    ],
  },
  {
    id: 'cognitive',
    label: 'Mind',
    color: '#2d8b7a',
    bg: 'rgba(45,139,122,0.10)',
    selectedBg: '#2d8b7a',
    symptoms: [
      'Brain fog', 'Memory lapses', 'Difficulty concentrating', 'Word finding',
    ],
  },
  {
    id: 'sleep',
    label: 'Sleep',
    color: '#c4959e',
    bg: 'rgba(196,149,158,0.10)',
    selectedBg: '#c4959e',
    symptoms: [
      'Poor sleep', 'Night waking', 'Vivid dreams', 'Insomnia',
    ],
  },
]

const TRIGGERS = [
  'Alcohol', 'Caffeine', 'Spicy food', 'Sugar', 'Stress',
  'Heat', 'Exercise', 'Missed medication', 'Conflict', 'Workload',
]

const HELPED = [
  'Exercise', 'Good food', 'Time outside', 'Rest', 'Social time',
  'Meditation', 'Good hydration', 'Fresh air', 'Reading', 'Sleep hygiene',
]

// Wellbeing states with emoji + label
const WELLBEING_LEVELS = [
  { value: 1, emoji: '😞', label: 'Rough day', color: '#e07a5f' },
  { value: 2, emoji: '😔', label: 'Struggling', color: '#c47a5a' },
  { value: 3, emoji: '😐', label: 'Getting by', color: '#b8a9a0' },
  { value: 4, emoji: '🙂', label: 'Pretty good', color: '#6b9e80' },
  { value: 5, emoji: '😊', label: 'Feeling great', color: '#2d8b7a' },
]

const SLEEP_HOURS = [4, 5, 6, 7, 8, 9, 10]
const SLEEP_QUALITY = [
  { value: 1, label: 'Awful' },
  { value: 2, label: 'Poor' },
  { value: 3, label: 'OK' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Great' },
]
const ENERGY_LEVELS = [
  { value: 2, label: 'Drained' },
  { value: 4, label: 'Low' },
  { value: 6, label: 'Moderate' },
  { value: 8, label: 'Good' },
  { value: 10, label: 'Energised' },
]

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.38)',
  border: '1.5px solid rgba(255,255,255,0.60)',
  borderRadius: 22,
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  boxShadow: '0 2px 16px rgba(26,18,32,0.06)',
  padding: '22px 20px',
}

const stepLabel: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: '#b8a9a0',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  marginBottom: 6,
  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
}

const questionStyle: React.CSSProperties = {
  fontFamily: 'var(--font-playfair), Georgia, serif',
  fontSize: 18, fontWeight: 700, color: '#1e3d35',
  marginBottom: 20, lineHeight: 1.3,
}

export function CheckInForm() {
  const [wellbeing, setWellbeing] = useState<number | null>(null)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [energyLevel, setEnergyLevel] = useState<number | null>(null)
  const [sleepHours, setSleepHours] = useState<number | null>(null)
  const [sleepQuality, setSleepQuality] = useState<number | null>(null)
  const [triggers, setTriggers] = useState<string[]>([])
  const [helped, setHelped] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleItem(arr: string[], item: string, setter: (v: string[]) => void) {
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    // Map symptoms to DB fields
    const hotFlashPresent = symptoms.includes('Hot flushes')
    const nightSweatsPresent = symptoms.includes('Night sweats')

    // Combine all symptom/trigger/helped context into triggers array
    const allTriggers = [
      ...triggers,
      ...symptoms.filter((s) => s !== 'Hot flushes' && s !== 'Night sweats').map((s) => `symptom:${s}`),
      ...helped.map((h) => `helped:${h}`),
    ]

    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkinDate: new Date().toISOString().split('T')[0],
          overallWellbeing: wellbeing,
          mood: wellbeing ? wellbeing * 2 : null,
          energyLevel,
          sleepHours,
          sleepQuality,
          hotFlashSeverity: hotFlashPresent ? 3 : null,
          hotFlashCount: hotFlashPresent ? 1 : null,
          nightSweatsCount: nightSweatsPresent ? 1 : null,
          nightSweatsSeverity: nightSweatsPresent ? 3 : null,
          triggers: allTriggers,
        }),
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
    const chosenWellbeing = WELLBEING_LEVELS.find((w) => w.value === wellbeing)
    return (
      <div style={{ ...card, textAlign: 'center', padding: '48px 28px' }}>
        <div style={{ fontSize: 56, marginBottom: 16, lineHeight: 1 }}>{chosenWellbeing?.emoji ?? '🌿'}</div>
        <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 700, color: '#1e3d35', marginBottom: 10 }}>
          Check-in saved
        </h2>
        <p style={{ color: '#6a7a72', fontSize: 15, marginBottom: 8, lineHeight: 1.6 }}>
          {chosenWellbeing ? `${chosenWellbeing.label} — your body is being heard.` : 'Every entry helps reveal your patterns.'}
        </p>
        {symptoms.length > 0 && (
          <p style={{ color: '#9b8ab8', fontSize: 13, marginBottom: 28 }}>
            Logged: {symptoms.slice(0, 3).join(', ')}{symptoms.length > 3 ? ` +${symptoms.length - 3} more` : ''}
          </p>
        )}
        <button
          onClick={() => { setSaved(false); setWellbeing(null); setSymptoms([]); setEnergyLevel(null); setSleepHours(null); setSleepQuality(null); setTriggers([]); setHelped([]) }}
          style={{
            height: 46, borderRadius: 14, border: '1.5px solid rgba(45,139,122,0.3)',
            background: 'rgba(45,139,122,0.08)', color: '#2d8b7a',
            fontSize: 14, fontWeight: 600, padding: '0 28px', cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}
        >Log another day</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Step 1 — Overall wellbeing */}
      <div style={card}>
        <p style={stepLabel}>Step 1 of 5</p>
        <p style={questionStyle}>How are you feeling today?</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          {WELLBEING_LEVELS.map(({ value, emoji, label, color }) => {
            const selected = wellbeing === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setWellbeing(value)}
                style={{
                  flex: 1,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '14px 8px',
                  borderRadius: 16,
                  border: selected ? `2px solid ${color}` : '1.5px solid rgba(237,224,216,0.7)',
                  background: selected ? `${color}18` : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: selected ? `0 4px 16px ${color}30` : 'none',
                  minHeight: 72,
                }}
              >
                <span style={{ fontSize: 28, lineHeight: 1 }}>{emoji}</span>
                <span style={{
                  fontSize: 10, fontWeight: selected ? 700 : 500,
                  color: selected ? color : '#b8a9a0',
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  textAlign: 'center', lineHeight: 1.2,
                }}>{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 2 — Symptoms */}
      <div style={card}>
        <p style={stepLabel}>Step 2 of 5</p>
        <p style={questionStyle}>What are you experiencing today?</p>
        <p style={{ fontSize: 13, color: '#8a7a72', marginBottom: 18, marginTop: -12 }}>Tap all that apply — nothing if you&apos;re symptom-free</p>

        {SYMPTOM_CATEGORIES.map(({ id, label, color, selectedBg, symptoms: catSymptoms }) => (
          <div key={id} style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
              {label}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {catSymptoms.map((s) => {
                const sel = symptoms.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleItem(symptoms, s, setSymptoms)}
                    style={{
                      borderRadius: 22, padding: '8px 15px', fontSize: 13, fontWeight: 500,
                      border: sel ? 'none' : '1.5px solid rgba(237,224,216,0.8)',
                      background: sel ? selectedBg : 'rgba(255,255,255,0.75)',
                      color: sel ? 'white' : '#6a5a62',
                      cursor: 'pointer', minHeight: 38,
                      transition: 'all 0.15s',
                      fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                      boxShadow: sel ? `0 2px 10px ${selectedBg}40` : 'none',
                    }}
                  >{s}</button>
                )
              })}
            </div>
          </div>
        ))}

        {symptoms.length > 0 && (
          <div style={{
            marginTop: 4, padding: '10px 14px',
            background: 'rgba(45,139,122,0.06)',
            border: '1px solid rgba(45,139,122,0.15)',
            borderRadius: 12,
            fontSize: 13, color: '#2d8b7a', fontWeight: 500,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>
            {symptoms.length} symptom{symptoms.length > 1 ? 's' : ''} logged ✓
          </div>
        )}
      </div>

      {/* Step 3 — Energy + Sleep */}
      <div style={card}>
        <p style={stepLabel}>Step 3 of 5</p>
        <p style={questionStyle}>Energy and sleep</p>

        <p style={{ fontSize: 13, fontWeight: 600, color: '#3d2c35', marginBottom: 12 }}>Energy today</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {ENERGY_LEVELS.map(({ value, label }) => {
            const sel = energyLevel === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setEnergyLevel(value)}
                style={{
                  borderRadius: 12, padding: '10px 16px', fontSize: 13, fontWeight: sel ? 700 : 500,
                  border: sel ? 'none' : '1.5px solid rgba(237,224,216,0.8)',
                  background: sel ? 'linear-gradient(135deg, #c47a5a, #a85a3a)' : 'rgba(255,255,255,0.75)',
                  color: sel ? 'white' : '#6a5a62',
                  cursor: 'pointer', minHeight: 44, flex: 1,
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  boxShadow: sel ? '0 3px 12px rgba(196,122,90,0.35)' : 'none',
                }}
              >{label}</button>
            )
          })}
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, color: '#3d2c35', marginBottom: 12 }}>Hours of sleep</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {SLEEP_HOURS.map((h) => {
            const sel = sleepHours === h
            return (
              <button
                key={h}
                type="button"
                onClick={() => setSleepHours(h)}
                style={{
                  width: 46, height: 46, borderRadius: 14, fontSize: 15, fontWeight: sel ? 700 : 500,
                  border: sel ? 'none' : '1.5px solid rgba(237,224,216,0.8)',
                  background: sel ? '#c4959e' : 'rgba(255,255,255,0.75)',
                  color: sel ? 'white' : '#6a5a62',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  boxShadow: sel ? '0 3px 12px rgba(196,149,158,0.40)' : 'none',
                }}
              >{h}</button>
            )
          })}
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, color: '#3d2c35', marginBottom: 12 }}>Sleep quality</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {SLEEP_QUALITY.map(({ value, label }) => {
            const sel = sleepQuality === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setSleepQuality(value)}
                style={{
                  flex: 1, padding: '10px 6px', borderRadius: 12, fontSize: 12, fontWeight: sel ? 700 : 500,
                  border: sel ? 'none' : '1.5px solid rgba(237,224,216,0.8)',
                  background: sel ? '#c4959e' : 'rgba(255,255,255,0.75)',
                  color: sel ? 'white' : '#6a5a62',
                  cursor: 'pointer', minHeight: 44,
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  boxShadow: sel ? '0 3px 12px rgba(196,149,158,0.35)' : 'none',
                  textAlign: 'center',
                }}
              >{label}</button>
            )
          })}
        </div>
      </div>

      {/* Step 4 — Triggers */}
      <div style={card}>
        <p style={stepLabel}>Step 4 of 5</p>
        <p style={questionStyle}>What may have made things harder?</p>
        <p style={{ fontSize: 13, color: '#8a7a72', marginBottom: 16, marginTop: -12 }}>Leave blank if nothing stands out</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TRIGGERS.map((t) => {
            const sel = triggers.includes(t)
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleItem(triggers, t, setTriggers)}
                style={{
                  borderRadius: 22, padding: '8px 16px', fontSize: 13, fontWeight: 500,
                  border: sel ? 'none' : '1.5px solid rgba(237,224,216,0.8)',
                  background: sel ? '#e07a5f' : 'rgba(255,255,255,0.75)',
                  color: sel ? 'white' : '#6a5a62',
                  cursor: 'pointer', minHeight: 38,
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  boxShadow: sel ? '0 2px 8px rgba(224,122,95,0.35)' : 'none',
                }}
              >{t}</button>
            )
          })}
        </div>
      </div>

      {/* Step 5 — What helped */}
      <div style={card}>
        <p style={stepLabel}>Step 5 of 5</p>
        <p style={questionStyle}>What helped today?</p>
        <p style={{ fontSize: 13, color: '#8a7a72', marginBottom: 16, marginTop: -12 }}>Recognising what works is just as important</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {HELPED.map((h) => {
            const sel = helped.includes(h)
            return (
              <button
                key={h}
                type="button"
                onClick={() => toggleItem(helped, h, setHelped)}
                style={{
                  borderRadius: 22, padding: '8px 16px', fontSize: 13, fontWeight: 500,
                  border: sel ? 'none' : '1.5px solid rgba(237,224,216,0.8)',
                  background: sel ? '#2d8b7a' : 'rgba(255,255,255,0.75)',
                  color: sel ? 'white' : '#6a5a62',
                  cursor: 'pointer', minHeight: 38,
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  boxShadow: sel ? '0 2px 8px rgba(45,139,122,0.35)' : 'none',
                }}
              >{h}</button>
            )
          })}
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(201,82,82,0.07)', border: '1px solid rgba(201,82,82,0.22)',
          borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#c0392b',
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        style={{
          height: 56, borderRadius: 18, border: 'none',
          background: wellbeing
            ? 'linear-gradient(135deg, #2d8b7a 0%, #1e6b55 100%)'
            : 'linear-gradient(135deg, #b8a9a0 0%, #9a8a82 100%)',
          color: 'white', fontSize: 16, fontWeight: 700,
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.7 : 1,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          boxShadow: wellbeing ? '0 6px 24px rgba(45,139,122,0.38)' : 'none',
          transition: 'all 0.2s',
          marginTop: 4,
        }}
      >
        {saving ? 'Saving your check-in…' : wellbeing ? 'Save today\'s check-in 🌿' : 'How are you feeling? (step 1 above)'}
      </button>
    </form>
  )
}
