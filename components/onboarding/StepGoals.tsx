'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { OnboardingData } from './OnboardingFlow'

const GOALS = [
  { value: 'manage_hot_flashes', label: 'Manage hot flashes & night sweats', emoji: '🌡️' },
  { value: 'improve_sleep', label: 'Improve sleep quality', emoji: '😴' },
  { value: 'support_mood', label: 'Support mood & reduce anxiety', emoji: '🧘' },
  { value: 'reduce_brain_fog', label: 'Reduce brain fog & improve focus', emoji: '🧠' },
  { value: 'manage_weight', label: 'Manage weight changes', emoji: '⚖️' },
  { value: 'bone_health', label: 'Support bone health', emoji: '💪' },
  { value: 'heart_health', label: 'Support heart health', emoji: '❤️' },
  { value: 'sexual_health', label: 'Improve sexual health & comfort', emoji: '🌸' },
  { value: 'doctor_communication', label: 'Better communicate with my doctor', emoji: '🏥' },
  { value: 'track_patterns', label: 'Understand my symptom patterns', emoji: '📊' },
  { value: 'community', label: 'Connect with others who understand', emoji: '👭' },
  { value: 'feel_less_alone', label: 'Feel less alone in this journey', emoji: '💚' },
]

interface Props { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; onNext: () => void; onBack: () => void }

export function StepGoals({ data, update, onNext, onBack }: Props) {
  function toggle(value: string) {
    const has = data.goals.includes(value)
    if (has) { update({ goals: data.goals.filter((g) => g !== value) }) }
    else if (data.goals.length < 3) { update({ goals: [...data.goals, value] }) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3748]">Your goals</h1>
        <p className="text-[#718096] mt-2">What matters most right now? Pick up to 3. <span className="text-[#a0aec0]">(optional)</span></p>
      </div>
      <div className="grid gap-2">
        {GOALS.map(({ value, label, emoji }) => {
          const selected = data.goals.includes(value)
          const maxed = data.goals.length >= 3 && !selected
          return (
            <button key={value} type="button" onClick={() => toggle(value)} disabled={maxed}
              className={cn('w-full text-left rounded-xl border px-4 py-3 transition-all flex items-center gap-3', selected ? 'border-[#5a8a6b] bg-[#5a8a6b]/5 ring-1 ring-[#5a8a6b]' : maxed ? 'border-[#e2d9d0] opacity-40 cursor-not-allowed' : 'border-[#e2d9d0] hover:border-[#5a8a6b]/50')}>
              <span className="text-xl">{emoji}</span>
              <span className={cn('text-sm', selected ? 'font-medium text-[#2d3748]' : 'text-[#718096]')}>{label}</span>
              {selected && <span className="ml-auto text-[#5a8a6b] text-xs font-semibold">#{data.goals.indexOf(value) + 1}</span>}
            </button>
          )
        })}
      </div>
      {data.goals.length > 0 && <p className="text-sm text-[#5a8a6b]">{data.goals.length}/3 selected</p>}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  )
}
