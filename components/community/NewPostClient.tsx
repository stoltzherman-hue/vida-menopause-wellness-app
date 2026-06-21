'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inp: React.CSSProperties = {
  width: '100%', borderRadius: 14, border: '1.5px solid #ede0d8',
  background: 'rgba(255,255,255,0.9)', fontSize: 15, color: '#3d2c35',
  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', outline: 'none',
}

export function NewPostClient({ categoryId, slug }: { categoryId: string; slug: string }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryId, title: title.trim(), body: body.trim() }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) { setError(json.error?.message ?? 'Failed to create post'); return }
    router.push(`/community/${slug}/${json.data.id}`)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 12, padding: '12px 16px', color: '#c0392b', fontSize: 14 }}>{error}</div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#5a4a52', marginBottom: 7 }}>Title</label>
        <input
          style={{ ...inp, height: 50, padding: '0 16px' } as React.CSSProperties}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={300}
          required
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#5a4a52', marginBottom: 7 }}>Your post</label>
        <textarea
          style={{ ...inp, height: 200, padding: '14px 16px', resize: 'vertical', lineHeight: 1.65 } as React.CSSProperties}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Share your experience, question, or story…"
          maxLength={10000}
          required
        />
        <p style={{ fontSize: 12, color: '#c0b4ac', marginTop: 4 }}>{body.length.toLocaleString()} / 10,000</p>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ flex: 1, height: 50, borderRadius: 14, border: '1.5px solid #ede0d8', background: 'white', color: '#8a7a72', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !title.trim() || !body.trim()}
          style={{ flex: 2, height: 50, borderRadius: 14, border: 'none', background: title.trim() && body.trim() ? '#6b9e80' : '#e8e0da', color: title.trim() && body.trim() ? 'white' : '#a09098', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', boxShadow: title.trim() && body.trim() ? '0 3px 14px rgba(107,158,128,0.32)' : 'none', transition: 'all 0.2s' }}
        >
          {loading ? 'Posting…' : 'Post'}
        </button>
      </div>
    </form>
  )
}
