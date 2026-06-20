'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const TRIGGERS = ['Alcohol','Caffeine','Spicy food','Sugar','Stress','Poor sleep','Heat','Exercise','Missed medication','Travel','Conflict','Workload','Illness']

function ScaleButton({ value, selected, onClick, color = '#5a8a6b' }: { value: number; selected: boolean; onClick: () => void; color?: string }) {
  return (
    <button type="button" onClick={onClick}
      className={cn('w-10 h-10 rounded-full text-sm font-medium border-2 transition-all', selected ? 'text-white border-transparent' : 'border-[#e2d9d0] text-[#718096] hover:border-[#5a8a6b]')}
      style={selected ? { backgroundColor: color, borderColor: color } : undefined}>
      {value}
    </button>
  )
}

export function CheckInForm() {
  const [mood, setMood] = useState<number | null>(null)
  const [energy, setEnergy] = useState<number | null>(null)
  const [sleepHours, setSleepHours] = useState<number | null>(null)
  const [sleepQuality, setSleepQuality] = useState<number | null>(null)
  const [hotFlashSeverity, setHotFlashSeverity] = useState<number | null>(null)
  const [triggers, setTriggers] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggleTrigger(t: string) {
    setTriggers((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkinDate: new Date().toISOString().split('T')[0], mood, energyLevel: energy, sleepHours, sleepQuality, hotFlashSeverity, triggers }),
      })
      if (res.ok) setSaved(true)
    } finally { setSaving(false) }
  }

  if (saved) return (
    <Card><CardContent className="py-12 text-center space-y-3">
      <div className="text-5xl">🌿</div>
      <h2 className="text-xl font-semibold text-[#2d3748]">Check-in saved!</h2>
      <p className="text-[#718096]">Great job tracking today. Every entry helps reveal your patterns.</p>
      <Button onClick={() => setSaved(false)} variant="outline" className="mt-4">Log another</Button>
    </CardContent></Card>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card><CardHeader className="pb-3"><CardTitle className="text-base">Mood</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">{[1,2,3,4,5,6,7,8,9,10].map((v) => <ScaleButton key={v} value={v} selected={mood===v} onClick={() => setMood(v)} />)}</div>
          <div className="flex justify-between text-xs text-[#a0aec0] mt-2 px-1"><span>Low</span><span>Great</span></div>
        </CardContent>
      </Card>

      <Card><CardHeader className="pb-3"><CardTitle className="text-base">Energy level</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">{[1,2,3,4,5,6,7,8,9,10].map((v) => <ScaleButton key={v} value={v} selected={energy===v} onClick={() => setEnergy(v)} color="#c47a5a" />)}</div>
          <div className="flex justify-between text-xs text-[#a0aec0] mt-2 px-1"><span>Exhausted</span><span>Energised</span></div>
        </CardContent>
      </Card>

      <Card><CardHeader className="pb-3"><CardTitle className="text-base">Sleep last night</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-[#718096] mb-2">Hours</p>
            <div className="flex gap-2 flex-wrap">{[4,5,6,7,8,9,10].map((v) => <ScaleButton key={v} value={v} selected={sleepHours===v} onClick={() => setSleepHours(v)} color="#c4959e" />)}</div>
          </div>
          <div>
            <p className="text-sm text-[#718096] mb-2">Quality</p>
            <div className="flex gap-2">{[1,2,3,4,5].map((v) => <ScaleButton key={v} value={v} selected={sleepQuality===v} onClick={() => setSleepQuality(v)} color="#c4959e" />)}</div>
            <div className="flex justify-between text-xs text-[#a0aec0] mt-2 px-1"><span>Poor</span><span>Excellent</span></div>
          </div>
        </CardContent>
      </Card>

      <Card><CardHeader className="pb-3"><CardTitle className="text-base">Hot flashes today?</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2">{[1,2,3,4,5].map((v) => <ScaleButton key={v} value={v} selected={hotFlashSeverity===v} onClick={() => setHotFlashSeverity(v)} />)}</div>
          <div className="flex justify-between text-xs text-[#a0aec0] mt-2 px-1"><span>Mild</span><span>Severe</span></div>
        </CardContent>
      </Card>

      <Card><CardHeader className="pb-3"><CardTitle className="text-base">Any triggers today?</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {TRIGGERS.map((t) => (
              <button type="button" key={t} onClick={() => toggleTrigger(t)}
                className={cn('rounded-full px-4 py-2 text-sm border transition-colors min-h-[40px]', triggers.includes(t) ? 'bg-[#5a8a6b] text-white border-[#5a8a6b]' : 'border-[#e2d9d0] text-[#718096] hover:border-[#5a8a6b]')}>
                {t}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" size="lg" disabled={saving}>{saving ? 'Saving…' : 'Save check-in'}</Button>
    </form>
  )
}
