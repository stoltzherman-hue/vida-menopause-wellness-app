'use client'
import { useState, useEffect, useRef } from 'react'

const TECHNIQUES = {
  '478': {
    name: '4-7-8 Breathing',
    desc: 'Inhale 4s · Hold 7s · Exhale 8s — shown to calm the nervous system and reduce hot flush intensity',
    phases: [
      { label: 'Breathe in', sub: 'slowly through your nose', seconds: 4, color: '#2d8b7a', bg: 'rgba(45,139,122,0.12)', scale: 1 },
      { label: 'Hold', sub: 'gently — no strain', seconds: 7, color: '#9b8ab8', bg: 'rgba(155,138,184,0.12)', scale: 1 },
      { label: 'Breathe out', sub: 'slowly through your mouth', seconds: 8, color: '#c4959e', bg: 'rgba(196,149,158,0.12)', scale: 0.32 },
    ],
  },
  box: {
    name: 'Box Breathing',
    desc: 'Equal 4s counts — used by athletes and therapists to reset during stress and anxiety',
    phases: [
      { label: 'Breathe in', sub: 'through your nose', seconds: 4, color: '#2d8b7a', bg: 'rgba(45,139,122,0.12)', scale: 1 },
      { label: 'Hold', sub: 'lungs full', seconds: 4, color: '#9b8ab8', bg: 'rgba(155,138,184,0.12)', scale: 1 },
      { label: 'Breathe out', sub: 'through your mouth', seconds: 4, color: '#c4959e', bg: 'rgba(196,149,158,0.12)', scale: 0.32 },
      { label: 'Hold', sub: 'lungs empty', seconds: 4, color: '#c9a96e', bg: 'rgba(201,169,110,0.12)', scale: 0.32 },
    ],
  },
  calm: {
    name: 'Calm Breathing',
    desc: 'Simple 5-5 rhythm — effective for hot flush onset and general anxiety relief',
    phases: [
      { label: 'Breathe in', sub: 'gently through your nose', seconds: 5, color: '#2d8b7a', bg: 'rgba(45,139,122,0.12)', scale: 1 },
      { label: 'Breathe out', sub: 'slowly through your mouth', seconds: 5, color: '#c4959e', bg: 'rgba(196,149,158,0.12)', scale: 0.32 },
    ],
  },
} as const

type TechKey = keyof typeof TECHNIQUES

