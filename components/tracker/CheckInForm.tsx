'use client'
import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'

const MOOD_OPTIONS = [
  { value: 1, label: 'Rough',   color: 'rgba(217,95,95,0.7)' },
  { value: 2, label: 'Low',     color: 'rgba(196,122,90,0.7)' },
  { value: 3, label: 'Okay',    color: 'rgba(201,169,110,0.7)' },
  { value: 4, label: 'Good',    color: 'rgba(107,158,128,0.7)' },
  { value: 5, label: 'Great',   color: 'rgba(139,109,181,0.8)' },
]

const SYMPTOM_CHIPS = [
  { label: 'Hot flushes',  dbKey: 'Hot flushes' },
  { label: 'Night sweats', dbKey: 'Night sweats' },
  { label: 'Brain fog',    dbKey: 'Brain fog' },
  { label: 'Fatigue',      dbKey: 'Fatigue' },
  { label: 'Low mood',     dbKey: 'Low mood' },
  { label: 'Anxiety',      dbKey: 'Anxiety' },
  { label: 'Joint pain',   dbKey: 'Joint pain' },
  { label: 'Insomnia',     dbKey: 'Insomnia' },
  { label: 'Headache',     dbKey: 'Headache' },
  { label: 'Palpitations', dbKey: 'Palpitations' },
]

const TOTAL_STEPS = 3
const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PF = 'var(--font-playfair), Georgia, serif'

const ENCOURAGEMENT = [
  'Every entry builds your wellness picture.',
  'You showed up for yourself today.',
  'Small steps, real insights.',
  'Your data tells your story.',
  'Consistency is where the patterns emerge.',
]

