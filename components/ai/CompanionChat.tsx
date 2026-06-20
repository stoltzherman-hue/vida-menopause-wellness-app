'use client'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ModeSelector } from './ModeSelector'
import { MODES, type ConversationMode } from '@/lib/ai/modes'

interface Message {
  role: 'user' | 'assistant'
  content: string
  flagged?: boolean
}

interface Props {
  initialMessages?: Message[]
  initialConversationId?: string
  initialMode?: ConversationMode
  isPremium?: boolean
  freeMessageLimit?: number
}

const FREE_LIMIT = 10

export function CompanionChat({
  initialMessages = [],
  initialConversationId,
  initialMode = 'supportive_friend',
  isPremium = false,
  freeMessageLimit = FREE_LIMIT,
}: Props) {
  const defaultGreeting = `Hi! I'm your Vida companion in ${MODES.find((m) => m.key === initialMode)?.label ?? 'Supportive Friend'} mode. I'm here to listen and support you. What's on your mind today?`

  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0
      ? initialMessages
      : [{ role: 'assistant', content: defaultGreeting }]
  )
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId ?? null)
  const [mode, setMode] = useState<ConversationMode>(initialMode)
  const bottomRef = useRef<HTMLDivElement>(null)

  const userMessageCount = messages.filter((m) => m.role === 'user').length
  const hitLimit = !isPremium && userMessageCount >= freeMessageLimit

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleModeChange(newMode: ConversationMode) {
    if (loading) return
    setMode(newMode)
    const modeLabel = MODES.find((m) => m.key === newMode)?.label ?? newMode
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `Switched to ${modeLabel} mode. ${
          newMode === 'doctor_prep'
            ? "Let's help you prepare for your next appointment. What would you like to discuss with your doctor?"
            : newMode === 'wellness_coach'
            ? "Let's focus on practical strategies for managing your symptoms. What area would you like to work on?"
            : "I'm here to listen. How are you feeling?"
        }`,
      },
    ])
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading || hitLimit) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationId, mode }),
      })
      const json = await res.json()
      if (json.data) {
        if (json.data.conversationId) setConversationId(json.data.conversationId)
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: json.data.content, flagged: json.data.flagged },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm sorry, I couldn't connect right now. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="pb-3 border-b border-[#e2d9d0] mb-3">
        <ModeSelector value={mode} onChange={handleModeChange} disabled={loading} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-[#5a8a6b] text-white rounded-br-sm'
                  : msg.flagged
                  ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-sm'
                  : 'bg-white border border-[#e2d9d0] text-[#2d3748] rounded-bl-sm'
              )}
            >
              {msg.flagged && (
                <p className="text-xs font-semibold text-red-700 mb-1">⚠️ Important safety information</p>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#e2d9d0] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 bg-[#5a8a6b] rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {hitLimit && (
        <div className="mb-3 rounded-xl border border-[#c47a5a]/30 bg-[#c47a5a]/5 px-4 py-3 text-sm text-center space-y-1">
          <div className="flex items-center justify-center gap-2 font-medium text-[#2d3748]">
            <Lock size={14} className="text-[#c47a5a]" />
            Free message limit reached
          </div>
          <p className="text-xs text-[#718096]">
            Upgrade to Premium for unlimited conversations and AI memory.
          </p>
          <a
            href="/settings"
            className="inline-block mt-1 text-xs font-medium text-[#5a8a6b] underline underline-offset-2"
          >
            View Premium →
          </a>
        </div>
      )}

      {!isPremium && !hitLimit && userMessageCount > 0 && (
        <p className="text-xs text-[#a0aec0] text-center mb-2">
          {freeMessageLimit - userMessageCount} free message{freeMessageLimit - userMessageCount !== 1 ? 's' : ''} remaining
        </p>
      )}

      <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t border-[#e2d9d0]">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={hitLimit ? 'Upgrade to continue…' : "Share what's on your mind…"}
          className="flex-1"
          disabled={loading || hitLimit}
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim() || hitLimit}>
          <Send size={18} />
        </Button>
      </form>

      <p className="text-xs text-[#a0aec0] text-center mt-2">
        Educational support only — not medical advice
      </p>
    </div>
  )
}
