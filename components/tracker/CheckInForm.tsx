'use client'
import { useState, useCallback, useRef, useEffect } from 'react'

// ── Data ────────────────────────────────────────────────────────────────────
const SYMPTOM_CATEGORIES = [
  {
    id: 'physical', label: 'Physical', color: '#e07a5f', selectedBg: '#e07a5f',
    symptoms: ['Hot flushes', 'Night sweats', 'Fatigue', 'Joint pain', 'Headaches', 'Palpitations', 'Bloating', 'Breast tenderness'],
  },
  {
    id: 'emotional', label: 'Emotional', color: '#9b8ab8', selectedBg: '#9b8ab8',
    symptoms: ['Anxiety', 'Low mood', 'Irritability', 'Mood swings', 'Emotional sensitivity', 'Lack of motivation'],
  },
  {
    id: 'cognitive', label: 'Mind', color: '#2d8b7a', selectedBg: '#2d8b7a',
    symptoms: ['Brain fog', 'Memory lapses', 'Difficulty concentrating', 'Word finding'],
  },
  {
    id: 'sleep', label: 'Sleep', color: '#c4959e', selectedBg: '#c4959e',
    symptoms: ['Poor sleep', 'Night waking', 'Vivid dreams', 'Insomnia'],
  },
]
const TRIGGERS = ['Alcohol', 'Caffeine', 'Spicy food', 'Sugar', 'Stress', 'Heat', 'Exercise', 'Missed medication', 'Conflict', 'Workload']
const HELPED   = ['Exercise', 'Good food', 'Time outside', 'Rest', 'Social time', 'Meditation', 'Good hydration', 'Fresh air', 'Reading', 'Sleep hygiene']
const WELLBEING_LEVELS = [
  { value: 1, emoji: '😞', label: 'Rough day',     color: '#e07a5f' },
  { value: 2, emoji: '😔', label: 'Struggling',    color: '#c47a5a' },
  { value: 3, emoji: '😐', label: 'Getting by',    color: '#b8a9a0' },
  { value: 4, emoji: '🙂', label: 'Pretty good',   color: '#6b9e80' },
  { value: 5, emoji: '😊', label: 'Feeling great', color: '#2d8b7a' },
]
const SLEEP_HOURS   = [4, 5, 6, 7, 8, 9, 10]
const SLEEP_QUALITY = [{ value: 1, label: 'Awful' }, { value: 2, label: 'Poor' }, { value: 3, label: 'OK' }, { value: 4, label: 'Good' }, { value: 5, label: 'Great' }]
const ENERGY_LEVELS = [{ value: 2, label: 'Drained' }, { value: 4, label: 'Low' }, { value: 6, label: 'Moderate' }, { value: 8, label: 'Good' }, { value: 10, label: 'Energised' }]
const TOTAL_STEPS = 5

