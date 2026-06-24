'use client'
import { useState } from 'react'

const STAGES = ['Perimenopause', 'Menopause', 'Post-menopause', 'Surgical menopause', 'Not sure']
const GOALS = ['Track my symptoms', 'Understand my patterns', 'Prepare for doctor visits', 'Find community support', 'Learn about menopause', 'Manage mood & anxiety', 'Improve sleep']

const input: React.CSSProperties = {
  width: '100%', padding: '13px 16px', borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.10)', fontSize: 15,
  background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.82)',
  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
  outline: 'none', boxSizing: 'border-box',
}

const label: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.55)', marginBottom: 7,
}

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 22, backdropFilter: 'blur(24px)', padding: '24px 22px', marginBottom: 16,
}

interface Props {
  email: string
  displayName: string
  menopauseStage: string
  dateOfBirth: string
  goals: string[]
}

export function ProfileForm({ email, displayName, menopauseStage, dateOfBirth, goals }: Props) {
  const [name, setName] = useState(displayName)
  const [stage, setStage] = useState(menopauseStage)
  const [dob, setDob] = useState(dateOfBirth)
  const [selectedGoals, setSelectedGoals] = useState<string[]>(goals)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function toggleGoal(g: string) {
    setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/onboarding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: name, menopauseStage: stage, dateOfBirth: dob, goals: selectedGoals }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Could not save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={card}>
        <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 20px' }}>Personal details</p>
        <div style={{ marginBottom: 18 }}>
          <label style={label}>Display name</label>
          <input style={input} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={label}>Email address</label>
          <input style={{ ...input, background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.32)' }} value={email} disabled />
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', marginTop: 5 }}>Email cannot be changed here. Contact support if needed.</p>
        </div>
        <div>
          <label style={label}>Date of birth</label>
          <input style={input} type="date" value={dob} onChange={e => setDob(e.target.value)} />
        </div>
      </div>

      <div style={card}>
        <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 16px' }}>Menopause stage</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {STAGES.map(s => (
            <button
              key={s} type="button" onClick={() => setStage(s)}
              style={{
                padding: '9px 18px', borderRadius: 9999, fontSize: 14, fontWeight: 300, cursor: 'pointer',
                border: stage === s ? 'none' : '1px solid rgba(255,255,255,0.10)',
                background: stage === s ? 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)' : 'rgba(255,255,255,0.05)',
                color: stage === s ? 'white' : 'rgba(255,255,255,0.55)',
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 16px' }}>My goals</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GOALS.map(g => (
            <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontSize: 14, color: 'rgba(255,255,255,0.82)' }}>
              <div
                onClick={() => toggleGoal(g)}
                style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  border: selectedGoals.includes(g) ? 'none' : '1px solid rgba(255,255,255,0.20)',
                  background: selectedGoals.includes(g) ? 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
              >
                {selectedGoals.includes(g) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              {g}
            </label>
          ))}
        </div>
      </div>

      {error && <p style={{ background: 'rgba(217,95,95,0.07)', border: '1px solid rgba(217,95,95,0.22)', borderRadius: 10, padding: '10px 14px', color: 'rgba(232,160,160,0.9)', fontSize: 14, marginBottom: 12 }}>{error}</p>}

      <button
        type="submit" disabled={saving}
        style={{
          width: '100%', padding: '15px', borderRadius: 16, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
          background: saving ? 'rgba(155,124,200,0.4)' : 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)',
          color: 'white', fontSize: 16, fontWeight: 300,
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          boxShadow: '0 4px 18px rgba(155,124,200,0.25)',
          transition: 'opacity 0.2s',
        }}
      >
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
      </button>
    </form>
  )
}
