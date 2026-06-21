'use client'
import { useState } from 'react'

export function DeleteAccountButton() {
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  if (confirm) {
    return (
      <div style={{ padding: '16px 20px', background: 'rgba(192,57,43,0.04)' }}>
        <p style={{ margin: '0 0 12px', fontSize: 14, color: '#c0392b', fontWeight: 600 }}>
          Are you sure? This permanently deletes all your data.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setConfirm(false)} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: '1.5px solid rgba(237,224,216,0.8)',
            background: 'white', fontSize: 14, fontWeight: 600, color: '#3d2c35', cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>Cancel</button>
          <button disabled={loading} onClick={async () => {
            setLoading(true)
            await fetch('/api/account/delete', { method: 'DELETE' })
            window.location.href = '/'
          }} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: 'none',
            background: '#c0392b', fontSize: 14, fontWeight: 600, color: 'white',
            cursor: loading ? 'wait' : 'pointer',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          }}>
            {loading ? 'Deleting…' : 'Yes, delete'}
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
        <span style={{ fontSize: 20 }}>🗑️</span>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: '#c0392b' }}>Delete account</p>
      </div>
      <span style={{ color: '#e99', fontSize: 18 }}>›</span>
    </button>
  )
}
