'use client'
import { useState } from 'react'

const SENSES = [
  {
    number: 5,
    sense: 'SEE',
    icon: '👁️',
    color: '#2d8b7a',
    bg: 'rgba(45,139,122,0.08)',
    border: 'rgba(45,139,122,0.2)',
    prompt: 'Look around and name 5 things you can see.',
    examples: ['The pattern on the wall', 'Light through a window', 'Your hands', 'A plant', 'The colour of the floor'],
    question: 'What can you see right now?',
  },
  {
    number: 4,
    sense: 'TOUCH',
    icon: '🤲',
    color: '#c47a5a',
    bg: 'rgba(196,122,90,0.08)',
    border: 'rgba(196,122,90,0.2)',
    prompt: 'Notice 4 things you can physically feel.',
    examples: ['Your feet on the floor', 'The chair beneath you', 'The texture of your clothes', 'The air temperature'],
    question: 'What can you physically feel?',
  },
  {
    number: 3,
    sense: 'HEAR',
    icon: '👂',
    color: '#9b8ab8',
    bg: 'rgba(155,138,184,0.08)',
    border: 'rgba(155,138,184,0.2)',
    prompt: 'Listen carefully and identify 3 sounds.',
    examples: ['Traffic in the distance', 'Your own breathing', 'A clock ticking', 'Birds outside'],
    question: 'What sounds do you hear?',
  },
  {
    number: 2,
    sense: 'SMELL',
    icon: '👃',
    color: '#c4959e',
    bg: 'rgba(196,149,158,0.08)',
    border: 'rgba(196,149,158,0.2)',
    prompt: 'Notice 2 things you can smell — even faint ones.',
    examples: ['Fresh air', 'Coffee or tea nearby', 'Your own skin', 'Something from outside'],
    question: 'What can you smell?',
  },
  {
    number: 1,
    sense: 'TASTE',
    icon: '👅',
    color: '#c9a96e',
    bg: 'rgba(201,169,110,0.08)',
    border: 'rgba(201,169,110,0.2)',
    prompt: 'Notice 1 thing you can taste right now.',
    examples: ['The taste in your mouth', 'A lingering flavour', 'A sip of water'],
    question: 'What do you taste?',
  },
]

export function GroundingExercise() {
  const [step, setStep] = useState<'intro' | number | 'done'>('intro')
  const [notes, setNotes] = useState<Record<number, string>>({})

  const sense = typeof step === 'number' ? SENSES[step] : null

  function handleNote(idx: number, value: string) {
    setNotes((n) => ({ ...n, [idx]: value }))
  }

  if (step === 'intro') {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🌿</div>
        <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 700, color: '#1a1220', marginBottom: 14 }}>
          5-4-3-2-1 Grounding
        </h3>
        <p style={{ fontSize: 15, color: '#6a5a6a', lineHeight: 1.75, marginBottom: 12, maxWidth: 420, margin: '0 auto 16px' }}>
          This technique anchors you in the present moment by engaging all five senses. It interrupts the anxiety or overwhelm cycle and is particularly effective during or after hot flushes.
        </p>
        <p style={{ fontSize: 13, color: '#b8a9a0', marginBottom: 36, lineHeight: 1.6 }}>
          Takes 3–5 minutes · Find a comfortable spot
        </p>
        <button onClick={() => setStep(0)} style={{
          padding: '16px 48px', borderRadius: 16, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #2d8b7a, #1e6b55)',
          color: 'white', fontSize: 16, fontWeight: 700,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          boxShadow: '0 6px 24px rgba(45,139,122,0.32)',
        }}>
          Begin grounding
        </button>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>✨</div>
        <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 700, color: '#1a1220', marginBottom: 14 }}>
          You did it
        </h3>
        <p style={{ fontSize: 16, color: '#4a7a6a', lineHeight: 1.75, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
          You&apos;ve reconnected with the present moment. Notice how your body feels right now — grounded, here, safe.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380, margin: '0 auto 32px' }}>
          {SENSES.map((s, i) => notes[i] && (
            <div key={i} style={{
              background: s.bg, border: `1px solid ${s.border}`,
              borderRadius: 14, padding: '12px 16px', textAlign: 'left',
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>{s.number} things to {s.sense}</p>
                <p style={{ fontSize: 13, color: '#4a3a42', margin: 0, lineHeight: 1.5 }}>{notes[i]}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => { setStep('intro'); setNotes({}) }} style={{
          padding: '13px 32px', borderRadius: 14, border: '1.5px solid rgba(45,139,122,0.3)',
          cursor: 'pointer', background: 'rgba(45,139,122,0.07)',
          color: '#2d8b7a', fontSize: 14, fontWeight: 600,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        }}>
          Start again
        </button>
      </div>
    )
  }

  const idx = step as number
  const isLast = idx === SENSES.length - 1

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 36 }}>
        {SENSES.map((_, i) => (
          <div key={i} style={{
            width: i === idx ? 24 : 8, height: 8, borderRadius: 9999,
            background: i < idx ? '#2d8b7a' : i === idx ? sense!.color : 'rgba(237,224,216,0.6)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      <div className="step-enter" style={{
        background: sense!.bg, border: `1.5px solid ${sense!.border}`,
        borderRadius: 28, padding: '32px 28px', marginBottom: 24, textAlign: 'center',
      }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{sense!.icon}</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: `${sense!.color}15`, borderRadius: 9999, padding: '6px 16px', marginBottom: 18,
        }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: sense!.color, fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            {sense!.number}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: sense!.color, letterSpacing: '0.06em' }}>
            things to {sense!.sense}
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1a1220', lineHeight: 1.35, marginBottom: 10 }}>
          {sense!.prompt}
        </p>
        <p style={{ fontSize: 13, color: '#8a7a72', marginBottom: 0, lineHeight: 1.6 }}>
          Examples: {sense!.examples.join(' · ')}
        </p>
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={{
          display: 'block', fontSize: 13, fontWeight: 600, color: '#6a5a6a',
          marginBottom: 10, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        }}>
          {sense!.question} <span style={{ color: '#b8a9a0', fontWeight: 400 }}>(optional — just notice)</span>
        </label>
        <textarea
          value={notes[idx] ?? ''}
          onChange={(e) => handleNote(idx, e.target.value)}
          placeholder="Type here or just observe silently..."
          rows={3}
          style={{
            width: '100%', borderRadius: 14,
            border: `1.5px solid ${sense!.border}`,
            padding: '14px 16px', fontSize: 14, color: '#3d2c35',
            background: 'rgba(255,255,255,0.7)', outline: 'none',
            resize: 'none', lineHeight: 1.6,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {idx > 0 && (
          <button onClick={() => setStep(idx - 1)} style={{
            padding: '13px 22px', borderRadius: 14, border: '1.5px solid rgba(237,224,216,0.7)',
            cursor: 'pointer', background: 'white', color: '#8a7a72',
            fontSize: 14, fontWeight: 600,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>
            Back
          </button>
        )}
        <button onClick={() => setStep(isLast ? 'done' : idx + 1)} style={{
          flex: 1, padding: '15px 24px', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg, ${sense!.color}, ${sense!.color}cc)`,
          color: 'white', fontSize: 15, fontWeight: 700,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          boxShadow: `0 6px 20px ${sense!.color}35`,
        }}>
          {isLast ? 'Complete' : 'Next sense →'}
        </button>
      </div>
    </div>
  )
}