export function BreathingExercise() {
  const [tech, setTech] = useState<TechKey>('478')
  const [running, setRunning] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [cycles, setCycles] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const techniqueRef = useRef(tech)
  const phaseIdxRef = useRef(0)
  const secondsLeftRef = useRef(0)
  const cyclesRef = useRef(0)

  const technique = TECHNIQUES[tech]
  const currentPhase = technique.phases[phaseIdx]

  function start() {
    const phases = TECHNIQUES[techniqueRef.current].phases
    phaseIdxRef.current = 0
    secondsLeftRef.current = phases[0].seconds
    cyclesRef.current = 0
    setPhaseIdx(0)
    setSecondsLeft(phases[0].seconds)
    setCycles(0)
    setRunning(true)
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setRunning(false)
    setPhaseIdx(0)
    setCycles(0)
  }

  function changeTech(t: TechKey) {
    stop()
    setTech(t)
    techniqueRef.current = t
  }

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      secondsLeftRef.current -= 1
      const phases = TECHNIQUES[techniqueRef.current].phases
      if (secondsLeftRef.current <= 0) {
        const nextIdx = (phaseIdxRef.current + 1) % phases.length
        if (nextIdx === 0) {
          cyclesRef.current += 1
          setCycles(cyclesRef.current)
        }
        phaseIdxRef.current = nextIdx
        secondsLeftRef.current = phases[nextIdx].seconds
        setPhaseIdx(nextIdx)
      }
      setSecondsLeft(secondsLeftRef.current)
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const phaseDuration = currentPhase.seconds
  const progress = running ? ((phaseDuration - secondsLeft) / phaseDuration) * 100 : 0

  const circleSize = 200
  const strokeW = 8
  const r = (circleSize - strokeW) / 2
  const circ = 2 * Math.PI * r
  const ringOffset = circ - (progress / 100) * circ

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }}>
      {/* Technique selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {(Object.keys(TECHNIQUES) as TechKey[]).map((k) => (
          <button key={k} onClick={() => changeTech(k)} style={{
            padding: '9px 18px', borderRadius: 9999, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, transition: 'all 0.18s',
            background: tech === k ? '#1a1220' : 'rgba(237,224,216,0.55)',
            color: tech === k ? 'white' : '#6a5a6a',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>
            {TECHNIQUES[k].name}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 14, color: '#8a7a72', lineHeight: 1.65, marginBottom: 36 }}>
        {technique.desc}
      </p>

      {/* Breathing circle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}>
        <div style={{ position: 'relative', width: circleSize, height: circleSize, marginBottom: 28 }}>
          {/* Outer pulse ring */}
          {running && (
            <div style={{
              position: 'absolute', inset: -20,
              borderRadius: '50%',
              background: `${currentPhase.color}08`,
              animation: 'breathePulse 3s ease-in-out infinite',
            }} />
          )}

          {/* Progress SVG ring */}
          <svg width={circleSize} height={circleSize} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
            <circle cx={circleSize / 2} cy={circleSize / 2} r={r}
              fill="none" stroke="rgba(237,224,216,0.4)" strokeWidth={strokeW} />
            <circle cx={circleSize / 2} cy={circleSize / 2} r={r}
              fill="none" stroke={currentPhase.color} strokeWidth={strokeW}
              strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={ringOffset}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
            />
          </svg>

          {/* Inner circle */}
          <div style={{
            position: 'absolute', inset: 20,
            borderRadius: '50%',
            background: running ? currentPhase.bg : 'rgba(237,224,216,0.25)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            transition: `background 0.5s, transform ${phaseDuration}s cubic-bezier(0.45, 0, 0.55, 1)`,
            transform: running ? `scale(${currentPhase.scale === 1 ? 1 : 0.85})` : 'scale(1)',
          }}>
            {running ? (
              <>
                <span style={{ fontSize: 28, fontWeight: 800, color: currentPhase.color, fontFamily: 'var(--font-playfair), Georgia, serif', lineHeight: 1 }}>
                  {secondsLeft}
                </span>
                <span style={{ fontSize: 11, color: currentPhase.color, fontWeight: 600, marginTop: 3 }}>seconds</span>
              </>
            ) : (
              <span style={{ fontSize: 32 }}>🌿</span>
            )}
          </div>
        </div>

        {/* Phase label */}
        <div style={{
          textAlign: 'center', minHeight: 60,
          background: running ? currentPhase.bg : 'transparent',
          borderRadius: 18, padding: running ? '16px 28px' : '0',
          transition: 'all 0.4s',
        }}>
          {running ? (
            <>
              <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 22, fontWeight: 700, color: currentPhase.color, margin: 0, lineHeight: 1.2 }}>
                {currentPhase.label}
              </p>
              <p style={{ fontSize: 13, color: currentPhase.color, opacity: 0.75, margin: '4px 0 0' }}>
                {currentPhase.sub}
              </p>
            </>
          ) : (
            <p style={{ fontSize: 14, color: '#b8a9a0', fontStyle: 'italic' }}>Ready when you are</p>
          )}
        </div>
      </div>

      {/* Cycle count */}
      {running && cycles > 0 && (
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{
            fontSize: 12, fontWeight: 600, color: '#2d8b7a',
            background: 'rgba(45,139,122,0.09)', border: '1px solid rgba(45,139,122,0.2)',
            borderRadius: 9999, padding: '5px 14px',
          }}>
            {cycles} {cycles === 1 ? 'cycle' : 'cycles'} complete
          </span>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        {!running ? (
          <button onClick={start} style={{
            padding: '16px 44px', borderRadius: 16, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #2d8b7a, #1e6b55)',
            color: 'white', fontSize: 16, fontWeight: 700,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            boxShadow: '0 6px 24px rgba(45,139,122,0.35)',
          }}>
            Begin
          </button>
        ) : (
          <button onClick={stop} style={{
            padding: '14px 36px', borderRadius: 16, border: '1.5px solid rgba(196,149,158,0.4)',
            cursor: 'pointer', background: 'rgba(196,149,158,0.08)',
            color: '#c4959e', fontSize: 15, fontWeight: 600,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>
            Stop
          </button>
        )}
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#c4b5ae', marginTop: 28, lineHeight: 1.6 }}>
        Aim for 3–5 cycles · Find a quiet moment and a comfortable seat
      </p>
    </div>
  )
}
