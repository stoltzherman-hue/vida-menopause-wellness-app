'use client'
import { useState } from 'react'
import { AddMedicationForm } from './AddMedicationForm'

interface Medication {
  id: string; name: string; type: string; dose: string | null
  frequency: string; time_of_day: string[] | null; start_date: string | null; notes: string | null
}

interface Props { initialMeds: Medication[] }

const TYPE_COLORS: Record<string, string> = {
  HRT: '#6b9e80', Supplement: '#c47a5a', Prescription: '#c4959e', OTC: '#8a7a72', Other: '#b8a9c9',
}

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.82)',
  border: '1.5px solid rgba(237,224,216,0.7)',
  borderRadius: 20, backdropFilter: 'blur(12px)', padding: '18px 20px',
}

export function MedicationList({ initialMeds }: Props) {
  const [meds, setMeds] = useState(initialMeds)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

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
          <div style={{ fontSize: 40, marginBottom: 14 }}>💊</div>
          <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 700, color: '#3d2c35', marginBottom: 8 }}>No medications yet</h2>
          <p style={{ color: '#8a7a72', fontSize: 14, lineHeight: 1.6 }}>Track your HRT, supplements, and prescriptions to monitor adherence.</p>
        </div>
      )}

      {meds.map((med) => {
        const color = TYPE_COLORS[med.type] ?? '#8a7a72'
        return (
          <div key={med.id} style={card}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  <p style={{ fontWeight: 700, color: '#3d2c35', fontSize: 15, margin: 0 }}>{med.name}</p>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color,
                    background: `${color}18`, borderRadius: 8, padding: '2px 8px',
                  }}>{med.type}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 16px', fontSize: 13, color: '#8a7a72' }}>
                  {med.dose && <span>{med.dose}</span>}
                  <span>{med.frequency}</span>
                  {med.time_of_day && med.time_of_day.length > 0 && <span>{med.time_of_day.join(', ')}</span>}
                </div>
                {med.notes && <p style={{ fontSize: 12, color: '#b8a9a0', marginTop: 4 }}>{med.notes}</p>}
                {med.start_date && <p style={{ fontSize: 12, color: '#b8a9a0', marginTop: 2 }}>Started {new Date(med.start_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
              </div>
              <button
                onClick={() => handleDelete(med.id)}
                disabled={deleting === med.id}
                style={{
                  width: 36, height: 36, borderRadius: 10, border: 'none',
                  background: 'rgba(237,224,216,0.5)', color: '#b8a9a0',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, transition: 'all 0.15s', flexShrink: 0,
                }}
                aria-label="Remove"
              >🗑️</button>
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
            height: 52, borderRadius: 16, border: '1.5px dashed rgba(107,158,128,0.4)',
            background: 'rgba(107,158,128,0.05)', color: '#6b9e80',
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            transition: 'all 0.18s',
          }}
        >+ Add medication or supplement</button>
      )}

      <div style={{
        background: 'rgba(253,248,244,0.8)', borderRadius: 14,
        padding: '14px 18px', fontSize: 13, color: '#8a7a72', lineHeight: 1.6,
      }}>
        <p style={{ fontWeight: 700, color: '#3d2c35', marginBottom: 4, fontSize: 13 }}>Important</p>
        Never change your medication doses without talking to your prescribing doctor.
      </div>
    </div>
  )
}
