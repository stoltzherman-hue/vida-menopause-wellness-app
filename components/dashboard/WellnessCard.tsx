'use client'

import { useState } from 'react'
import Link from 'next/link'

interface WellnessCardProps {
  todayLogged: boolean
  wellbeing: number | null
  namedSymptoms: string[]
  sleepHours: number | null
}

const MOODS = [
  { label: 'Rough', value: 1 },
  { label: 'Low', value: 2 },
  { label: 'Okay', value: 3 },
  { label: 'Good', value: 4 },
  { label: 'Great', value: 5 },
]

export function WellnessCard({ todayLogged, wellbeing, namedSymptoms, sleepHours }: WellnessCardProps) {
  const [selected, setSelected] = useState<number | null>(wellbeing)

  return (
    <div className="glass" style={{ borderRadius: 24, padding: 28 }}>
      {/* Eyebrow */}
      <p style={{
        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        fontWeight: 400, fontSize: 10, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
        margin: '0 0 8px',
      }}>
        Today&apos;s Wellness
      </p>

      {/* Heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <h3 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.88)',
          margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em',
        }}>
          How are you feeling?
        </h3>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#9b7cc8', display: 'inline-block',
          flexShrink: 0, animation: 'dot-pulse 2.4s infinite',
        }} />
      </div>

      {/* Mood buttons — text only, no emoji */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
        {MOODS.map((m) => {
          const isSelected = selected === m.value
          return (
            <button
              key={m.value}
              onClick={() => setSelected(m.value)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '12px 4px', borderRadius: 12, cursor: 'pointer',
                background: isSelected ? 'rgba(139,109,181,0.16)' : 'rgba(255,255,255,0.03)',
                border: isSelected ? '1px solid rgba(139,109,181,0.4)' : '1px solid rgba(255,255,255,0.07)',
                boxShadow: isSelected ? '0 0 0 2px rgba(139,109,181,0.15)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 11, fontWeight: 300,
                color: isSelected ? 'rgba(196,184,224,0.9)' : 'rgba(255,255,255,0.32)',
              }}>
                {m.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0 0 18px' }} />

      {/* Symptoms */}
      {namedSymptoms.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.28)',
            margin: '0 0 8px', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            Symptoms today
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {namedSymptoms.map((s) => (
              <span key={s} style={{
                fontSize: 12, fontWeight: 300,
                color: 'rgba(196,184,224,0.75)',
                background: 'rgba(139,109,181,0.10)',
                border: '1px solid rgba(139,109,181,0.2)',
                borderRadius: 20, padding: '5px 12px', display: 'inline-block',
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Sleep */}
      {sleepHours != null && (
        <div style={{ marginBottom: 22 }}>
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.28)',
            margin: '0 0 8px', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            Last night&apos;s sleep
          </p>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'rgba(196,184,224,0.8)', fontWeight: 300, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>{sleepHours}h</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', fontWeight: 300 }}>/12h</span>
            </div>
            <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min((sleepHours / 12) * 100, 100)}%`,
                background: 'linear-gradient(90deg, #7a52b0, #9b7cc8)',
                borderRadius: 2,
              }} />
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <Link
        href="/check-in"
        className="btn-primary"
        style={{ display: 'block', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}
      >
        {todayLogged ? 'Update check-in' : 'Start check-in'}
      </Link>
    </div>
  )
}
