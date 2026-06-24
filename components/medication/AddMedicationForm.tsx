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
  border: '1px solid rgba(255,255,255,0.10)',
  background: 'rgba(255,255,255,0.05)',
  fontSize: 14,
  fontFamily: 'DM Sans, sans-serif',
  color: 'rgba(255,255,255,0.82)',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 300,
  color: 'rgba(255,255,255,0.55)',
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

  function PillBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{
          padding: '6px 14px',
          borderRadius: 999,
          fontSize: 13,
          border: active ? 'none' : '1px solid rgba(255,255,255,0.10)',
          background: active ? 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)' : 'rgba(255,255,255,0.05)',
          color: active ? '#fff' : 'rgba(255,255,255,0.55)',
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
          transition: 'all 0.15s',
          fontWeight: 300,
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(24px)',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.09)',
      padding: 20,
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
              <PillBtn key={t} label={t} active={timeOfDay.includes(t)} onClick={() => toggleTime(t)} />
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

        {error && <p style={{ fontSize: 13, color: 'rgba(232,160,160,0.9)', fontFamily: 'DM Sans, sans-serif', background: 'rgba(217,95,95,0.07)', border: '1px solid rgba(217,95,95,0.22)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '11px 0',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.09)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.55)',
              fontSize: 14,
              fontWeight: 300,
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
              background: saving ? 'rgba(155,124,200,0.4)' : 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 300,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {saving ? 'Saving...' : 'Add medication'}
          </button>
        </div>
      </form>
    </div>
  )
}
