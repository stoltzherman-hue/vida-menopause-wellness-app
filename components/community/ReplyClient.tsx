'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ReplyClient({ postId, username }: { postId: string; username: string }) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setLoading(true); setError('')
    const res = await fetch('/api/community/replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, body: body.trim() }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) { setError(json.error?.message ?? 'Failed to post reply'); return }
    setBody('')
    router.refresh()
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, padding: '18px 20px' }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>
        Reply as <span style={{ color: '#9b7cc8' }}>{username}</span>
      </p>
      {error && (
        <div style={{ background: 'rgba(217,95,95,0.07)', border: '1px solid rgba(217,95,95,0.22)', borderRadius: 10, padding: '10px 14px', color: 'rgba(232,160,160,0.9)', fontSize: 13, marginBottom: 12 }}>{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          style={{ width: '100%', minHeight: 90, borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)', padding: '12px 14px', fontSize: 14, color: 'rgba(255,255,255,0.82)', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', outline: 'none', resize: 'vertical', lineHeight: 1.6 } as React.CSSProperties}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Write a reply…"
          maxLength={5000}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <button
            type="submit"
            disabled={loading || !body.trim()}
            style={{ height: 40, padding: '0 22px', borderRadius: 12, border: 'none', background: body.trim() ? 'linear-gradient(135deg, #9b7cc8, #7a52b0)' : 'rgba(255,255,255,0.07)', color: body.trim() ? 'white' : 'rgba(255,255,255,0.32)', fontSize: 14, fontWeight: 600, cursor: body.trim() ? 'pointer' : 'default', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', transition: 'all 0.2s' }}
          >
            {loading ? 'Posting…' : 'Post reply'}
          </button>
        </div>
      </form>
    </div>
  )
}
