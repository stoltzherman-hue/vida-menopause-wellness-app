'use client'
import { useState } from 'react'
import { BreathingExercise } from './BreathingExercise'
import { GroundingExercise } from './GroundingExercise'
import { HotFlushGuide } from './HotFlushGuide'
import { TiltCard } from '@/components/ui/TiltCard'

const TOOLS = [
  {
    id: 'breathing',
    title: 'Breathing Exercise',
    desc: '4-7-8, Box, or Calm breathing — animated timer with phase guidance',
    color: '#9b7cc8',
    bg: 'rgba(155,124,200,0.06)',
    border: 'rgba(155,124,200,0.15)',
    badge: '3–5 min',
    evidence: 'Shown to reduce hot flush intensity and anxiety',
  },
  {
    id: 'hotflush',
    title: 'Hot Flush Guide',
    desc: 'Step-by-step support when a flush hits — acknowledgement, breathing, and cooling',
    color: '#e07a5f',
    bg: 'rgba(224,122,95,0.06)',
    border: 'rgba(224,122,95,0.15)',
    badge: '1–3 min',
    evidence: 'Paced breathing reduces flush severity by up to 50%',
  },
  {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding',
    desc: 'Sensory anchoring exercise to interrupt anxiety and return to the present moment',
    color: '#c4b8e0',
    bg: 'rgba(196,184,224,0.06)',
    border: 'rgba(196,184,224,0.15)',
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
          fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.55)',
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          padding: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to tools
        </button>

        <div style={{
          background: activeTool.bg, border: `1px solid ${activeTool.border}`,
          borderRadius: 24, padding: '24px 22px', marginBottom: 32,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: `rgba(155,124,200,0.18)`,
            border: '1px solid rgba(155,124,200,0.3)',
          }} />
          <div>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: 0 }}>
              {activeTool.title}
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '4px 0 0' }}>{activeTool.evidence}</p>
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
          <TiltCard
            key={tool.id}
            maxTilt={8}
            scale={1.03}
            style={{
              background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.09)`,
              borderRadius: 24, padding: '28px 22px', textAlign: 'left', cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            }}
            className="learn-card"
          >
            <button
              onClick={() => setActive(tool.id)}
              style={{ all: 'unset', display: 'block', width: '100%', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: `rgba(155,124,200,0.18)`,
                  border: '1px solid rgba(155,124,200,0.3)',
                }} />
                <span style={{
                  fontSize: 11, fontWeight: 300, color: tool.color,
                  background: `${tool.color}14`, border: `1px solid ${tool.color}25`,
                  borderRadius: 9999, padding: '4px 10px',
                }}>
                  {tool.badge}
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.88)', marginBottom: 8, lineHeight: 1.3 }}>
                {tool.title}
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 14 }}>{tool.desc}</p>
              <p style={{
                fontSize: 12, color: tool.color, fontWeight: 300,
                display: 'flex', alignItems: 'center', gap: 5, margin: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
                {tool.evidence}
              </p>
            </button>
          </TiltCard>
        ))}
      </div>

      {/* Evidence note */}
      <div style={{
        background: 'rgba(155,124,200,0.05)', border: '1px solid rgba(155,124,200,0.12)',
        borderRadius: 20, padding: '20px 22px',
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 11, flexShrink: 0,
          background: 'rgba(155,124,200,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9b7cc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
        </div>
        <div>
          <p style={{ fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.88)', margin: '0 0 4px' }}>
            Evidence-informed tools
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.6 }}>
            These tools are based on techniques used in Cognitive Behavioural Therapy (CBT) for menopause,
            which has a strong evidence base for reducing hot flush distress, sleep disturbance, and anxiety.
            They are not a substitute for medical care.
          </p>
        </div>
      </div>
    </>
  )
}
