'use client'
import { useState } from 'react'

const TYPES = ['HRT', 'Supplement', 'Prescription', 'OTC', 'Other']
const FREQUENCIES = ['Daily', 'Twice daily', 'Weekly', 'As needed']
const TIMES_OF_DAY = ['Morning', 'Midday', 'Evening', 'Bedtime']

interface Props {
  onSaved: () => void
  onCancel: () => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1.5px solid #e2d9d0',
  background: 'rgba(255,255,255,0.85)',
  fontSize: 14,
  fontFamily: 'DM Sans, sans-serif',
  color: '#2d3748',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#3d2c35',
  marginBottom: 6,
  fontFamily: 'DM Sans, sans-serif',
}

export function AddMedicationForm({ onSaved, onCancel }: Props) {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [dose, setDose] = useState('')
  const [frequency, setFrequency] = useState('')
  const [timeOfDay, setTimeOfDay] = useState<string[]>([])
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function toggleTime(t: string) {
    setTimeOfDay((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !type || !frequency) { setError('Please fill in name, type, and frequency.'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, dose, frequency, timeOfDay, startDate, notes }),
      })
      if (res.ok) {
        onSaved()
      } else {
        setError('Failed to save. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  function PillBtn({ label, active, onClick, activeColor = '#6b9e80' }: { label: string; active: boolean; onClick: () => void; activeColor?: string }) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{
          padding: '6px 14px',
          borderRadius: 999,
          fontSize: 13,
          border: active ? `1.5px solid ${activeColor}` : '1.5px solid #e2d9d0',
          background: active ? activeColor : 'rgba(255,255,255,0.7)',
          color: active ? '#fff' : '#718096',
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
          transition: 'all 0.15s',
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      borderRadius: 16,
      border: '1px solid rgba(107,158,128,0.2)',
      padding: 20,
      boxShadow: '0 4px 20px rgba(61,44,53,0.08)',
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Estradiol, Vitamin D"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Type *</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TYPES.map((t) => (
              <PillBtn key={t} label={t} active={type === t} onClick={() => setType(t)} />
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Dose</label>
            <input
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="e.g. 1mg, 50IU"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Frequency *</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FREQUENCIES.map((f) => (
              <PillBtn key={f} label={f} active={frequency === f} onClick={() => setFrequency(f)} />
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Time of day</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TIMES_OF_DAY.map((t) => (
              <PillBtn key={t} label={t} active={timeOfDay.includes(t)} onClick={() => toggleTime(t)} activeColor="#c4959e" />
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Notes</label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Take with food"
            style={inputStyle}
          />
        </div>

        {error && <p style={{ fontSize: 13, color: '#c47a5a', fontFamily: 'DM Sans, sans-serif' }}>{error}</p>}

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '11px 0',
              borderRadius: 10,
              border: '1.5px solid #e2d9d0',
              background: 'transparent',
              color: '#718096',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              flex: 1,
              padding: '11px 0',
              borderRadius: 10,
              border: 'none',
              background: saving ? '#a0aec0' : 'linear-gradient(135deg,#6b9e80,#5a8a6b)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {saving ? 'Saving…' : 'Add medication'}
          </button>
        </div>
      </form>
    </div>
  )
}
