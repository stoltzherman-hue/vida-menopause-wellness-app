'use client'
import { useState, useEffect, useRef } from 'react'

const STEPS = [
  {
    icon: '🌡️',
    title: 'Acknowledge it',
    color: '#e07a5f',
    bg: 'rgba(224,122,95,0.08)',
    border: 'rgba(224,122,95,0.2)',
    content: (
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 16, color: '#5a4a42', lineHeight: 1.75, marginBottom: 20 }}>
          A hot flush is real, physical, and temporary. Most last <strong>1–5 minutes</strong>.
          Your hypothalamus is misfiring — it&apos;s not dangerous.
        </p>
        <div style={{
          background: 'rgba(224,122,95,0.08)', border: '1px solid rgba(224,122,95,0.18)',
          borderRadius: 16, padding: '16px 20px', textAlign: 'left',
        }}>
          <p style={{ fontSize: 14, color: '#8a7a72', lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: '#e07a5f' }}>Right now:</strong> Say to yourself —
            &ldquo;This will pass. I am safe. This is my body, and I can handle this.&rdquo;
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: '💨',
    title: 'Pace your breathing',
    color: '#2d8b7a',
    bg: 'rgba(45,139,122,0.08)',
    border: 'rgba(45,139,122,0.2)',
    content: <PacedBreathing />,
  },
  {
    icon: '❄️',
    title: 'Cool your body',
    color: '#9b8ab8',
    bg: 'rgba(155,138,184,0.08)',
    border: 'rgba(155,138,184,0.2)',
    content: (
      <div>
        <p style={{ fontSize: 15, color: '#6a5a6a', lineHeight: 1.75, marginBottom: 20 }}>
          While breathing, try one or more of these:
        </p>
        {[
          { icon: '🧊', tip: 'Press a cold wrist against your pulse point or the back of your neck' },
          { icon: '🌊', tip: 'Visualise cool water — a stream, the sea, rain on your face' },
          { icon: '💨', tip: 'If possible, open a window or turn on a fan' },
          { icon: '💧', tip: 'Sip cold water slowly' },
        ].map(({ icon, tip }) => (
          <div key={tip} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14,
            background: 'rgba(155,138,184,0.06)', borderRadius: 14, padding: '12px 14px',
          }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
            <p style={{ fontSize: 14, color: '#5a4a5a', lineHeight: 1.6, margin: 0 }}>{tip}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: '📝',
    title: 'Log this one',
    color: '#c47a5a',
    bg: 'rgba(196,122,90,0.08)',
    border: 'rgba(196,122,90,0.2)',
    content: <FlushLogger />,
  },
]

function PacedBreathing() {
  const [phase, setPhase] = useState<'inhale' | 'exhale' | 'idle'>('idle')
  const [started, setStarted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function runCycle() {
    setPhase('inhale')
    timerRef.current = setTimeout(() => {
      setPhase('exhale')
      timerRef.current = setTimeout(runCycle, 5000)
    }, 5000)
  }

  function start() {
    setStarted(true)
    runCycle()
  }

  function stop() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setStarted(false)
    setPhase('idle')
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const isInhale = phase === 'inhale'

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 14, color: '#6a5a6a', lineHeight: 1.7, marginBottom: 24 }}>
        Slow, paced breathing — 5 seconds in, 5 seconds out — reduces hot flush severity
        and interrupts the fight-or-flight response.
      </p>
      <div style={{
        position: 'relative', width: 140, height: 140, margin: '0 auto 24px',
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: isInhale ? 'rgba(45,139,122,0.15)' : 'rgba(196,149,158,0.12)',
          transform: `scale(${!started ? 0.7 : isInhale ? 1 : 0.5})`,
          transition: `transform ${started ? 5 : 0.4}s cubic-bezier(0.45, 0, 0.55, 1), background 0.5s`,
          border: `2px solid ${isInhale ? 'rgba(45,139,122,0.35)' : 'rgba(196,149,158,0.3)'}`,
        }} />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 16, fontWeight: 700,
            color: started ? (isInhale ? '#2d8b7a' : '#c4959e') : '#b8a9a0',
          }}>
            {!started ? 'Ready' : isInhale ? 'In...' : 'Out...'}
          </span>
        </div>
      </div>

      {!started ? (
        <button onClick={start} style={{
          padding: '13px 36px', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #2d8b7a, #1e6b55)',
          color: 'white', fontSize: 15, fontWeight: 700,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        }}>
          Start paced breathing
        </button>
      ) : (
        <button onClick={stop} style={{
          padding: '11px 28px', borderRadius: 14, border: '1.5px solid rgba(196,149,158,0.35)',
          cursor: 'pointer', background: 'rgba(196,149,158,0.08)',
          color: '#c4959e', fontSize: 14, fontWeight: 600,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        }}>
          Stop
        </button>
      )}
    </div>
  )
}

