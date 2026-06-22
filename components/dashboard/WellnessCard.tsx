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
  { emoji: '😞', label: 'Rough', value: 1 },
  { emoji: '😔', label: 'Low', value: 2 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😊', label: 'Great', value: 5 },
]

const SYMPTOM_COLORS: Record<string, string> = {
  'Hot flushes': '#c47a5a',
  'Night sweats': '#c4959e',
  'Brain fog': '#9b8ab8',
  'Fatigue': '#c47a5a',
}

function getSymptomStyle(symptom: string) {
  const color = SYMPTOM_COLORS[symptom] ?? '#9b8ab8'
  return {
    chip: {
      fontSize: 12,
      fontWeight: 500,
      color,
      background: `${color}18`,
      border: `1px solid ${color}40`,
      borderRadius: 20,
      padding: '5px 12px',
      display: 'inline-block',
    } as React.CSSProperties,
  }
}

export function WellnessCard({ todayLogged, wellbeing, namedSymptoms, sleepHours }: WellnessCardProps) {
  const [selected, setSelected] = useState<number | null>(wellbeing)

  return (
    <div
      className="glass"
      style={{ borderRadius: 24, padding: 28 }}
    >
      {/* Eyebrow */}
      <p style={{
        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
        fontWeight: 700,
        fontSize: 10,
        letterSpacing: '0.11em',
        textTransform: 'uppercase',
        color: '#2d8b7a',
        margin: '0 0 8px',
      }}>
        Today&apos;s Wellness
      </p>

      {/* Heading + pulse dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <h3 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 20,
          fontWeight: 700,
          color: '#1a1220',
          margin: 0,
          lineHeight: 1.2,
        }}>
          How are you feeling?
        </h3>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#2d8b7a',
            display: 'inline-block',
            flexShrink: 0,
            animation: 'dot-pulse 2.4s infinite',
          }}
        />
      </div>

      {/* Mood buttons */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {MOODS.map((m) => {
          const isSelected = selected === m.value
          return (
            <button
              key={m.value}
              onClick={() => setSelected(m.value)}
              style={{
                flex: 1,
                minWidth: 52,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '10px 4px',
                borderRadius: 12,
                cursor: 'pointer',
                background: isSelected ? 'rgba(45,139,122,0.10)' : 'white',
                border: isSelected
                  ? '2px solid #2d8b7a'
                  : '1px solid rgba(237,224,216,0.8)',
                boxShadow: isSelected ? '0 0 0 3px rgba(45,139,122,0.10)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}>{m.emoji}</span>
              <span style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: 9,
                fontWeight: 600,
                color: isSelected ? '#2d8b7a' : '#8a7a72',
              }}>
                {m.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(237,224,216,0.6)', margin: '0 0 16px' }} />

      {/* Symptoms */}
      {namedSymptoms.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 11,
            fontWeight: 600,
            color: '#b8a9a0',
            margin: '0 0 8px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            Symptoms today
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {namedSymptoms.map((s) => (
              <span key={s} style={getSymptomStyle(s).chip}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Sleep section */}
      {sleepHours != null && (
        <div style={{ marginBottom: 20 }}>
          <p style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontSize: 11,
            fontWeight: 600,
            color: '#b8a9a0',
            margin: '0 0 8px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            Last night&apos;s sleep
          </p>
          <div style={{
            background: 'rgba(45,139,122,0.06)',
            borderRadius: 12,
            padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#4a7a6a', fontWeight: 500 }}>{sleepHours}h</span>
              <span style={{ fontSize: 12, color: '#b8a9a0' }}>/12h</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(45,139,122,0.12)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min((sleepHours / 12) * 100, 100)}%`,
                background: 'linear-gradient(90deg, #2d8b7a, #6b9e80)',
                borderRadius: 2,
              }} />
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <Link
        href="/check-in"
        style={{
          display: 'block',
          width: '100%',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #2d8b7a, #1e6b55)',
          color: 'white',
          borderRadius: 9999,
          padding: '14px 20px',
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 15,
          textDecoration: 'none',
          boxShadow: '0 4px 16px rgba(45,139,122,0.28)',
          boxSizing: 'border-box',
        }}
      >
        {todayLogged ? 'Update today\'s check-in →' : 'Start today\'s check-in →'}
      </Link>
    </div>
  )
}
