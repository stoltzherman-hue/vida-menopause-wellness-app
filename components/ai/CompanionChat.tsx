'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
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
const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PORTRAIT_URL = 'https://media.craiyon.com/2025-05-26/0f6O-Dn9Qrme3fztiJ5JmQ.webp'

const SPEAKING_CSS = `
@keyframes portrait-alive {
  0%,100% { transform: scale(1) translateY(0); }
  33% { transform: scale(1.012) translateY(-3px); }
  66% { transform: scale(1.008) translateY(2px); }
}
@keyframes speak-ring {
  0%,100% { transform: translate(-50%,-50%) scale(1); opacity:0.7; }
  50% { transform: translate(-50%,-50%) scale(1.08); opacity:1; }
}
@keyframes speak-ring2 {
  0%,100% { transform: translate(-50%,-50%) scale(1); opacity:0.35; }
  50% { transform: translate(-50%,-50%) scale(1.06); opacity:0.6; }
}
@keyframes wave-bar {
  0%,100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}
@keyframes glow-breathe {
  0%,100% { box-shadow: 0 0 18px rgba(139,109,181,0.35), 0 0 40px rgba(122,82,176,0.18); }
  50% { box-shadow: 0 0 28px rgba(139,109,181,0.55), 0 0 60px rgba(122,82,176,0.28); }
}
#vida-portrait { opacity:0.13; filter:brightness(0.9); transition:opacity 0.7s,filter 0.7s; width:100%;height:100%;object-fit:cover;object-position:center top; }
#vida-ring1 { position:absolute;top:50%;left:18%;width:420px;height:420px;border-radius:50%;border:1px solid rgba(139,109,181,0);transform:translate(-50%,-50%);pointer-events:none;transition:border-color 0.5s; }
#vida-ring2 { position:absolute;top:50%;left:18%;width:520px;height:520px;border-radius:50%;border:1px solid rgba(196,184,224,0);transform:translate(-50%,-50%);pointer-events:none;transition:border-color 0.7s; }
#vida-wave { display:none; align-items:center; gap:3px; height:28px; }
#vida-v { display:flex; align-items:center; justify-content:center; }
body.vida-speaking #vida-portrait { opacity:0.32 !important; filter:brightness(1.14) contrast(1.1) !important; animation:portrait-alive 2.2s ease-in-out infinite !important; }
body.vida-speaking #vida-ring1 { border-color:rgba(139,109,181,0.6) !important; animation:speak-ring 1.8s ease-in-out infinite !important; }
body.vida-speaking #vida-ring2 { border-color:rgba(196,184,224,0.3) !important; animation:speak-ring2 2.4s 0.4s ease-in-out infinite !important; }
body.vida-speaking #vida-wave { display:flex !important; }
body.vida-speaking #vida-v { display:none !important; }
body.vida-speaking #vida-avatar { box-shadow:0 0 40px rgba(196,184,224,0.7),0 0 80px rgba(139,109,181,0.4) !important; }
`

function getVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  const priority = [
    (v: SpeechSynthesisVoice) => /google uk english female/i.test(v.name),
    (v: SpeechSynthesisVoice) => /microsoft zira/i.test(v.name),
    (v: SpeechSynthesisVoice) => /female|woman|samantha|karen|moira|tessa|fiona|victoria|allison|ava|serena/i.test(v.name),
    (v: SpeechSynthesisVoice) => !/male|david|mark|alex|daniel|fred|jorge|luca|thomas|oliver/i.test(v.name),
  ]
  for (const test of priority) {
    const match = voices.find(test)
    if (match) return match
  }
  return voices[0]
}

