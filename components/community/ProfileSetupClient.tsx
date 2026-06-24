'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STAGES = [
  { value: '', label: 'Prefer not to say' },
  { value: 'perimenopause', label: 'Perimenopause' },
  { value: 'menopause', label: 'Menopause' },
  { value: 'post_menopause', label: 'Post-menopause' },
  { value: 'surgical_menopause', label: 'Surgical menopause' },
  { value: 'premature_ovarian_insufficiency', label: 'POI' },
  { value: 'unsure', label: 'Not sure yet' },
]

const inp: React.CSSProperties = {
  width: '100%', height: 50, borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)',
  padding: '0 16px', fontSize: 15, color: 'rgba(255,255,255,0.82)',
  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', outline: 'none',
  transition: 'border-color 0.18s',
}

export function ProfileSetupClient({ suggestedName, stage }: { suggestedName: string; stage: string }) {
  const router = useRouter()
  const suggested = suggestedName.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').slice(0, 30)
  const [username, setUsername] = useState(suggested)
  const [bio, setBio] = useState('')
  const [selectedStage, setSelectedStage] = useState(stage)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[a-z0-9_]{2,30}$/.test(username)) {
      setError('Username must be 2–30 characters: lowercase letters, numbers, underscores only.')
      return
    }
    setLoading(true); setError('')
    const res = await fetch('/api/community/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, bio, stage: selectedStage, isAnonymous }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) { setError(json.error?.message ?? 'Something went wrong'); return }
    router.push('/community')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {error && (
        <div style={{ background: 'rgba(217,95,95,0.07)', border: '1px solid rgba(217,95,95,0.22)', borderRadius: 12, padding: '12px 16px', color: 'rgba(232,160,160,0.9)', fontSize: 14 }}>{error}</div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: 7 }}>Username <span style={{ color: '#c4b8e0' }}>*</span></label>
        <input
          style={inp}
          value={username}
          onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          placeholder="e.g. sarah_w"
          maxLength={30}
          required
        />
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', marginTop: 5 }}>Lowercase letters, numbers, underscores only. Visible to other members.</p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: 7 }}>Bio <span style={{ color: 'rgba(255,255,255,0.32)', fontWeight: 400 }}>(optional)</span></label>
        <textarea
          style={{ ...inp, height: 88, padding: '14px 16px', resize: 'none', lineHeight: 1.55 } as React.CSSProperties}
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="A little about your journey…"
          maxLength={300}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: 7 }}>Your stage <span style={{ color: 'rgba(255,255,255,0.32)', fontWeight: 400 }}>(optional)</span></label>
        <select
          style={{ ...inp, appearance: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' } as React.CSSProperties}
          value={selectedStage}
          onChange={e => setSelectedStage(e.target.value)}
        >
          {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div
        style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: '14px 16px', cursor: 'pointer' }}
        onClick={() => setIsAnonymous(v => !v)}
      >
        <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${isAnonymous ? '#9b7cc8' : 'rgba(255,255,255,0.18)'}`, background: isAnonymous ? '#9b7cc8' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.15s' }}>
          {isAnonymous && <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>}
        </div>
        <div>
          <p style={{ fontWeight: 500, color: 'rgba(255,255,255,0.88)', fontSize: 14, marginBottom: 2 }}>Post anonymously by default</p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.5 }}>Your username won&apos;t show on posts. You can change this per post.</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{ height: 52, borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #9b7cc8, #7a52b0)', color: 'white', fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', boxShadow: '0 4px 18px rgba(155,124,200,0.35)', transition: 'all 0.2s' }}
      >
        {loading ? 'Creating profile…' : 'Create community profile'}
      </button>
    </form>
  )
}
