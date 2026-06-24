'use client'
import { useState } from 'react'
import Link from 'next/link'

const input: React.CSSProperties = {
  width: '100%', padding: '13px 16px', borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.10)', fontSize: 15,
  background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.82)',
  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
  outline: 'none', boxSizing: 'border-box',
}

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (next !== confirm) { setError('New passwords do not match.'); return }
    if (next.length < 8) { setError('Password must be at least 8 characters.'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to update password')
      setMessage('Password updated successfully.')
      setCurrent(''); setNext(''); setConfirm('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '28px 16px 100px' }}>
      <Link href="/settings" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.55)', marginBottom: 24, textDecoration: 'none' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Settings
      </Link>
      <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 28px' }}>Change Password</h1>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 22, backdropFilter: 'blur(24px)', padding: '28px 24px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.55)', marginBottom: 7 }}>Current password</label>
            <input className="auth-input" style={input} type="password" value={current} onChange={e => setCurrent(e.target.value)} placeholder="Enter current password" required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.55)', marginBottom: 7 }}>New password</label>
            <input className="auth-input" style={input} type="password" value={next} onChange={e => setNext(e.target.value)} placeholder="At least 8 characters" required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.55)', marginBottom: 7 }}>Confirm new password</label>
            <input className="auth-input" style={input} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat new password" required />
          </div>

          {error && <p style={{ fontSize: 14, color: 'rgba(232,160,160,0.9)', background: 'rgba(217,95,95,0.07)', border: '1px solid rgba(217,95,95,0.22)', borderRadius: 10, padding: '10px 14px', margin: 0 }}>{error}</p>}
          {message && <p style={{ fontSize: 14, color: '#c4b8e0', fontWeight: 300, margin: 0 }}>&#10003; {message}</p>}

          <button
            type="submit" disabled={saving}
            style={{
              padding: '14px', borderRadius: 14, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
              background: saving ? 'rgba(155,124,200,0.4)' : 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)',
              color: 'white', fontSize: 15, fontWeight: 300,
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              boxShadow: saving ? 'none' : '0 4px 20px rgba(155,124,200,0.28)',
            }}
          >
            {saving ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>

      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', textAlign: 'center', marginTop: 20 }}>
        Forgot your password?{' '}
        <Link href="/login" style={{ color: '#c4b8e0', fontWeight: 300 }}>Sign out and reset it</Link>
      </p>
    </div>
  )
}
