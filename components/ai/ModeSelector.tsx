'use client'
import { MODES, type ConversationMode } from '@/lib/ai/modes'
import { cn } from '@/lib/utils'

interface Props {
  value: ConversationMode
  onChange: (mode: ConversationMode) => void
  disabled?: boolean
}

export function ModeSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {MODES.map((m) => (
        <button
          key={m.key}
          type="button"
          onClick={() => onChange(m.key)}
          disabled={disabled}
          className={cn(
            'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
            value === m.key
              ? 'bg-[#5a8a6b] text-white border-[#5a8a6b]'
              : 'border-[#e2d9d0] text-[#718096] hover:border-[#5a8a6b]'
          )}
        >
          <span>{m.emoji}</span>
          <span>{m.label}</span>
        </button>
      ))}
    </div>
  )
}
