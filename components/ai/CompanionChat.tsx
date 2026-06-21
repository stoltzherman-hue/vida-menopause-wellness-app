'use client'
import { useState, useRef, useEffect } from 'react'
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

      if (!res.ok) {
        // API returned an error — show a helpful message
        const msg = res.status === 503
          ? "I can't connect right now. Make sure ANTHROPIC_API_KEY is set in your Vercel environment variables, then redeploy."
          : res.status === 401
          ? "You need to be signed in to chat."
          : json.error?.message ?? "Something went wrong. Please try again."
        setMessages((prev) => [...prev, { role: 'assistant', content: msg }])
        return
      }

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
        { role: 'assistant', content: "I couldn't connect. Please check your internet connection and try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Mode selector */}
      <div style={{ paddingBottom: 12, borderBottom: '1px solid rgba(237,224,216,0.7)', marginBottom: 12 }}>
        <ModeSelector value={mode} onChange={handleModeChange} disabled={loading} />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              padding: '11px 16px',
              fontSize: 14,
              lineHeight: 1.65,
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg,#6b9e80,#4a7a5b)'
                : msg.flagged ? '#fff5f5' : 'rgba(255,255,255,0.92)',
              color: msg.role === 'user' ? '#fff' : msg.flagged ? '#9b2c2c' : '#2d3748',
              border: msg.role === 'user' ? 'none' : msg.flagged ? '1px solid #feb2b2' : '1px solid rgba(237,224,216,0.8)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            }}>
              {msg.flagged && (
                <p style={{ fontSize: 12, fontWeight: 700, color: '#c53030', marginBottom: 4, margin: '0 0 4px' }}>⚠️ Important safety information</p>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(237,224,216,0.8)', borderRadius: '18px 18px 18px 4px', padding: '12px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{
                    width: 8, height: 8,
                    background: '#6b9e80',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'bounce 1.1s infinite ease-in-out',
                    animationDelay: `${i * 0.18}s`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Free limit gate */}
      {hitLimit && (
        <div style={{ marginBottom: 12, borderRadius: 14, border: '1px solid rgba(196,122,90,0.28)', background: 'rgba(196,122,90,0.05)', padding: '14px 18px', textAlign: 'center', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
          <p style={{ fontWeight: 700, color: '#2d3748', fontSize: 14, margin: '0 0 4px' }}>🔒 Free message limit reached</p>
          <p style={{ fontSize: 13, color: '#718096', margin: '0 0 8px' }}>Upgrade to Premium for unlimited conversations.</p>
          <a href="/settings" style={{ fontSize: 13, fontWeight: 700, color: '#6b9e80' }}>View Premium →</a>
        </div>
      )}

      {!isPremium && !hitLimit && userMessageCount > 0 && (
        <p style={{ fontSize: 12, color: '#a0aec0', textAlign: 'center', marginBottom: 8, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
          {freeMessageLimit - userMessageCount} free message{freeMessageLimit - userMessageCount !== 1 ? 's' : ''} remaining
        </p>
      )}

      {/* Input */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid rgba(237,224,216,0.7)' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={hitLimit ? 'Upgrade to continue…' : "Share what's on your mind…"}
          disabled={loading || hitLimit}
          style={{
            flex: 1, padding: '11px 18px', borderRadius: 999,
            border: '1.5px solid rgba(237,224,216,0.9)',
            background: 'rgba(255,255,255,0.85)',
            fontSize: 14, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            color: '#2d3748', outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim() || hitLimit}
          style={{
            width: 46, height: 46, borderRadius: '50%', border: 'none', flexShrink: 0,
            background: loading || !input.trim() || hitLimit
              ? '#e2d9d0'
              : 'linear-gradient(135deg,#6b9e80,#4a7a5b)',
            color: '#fff',
            cursor: loading || !input.trim() || hitLimit ? 'not-allowed' : 'pointer',
            fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: loading || !input.trim() || hitLimit ? 'none' : '0 3px 12px rgba(107,158,128,0.4)',
          }}
        >➤</button>
      </form>

      <p style={{ fontSize: 11, color: '#a0aec0', textAlign: 'center', marginTop: 8, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
        Educational support only — not medical advice
      </p>
    </div>
  )
}
