'use client'
import { useState } from 'react'

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCancel() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payfast/cancel', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) { setError(json.error?.message ?? 'Something went wrong.'); setLoading(false); setConfirming(false); return }
      setDone(true)
      setLoading(false)
    } catch {
      setError('Could not connect. Please try again.')
      setLoading(false)
      setConfirming(false)
    }
  }

  if (done) {
    return (
      <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(196,184,224,0.75)', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
        Your subscription is cancelled. You keep Premium until the end of your current billing period.
      </p>
    )
  }

  return (
    <div>
      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.72)', borderRadius: 12, padding: '10px 18px',
            fontSize: 13, fontWeight: 300, cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            transition: 'all 0.2s',
          }}
        >
          Cancel subscription
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
            Cancel Premium? You keep access until the end of the billing period.
          </span>
          <button
            onClick={handleCancel}
            disabled={loading}
            style={{
              background: 'rgba(232,160,160,0.1)', border: '1px solid rgba(232,160,160,0.3)',
              color: 'rgba(232,160,160,0.85)', borderRadius: 12, padding: '8px 16px',
              fontSize: 13, fontWeight: 300, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Cancelling…' : 'Yes, cancel'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={loading}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
              fontSize: 13, fontWeight: 300, cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            }}
          >
            Keep Premium
          </button>
        </div>
      )}
      {error && <p style={{ fontSize: 12, color: 'rgba(232,160,160,0.8)', marginTop: 6 }}>{error}</p>}
    </div>
  )
}
