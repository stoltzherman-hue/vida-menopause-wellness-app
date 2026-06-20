'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { OnboardingData } from './OnboardingFlow'

const AGE_RANGES = ['Under 40','40–44','45–49','50–54','55–59','60–64','65+','Prefer not to say']

const STAGES = [
  { value: 'perimenopause', label: 'Perimenopause', desc: 'Irregular periods, symptoms starting — still having cycles' },
  { value: 'menopause', label: 'Menopause', desc: 'No period for 12 months or just reached this point' },
  { value: 'post_menopause', label: 'Post-menopause', desc: 'More than 12 months since last period' },
  { value: 'surgical_menopause', label: 'Surgical menopause', desc: 'After hysterectomy or oophorectomy' },
  { value: 'premature_ovarian_insufficiency', label: 'Premature ovarian insufficiency', desc: 'Menopause before age 40' },
  { value: 'unsure', label: "I'm not sure", desc: "That's okay — we can help you figure it out" },
]

interface Props { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; onNext: () => void; onBack: () => void }

export function StepStage({ data, update, onNext }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3748]">Welcome to Vida</h1>
        <p className="text-[#718096] mt-2">Let&apos;s personalise your experience. All questions are optional.</p>
      </div>

      <div>
        <p className="font-medium text-[#2d3748] mb-3">What&apos;s your age range? <span className="text-[#a0aec0] font-normal text-sm">(optional)</span></p>
        <div className="flex flex-wrap gap-2">
          {AGE_RANGES.map((age) => (
            <button key={age} type="button" onClick={() => update({ ageRange: data.ageRange === age ? '' : age })}
              className={cn('rounded-full px-4 py-2 text-sm border transition-colors min-h-[40px]', data.ageRange === age ? 'bg-[#5a8a6b] text-white border-[#5a8a6b]' : 'border-[#e2d9d0] text-[#718096] hover:border-[#5a8a6b]')}>
              {age}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-medium text-[#2d3748] mb-3">Where are you in your menopause journey?</p>
        <div className="space-y-2">
          {STAGES.map((s) => (
            <button key={s.value} type="button" onClick={() => update({ menopauseStage: s.value })}
              className={cn('w-full text-left rounded-xl border p-4 transition-all', data.menopauseStage === s.value ? 'border-[#5a8a6b] bg-[#5a8a6b]/5 ring-1 ring-[#5a8a6b]' : 'border-[#e2d9d0] hover:border-[#5a8a6b]/50')}>
              <p className="font-medium text-[#2d3748]">{s.label}</p>
              <p className="text-sm text-[#718096] mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <Button onClick={onNext} className="w-full" size="lg">Continue</Button>
    </div>
  )
}
