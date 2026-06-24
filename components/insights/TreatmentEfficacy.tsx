'use client'

import { useState } from 'react'

const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PF = 'var(--font-playfair), Georgia, serif'

interface BeforeAfter {
  avgMood: number | null
  avgSleep: number | null
  hotFlushDays: number
  totalDays: number
}

interface Props {
  treatmentStartDate: string | null
  before: BeforeAfter | null
  after: BeforeAfter | null
  hasEnoughData: boolean
}

function Metric({ label, before, after, unit = '' }: { label: string; before: number | null; after: number | null; unit?: string }) {
  if (before == null && after == null) return null
  const diff = before != null && after != null ? after - before : null
  const positive = diff != null && diff > 0
  const negative = diff != null && diff < 0

  return (
    <div>
      <p style={{ fontFamily: DM, fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
        {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: PF, fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1 }}>
            {before != null ? before.toFixed(1) : '—'}{unit}
          </p>
          <p style={{ fontFamily: DM, fontSize: 10, color: 'rgba(255,255,255,0.22)', margin: '4px 0 0' }}>Before</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: PF, fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: 0, lineHeight: 1 }}>
            {after != null ? after.toFixed(1) : '—'}{unit}
          </p>
          <p style={{ fontFamily: DM, fontSize: 10, color: 'rgba(255,255,255,0.22)', margin: '4px 0 0' }}>After</p>
        </div>
        {diff != null && Math.abs(diff) >= 0.3 && (
          <div style={{
            padding: '3px 9px', borderRadius: 9999,
            background: positive ? 'rgba(107,158,128,0.12)' : 'rgba(196,122,90,0.12)',
            border: `1px solid ${positive ? 'rgba(107,158,128,0.25)' : 'rgba(196,122,90,0.25)'}`,
          }}>
            <span style={{
              fontFamily: DM, fontSize: 11, fontWeight: 400,
              color: positive ? 'rgba(107,158,128,0.9)' : 'rgba(196,122,90,0.9)',
            }}>
              {positive ? '+' : ''}{diff.toFixed(1)}
            </span>
          </div>
        )}
        {negative && (
          <></>
        )}
      </div>
    </div>
  )
}

