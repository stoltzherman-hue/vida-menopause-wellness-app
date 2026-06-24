'use client'
import { useState } from 'react'

const SENSES = [
  {
    number: 5,
    sense: 'SEE',
    color: '#9b7cc8',
    bg: 'rgba(155,124,200,0.06)',
    border: 'rgba(155,124,200,0.15)',
    prompt: 'Look around and name 5 things you can see.',
    examples: ['The pattern on the wall', 'Light through a window', 'Your hands', 'A plant', 'The colour of the floor'],
    question: 'What can you see right now?',
  },
  {
    number: 4,
    sense: 'TOUCH',
    color: '#c4b8e0',
    bg: 'rgba(196,184,224,0.06)',
    border: 'rgba(196,184,224,0.15)',
    prompt: 'Notice 4 things you can physically feel.',
    examples: ['Your feet on the floor', 'The chair beneath you', 'The texture of your clothes', 'The air temperature'],
    question: 'What can you physically feel?',
  },
  {
    number: 3,
    sense: 'HEAR',
    color: '#7a52b0',
    bg: 'rgba(122,82,176,0.06)',
    border: 'rgba(122,82,176,0.15)',
    prompt: 'Listen carefully and identify 3 sounds.',
    examples: ['Traffic in the distance', 'Your own breathing', 'A clock ticking', 'Birds outside'],
    question: 'What sounds do you hear?',
  },
  {
    number: 2,
    sense: 'SMELL',
    color: '#c4b8e0',
    bg: 'rgba(196,184,224,0.06)',
    border: 'rgba(196,184,224,0.15)',
    prompt: 'Notice 2 things you can smell — even faint ones.',
    examples: ['Fresh air', 'Coffee or tea nearby', 'Your own skin', 'Something from outside'],
    question: 'What can you smell?',
  },
  {
    number: 1,
    sense: 'TASTE',
    color: '#9b7cc8',
    bg: 'rgba(155,124,200,0.06)',
    border: 'rgba(155,124,200,0.15)',
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
        <div style={{
          width: 64, height: 64, borderRadius: '50%', margin: '0 auto 24px',
          background: 'rgba(155,124,200,0.15)',
          border: '1px solid rgba(155,124,200,0.35)',
          boxShadow: '0 0 32px rgba(155,124,200,0.2)',
        }} />
        <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 300, color: 'rgba(255,255,255,0.88)', marginBottom: 14 }}>
          5-4-3-2-1 Grounding
        </h3>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 12, maxWidth: 420, margin: '0 auto 16px' }}>
          This technique anchors you in the present moment by engaging all five senses. It interrupts the anxiety or overwhelm cycle and is particularly effective during or after hot flushes.
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', marginBottom: 36, lineHeight: 1.6 }}>
          Takes 3–5 minutes · Find a comfortable spot
        </p>
        <button onClick={() => setStep(0)} style={{
          padding: '16px 48px', borderRadius: 16, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)',
          color: 'white', fontSize: 16, fontWeight: 300,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          boxShadow: '0 6px 24px rgba(155,124,200,0.32)',
        }}>
          Begin grounding
        </button>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', margin: '0 auto 24px',
          background: 'rgba(155,124,200,0.2)',
          border: '1px solid rgba(155,124,200,0.4)',
          boxShadow: '0 0 40px rgba(155,124,200,0.3)',
        }} />
        <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 300, color: 'rgba(255,255,255,0.88)', marginBottom: 14 }}>
          You did it
        </h3>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
          You&apos;ve reconnected with the present moment. Notice how your body feels right now — grounded, here, safe.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380, margin: '0 auto 32px' }}>
          {SENSES.map((s, i) => notes[i] && (
            <div key={i} style={{
              background: s.bg, border: `1px solid ${s.border}`,
              borderRadius: 14, padding: '12px 16px', textAlign: 'left',
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 4, background: s.color }} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 300, color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>{s.number} things to {s.sense}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', margin: 0, lineHeight: 1.5 }}>{notes[i]}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => { setStep('intro'); setNotes({}) }} style={{
          padding: '13px 32px', borderRadius: 14, border: '1px solid rgba(155,124,200,0.3)',
          cursor: 'pointer', background: 'rgba(155,124,200,0.07)',
          color: '#c4b8e0', fontSize: 14, fontWeight: 300,
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
            background: i < idx ? '#9b7cc8' : i === idx ? sense!.color : 'rgba(255,255,255,0.12)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      <div className="step-enter" style={{
        background: sense!.bg, border: `1px solid ${sense!.border}`,
        borderRadius: 28, padding: '32px 28px', marginBottom: 24, textAlign: 'center',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
          background: `rgba(155,124,200,0.15)`,
          border: `1px solid ${sense!.border}`,
          boxShadow: `0 0 24px ${sense!.color}30`,
        }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: `${sense!.color}15`, borderRadius: 9999, padding: '6px 16px', marginBottom: 18,
        }}>
          <span style={{ fontSize: 22, fontWeight: 300, color: sense!.color, fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            {sense!.number}
          </span>
          <span style={{ fontSize: 13, fontWeight: 300, color: sense!.color, letterSpacing: '0.06em' }}>
            things to {sense!.sense}
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.88)', lineHeight: 1.35, marginBottom: 10 }}>
          {sense!.prompt}
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 0, lineHeight: 1.6 }}>
          Examples: {sense!.examples.join(' · ')}
        </p>
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={{
          display: 'block', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.55)',
          marginBottom: 10, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        }}>
          {sense!.question} <span style={{ color: 'rgba(255,255,255,0.32)', fontWeight: 300 }}>(optional — just notice)</span>
        </label>
        <textarea
          value={notes[idx] ?? ''}
          onChange={(e) => handleNote(idx, e.target.value)}
          placeholder="Type here or just observe silently..."
          rows={3}
          style={{
            width: '100%', borderRadius: 14,
            border: `1px solid rgba(255,255,255,0.10)`,
            padding: '14px 16px', fontSize: 14, color: 'rgba(255,255,255,0.82)',
            background: 'rgba(255,255,255,0.05)', outline: 'none',
            resize: 'none', lineHeight: 1.6,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {idx > 0 && (
          <button onClick={() => setStep(idx - 1)} style={{
            padding: '13px 22px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.09)',
            cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)',
            fontSize: 14, fontWeight: 300,
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>
            Back
          </button>
        )}
        <button onClick={() => setStep(isLast ? 'done' : idx + 1)} style={{
          flex: 1, padding: '15px 24px', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)`,
          color: 'white', fontSize: 15, fontWeight: 300,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          boxShadow: `0 6px 20px rgba(155,124,200,0.35)`,
        }}>
          {isLast ? 'Complete' : 'Next sense →'}
        </button>
      </div>
    </div>
  )
}
