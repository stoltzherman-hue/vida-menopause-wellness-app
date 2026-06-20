'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const TYPES = ['HRT', 'Supplement', 'Prescription', 'OTC', 'Other']
const FREQUENCIES = ['Daily', 'Twice daily', 'Weekly', 'As needed']
const TIMES_OF_DAY = ['Morning', 'Midday', 'Evening', 'Bedtime']

interface Props {
  onSaved: () => void
  onCancel: () => void
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

  return (
    <Card>
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="med-name">Name *</Label>
            <Input
              id="med-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Estradiol, Vitamin D"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Type *</Label>
            <div className="flex gap-2 flex-wrap mt-1">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm border transition-colors',
                    type === t ? 'bg-[#5a8a6b] text-white border-[#5a8a6b]' : 'border-[#e2d9d0] text-[#718096]'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="med-dose">Dose</Label>
              <Input
                id="med-dose"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="e.g. 1mg, 50IU"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="med-start">Start date</Label>
              <Input
                id="med-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Frequency *</Label>
            <div className="flex gap-2 flex-wrap mt-1">
              {FREQUENCIES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm border transition-colors',
                    frequency === f ? 'bg-[#5a8a6b] text-white border-[#5a8a6b]' : 'border-[#e2d9d0] text-[#718096]'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Time of day</Label>
            <div className="flex gap-2 flex-wrap mt-1">
              {TIMES_OF_DAY.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTime(t)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm border transition-colors',
                    timeOfDay.includes(t) ? 'bg-[#c4959e] text-white border-[#c4959e]' : 'border-[#e2d9d0] text-[#718096]'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="med-notes">Notes</Label>
            <Input
              id="med-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Take with food"
              className="mt-1"
            />
          </div>

          {error && <p className="text-sm text-[#c47a5a]">{error}</p>}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? 'Saving…' : 'Add medication'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
