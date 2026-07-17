'use client'
import { useEffect, useRef, useState } from 'react'

const DM = 'var(--font-dm-sans), system-ui, sans-serif'

type VapiLike = {
  start: (assistantId: string, overrides?: Record<string, unknown>) => Promise<unknown>
  stop: () => void
  on: (event: string, cb: (...args: unknown[]) => void) => void
  removeAllListeners?: () => void
}
type VapiCtor = new (publicKey: string) => VapiLike

type Status = 'idle' | 'connecting' | 'live' | 'error'

interface Props {
  mode: string
  canUseVoice: boolean
  remainingMinutes: number
}

export function VoiceCompanion({ mode, canUseVoice, remainingMinutes }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [remaining, setRemaining] = useState(remainingMinutes)
  const vapiRef = useRef<VapiLike | null>(null)

  useEffect(() => {
    return () => {
      try { vapiRef.current?.stop() } catch { /* ignore */ }
      document.body.classList.remove('vida-speaking')
    }
  }, [])

  async function startCall() {
    setError(null)
    setStatus('connecting')
    try {
      const res = await fetch('/api/vapi/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error?.message ?? 'Could not start voice session.')
        setStatus('idle')
        return
      }
      const { publicKey, assistantId, token, maxDurationSeconds, remainingMinutes: rem } = json.data
      setRemaining(rem)

      // Load the Vapi web SDK at runtime from a CDN (kept out of the bundle).
      // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
      const cdnImport = new Function('u', 'return import(u)') as (u: string) => Promise<{ default: VapiCtor }>
      const mod = await cdnImport('https://esm.sh/@vapi-ai/web@2.3.8')
      const Vapi = mod.default
      const vapi = new Vapi(publicKey)
      vapiRef.current = vapi

      vapi.on('call-start', () => setStatus('live'))
      vapi.on('call-end', () => {
        setStatus('idle')
        document.body.classList.remove('vida-speaking')
      })
      vapi.on('speech-start', () => document.body.classList.add('vida-speaking'))
      vapi.on('speech-end', () => document.body.classList.remove('vida-speaking'))
      vapi.on('error', (e: unknown) => {
        console.error('vapi error', e)
        setError('The voice connection dropped. Please try again.')
        setStatus('error')
        document.body.classList.remove('vida-speaking')
      })

      await vapi.start(assistantId, {
        metadata: { token },
        maxDurationSeconds,
      })
    } catch (e) {
      console.error('voice start failed', e)
      setError('Could not connect. Check your microphone permission and try again.')
      setStatus('idle')
    }
  }

  function endCall() {
    try { vapiRef.current?.stop() } catch { /* ignore */ }
    setStatus('idle')
    document.body.classList.remove('vida-speaking')
  }

  if (!canUseVoice) {
    return (
      <a href="/settings/upgrade" style={{
        display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
        background: 'rgba(139,109,181,0.08)', border: '1px solid rgba(139,109,181,0.2)',
        borderRadius: 14, padding: '11px 16px', marginBottom: 12,
      }}>
        <MicIcon />
        <span style={{ fontSize: 12, color: 'rgba(196,184,224,0.8)', fontFamily: DM, fontWeight: 300 }}>
          Talk to Vida out loud — <span style={{ color: '#c4b8e0', fontWeight: 400 }}>upgrade to Voice</span>
        </span>
      </a>
    )
  }

  const live = status === 'live' || status === 'connecting'

  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={live ? endCall : startCall}
        disabled={status === 'connecting'}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: live ? 'rgba(217,95,95,0.12)' : 'linear-gradient(135deg, rgba(155,124,200,0.9), rgba(122,82,176,0.9))',
          border: live ? '1px solid rgba(217,95,95,0.3)' : '1px solid rgba(155,124,200,0.4)',
          color: live ? 'rgba(232,160,160,0.95)' : '#fff',
          borderRadius: 14, padding: '13px 18px', cursor: status === 'connecting' ? 'wait' : 'pointer',
          fontFamily: DM, fontSize: 14, fontWeight: 400,
          boxShadow: live ? 'none' : '0 4px 20px rgba(122,82,176,0.3)',
        }}
      >
        {live ? <StopIcon /> : <MicIcon light />}
        {status === 'connecting' ? 'Connecting…' : status === 'live' ? 'Tap to end call' : 'Talk to Vida'}
      </button>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: DM, fontWeight: 300, textAlign: 'center', marginTop: 6 }}>
        {status === 'live' ? 'Listening — speak naturally' : `${remaining} voice minute${remaining === 1 ? '' : 's'} left this month`}
      </p>
      {error && <p style={{ fontSize: 12, color: 'rgba(232,160,160,0.85)', fontFamily: DM, textAlign: 'center', marginTop: 4 }}>{error}</p>}
    </div>
  )
}

function MicIcon({ light }: { light?: boolean }) {
  const stroke = light ? '#fff' : 'rgba(196,184,224,0.85)'
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(232,160,160,0.95)">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  )
}