export function TreatmentEfficacy({ treatmentStartDate, before, after, hasEnoughData }: Props) {
  const [editing, setEditing] = useState(false)
  const [dateVal, setDateVal] = useState(treatmentStartDate ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/user/treatment-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateVal || null }),
      })
      setSaved(true)
      setEditing(false)
      setTimeout(() => { window.location.reload() }, 300)
    } finally {
      setSaving(false)
    }
  }

  async function handleClear() {
    setSaving(true)
    try {
      await fetch('/api/user/treatment-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: null }),
      })
      setDateVal('')
      setEditing(false)
      setTimeout(() => { window.location.reload() }, 300)
    } finally {
      setSaving(false)
    }
  }

  // No date set — show prompt
  if (!treatmentStartDate && !editing) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 18, padding: '18px 20px', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ fontFamily: DM, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.5)', margin: '0 0 3px' }}>
            Track your treatment progress
          </p>
          <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.25)', margin: 0, lineHeight: 1.5 }}>
            Add the date you started HRT or any treatment to see a before / after comparison.
          </p>
        </div>
        <button onClick={() => setEditing(true)} style={{
          flexShrink: 0, padding: '9px 18px', borderRadius: 9999,
          background: 'rgba(155,124,200,0.1)', border: '1px solid rgba(155,124,200,0.22)',
          color: '#c4b8e0', fontFamily: DM, fontSize: 12, fontWeight: 300,
          cursor: 'pointer',
        }}>
          Add start date
        </button>
      </div>
    )
  }

  // Editing mode
  if (editing || (!treatmentStartDate && editing)) {
    return (
      <div style={{
        background: 'rgba(155,124,200,0.05)', border: '1px solid rgba(155,124,200,0.15)',
        borderRadius: 18, padding: '18px 20px', marginBottom: 16,
      }}>
        <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 400, color: 'rgba(196,184,224,0.6)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Treatment start date
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="date"
            value={dateVal}
            onChange={(e) => setDateVal(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, padding: '9px 14px', color: 'rgba(255,255,255,0.75)',
              fontFamily: DM, fontSize: 14, fontWeight: 300, outline: 'none',
            }}
          />
          <button onClick={handleSave} disabled={saving || !dateVal} style={{
            padding: '9px 20px', borderRadius: 10, border: 'none', cursor: saving ? 'wait' : 'pointer',
            background: 'rgba(155,124,200,0.2)', color: '#c4b8e0',
            fontFamily: DM, fontSize: 13, fontWeight: 300,
            opacity: !dateVal ? 0.4 : 1,
          }}>
            {saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
          </button>
          <button onClick={() => setEditing(false)} style={{
            padding: '9px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'rgba(255,255,255,0.3)',
            fontFamily: DM, fontSize: 13, fontWeight: 300,
          }}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // Date set — show comparison
  const formatted = new Date(treatmentStartDate!).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{
      background: 'rgba(107,158,128,0.04)', border: '1px solid rgba(107,158,128,0.14)',
      borderRadius: 24, padding: '24px 24px', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <div>
          <p style={{ fontFamily: DM, fontSize: 10, fontWeight: 400, color: 'rgba(107,158,128,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 5px' }}>
            Treatment progress
          </p>
          <h3 style={{ fontFamily: PF, fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: 0, letterSpacing: '-0.02em' }}>
            Before &amp; after {formatted}
          </h3>
        </div>
        <button onClick={() => setEditing(true)} style={{
          padding: '6px 12px', borderRadius: 9999,
          background: 'transparent', border: '1px solid rgba(255,255,255,0.09)',
          color: 'rgba(255,255,255,0.28)', fontFamily: DM, fontSize: 11, fontWeight: 300,
          cursor: 'pointer', flexShrink: 0,
        }}>
          Edit date
        </button>
      </div>

      {!hasEnoughData ? (
        <p style={{ fontFamily: DM, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.6 }}>
          You need check-in data both before and after {formatted} to see a comparison. Keep tracking daily and this will populate automatically.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20 }}>
          {before && after && (
            <>
              <Metric label="Avg mood" before={before.avgMood} after={after.avgMood} unit="/10" />
              <Metric label="Avg sleep" before={before.avgSleep} after={after.avgSleep} unit="h" />
              <div>
                <p style={{ fontFamily: DM, fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  Hot flush days
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: PF, fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1 }}>
                      {before.totalDays > 0 ? Math.round((before.hotFlushDays / before.totalDays) * 100) : 0}%
                    </p>
                    <p style={{ fontFamily: DM, fontSize: 10, color: 'rgba(255,255,255,0.22)', margin: '4px 0 0' }}>Before</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: PF, fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: 0, lineHeight: 1 }}>
                      {after.totalDays > 0 ? Math.round((after.hotFlushDays / after.totalDays) * 100) : 0}%
                    </p>
                    <p style={{ fontFamily: DM, fontSize: 10, color: 'rgba(255,255,255,0.22)', margin: '4px 0 0' }}>After</p>
                  </div>
                  {(() => {
                    const bPct = before.totalDays > 0 ? (before.hotFlushDays / before.totalDays) * 100 : 0
                    const aPct = after.totalDays > 0 ? (after.hotFlushDays / after.totalDays) * 100 : 0
                    const diff = aPct - bPct
                    if (Math.abs(diff) < 5) return null
                    const improved = diff < 0
                    return (
                      <div style={{
                        padding: '3px 9px', borderRadius: 9999,
                        background: improved ? 'rgba(107,158,128,0.12)' : 'rgba(196,122,90,0.12)',
                        border: `1px solid ${improved ? 'rgba(107,158,128,0.25)' : 'rgba(196,122,90,0.25)'}`,
                      }}>
                        <span style={{ fontFamily: DM, fontSize: 11, fontWeight: 400, color: improved ? 'rgba(107,158,128,0.9)' : 'rgba(196,122,90,0.9)' }}>
                          {improved ? '' : '+'}{diff.toFixed(0)}%
                        </span>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {hasEnoughData && (
        <p style={{ fontFamily: DM, fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.2)', margin: '16px 0 0', lineHeight: 1.6 }}>
          Based on your check-in data. Self-reported values only — discuss trends with your healthcare provider.
        </p>
      )}
    </div>
  )
}
