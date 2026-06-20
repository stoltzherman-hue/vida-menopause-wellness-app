'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { OnboardingData } from './OnboardingFlow'

const CONDITIONS = [
  { value: 'thyroid', label: 'Thyroid condition' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'cardiovascular', label: 'Cardiovascular disease' },
  { value: 'osteoporosis', label: 'Osteoporosis / osteopenia' },
  { value: 'hypertension', label: 'High blood pressure' },
  { value: 'migraine', label: 'Migraines' },
  { value: 'depression_anxiety', label: 'Depression / anxiety' },
  { value: 'breast_cancer', label: 'Breast cancer history' },
  { value: 'hysterectomy', label: 'Hysterectomy' },
  { value: 'oophorectomy', label: 'Oophorectomy' },
  { value: 'endometriosis', label: 'Endometriosis' },
  { value: 'pcos', label: 'PCOS' },
  { value: 'none', label: 'None of these' },
  { value: 'prefer_not', label: 'Prefer not to say' },
]

interface Props { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; onNext: () => void; onBack: () => void }

export function StepMedical({ data, update, onNext, onBack }: Props) {
  function toggle(value: string) {
    let history = [...data.medicalHistory]
    if (value === 'none' || value === 'prefer_not') {
      history = history.includes(value) ? [] : [value]
    } else {
      history = history.filter((h) => h !== 'none' && h !== 'prefer_not')
      history = history.includes(value) ? history.filter((h) => h !== value) : [...history, value]
    }
    update({ medicalHistory: history })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3748]">Medical background</h1>
        <p className="text-[#718096] mt-2">Helps us give more relevant information. Private and never shared. <span className="text-[#a0aec0]">(optional)</span></p>
      </div>
      <div className="flex flex-wrap gap-2">
        {CONDITIONS.map(({ value, label }) => (
          <button key={value} type="button" onClick={() => toggle(value)}
            className={cn('rounded-full px-4 py-2 text-sm border transition-colors min-h-[40px]', data.medicalHistory.includes(value) ? 'bg-[#c47a5a] text-white border-[#c47a5a]' : 'border-[#e2d9d0] text-[#718096] hover:border-[#c47a5a]')}>
            {label}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#a0aec0] bg-[#f0ece4] rounded-xl px-4 py-3">This information personalises your Vida experience. It is not a medical assessment and Vida does not provide diagnoses.</p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  )
}
