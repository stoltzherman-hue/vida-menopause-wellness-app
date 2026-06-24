'use client'
import { useState } from 'react'
import { AddMedicationForm } from './AddMedicationForm'
import { TakenButton } from './TakenButton'

interface Medication {
  id: string; name: string; type: string; dose: string | null
  frequency: string; time_of_day: string[] | null; start_date: string | null; notes: string | null
}

interface Props { initialMeds: Medication[]; takenTodayIds?: string[] }

const TYPE_COLORS: Record<string, string> = {
  HRT: '#9b7cc8', Supplement: '#c4b8e0', Prescription: '#7a52b0', OTC: 'rgba(255,255,255,0.55)', Other: '#c4b8e0',
}

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 20, backdropFilter: 'blur(24px)', padding: '18px 20px',
}

export function MedicationList({ initialMeds, takenTodayIds = [] }: Props) {
  const [meds, setMeds] = useState(initialMeds)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const takenSet = new Set(takenTodayIds)

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await fetch(`/api/medications?id=${id}`, { method: 'DELETE' })
      setMeds((prev) => prev.filter((m) => m.id !== id))
    } finally { setDeleting(null) }
  }

  function handleSaved() { setShowForm(false); window.location.reload() }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {meds.length === 0 && !showForm && (
        <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0, margin: '0 auto 14px',
            background: 'rgba(155,124,200,0.18)',
            border: '1px solid rgba(155,124,200,0.35)',
          }} />
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.88)', marginBottom: 8 }}>No medications yet</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.6 }}>Track your HRT, supplements, and prescriptions to monitor adherence.</p>
        </div>
      )}

      {meds.map((med) => {
        const color = TYPE_COLORS[med.type] ?? 'rgba(255,255,255,0.55)'
        return (
          <div key={med.id} style={card}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  <p style={{ fontWeight: 300, color: 'rgba(255,255,255,0.88)', fontSize: 15, margin: 0 }}>{med.name}</p>
                  <span style={{
                    fontSize: 11, fontWeight: 300, color,
                    background: `rgba(155,124,200,0.12)`, borderRadius: 8, padding: '2px 8px',
                    border: '1px solid rgba(155,124,200,0.2)',
                  }}>{med.type}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 16px', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                  {med.dose && <span>{med.dose}</span>}
                  <span>{med.frequency}</span>
                  {med.time_of_day && med.time_of_day.length > 0 && <span>{med.time_of_day.join(', ')}</span>}
                </div>
                {med.notes && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', marginTop: 4 }}>{med.notes}</p>}
                {med.start_date && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', marginTop: 2 }}>Started {new Date(med.start_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                <div style={{ marginTop: 10 }}>
                  <TakenButton
                    medicationId={med.id}
                    medicationName={med.name}
                    takenToday={takenSet.has(med.id)}
                  />
                </div>
              </div>
              <button
                onClick={() => handleDelete(med.id)}
                disabled={deleting === med.id}
                style={{
                  width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)',
                  background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.32)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, transition: 'all 0.15s', flexShrink: 0,
                }}
                aria-label="Remove"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          </div>
        )
      })}

      {showForm ? (
        <AddMedicationForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          style={{
            height: 52, borderRadius: 16, border: '1px dashed rgba(155,124,200,0.35)',
            background: 'rgba(155,124,200,0.05)', color: '#c4b8e0',
            fontSize: 15, fontWeight: 300, cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            transition: 'all 0.18s',
          }}
        >+ Add medication or supplement</button>
      )}

      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        padding: '14px 18px', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6,
      }}>
        <p style={{ fontWeight: 300, color: 'rgba(255,255,255,0.88)', marginBottom: 4, fontSize: 13 }}>Important</p>
        Never change your medication doses without talking to your prescribing doctor.
      </div>
    </div>
  )
}
