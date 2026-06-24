'use client'
import { useState } from 'react'

export function DeleteAccountButton() {
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  if (confirm) {
    return (
      <div style={{ padding: '16px 20px', background: 'rgba(217,95,95,0.07)' }}>
        <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(232,160,160,0.9)', fontWeight: 300 }}>
          Are you sure? This permanently deletes all your data.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setConfirm(false)} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)',
            background: 'rgba(255,255,255,0.05)', fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.82)', cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>Cancel</button>
          <button disabled={loading} onClick={async () => {
            setLoading(true)
            await fetch('/api/account/delete', { method: 'DELETE' })
            window.location.href = '/'
          }} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: '1px solid rgba(217,95,95,0.22)',
            background: 'rgba(217,95,95,0.12)', fontSize: 14, fontWeight: 300, color: 'rgba(232,160,160,0.9)',
            cursor: loading ? 'wait' : 'pointer',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>
            {loading ? 'Deleting...' : 'Yes, delete'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirm(true)} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      width: '100%', padding: '15px 20px', background: 'transparent',
      border: 'none', cursor: 'pointer',
      fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(232,160,160,0.9)',
        }} />
        <p style={{ margin: 0, fontWeight: 300, fontSize: 15, color: 'rgba(232,160,160,0.9)' }}>Delete account</p>
      </div>
      <span style={{ color: 'rgba(232,160,160,0.6)', fontSize: 18 }}>›</span>
    </button>
  )
}
