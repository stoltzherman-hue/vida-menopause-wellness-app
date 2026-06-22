'use client'
import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'

// ── Data ────────────────────────────────────────────────────────────────────
const MOOD_OPTIONS = [
  { value: 1, emoji: '😞', label: 'Rough' },
  { value: 2, emoji: '😔', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
]

const SYMPTOM_CHIPS = [
  { label: 'Hot flushes',  emoji: '🔥', selectedBg: 'rgba(196,122,90,0.12)',   selectedBorder: 'rgba(196,122,90,0.4)',   selectedColor: '#c47a5a', dbKey: 'Hot flushes' },
  { label: 'Night sweats', emoji: '🌙', selectedBg: 'rgba(196,149,158,0.12)',  selectedBorder: 'rgba(196,149,158,0.4)',  selectedColor: '#c4959e', dbKey: 'Night sweats' },
  { label: 'Brain fog',    emoji: '🧠', selectedBg: 'rgba(155,138,184,0.12)',  selectedBorder: 'rgba(155,138,184,0.4)',  selectedColor: '#9b8ab8', dbKey: 'Brain fog' },
  { label: 'Fatigue',      emoji: '🥱', selectedBg: 'rgba(196,122,90,0.12)',   selectedBorder: 'rgba(196,122,90,0.4)',   selectedColor: '#c47a5a', dbKey: 'Fatigue' },
  { label: 'Low mood',     emoji: '💛', selectedBg: 'rgba(155,138,184,0.12)',  selectedBorder: 'rgba(155,138,184,0.4)',  selectedColor: '#9b8ab8', dbKey: 'Low mood' },
  { label: 'Anxiety',      emoji: '🌊', selectedBg: 'rgba(155,138,184,0.12)',  selectedBorder: 'rgba(155,138,184,0.4)',  selectedColor: '#9b8ab8', dbKey: 'Anxiety' },
  { label: 'Joint pain',   emoji: '🦴', selectedBg: 'rgba(196,122,90,0.12)',   selectedBorder: 'rgba(196,122,90,0.4)',   selectedColor: '#c47a5a', dbKey: 'Joint pain' },
  { label: 'Insomnia',     emoji: '😴', selectedBg: 'rgba(45,139,122,0.12)',   selectedBorder: 'rgba(45,139,122,0.4)',   selectedColor: '#2d8b7a', dbKey: 'Insomnia' },
]

const TOTAL_STEPS = 4

// ── Shared style tokens ──────────────────────────────────────────────────────
const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PF = 'var(--font-playfair), Georgia, serif'

// ── Main component ───────────────────────────────────────────────────────────
export function CheckInForm() {
  const [step, setStep]           = useState(1)
  const [mood, setMood]           = useState<number | null>(null)
  const [symptoms, setSymptoms]   = useState<string[]>([])
  const [sleepHours, setSleepHours] = useState(7)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const stepRef = useRef<HTMLDivElement>(null)

  function animateStep(dir: 'forward' | 'back') {
    requestAnimationFrame(() => {
      if (!stepRef.current) return
      const cls = dir === 'forward' ? 'step-enter' : 'step-enter-back'
      stepRef.current.classList.remove('step-enter', 'step-enter-back')
      void stepRef.current.offsetWidth
      stepRef.current.classList.add(cls)
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
    const otherSymptomTriggers = symptoms
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
          triggers: otherSymptomTriggers,
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

  // ── Glass card style ────────────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.50)',
    border: '1.5px solid rgba(255,255,255,0.80)',
    backdropFilter: 'blur(22px) saturate(160%)',
    WebkitBackdropFilter: 'blur(22px) saturate(160%)',
    boxShadow: '0 4px 28px rgba(61,44,53,0.07), 0 1px 0 rgba(255,255,255,0.95) inset',
    borderRadius: 22,
    padding: '30px 26px',
  }

  const progressPct = `${(step / TOTAL_STEPS) * 100}%`

  // ── Step 4 / Complete ───────────────────────────────────────────────────────
  if (saved) {
    const chosenMood = MOOD_OPTIONS.find((m) => m.value === mood)
    const summaryChips: { label: string; color: string; bg: string; border: string }[] = []
    if (chosenMood) summaryChips.push({ label: `${chosenMood.emoji} ${chosenMood.label}`, color: '#2d8b7a', bg: 'rgba(45,139,122,0.1)', border: 'rgba(45,139,122,0.3)' })
    symptoms.forEach((s) => {
      const chip = SYMPTOM_CHIPS.find((c) => c.dbKey === s)
      if (chip) summaryChips.push({ label: `${chip.emoji} ${chip.label}`, color: chip.selectedColor, bg: chip.selectedBg, border: chip.selectedBorder })
    })
    summaryChips.push({ label: `🌙 ${sleepHours}h sleep`, color: '#c4959e', bg: 'rgba(196,149,158,0.12)', border: 'rgba(196,149,158,0.4)' })

    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px', animation: 'screen-in 0.45s cubic-bezier(0.22,1,0.36,1)' }}>
        {/* Progress bar — full */}
        <div style={{ width: '100%', height: 3, background: 'rgba(237,224,216,0.5)', borderRadius: 999, marginBottom: 24 }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,#2d8b7a,#6b9e80)', transition: 'width 0.4s ease' }} />
        </div>

        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16, lineHeight: 1 }}>✨</div>
          <h2 style={{ fontFamily: PF, fontSize: 26, fontWeight: 700, color: '#1e3d35', margin: '0 0 10px' }}>
            Check-in complete!
          </h2>
          <p style={{ fontFamily: DM, fontSize: 15, color: '#8a7a72', margin: '0 0 24px', lineHeight: 1.6 }}>
            Great job tracking today — every entry helps reveal patterns
          </p>

          {/* Summary chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
            {summaryChips.map((chip) => (
              <span key={chip.label} style={{
                padding: '6px 14px', borderRadius: 999,
                background: chip.bg, border: `1px solid ${chip.border}`,
                color: chip.color, fontFamily: DM, fontSize: 13, fontWeight: 500,
              }}>{chip.label}</span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' }}>
            <Link href="/dashboard" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: 52, borderRadius: 999, border: 'none',
              background: 'linear-gradient(90deg,#2d8b7a,#1e6b55)',
              color: 'white', fontFamily: DM, fontSize: 15, fontWeight: 600,
              textDecoration: 'none', boxShadow: '0 6px 24px rgba(45,139,122,0.32)',
            }}>Back to dashboard</Link>
            <Link href="/insights" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: 48, borderRadius: 999,
              background: 'transparent', border: '1.5px solid rgba(45,139,122,0.35)',
              color: '#2d8b7a', fontFamily: DM, fontSize: 14, fontWeight: 600,
              textDecoration: 'none',
            }}>View my insights →</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px', animation: 'screen-in 0.45s cubic-bezier(0.22,1,0.36,1)' }}>

      {/* Progress bar */}
      <div style={{ width: '100%', height: 3, background: 'rgba(237,224,216,0.5)', borderRadius: 999, marginBottom: 20 }}>
        <div style={{ width: progressPct, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,#2d8b7a,#6b9e80)', transition: 'width 0.4s ease' }} />
      </div>

      {/* Step eyebrow + back button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, minHeight: 24 }}>
        <span style={{ fontFamily: DM, fontSize: 10, fontWeight: 700, color: '#2d8b7a', textTransform: 'uppercase', letterSpacing: '0.11em' }}>
          Step {step} of {TOTAL_STEPS}
        </span>
        {step > 1 && (
          <button type="button" onClick={goBack} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: DM, fontSize: 13, fontWeight: 500, color: '#8a7a72',
            padding: '4px 8px',
          }}>← Back</button>
        )}
      </div>

      {/* Step card */}
      <div ref={stepRef} style={cardStyle}>

        {/* ── Step 1 — Mood ────────────────────────────────────────────────── */}
        {step === 1 && (
          <>
            <h2 style={{ fontFamily: PF, fontSize: 22, fontWeight: 700, color: '#1a1220', margin: '0 0 6px' }}>
              How are you feeling today?
            </h2>
            <p style={{ fontFamily: DM, fontSize: 14, color: '#8a7a72', margin: '0 0 24px', lineHeight: 1.55 }}>
              Your mood shapes your whole wellness picture
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              {MOOD_OPTIONS.map(({ value, emoji, label }) => {
                const sel = mood === value
                return (
                  <button key={value} type="button" onClick={() => setMood(sel ? null : value)}
                    style={{
                      width: 70, display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '16px 8px', borderRadius: 16,
                      background: sel ? 'rgba(45,139,122,0.10)' : 'white',
                      border: sel ? '2px solid #2d8b7a' : '1.5px solid rgba(237,224,216,0.8)',
                      boxShadow: sel ? '0 0 0 4px rgba(45,139,122,0.10)' : 'none',
                      transform: sel ? 'scale(1.06)' : 'scale(1)',
                      transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                      cursor: 'pointer', gap: 8,
                    }}>
                    <span style={{ fontSize: 28, lineHeight: 1 }}>{emoji}</span>
                    <span style={{ fontFamily: DM, fontSize: 11, fontWeight: 500, color: '#8a7a72' }}>{label}</span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* ── Step 2 — Symptoms ────────────────────────────────────────────── */}
        {step === 2 && (
          <>
            <h2 style={{ fontFamily: PF, fontSize: 22, fontWeight: 700, color: '#1a1220', margin: '0 0 6px' }}>
              Any symptoms today?
            </h2>
            <p style={{ fontFamily: DM, fontSize: 14, color: '#8a7a72', margin: '0 0 24px', lineHeight: 1.55 }}>
              Select all that apply — or skip if none
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {SYMPTOM_CHIPS.map(({ label, emoji, selectedBg, selectedBorder, selectedColor, dbKey }) => {
                const sel = symptoms.includes(dbKey)
                return (
                  <button key={dbKey} type="button" onClick={() => toggleSymptom(dbKey)}
                    style={{
                      padding: '8px 16px', borderRadius: 999,
                      background: sel ? selectedBg : 'white',
                      border: sel ? `1px solid ${selectedBorder}` : '1px solid rgba(237,224,216,0.8)',
                      color: sel ? selectedColor : '#3d2c35',
                      fontFamily: DM, fontSize: 14, fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                    }}>
                    {emoji} {label}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* ── Step 3 — Sleep ───────────────────────────────────────────────── */}
        {step === 3 && (
          <>
            <h2 style={{ fontFamily: PF, fontSize: 22, fontWeight: 700, color: '#1a1220', margin: '0 0 24px' }}>
              How did you sleep?
            </h2>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: PF, fontSize: 56, fontWeight: 700, color: '#2d8b7a', lineHeight: 1 }}>
                {sleepHours}h
              </span>
            </div>
            <input
              type="range" min={0} max={12} step={0.5} value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              style={{ width: '100%', height: 6, accentColor: '#2d8b7a', cursor: 'pointer', marginBottom: 8 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: DM, fontSize: 12, color: '#8a7a72' }}>0h</span>
              <span style={{ fontFamily: DM, fontSize: 12, color: '#8a7a72' }}>12h</span>
            </div>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginTop: 10, background: 'rgba(201,82,82,0.07)', border: '1px solid rgba(201,82,82,0.22)', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#c0392b', fontFamily: DM }}>
          {error}
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{ marginTop: 14 }}>
        {step < TOTAL_STEPS ? (
          <>
            <button type="button" onClick={goNext} disabled={step === 1 && !mood}
              style={{
                width: '100%', height: 52, borderRadius: 999, border: 'none',
                background: (step === 1 && !mood)
                  ? 'rgba(196,181,174,0.5)'
                  : 'linear-gradient(90deg,#2d8b7a,#1e6b55)',
                color: 'white', fontFamily: DM, fontSize: 15, fontWeight: 600,
                cursor: (step === 1 && !mood) ? 'not-allowed' : 'pointer',
                boxShadow: (step === 1 && !mood) ? 'none' : '0 6px 24px rgba(45,139,122,0.32)',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}>
              Continue →
            </button>
            {step === 2 && (
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <button type="button" onClick={goNext} style={{ background: 'none', border: 'none', color: '#8a7a72', fontFamily: DM, fontSize: 13, cursor: 'pointer' }}>
                  Skip →
                </button>
              </div>
            )}
          </>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={saving}
            style={{
              width: '100%', height: 52, borderRadius: 999, border: 'none',
              background: 'linear-gradient(90deg,#2d8b7a,#1e6b55)',
              color: 'white', fontFamily: DM, fontSize: 15, fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              boxShadow: '0 6px 24px rgba(45,139,122,0.32)',
              transition: 'opacity 0.2s',
            }}>
            {saving ? 'Saving…' : 'Save check-in 🌿'}
          </button>
        )}
      </div>
    </div>
  )
}
