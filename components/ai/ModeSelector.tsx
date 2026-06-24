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
            fontWeight: 300,
            border: value === m.key ? '1.5px solid rgba(139,109,181,0.4)' : '1px solid rgba(255,255,255,0.09)',
            background: value === m.key ? 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)' : 'rgba(255,255,255,0.04)',
            color: value === m.key ? '#fff' : 'rgba(255,255,255,0.40)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          <span>{m.label}</span>
        </button>
      ))}
    </div>
  )
}