function FlushLogger() {
  const [intensity, setIntensity] = useState<number | null>(null)
  const [duration, setDuration] = useState<string>('')
  const [logged, setLogged] = useState(false)

  function log() {
    // In a real app this would call a server action to record in daily_checkins
    setLogged(true)
  }

  if (logged) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 18, fontWeight: 700, color: '#1a1220', marginBottom: 8 }}>
          Logged
        </p>
        <p style={{ fontSize: 14, color: '#8a7a72', lineHeight: 1.6 }}>
          This goes towards your pattern data. Over time you&apos;ll see what triggers your flushes and how their intensity changes.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p style={{ fontSize: 14, color: '#6a5a6a', lineHeight: 1.7, marginBottom: 24 }}>
        Logging this flush adds to your pattern data — over time, you&apos;ll see correlations with sleep, stress, diet, and your cycle.
      </p>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#6a5a6a', marginBottom: 10 }}>Intensity (1–5):</p>
        <div style={{ display: 'flex', gap: 10 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setIntensity(n)} style={{
              width: 44, height: 44, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: intensity === n ? '#c47a5a' : 'rgba(237,224,216,0.5)',
              color: intensity === n ? 'white' : '#8a7a72',
              fontSize: 16, fontWeight: 700, transition: 'all 0.15s',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#6a5a6a', marginBottom: 10 }}>Approximate duration:</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Under 1 min', '1–2 min', '2–5 min', '5+ min'].map((d) => (
            <button key={d} onClick={() => setDuration(d)} style={{
              padding: '8px 16px', borderRadius: 9999, border: 'none', cursor: 'pointer',
              background: duration === d ? '#c47a5a' : 'rgba(237,224,216,0.5)',
              color: duration === d ? 'white' : '#8a7a72',
              fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <button onClick={log} disabled={!intensity && !duration} style={{
        width: '100%', padding: '14px 24px', borderRadius: 14, border: 'none',
        cursor: intensity || duration ? 'pointer' : 'not-allowed',
        background: intensity || duration
          ? 'linear-gradient(135deg, #c47a5a, #a8603a)'
          : 'rgba(237,224,216,0.5)',
        color: intensity || duration ? 'white' : '#b8a9a0',
        fontSize: 15, fontWeight: 700,
        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        transition: 'all 0.2s',
      }}>
        Log this flush
      </button>
    </div>
  )
}

export function HotFlushGuide() {
  const [step, setStep] = useState(0)

  const current = STEPS[step]

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(224,122,95,0.12), rgba(196,122,90,0.08))',
        border: '1.5px solid rgba(224,122,95,0.2)',
        borderRadius: 20, padding: '16px 20px', marginBottom: 28,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(224,122,95,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: 20 }}>🌡️</span>
        </div>
        <div>
          <p style={{ fontWeight: 700, color: '#c47a5a', fontSize: 14, margin: 0 }}>Hot flush support</p>
          <p style={{ fontSize: 12, color: '#b8a9a0', margin: '2px 0 0' }}>Follow the steps — it will pass</p>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, padding: '10px 4px',
            borderRadius: 12, border: 'none', cursor: 'pointer',
            background: i === step ? s.color : i < step ? 'rgba(45,139,122,0.15)' : 'rgba(237,224,216,0.4)',
            transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 16, display: 'block', marginBottom: 3 }}>{s.icon}</span>
            <span style={{
              fontSize: 10, fontWeight: 600, display: 'block', lineHeight: 1.2,
              color: i === step ? 'white' : i < step ? '#2d8b7a' : '#b8a9a0',
            }}>
              {s.title}
            </span>
          </button>
        ))}
      </div>

      {/* Current step */}
      <div key={step} className="step-enter" style={{
        background: current.bg, border: `1.5px solid ${current.border}`,
        borderRadius: 24, padding: '28px 24px', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <span style={{ fontSize: 32 }}>{current.icon}</span>
          <h3 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 20, fontWeight: 700, color: current.color, margin: 0,
          }}>
            {current.title}
          </h3>
        </div>
        {current.content}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 12 }}>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} style={{
            padding: '12px 20px', borderRadius: 14, border: '1.5px solid rgba(237,224,216,0.7)',
            cursor: 'pointer', background: 'white', color: '#8a7a72',
            fontSize: 14, fontWeight: 600,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>
            Back
          </button>
        )}
        {step < STEPS.length - 1 && (
          <button onClick={() => setStep(step + 1)} style={{
            flex: 1, padding: '14px 24px', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${current.color}, ${current.color}cc)`,
            color: 'white', fontSize: 15, fontWeight: 700,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            boxShadow: `0 4px 16px ${current.color}30`,
          }}>
            Next step →
          </button>
        )}
      </div>
    </div>
  )
}
