'use client'
import { useState } from 'react'
import { BreathingExercise } from './BreathingExercise'
import { GroundingExercise } from './GroundingExercise'
import { HotFlushGuide } from './HotFlushGuide'

const TOOLS = [
  {
    id: 'breathing',
    icon: '🫁',
    title: 'Breathing Exercise',
    desc: '4-7-8, Box, or Calm breathing — animated timer with phase guidance',
    color: '#2d8b7a',
    bg: 'rgba(45,139,122,0.08)',
    border: 'rgba(45,139,122,0.2)',
    badge: '3–5 min',
    evidence: 'Shown to reduce hot flush intensity and anxiety',
  },
  {
    id: 'hotflush',
    icon: '🌡️',
    title: 'Hot Flush Guide',
    desc: 'Step-by-step support when a flush hits — acknowledgement, breathing, and cooling',
    color: '#e07a5f',
    bg: 'rgba(224,122,95,0.08)',
    border: 'rgba(224,122,95,0.2)',
    badge: '1–3 min',
    evidence: 'Paced breathing reduces flush severity by up to 50%',
  },
  {
    id: 'grounding',
    icon: '🌿',
    title: '5-4-3-2-1 Grounding',
    desc: 'Sensory anchoring exercise to interrupt anxiety and return to the present moment',
    color: '#9b8ab8',
    bg: 'rgba(155,138,184,0.08)',
    border: 'rgba(155,138,184,0.2)',
    badge: '3–5 min',
    evidence: 'Evidence-based CBT technique for anxiety and overwhelm',
  },
]

export function ToolsClient() {
  const [active, setActive] = useState<string | null>(null)

  const activeTool = TOOLS.find((t) => t.id === active)

  if (active && activeTool) {
    return (
      <div>
        <button onClick={() => setActive(null)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 28,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 14, fontWeight: 600, color: '#8a7a72',
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          padding: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to tools
        </button>

        <div style={{
          background: activeTool.bg, border: `1.5px solid ${activeTool.border}`,
          borderRadius: 24, padding: '24px 22px', marginBottom: 32,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{ fontSize: 36 }}>{activeTool.icon}</span>
          <div>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1a1220', margin: 0 }}>
              {activeTool.title}
            </h2>
            <p style={{ fontSize: 13, color: '#8a7a72', margin: '4px 0 0' }}>{activeTool.evidence}</p>
          </div>
        </div>

        {active === 'breathing' && <BreathingExercise />}
        {active === 'hotflush' && <HotFlushGuide />}
        {active === 'grounding' && <GroundingExercise />}
      </div>
    )
  }

  return (
    <>
      {/* Tool cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 48 }}>
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActive(tool.id)}
            style={{
              background: 'rgba(255,255,255,0.82)', border: `1.5px solid rgba(237,224,216,0.7)`,
              borderRadius: 24, padding: '28px 22px', textAlign: 'left', cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            }}
            className="learn-card"
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <span style={{ fontSize: 40 }}>{tool.icon}</span>
              <span style={{
                fontSize: 11, fontWeight: 600, color: tool.color,
                background: `${tool.color}14`, border: `1px solid ${tool.color}25`,
                borderRadius: 9999, padding: '4px 10px',
              }}>
                {tool.badge}
              </span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 18, fontWeight: 700, color: '#1a1220', marginBottom: 8, lineHeight: 1.3 }}>
              {tool.title}
            </h3>
            <p style={{ fontSize: 13, color: '#8a7a72', lineHeight: 1.65, marginBottom: 14 }}>{tool.desc}</p>
            <p style={{
              fontSize: 12, color: tool.color, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 5, margin: 0,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
              {tool.evidence}
            </p>
          </button>
        ))}
      </div>

      {/* Evidence note */}
      <div style={{
        background: 'rgba(45,139,122,0.06)', border: '1.5px solid rgba(45,139,122,0.14)',
        borderRadius: 20, padding: '20px 22px',
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 11, flexShrink: 0,
          background: 'rgba(45,139,122,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d8b7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 14, color: '#1e3d35', margin: '0 0 4px' }}>
            Evidence-informed tools
          </p>
          <p style={{ fontSize: 13, color: '#4a7a6a', margin: 0, lineHeight: 1.6 }}>
            These tools are based on techniques used in Cognitive Behavioural Therapy (CBT) for menopause,
            which has a strong evidence base for reducing hot flush distress, sleep disturbance, and anxiety.
            They are not a substitute for medical care.
          </p>
        </div>
      </div>
    </>
  )
}