export function CheckInForm() {
  const [step, setStep]             = useState(1)
  const [mood, setMood]             = useState<number | null>(null)
  const [symptoms, setSymptoms]     = useState<string[]>([])
  const [sleepHours, setSleepHours] = useState(7)
  const [note, setNote]             = useState('')
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const stepRef = useRef<HTMLDivElement>(null)
  const encouragement = ENCOURAGEMENT[new Date().getDay() % ENCOURAGEMENT.length]

  function animateStep(dir: 'forward' | 'back') {
    requestAnimationFrame(() => {
      if (!stepRef.current) return
      stepRef.current.classList.remove('step-enter', 'step-enter-back')
      void stepRef.current.offsetWidth
      stepRef.current.classList.add(dir === 'forward' ? 'step-enter' : 'step-enter-back')
    })
  }

  function goNext() { animateStep('forward'); setStep((s) => Math.min(s + 1, TOTAL_STEPS)) }
  function goBack() { animateStep('back');    setStep((s) => Math.max(s - 1, 1)) }

  const toggleSymptom = useCallback((key: string) => {
    setSymptoms((prev) => prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key])
  }, [])

  async function handleSubmit() {
    setSaving(true); setError(null)
    const hotFlashPresent    = symptoms.includes('Hot flushes')
    const nightSweatsPresent = symptoms.includes('Night sweats')
    const otherTriggers = symptoms
      .filter((s) => s !== 'Hot flushes' && s !== 'Night sweats')
      .map((s) => `symptom:${s}`)

    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkinDate: new Date().toISOString().split('T')[0],
          ...(mood != null && { overallWellbeing: mood, mood: mood * 2 }),
          sleepHours,
          ...(hotFlashPresent    && { hotFlashSeverity: 3, hotFlashCount: 1 }),
          ...(nightSweatsPresent && { nightSweatsCount: 1, nightSweatsSeverity: 3 }),
          triggers: otherTriggers,
          ...(note.trim() && { notes: note.trim() }),
        }),
      })
      if (res.ok) {
        setSaved(true)
      } else {
        const json = await res.json().catch(() => ({}))
        setError(json?.error?.message ?? `Something went wrong (${res.status}).`)
      }
    } catch {
      setError('Network error — please check your connection.')
    } finally {
      setSaving(false)
    }
  }

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: 22, padding: '30px 26px',
  }

  const selectedMood = MOOD_OPTIONS.find((m) => m.value === mood)

  // ── Success screen ──
  if (saved) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px', animation: 'screen-in 0.45s cubic-bezier(0.22,1,0.36,1)' }}>
        <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 999, marginBottom: 24 }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,#9b7cc8,#c4b8e0)' }} />
        </div>

        <div style={{ ...cardStyle, textAlign: 'center' }}>
          {/* Animated ring */}
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(139,109,181,0.12)',
            border: '1px solid rgba(139,109,181,0.3)',
            margin: '0 auto 20px',
            boxShadow: '0 0 32px rgba(139,109,181,0.18)',
          }} />

          <h2 style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Checked in
          </h2>
          <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.35)', margin: '0 0 28px', lineHeight: 1.6 }}>
            {encouragement}
          </p>

          {/* What was logged */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
            {mood != null && (
              <span style={{
                padding: '6px 16px', borderRadius: 999,
                background: `${selectedMood?.color.replace('0.7', '0.12').replace('0.8', '0.12')}`,
                border: `1px solid ${selectedMood?.color.replace('0.7', '0.3').replace('0.8', '0.3')}`,
                color: selectedMood?.color.replace('0.7', '0.9').replace('0.8', '0.95'),
                fontFamily: DM, fontSize: 12, fontWeight: 300,
              }}>
                {selectedMood?.label}
              </span>
            )}
            <span style={{ padding: '6px 16px', borderRadius: 999, background: 'rgba(155,124,200,0.1)', border: '1px solid rgba(155,124,200,0.22)', color: 'rgba(196,184,224,0.75)', fontFamily: DM, fontSize: 12, fontWeight: 300 }}>
              {sleepHours}h sleep
            </span>
            {symptoms.map((s) => (
              <span key={s} style={{ padding: '6px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.42)', fontFamily: DM, fontSize: 12, fontWeight: 300 }}>
                {s}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' }}>
            <Link href="/insights" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: 14 }}>
              See my insights
            </Link>
            <Link href="/dashboard" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: 14 }}>
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px', animation: 'screen-in 0.45s cubic-bezier(0.22,1,0.36,1)' }}>

      {/* Progress bar */}
      <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 999, marginBottom: 20 }}>
        <div style={{ width: `${(step / TOTAL_STEPS) * 100}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,#9b7cc8,#c4b8e0)', transition: 'width 0.4s ease', boxShadow: '0 0 8px rgba(155,124,200,0.4)' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, minHeight: 24 }}>
        <span style={{ fontFamily: DM, fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {step} of {TOTAL_STEPS}
        </span>
        {step > 1 && (
          <button type="button" onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.32)', padding: '4px 8px' }}>
            Back
          </button>
        )}
      </div>

      <div ref={stepRef} style={cardStyle}>

        {/* Step 1 — Mood */}
        {step === 1 && (
          <>
            <h2 style={{ fontFamily: PF, fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              How are you feeling today?
            </h2>
            <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.35)', margin: '0 0 28px' }}>
              Be honest — all feelings are valid data
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: 8 }}>
              {MOOD_OPTIONS.map(({ value, label, color }) => {
                const sel = mood === value
                return (
                  <button key={value} type="button" onClick={() => { setMood(sel ? null : value); if (!sel) setTimeout(goNext, 280) }}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '16px 6px', borderRadius: 16,
                      background: sel ? color.replace('0.7', '0.12').replace('0.8', '0.12') : 'rgba(255,255,255,0.03)',
                      border: sel ? `1px solid ${color.replace('0.7', '0.4').replace('0.8', '0.45')}` : '1px solid rgba(255,255,255,0.07)',
                      boxShadow: sel ? `0 0 0 3px ${color.replace('0.7', '0.1').replace('0.8', '0.1')}` : 'none',
                      transform: sel ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                      cursor: 'pointer',
                    }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%', marginBottom: 10,
                      background: sel ? color : 'rgba(255,255,255,0.15)',
                      transition: 'all 0.25s',
                    }} />
                    <span style={{ fontFamily: DM, fontSize: 11, fontWeight: 300, color: sel ? color.replace('0.7', '0.95').replace('0.8', '1') : 'rgba(255,255,255,0.35)' }}>{label}</span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* Step 2 — Symptoms + sleep */}
        {step === 2 && (
          <>
            <h2 style={{ fontFamily: PF, fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Any symptoms & how did you sleep?
            </h2>
            <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.35)', margin: '0 0 22px' }}>
              Tap all that apply, or skip if none
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {SYMPTOM_CHIPS.map(({ label, dbKey }) => {
                const sel = symptoms.includes(dbKey)
                return (
                  <button key={dbKey} type="button" onClick={() => toggleSymptom(dbKey)}
                    style={{
                      padding: '8px 16px', borderRadius: 999,
                      background: sel ? 'rgba(139,109,181,0.14)' : 'rgba(255,255,255,0.03)',
                      border: sel ? '1px solid rgba(139,109,181,0.35)' : '1px solid rgba(255,255,255,0.07)',
                      color: sel ? 'rgba(196,184,224,0.9)' : 'rgba(255,255,255,0.38)',
                      fontFamily: DM, fontSize: 13, fontWeight: 300,
                      cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                    }}>
                    {label}
                  </button>
                )
              })}
            </div>

            {/* Sleep inline */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                <span style={{ fontFamily: DM, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.5)' }}>Sleep last night</span>
                <span style={{ fontFamily: PF, fontSize: 28, fontWeight: 300, color: 'rgba(196,184,224,0.88)', letterSpacing: '-0.02em' }}>{sleepHours}h</span>
              </div>
              <input
                type="range" min={0} max={12} step={0.5} value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                style={{ width: '100%', height: 4, accentColor: '#9b7cc8', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontFamily: DM, fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.2)' }}>0h</span>
                <span style={{ fontFamily: DM, fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.2)' }}>12h</span>
              </div>
            </div>
          </>
        )}

        {/* Step 3 — Optional note */}
        {step === 3 && (
          <>
            <h2 style={{ fontFamily: PF, fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Anything else on your mind?
            </h2>
            <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.35)', margin: '0 0 20px' }}>
              Optional — a quick note for yourself or your doctor
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. worse after bad night, work stress high this week..."
              maxLength={500}
              rows={4}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 14, padding: '14px 16px',
                fontFamily: DM, fontSize: 14, fontWeight: 300,
                color: 'rgba(255,255,255,0.72)',
                resize: 'none', outline: 'none',
                lineHeight: 1.6,
              }}
            />
            <p style={{ fontFamily: DM, fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.2)', margin: '8px 0 0', textAlign: 'right' }}>
              {note.length}/500
            </p>
          </>
        )}
      </div>

      {error && (
        <div style={{ marginTop: 10, background: 'rgba(217,95,95,0.07)', border: '1px solid rgba(217,95,95,0.22)', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 300, color: 'rgba(232,160,160,0.9)', fontFamily: DM }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        {step < TOTAL_STEPS ? (
          <>
            <button type="button" onClick={goNext}
              disabled={step === 1 && !mood}
              className="btn-primary"
              style={{ width: '100%', height: 52, fontSize: 14, opacity: (step === 1 && !mood) ? 0.35 : 1, cursor: (step === 1 && !mood) ? 'not-allowed' : 'pointer' }}>
              Continue
            </button>
            {step === 2 && (
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <button type="button" onClick={goNext} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.28)', fontFamily: DM, fontSize: 12, fontWeight: 300, cursor: 'pointer' }}>
                  Skip note
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <button type="button" onClick={handleSubmit} disabled={saving}
              className="btn-primary"
              style={{ width: '100%', height: 52, fontSize: 14, opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving…' : 'Save check-in'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <button type="button" onClick={handleSubmit} disabled={saving} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.28)', fontFamily: DM, fontSize: 12, fontWeight: 300, cursor: 'pointer' }}>
                Save without note
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
