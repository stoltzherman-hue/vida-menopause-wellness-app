'use client'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AddMedicationForm } from './AddMedicationForm'
import { Pill, Plus, Trash2 } from 'lucide-react'

interface Medication {
  id: string
  name: string
  type: string
  dose: string | null
  frequency: string
  time_of_day: string[] | null
  start_date: string | null
  notes: string | null
}

interface Props {
  initialMeds: Medication[]
}

const TYPE_COLORS: Record<string, string> = {
  HRT: '#5a8a6b',
  Supplement: '#c47a5a',
  Prescription: '#c4959e',
  OTC: '#718096',
  Other: '#a0aec0',
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
    } finally {
      setDeleting(null)
    }
  }

  function handleSaved() {
    setShowForm(false)
    window.location.reload()
  }

  return (
    <div className="space-y-4">
      {meds.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <div className="rounded-full bg-[#c4959e]/10 p-4 w-16 h-16 mx-auto flex items-center justify-center">
              <Pill size={28} className="text-[#c4959e]" />
            </div>
            <h2 className="text-lg font-semibold text-[#2d3748]">No medications yet</h2>
            <p className="text-sm text-[#718096]">Track your HRT, supplements, and prescriptions to monitor adherence.</p>
          </CardContent>
        </Card>
      )}

      {meds.map((med) => (
        <Card key={med.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-[#2d3748]">{med.name}</p>
                  <Badge
                    className="text-xs"
                    style={{ backgroundColor: `${TYPE_COLORS[med.type] ?? '#718096'}20`, color: TYPE_COLORS[med.type] ?? '#718096' }}
                  >
                    {med.type}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-[#718096]">
                  {med.dose && <span>{med.dose}</span>}
                  <span>{med.frequency}</span>
                  {med.time_of_day && med.time_of_day.length > 0 && (
                    <span>{med.time_of_day.join(', ')}</span>
                  )}
                </div>
                {med.notes && <p className="text-xs text-[#a0aec0]">{med.notes}</p>}
                {med.start_date && (
                  <p className="text-xs text-[#a0aec0]">
                    Started {new Date(med.start_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(med.id)}
                disabled={deleting === med.id}
                className="p-2 rounded-lg hover:bg-[#f0ece4] text-[#a0aec0] hover:text-[#c47a5a] transition-colors flex-shrink-0"
                aria-label="Remove medication"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}

      {showForm ? (
        <AddMedicationForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
      ) : (
        <Button
          onClick={() => setShowForm(true)}
          variant="outline"
          className="w-full gap-2"
        >
          <Plus size={16} />
          Add medication or supplement
        </Button>
      )}

      <div className="bg-[#f0ece4] rounded-xl px-4 py-3 text-xs text-[#718096]">
        <p className="font-medium text-[#2d3748] mb-1">Important</p>
        <p>This tracker is for your personal reference only. Never change your medication doses without talking to your prescribing doctor.</p>
      </div>
    </div>
  )
}