export function CompanionChat({
  initialMessages = [],
  initialConversationId,
  initialMode = 'supportive_friend',
  isPremium = false,
  freeMessageLimit = FREE_LIMIT,
}: Props) {
  const defaultGreeting = `Hi, I'm your Vida companion in ${MODES.find((m) => m.key === initialMode)?.label ?? 'Supportive Friend'} mode. I'm here to listen and support you. What's on your mind today?`

  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0 ? initialMessages : [{ role: 'assistant', content: defaultGreeting }]
  )
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId ?? null)
  const [mode, setMode] = useState<ConversationMode>(initialMode)
  const [voiceOn, setVoiceOn] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const userMessageCount = messages.filter((m) => m.role === 'user').length
  const hitLimit = !isPremium && userMessageCount >= freeMessageLimit

  // Inject speaking CSS once
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById('vida-speaking-css')) return
    const style = document.createElement('style')
    style.id = 'vida-speaking-css'
    style.textContent = SPEAKING_CSS
    document.head.appendChild(style)
  }, [])

  // Sync speaking class on body
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (speaking) {
      document.body.classList.add('vida-speaking')
    } else {
      document.body.classList.remove('vida-speaking')
    }
    return () => { document.body.classList.remove('vida-speaking') }
  }, [speaking])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!voiceOn && typeof window !== 'undefined') {
      window.speechSynthesis?.cancel()
      setSpeaking(false)
    }
  }, [voiceOn])

  const speak = useCallback((text: string) => {
    if (!voiceOn || typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.86
    utt.pitch = 1.12
    utt.volume = 0.92

    const doSpeak = () => {
      const voice = getVoice()
      if (voice) utt.voice = voice
      setSpeaking(true)
      // Timer-based fallback: word count × 80ms
      const fallbackMs = text.split(/\s+/).length * 80 + 1500
      const timer = setTimeout(() => { setSpeaking(false) }, fallbackMs)
      utt.onend = () => { clearTimeout(timer); setSpeaking(false) }
      utt.onerror = () => { clearTimeout(timer); setSpeaking(false) }
      window.speechSynthesis.speak(utt)
    }

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => { doSpeak(); window.speechSynthesis.onvoiceschanged = null }
    } else {
      doSpeak()
    }
  }, [voiceOn])

  function handleModeChange(newMode: ConversationMode) {
    if (loading) return
    setMode(newMode)
    const modeLabel = MODES.find((m) => m.key === newMode)?.label ?? newMode
    const msg = `Switched to ${modeLabel} mode. ${
      newMode === 'doctor_prep'
        ? "Let's help you prepare for your next appointment. What would you like to discuss with your doctor?"
        : newMode === 'wellness_coach'
        ? "Let's focus on practical strategies for managing your symptoms. What area would you like to work on?"
        : "I'm here to listen. How are you feeling?"
    }`
    setMessages((prev) => [...prev, { role: 'assistant', content: msg }])
    speak(msg)
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
        body: JSON.stringify({ message: text, ...(conversationId ? { conversationId } : {}), mode }),
      })
      const json = await res.json()

      if (!res.ok) {
        const msg = res.status === 503
          ? "I can't connect right now. Make sure ANTHROPIC_API_KEY is set in your Vercel environment variables, then redeploy."
          : res.status === 401
          ? "You need to be signed in to chat."
          : json.error?.message ?? "Something went wrong. Please try again."
        setMessages((prev) => [...prev, { role: 'assistant', content: msg }])
        speak(msg)
        return
      }

      if (json.data) {
        if (json.data.conversationId) setConversationId(json.data.conversationId)
        const reply = json.data.content as string
        setMessages((prev) => [...prev, { role: 'assistant', content: reply, flagged: json.data.flagged }])
        speak(reply)
      }
    } catch {
      const msg = "I couldn't connect. Please check your internet connection and try again."
      setMessages((prev) => [...prev, { role: 'assistant', content: msg }])
      speak(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'relative', display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

      {/* Portrait panel — right side, desktop */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '52%', height: '100%',
        pointerEvents: 'none', overflow: 'hidden',
        display: 'none',
      }} className="companion-portrait-panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          id="vida-portrait"
          src={PORTRAIT_URL}
          alt=""
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 100%)',
          }}
        />
        <div id="vida-ring1" />
        <div id="vida-ring2" />
      </div>

      {/* Chat panel */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }} className="companion-chat-panel">

        {/* Avatar + mode bar */}
        <div style={{
          paddingBottom: 12,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          {/* Avatar orb */}
          <div
            id="vida-avatar"
            style={{
              flexShrink: 0,
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(139,109,181,0.3) 0%, rgba(196,184,224,0.15) 100%)',
              border: '1px solid rgba(139,109,181,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 18px rgba(139,109,181,0.35), 0 0 40px rgba(122,82,176,0.18)',
              animation: 'glow-breathe 3.5s ease-in-out infinite',
              transition: 'box-shadow 0.5s',
            }}
          >
            {/* Wave bars (speaking) */}
            <div id="vida-wave">
              {[0.4, 0.7, 1, 0.7, 0.4].map((delay, i) => (
                <span key={i} style={{
                  display: 'inline-block',
                  width: 3, height: 18,
                  borderRadius: 2,
                  background: 'rgba(196,184,224,0.85)',
                  transformOrigin: 'center',
                  animation: `wave-bar 0.7s ${delay * 0.15}s ease-in-out infinite`,
                }} />
              ))}
            </div>
            {/* V lettermark (idle) */}
            <div id="vida-v">
              <span style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 16, fontWeight: 300,
                color: 'rgba(196,184,224,0.85)',
                lineHeight: 1,
              }}>v</span>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <ModeSelector value={mode} onChange={handleModeChange} disabled={loading} />
          </div>

          {/* Voice / mute toggle */}
          <button
            type="button"
            onClick={() => setVoiceOn((v) => !v)}
            title={voiceOn ? 'Mute voice' : 'Unmute voice'}
            style={{
              flexShrink: 0, width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: voiceOn ? 'rgba(139,109,181,0.18)' : 'rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
          >
            {voiceOn ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(196,184,224,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            )}
          </button>
        </div>

        {/* Status */}
        <p style={{
          fontFamily: DM, fontSize: 11, fontWeight: 300,
          color: speaking ? 'rgba(196,184,224,0.6)' : 'rgba(255,255,255,0.2)',
          margin: '0 0 10px',
          transition: 'color 0.4s',
        }}>
          {speaking ? 'Speaking…' : 'Ready'}
        </p>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '11px 16px',
                fontSize: 14, lineHeight: 1.65, fontFamily: DM, fontWeight: 300,
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)'
                  : msg.flagged ? 'rgba(217,95,95,0.08)' : 'rgba(255,255,255,0.06)',
                color: msg.role === 'user' ? 'rgba(255,255,255,0.92)' : msg.flagged ? 'rgba(232,160,160,0.9)' : 'rgba(255,255,255,0.72)',
                border: msg.role === 'user' ? 'none' : msg.flagged ? '1px solid rgba(217,95,95,0.22)' : '1px solid rgba(255,255,255,0.08)',
              }}>
                {msg.flagged && (
                  <p style={{ fontSize: 12, fontWeight: 400, color: 'rgba(232,160,160,0.9)', margin: '0 0 6px' }}>Important safety information</p>
                )}
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px 18px 18px 4px', padding: '14px 18px' }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{
                      width: 7, height: 7,
                      background: 'rgba(155,124,200,0.7)',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'dot-pulse 1.1s infinite ease-in-out',
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
          <div style={{ marginBottom: 12, borderRadius: 14, border: '1px solid rgba(201,169,110,0.2)', background: 'rgba(201,169,110,0.06)', padding: '14px 18px', textAlign: 'center', fontFamily: DM }}>
            <p style={{ fontWeight: 400, color: 'rgba(201,169,110,0.85)', fontSize: 13, margin: '0 0 4px' }}>Free message limit reached</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: '0 0 8px', fontWeight: 300 }}>Upgrade to Premium for unlimited conversations.</p>
            <a href="/settings" style={{ fontSize: 13, fontWeight: 400, color: '#c9a96e' }}>View Premium →</a>
          </div>
        )}

        {!isPremium && !hitLimit && userMessageCount > 0 && (
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginBottom: 8, fontFamily: DM, fontWeight: 300 }}>
            {freeMessageLimit - userMessageCount} free message{freeMessageLimit - userMessageCount !== 1 ? 's' : ''} remaining
          </p>
        )}

        {/* Input */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={hitLimit ? 'Upgrade to continue…' : "Share what's on your mind…"}
            disabled={loading || hitLimit}
            style={{
              flex: 1, padding: '12px 18px', borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.05)',
              fontSize: 14, fontFamily: DM, fontWeight: 300,
              color: 'rgba(255,255,255,0.82)', outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || hitLimit}
            style={{
              width: 46, height: 46, borderRadius: '50%', border: 'none', flexShrink: 0,
              background: loading || !input.trim() || hitLimit
                ? 'rgba(255,255,255,0.07)'
                : 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)',
              color: 'rgba(255,255,255,0.8)',
              cursor: loading || !input.trim() || hitLimit ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: loading || !input.trim() || hitLimit ? 'none' : '0 3px 12px rgba(122,82,176,0.4)',
              transition: 'all 0.2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>

        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', textAlign: 'center', marginTop: 8, fontFamily: DM, fontWeight: 300 }}>
          Educational support only — not medical advice
        </p>

      </div>

      {/* CSS for portrait panel visibility on desktop */}
      <style>{`
        @media (min-width: 900px) {
          .companion-portrait-panel { display: block !important; }
          .companion-chat-panel { max-width: 52%; }
        }
        @keyframes glow-breathe {
          0%,100% { box-shadow: 0 0 18px rgba(139,109,181,0.35), 0 0 40px rgba(122,82,176,0.18); }
          50% { box-shadow: 0 0 28px rgba(139,109,181,0.55), 0 0 60px rgba(122,82,176,0.28); }
        }
      `}</style>
    </div>
  )
}
