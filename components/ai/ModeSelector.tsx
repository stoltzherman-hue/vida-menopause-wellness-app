'use client'
import { MODES, type ConversationMode } from '@/lib/ai/modes'

interface Props {
  value: ConversationMode
  onChange: (mode: ConversationMode) => void
  disabled?: boolean
}

export function ModeSelector({ value, onChange, disabled }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
      {MODES.map((m) => (
        <button
          key={m.key}
          type="button"
          onClick={() => onChange(m.key)}
          disabled={disabled}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 500,
            border: value === m.key ? '1.5px solid #6b9e80' : '1.5px solid #e2d9d0',
            background: value === m.key ? 'linear-gradient(135deg,#6b9e80,#5a8a6b)' : 'rgba(255,255,255,0.7)',
            color: value === m.key ? '#fff' : '#718096',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          <span>{m.emoji}</span>
          <span>{m.label}</span>
        </button>
      ))}
    </div>
  )
}