// ── Pill with guaranteed pop animation via DOM reflow ───────────────────────
function Pill({ selected, color, onToggle, children }: {
  selected: boolean; color: string; onToggle: () => void; children: React.ReactNode
}) {
  const ref = useRef<HTMLButtonElement>(null)
  function handleClick() {
    if (!selected && ref.current) {
      // Force reflow to restart the animation every time we select
      ref.current.classList.remove('pop-select')
      void ref.current.offsetWidth
      ref.current.classList.add('pop-select')
    }
    onToggle()
  }
  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      style={{
        borderRadius: 22, padding: '8px 16px', fontSize: 13, fontWeight: selected ? 600 : 500,
        border: selected ? 'none' : '1.5px solid rgba(237,224,216,0.8)',
        background: selected ? color : 'rgba(255,255,255,0.75)',
        color: selected ? 'white' : '#6a5a62',
        cursor: 'pointer', minHeight: 38,
        transition: 'background 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s',
        boxShadow: selected ? `0 3px 12px ${color}45` : 'none',
        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
      }}
    >{children}</button>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export function CheckInForm() {
  const [step, setStep]               = useState(1)
  const [wellbeing, setWellbeing]     = useState<number | null>(null)
  const [symptoms, setSymptoms]       = useState<string[]>([])
  const [energyLevel, setEnergyLevel] = useState<number | null>(null)
  const [sleepHours, setSleepHours]   = useState<number | null>(null)
  const [sleepQuality, setSleepQuality] = useState<number | null>(null)
  const [triggers, setTriggers]       = useState<string[]>([])
  const [helped, setHelped]           = useState<string[]>([])
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState(false)
  const [error, setError]             = useState<string | null>(null)

  const stepRef = useRef<HTMLDivElement>(null)
  const dirRef  = useRef<'forward' | 'back'>('forward')

  // Guaranteed animation via DOM reflow — works regardless of React reconciliation
  const animateStep = useCallback((dir: 'forward' | 'back') => {
    dirRef.current = dir
    requestAnimationFrame(() => {
      if (!stepRef.current) return
      const cls = dir === 'forward' ? 'step-enter' : 'step-enter-back'
      stepRef.current.classList.remove('step-enter', 'step-enter-back')
      void stepRef.current.offsetWidth // force reflow
      stepRef.current.classList.add(cls)
    })
  }, [])

  function goNext() { animateStep('forward'); setStep((s) => Math.min(s + 1, TOTAL_STEPS)) }
  function goBack() { animateStep('back');    setStep((s) => Math.max(s - 1, 1)) }

  const toggle = useCallback((arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item])
  }, [])

  async function handleSubmit() {
    setSaving(true); setError(null)
    const hotFlashPresent    = symptoms.includes('Hot flushes')
    const nightSweatsPresent = symptoms.includes('Night sweats')
    const allTriggers = [
      ...triggers,
      ...symptoms.filter((s) => s !== 'Hot flushes' && s !== 'Night sweats').map((s) => `symptom:${s}`),
      ...helped.map((h) => `helped:${h}`),
    ]
    try {
      const res = await fetch('/api/checkins', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkinDate: new Date().toISOString().split('T')[0],
          overallWellbeing: wellbeing, mood: wellbeing ? wellbeing * 2 : null,
          energyLevel, sleepHours, sleepQuality,
          hotFlashSeverity: hotFlashPresent ? 3 : null, hotFlashCount: hotFlashPresent ? 1 : null,
          nightSweatsCount: nightSweatsPresent ? 1 : null, nightSweatsSeverity: nightSweatsPresent ? 3 : null,
          triggers: allTriggers,
        }),
      })
      if (res.ok) { setSaved(true) }
      else {
        const json = await res.json().catch(() => ({}))
        setError(json?.error?.message ?? `Something went wrong (${res.status}).`)
      }
    } catch { setError('Network error — please check your connection.') }
    finally { setSaving(false) }
  }

  // ── Celebration screen ────────────────────────────────────────────────────
  if (saved) {
    const chosen = WELLBEING_LEVELS.find((w) => w.value === wellbeing)
    return (
      <div style={{
        background: 'rgba(255,255,255,0.38)', border: '1.5px solid rgba(255,255,255,0.60)',
        borderRadius: 22, backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        textAlign: 'center', padding: '52px 28px',
      }} className="step-enter">
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
          <div style={{ fontSize: 64, lineHeight: 1 }}>{chosen?.emoji ?? '🌿'}</div>
          <span className="celebrate-sparkle1" style={{ position: 'absolute', top: '10%', left: '50%', fontSize: 18, color: '#2d8b7a' }}>✦</span>
          <span className="celebrate-sparkle2" style={{ position: 'absolute', top: '10%', left: '50%', fontSize: 14, color: '#c9a96e' }}>✦</span>
          <span className="celebrate-sparkle3" style={{ position: 'absolute', top: '10%', left: '50%', fontSize: 12, color: '#9b8ab8' }}>✦</span>
          <span className="celebrate-sparkle4" style={{ position: 'absolute', top: '10%', left: '50%', fontSize: 10, color: '#c4959e' }}>✦</span>
          <span className="celebrate-sparkle5" style={{ position: 'absolute', top: '10%', left: '50%', fontSize: 10, color: '#e07a5f' }}>✦</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#1e3d35', marginBottom: 10 }}>
          Check-in saved
        </h2>
        <p style={{ color: '#6a7a72', fontSize: 15, marginBottom: 8, lineHeight: 1.6 }}>
          {chosen ? `${chosen.label} — your body is being heard.` : 'Every entry helps reveal your patterns.'}
        </p>
        {symptoms.length > 0 && (
          <p style={{ color: '#9b8ab8', fontSize: 13, marginBottom: 28 }}>
            Logged: {symptoms.slice(0, 3).join(', ')}{symptoms.length > 3 ? ` +${symptoms.length - 3} more` : ''}
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 280, margin: '0 auto' }}>
          <a href="/tracker" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'linear-gradient(135deg,#2d8b7a,#1e6b55)', color: 'white',
            borderRadius: 14, padding: '13px 24px', fontWeight: 700, fontSize: 14,
            textDecoration: 'none', boxShadow: '0 4px 16px rgba(45,139,122,0.28)',
          }}>View my trends</a>
          <a href="/companion" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(155,138,184,0.12)', color: '#9b8ab8',
            border: '1.5px solid rgba(155,138,184,0.28)',
            borderRadius: 14, padding: '12px 24px', fontWeight: 600, fontSize: 14, textDecoration: 'none',
          }}>Talk to AI companion</a>
          <button onClick={() => { setSaved(false); setWellbeing(null); setSymptoms([]); setEnergyLevel(null); setSleepHours(null); setSleepQuality(null); setTriggers([]); setHelped([]); setStep(1) }}
            style={{ background: 'transparent', border: 'none', color: '#b8a9a0', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-dm-sans),system-ui,sans-serif' }}>
            Log another day
          </button>
        </div>
      </div>
    )
  }

  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.38)', border: '1.5px solid rgba(255,255,255,0.60)',
    borderRadius: 22, backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
    boxShadow: '0 2px 16px rgba(26,18,32,0.06)', padding: '26px 22px',
  }
  const QL: React.CSSProperties = {
    fontFamily: 'var(--font-playfair), Georgia, serif',
    fontSize: 20, fontWeight: 700, color: '#1e3d35', marginBottom: 8, lineHeight: 1.3,
  }
  const SUB: React.CSSProperties = { fontSize: 13, color: '#8a7a72', marginBottom: 20, lineHeight: 1.55 }
  const LABEL: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: '#b8a9a0',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Progress bar */}
      <div className="checkin-progress-bar">
        <div className="checkin-progress-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      {/* Step card — ref used for guaranteed animation replay */}
      <div ref={stepRef} style={card}>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <>
            <p style={LABEL}>Step 1 of {TOTAL_STEPS}</p>
            <p style={QL}>How are you feeling today?</p>
            <p style={SUB}>Be honest — every answer helps you understand your patterns.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
              {WELLBEING_LEVELS.map(({ value, emoji, label, color }) => {
                const sel = wellbeing === value
                return (
                  <button key={value} type="button"
                    onClick={() => setWellbeing(sel ? null : value)}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                      padding: '16px 6px', borderRadius: 18,
                      border: sel ? `2.5px solid ${color}` : '1.5px solid rgba(237,224,216,0.7)',
                      background: sel ? `${color}18` : 'rgba(255,255,255,0.6)',
                      cursor: 'pointer',
                      transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                      transform: sel ? 'scale(1.06)' : 'scale(1)',
                      boxShadow: sel ? `0 6px 20px ${color}40` : 'none',
                      minHeight: 80,
                    }}>
                    <span style={{ fontSize: 30, lineHeight: 1 }}>{emoji}</span>
                    <span style={{
                      fontSize: 9, fontWeight: sel ? 700 : 500,
                      color: sel ? color : '#c4b5ae',
                      fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                      textAlign: 'center', lineHeight: 1.2,
                    }}>{label}</span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <>
            <p style={LABEL}>Step 2 of {TOTAL_STEPS}</p>
            <p style={QL}>What are you experiencing today?</p>
            <p style={SUB}>Tap all that apply — nothing if you&apos;re symptom-free today.</p>
            {SYMPTOM_CATEGORIES.map(({ id, label, color, selectedBg, symptoms: cats }) => (
              <div key={id} style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{label}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {cats.map((s) => (
                    <Pill key={s} selected={symptoms.includes(s)} color={selectedBg} onToggle={() => toggle(symptoms, s, setSymptoms)}>{s}</Pill>
                  ))}
                </div>
              </div>
            ))}
            {symptoms.length > 0 && (
              <div style={{ padding: '10px 14px', background: 'rgba(45,139,122,0.06)', border: '1px solid rgba(45,139,122,0.15)', borderRadius: 12, fontSize: 13, color: '#2d8b7a', fontWeight: 500, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
                {symptoms.length} symptom{symptoms.length > 1 ? 's' : ''} selected ✓
              </div>
            )}
          </>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <>
            <p style={LABEL}>Step 3 of {TOTAL_STEPS}</p>
            <p style={QL}>Energy and sleep</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#3d2c35', marginBottom: 10 }}>Energy today</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 26 }}>
              {ENERGY_LEVELS.map(({ value, label }) => {
                const sel = energyLevel === value
                return (
                  <button key={value} type="button" onClick={() => setEnergyLevel(sel ? null : value)}
                    style={{
                      borderRadius: 12, padding: '10px 16px', fontSize: 13, fontWeight: sel ? 700 : 500,
                      border: sel ? 'none' : '1.5px solid rgba(237,224,216,0.8)',
                      background: sel ? 'linear-gradient(135deg,#c47a5a,#a85a3a)' : 'rgba(255,255,255,0.75)',
                      color: sel ? 'white' : '#6a5a62', cursor: 'pointer', minHeight: 44, flex: 1,
                      transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                      transform: sel ? 'scale(1.04)' : 'scale(1)',
                      boxShadow: sel ? '0 4px 14px rgba(196,122,90,0.40)' : 'none',
                      fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                    }}>{label}</button>
                )
              })}
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#3d2c35', marginBottom: 10 }}>Hours of sleep</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {SLEEP_HOURS.map((h) => {
                const sel = sleepHours === h
                return (
                  <button key={h} type="button" onClick={() => setSleepHours(sel ? null : h)}
                    style={{
                      width: 48, height: 48, borderRadius: 14, fontSize: 15, fontWeight: sel ? 700 : 500,
                      border: sel ? 'none' : '1.5px solid rgba(237,224,216,0.8)',
                      background: sel ? '#c4959e' : 'rgba(255,255,255,0.75)',
                      color: sel ? 'white' : '#6a5a62', cursor: 'pointer', flexShrink: 0,
                      transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                      transform: sel ? 'scale(1.12)' : 'scale(1)',
                      boxShadow: sel ? '0 4px 14px rgba(196,149,158,0.45)' : 'none',
                      fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                    }}>{h}</button>
                )
              })}
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#3d2c35', marginBottom: 10 }}>Sleep quality</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {SLEEP_QUALITY.map(({ value, label }) => {
                const sel = sleepQuality === value
                return (
                  <button key={value} type="button" onClick={() => setSleepQuality(sel ? null : value)}
                    style={{
                      flex: 1, padding: '10px 4px', borderRadius: 12, fontSize: 12, fontWeight: sel ? 700 : 500,
                      border: sel ? 'none' : '1.5px solid rgba(237,224,216,0.8)',
                      background: sel ? '#c4959e' : 'rgba(255,255,255,0.75)',
                      color: sel ? 'white' : '#6a5a62', cursor: 'pointer', minHeight: 44, textAlign: 'center',
                      transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                      transform: sel ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: sel ? '0 4px 14px rgba(196,149,158,0.40)' : 'none',
                      fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                    }}>{label}</button>
                )
              })}
            </div>
          </>
        )}

        {/* ── Step 4 ── */}
        {step === 4 && (
          <>
            <p style={LABEL}>Step 4 of {TOTAL_STEPS}</p>
            <p style={QL}>What may have made things harder?</p>
            <p style={SUB}>Leave blank if nothing stands out today.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TRIGGERS.map((t) => (
                <Pill key={t} selected={triggers.includes(t)} color="#e07a5f" onToggle={() => toggle(triggers, t, setTriggers)}>{t}</Pill>
              ))}
            </div>
          </>
        )}

        {/* ── Step 5 ── */}
        {step === 5 && (
          <>
            <p style={LABEL}>Step 5 of {TOTAL_STEPS}</p>
            <p style={QL}>What helped today?</p>
            <p style={SUB}>Recognising what works is just as important as tracking symptoms.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {HELPED.map((h) => (
                <Pill key={h} selected={helped.includes(h)} color="#2d8b7a" onToggle={() => toggle(helped, h, setHelped)}>{h}</Pill>
              ))}
            </div>
          </>
        )}
      </div>

      {error && (
        <div style={{ marginTop: 10, background: 'rgba(201,82,82,0.07)', border: '1px solid rgba(201,82,82,0.22)', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#c0392b', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{error}</div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        {step > 1 && (
          <button type="button" onClick={goBack} style={{
            height: 52, width: 52, borderRadius: 16, border: '1.5px solid rgba(237,224,216,0.8)',
            background: 'rgba(255,255,255,0.6)', color: '#8a7a72',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'transform 0.15s, box-shadow 0.15s',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button type="button" onClick={goNext} disabled={step === 1 && !wellbeing} style={{
            flex: 1, height: 52, borderRadius: 16, border: 'none',
            background: (step === 1 && !wellbeing)
              ? 'linear-gradient(135deg,#c4b5ae,#a89a92)'
              : 'linear-gradient(135deg,#2d8b7a 0%,#1e6b55 100%)',
            color: 'white', fontSize: 15, fontWeight: 700,
            cursor: (step === 1 && !wellbeing) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: (step > 1 || wellbeing) ? '0 6px 24px rgba(45,139,122,0.35)' : 'none',
            transition: 'background 0.2s, box-shadow 0.2s',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>
            {step === 1 && !wellbeing ? 'Select how you\'re feeling above' : (
              <>Continue <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
            )}
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={saving} style={{
            flex: 1, height: 52, borderRadius: 16, border: 'none',
            background: 'linear-gradient(135deg,#2d8b7a 0%,#1e6b55 100%)',
            color: 'white', fontSize: 15, fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
            boxShadow: '0 6px 24px rgba(45,139,122,0.38)',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>
            {saving ? 'Saving…' : 'Save today\'s check-in 🌿'}
          </button>
        )}
      </div>

      {step > 1 && step < TOTAL_STEPS && (
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <button type="button" onClick={goNext} style={{ background: 'none', border: 'none', color: '#c4b5ae', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
            Skip this step →
          </button>
        </div>
      )}
    </div>
  )
}
