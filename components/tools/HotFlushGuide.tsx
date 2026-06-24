'use client'
import { useState, useEffect, useRef } from 'react'

const STEPS = [
  {
    title: 'Acknowledge it',
    color: '#e07a5f',
    bg: 'rgba(224,122,95,0.06)',
    border: 'rgba(224,122,95,0.15)',
    content: (
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 20 }}>
          A hot flush is real, physical, and temporary. Most last <strong>1–5 minutes</strong>.
          Your hypothalamus is misfiring — it&apos;s not dangerous.
        </p>
        <div style={{
          background: 'rgba(224,122,95,0.06)', border: '1px solid rgba(224,122,95,0.15)',
          borderRadius: 16, padding: '16px 20px', textAlign: 'left',
        }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: '#e07a5f' }}>Right now:</strong> Say to yourself —
            &ldquo;This will pass. I am safe. This is my body, and I can handle this.&rdquo;
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'Pace your breathing',
    color: '#9b7cc8',
    bg: 'rgba(155,124,200,0.06)',
    border: 'rgba(155,124,200,0.15)',
    content: <PacedBreathing />,
  },
  {
    title: 'Cool your body',
    color: '#c4b8e0',
    bg: 'rgba(196,184,224,0.06)',
    border: 'rgba(196,184,224,0.15)',
    content: (
      <div>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 20 }}>
          While breathing, try one or more of these:
        </p>
        {[
          { tip: 'Press a cold wrist against your pulse point or the back of your neck' },
          { tip: 'Visualise cool water — a stream, the sea, rain on your face' },
          { tip: 'If possible, open a window or turn on a fan' },
          { tip: 'Sip cold water slowly' },
        ].map(({ tip }) => (
          <div key={tip} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14,
            background: 'rgba(196,184,224,0.05)', borderRadius: 14, padding: '12px 14px',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 4, background: '#c4b8e0' }} />
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, margin: 0 }}>{tip}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Log this one',
    color: '#9b7cc8',
    bg: 'rgba(155,124,200,0.06)',
    border: 'rgba(155,124,200,0.15)',
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
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 24 }}>
        Slow, paced breathing — 5 seconds in, 5 seconds out — reduces hot flush severity
        and interrupts the fight-or-flight response.
      </p>
      <div style={{
        position: 'relative', width: 140, height: 140, margin: '0 auto 24px',
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: isInhale ? 'rgba(155,124,200,0.15)' : 'rgba(196,184,224,0.10)',
          transform: `scale(${!started ? 0.7 : isInhale ? 1 : 0.5})`,
          transition: `transform ${started ? 5 : 0.4}s cubic-bezier(0.45, 0, 0.55, 1), background 0.5s`,
          border: `2px solid ${isInhale ? 'rgba(155,124,200,0.35)' : 'rgba(196,184,224,0.25)'}`,
        }} />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 16, fontWeight: 300,
            color: started ? (isInhale ? '#9b7cc8' : '#c4b8e0') : 'rgba(255,255,255,0.32)',
          }}>
            {!started ? 'Ready' : isInhale ? 'In...' : 'Out...'}
          </span>
        </div>
      </div>

      {!started ? (
        <button onClick={start} style={{
          padding: '13px 36px', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)',
          color: 'white', fontSize: 15, fontWeight: 300,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        }}>
          Start paced breathing
        </button>
      ) : (
        <button onClick={stop} style={{
          padding: '11px 28px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.09)',
          cursor: 'pointer', background: 'rgba(255,255,255,0.05)',
          color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: 300,
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
        <div style={{
          width: 48, height: 48, borderRadius: '50%', margin: '0 auto 16px',
          background: 'rgba(155,124,200,0.2)', border: '1px solid rgba(155,124,200,0.4)',
        }} />
        <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.88)', marginBottom: 8 }}>
          Logged
        </p>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
          This goes towards your pattern data. Over time you&apos;ll see what triggers your flushes and how their intensity changes.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 24 }}>
        Logging this flush adds to your pattern data — over time, you&apos;ll see correlations with sleep, stress, diet, and your cycle.
      </p>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>Intensity (1–5):</p>
        <div style={{ display: 'flex', gap: 10 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setIntensity(n)} style={{
              width: 44, height: 44, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: intensity === n ? 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)' : 'rgba(255,255,255,0.06)',
              color: intensity === n ? 'white' : 'rgba(255,255,255,0.55)',
              fontSize: 16, fontWeight: 300, transition: 'all 0.15s',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>Approximate duration:</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Under 1 min', '1–2 min', '2–5 min', '5+ min'].map((d) => (
            <button key={d} onClick={() => setDuration(d)} style={{
              padding: '8px 16px', borderRadius: 9999, border: 'none', cursor: 'pointer',
              background: duration === d ? 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)' : 'rgba(255,255,255,0.06)',
              color: duration === d ? 'white' : 'rgba(255,255,255,0.55)',
              fontSize: 13, fontWeight: 300, transition: 'all 0.15s',
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
          ? 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)'
          : 'rgba(255,255,255,0.05)',
        color: intensity || duration ? 'white' : 'rgba(255,255,255,0.32)',
        fontSize: 15, fontWeight: 300,
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
        background: 'rgba(224,122,95,0.06)',
        border: '1px solid rgba(224,122,95,0.15)',
        borderRadius: 20, padding: '16px 20px', marginBottom: 28,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(224,122,95,0.12)',
          border: '1px solid rgba(224,122,95,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#e07a5f' }} />
        </div>
        <div>
          <p style={{ fontWeight: 300, color: '#e07a5f', fontSize: 14, margin: 0 }}>Hot flush support</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', margin: '2px 0 0' }}>Follow the steps — it will pass</p>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, padding: '10px 4px',
            borderRadius: 12, border: 'none', cursor: 'pointer',
            background: i === step ? s.color : i < step ? 'rgba(155,124,200,0.15)' : 'rgba(255,255,255,0.06)',
            transition: 'all 0.2s',
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%', margin: '0 auto 4px',
              background: i === step ? 'rgba(255,255,255,0.8)' : i < step ? '#9b7cc8' : 'rgba(255,255,255,0.3)',
            }} />
            <span style={{
              fontSize: 10, fontWeight: 300, display: 'block', lineHeight: 1.2,
              color: i === step ? 'white' : i < step ? '#c4b8e0' : 'rgba(255,255,255,0.32)',
            }}>
              {s.title}
            </span>
          </button>
        ))}
      </div>

      {/* Current step */}
      <div key={step} className="step-enter" style={{
        background: current.bg, border: `1px solid ${current.border}`,
        borderRadius: 24, padding: '28px 24px', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9999, flexShrink: 0, background: `rgba(155,124,200,0.2)`, border: `1px solid ${current.border}` }} />
          <h3 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 20, fontWeight: 300, color: current.color, margin: 0,
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
            padding: '12px 20px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.09)',
            cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)',
            fontSize: 14, fontWeight: 300,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>
            Back
          </button>
        )}
        {step < STEPS.length - 1 && (
          <button onClick={() => setStep(step + 1)} style={{
            flex: 1, padding: '14px 24px', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)`,
            color: 'white', fontSize: 15, fontWeight: 300,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            boxShadow: `0 4px 16px rgba(155,124,200,0.30)`,
          }}>
            Next step →
          </button>
        )}
      </div>
    </div>
  )
}
