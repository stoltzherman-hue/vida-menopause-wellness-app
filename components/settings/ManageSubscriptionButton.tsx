'use client'
import { useState } from 'react'

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleManage() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) { setError(json.error?.message ?? 'Something went wrong.'); setLoading(false); return }
      window.location.href = json.data.url
    } catch {
      setError('Could not connect. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleManage}
        disabled={loading}
        style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.72)', borderRadius: 12, padding: '10px 18px',
          fontSize: 13, fontWeight: 300, cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          opacity: loading ? 0.6 : 1, transition: 'all 0.2s',
        }}
      >
        {loading ? 'Opening…' : 'Manage subscription'}
      </button>
      {error && <p style={{ fontSize: 12, color: 'rgba(232,160,160,0.8)', marginTop: 6 }}>{error}</p>}
    </div>
  )
}
