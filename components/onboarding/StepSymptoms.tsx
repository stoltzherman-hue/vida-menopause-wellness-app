'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { OnboardingData } from './OnboardingFlow'

const SYMPTOMS = ['Hot flashes','Night sweats','Insomnia','Restless sleep','Early waking','Anxiety','Mood swings','Irritability','Depression','Brain fog','Memory lapses','Fatigue','Joint pain','Muscle aches','Headaches','Heart palpitations','Dizziness','Weight gain','Bloating','Breast tenderness','Vaginal dryness','Painful intercourse','Decreased libido','Urinary urgency','Frequent urination','Dry skin','Hair thinning','Acne','Tingling / numbness','Chills']

const HRT_OPTIONS = [
  { value: 'yes_hrt', label: 'Yes, on HRT / HT' },
  { value: 'yes_non_hormonal', label: 'Yes, non-hormonal prescription' },
  { value: 'yes_supplements', label: 'Yes, supplements only' },
  { value: 'no', label: 'No medication' },
  { value: 'considering', label: 'Considering starting' },
  { value: 'prefer_not', label: 'Prefer not to say' },
]

interface Props { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; onNext: () => void; onBack: () => void }

export function StepSymptoms({ data, update, onNext, onBack }: Props) {
  function toggle(label: string) {
    const has = data.primarySymptoms.includes(label)
    update({ primarySymptoms: has ? data.primarySymptoms.filter((s) => s !== label) : [...data.primarySymptoms, label] })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3748]">Your symptoms</h1>
        <p className="text-[#718096] mt-2">Select everything you&apos;re experiencing. <span className="text-[#a0aec0]">(optional)</span></p>
      </div>

      <div>
        <p className="font-medium text-[#2d3748] mb-3">Which symptoms are affecting you?</p>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map((label) => (
            <button key={label} type="button" onClick={() => toggle(label)}
              className={cn('rounded-full px-4 py-2 text-sm border transition-colors min-h-[40px]', data.primarySymptoms.includes(label) ? 'bg-[#5a8a6b] text-white border-[#5a8a6b]' : 'border-[#e2d9d0] text-[#718096] hover:border-[#5a8a6b]')}>
              {label}
            </button>
          ))}
        </div>
        {data.primarySymptoms.length > 0 && <p className="text-xs text-[#5a8a6b] mt-3">{data.primarySymptoms.length} selected</p>}
      </div>

      <div>
        <p className="font-medium text-[#2d3748] mb-3">Are you currently taking any medication or HRT?</p>
        <div className="space-y-2">
          {HRT_OPTIONS.map((opt) => (
            <button key={opt.value} type="button" onClick={() => update({ hrtStatus: opt.value })}
              className={cn('w-full text-left rounded-xl border px-4 py-3 text-sm transition-all', data.hrtStatus === opt.value ? 'border-[#5a8a6b] bg-[#5a8a6b]/5 ring-1 ring-[#5a8a6b] font-medium text-[#2d3748]' : 'border-[#e2d9d0] text-[#718096] hover:border-[#5a8a6b]/50')}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  )
}
