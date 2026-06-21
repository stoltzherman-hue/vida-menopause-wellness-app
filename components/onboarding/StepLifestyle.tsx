'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { OnboardingData } from './OnboardingFlow'

const FREQ = ['Never / rarely','1–2 times/week','3–4 times/week','Daily','Multiple times daily']
const EXERCISE = ['Sedentary','Light (1–2x/week)','Moderate (3–4x/week)','Active (5+x/week)']
const SMOKE = ['Never','Former smoker','Current smoker','Vaping','Prefer not to say']
const DIET = ['Omnivore','Vegetarian','Vegan','Gluten-free','Dairy-free','Low carb','Mediterranean','Other']

function Chips({ options, selected, onToggle }: { options: string[]; selected: string | string[]; onToggle: (v: string) => void }) {
  const sel = Array.isArray(selected) ? selected : [selected]
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button key={opt} type="button" onClick={() => onToggle(opt)}
          className={cn('rounded-full px-4 py-2 text-sm border transition-colors min-h-[40px]', sel.includes(opt) ? 'bg-[#5a8a6b] text-white border-[#5a8a6b]' : 'border-[#e2d9d0] text-[#718096] hover:border-[#5a8a6b]')}>
          {opt}
        </button>
      ))}
    </div>
  )
}

interface Props { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; onNext: () => void; onBack: () => void }

export function StepLifestyle({ data, update, onNext, onBack }: Props) {
  const ls = data.lifestyle
  function upLs(p: Partial<typeof ls>) { update({ lifestyle: { ...ls, ...p } }) }
  function toggleDiet(v: string) {
    const has = ls.dietPreferences.includes(v)
    upLs({ dietPreferences: has ? ls.dietPreferences.filter((d) => d !== v) : [...ls.dietPreferences, v] })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3748]">Your lifestyle</h1>
        <p className="text-[#718096] mt-2">Lifestyle factors can significantly affect symptoms. All optional.</p>
      </div>
      <div className="space-y-5">
        <div><p className="font-medium text-[#2d3748] mb-3">Alcohol</p><Chips options={FREQ} selected={ls.alcoholFrequency} onToggle={(v) => upLs({ alcoholFrequency: ls.alcoholFrequency === v ? '' : v })} /></div>
        <div><p className="font-medium text-[#2d3748] mb-3">Caffeine</p><Chips options={FREQ} selected={ls.caffeineFrequency} onToggle={(v) => upLs({ caffeineFrequency: ls.caffeineFrequency === v ? '' : v })} /></div>
        <div><p className="font-medium text-[#2d3748] mb-3">Exercise</p><Chips options={EXERCISE} selected={ls.exerciseFrequency} onToggle={(v) => upLs({ exerciseFrequency: ls.exerciseFrequency === v ? '' : v })} /></div>
        <div>
          <p className="font-medium text-[#2d3748] mb-3">Typical sleep hours</p>
          <div className="flex gap-2 flex-wrap">
            {[4,5,6,7,8,9,10].map((h) => (
              <button key={h} type="button" onClick={() => upLs({ sleepHoursAvg: ls.sleepHoursAvg === h ? null : h })}
                className={cn('w-12 h-12 rounded-full text-sm font-medium border-2 transition-all', ls.sleepHoursAvg === h ? 'bg-[#5a8a6b] text-white border-[#5a8a6b]' : 'border-[#e2d9d0] text-[#718096] hover:border-[#5a8a6b]')}>
                {h}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium text-[#2d3748] mb-3">Average stress level</p>
          <div className="flex gap-2 flex-wrap">
            {[1,2,3,4,5,6,7,8,9,10].map((v) => (
              <button key={v} type="button" onClick={() => upLs({ stressLevel: ls.stressLevel === v ? null : v })}
                className={cn('w-10 h-10 rounded-full text-sm font-medium border-2 transition-all', ls.stressLevel === v ? 'bg-[#c47a5a] text-white border-[#c47a5a]' : 'border-[#e2d9d0] text-[#718096] hover:border-[#c47a5a]')}>
                {v}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-[#a0aec0] mt-1 px-1"><span>Low</span><span>High</span></div>
        </div>
        <div><p className="font-medium text-[#2d3748] mb-3">Diet</p><Chips options={DIET} selected={ls.dietPreferences} onToggle={toggleDiet} /></div>
        <div><p className="font-medium text-[#2d3748] mb-3">Smoking / vaping</p><Chips options={SMOKE} selected={ls.smokingStatus} onToggle={(v) => upLs({ smokingStatus: ls.smokingStatus === v ? '' : v })} /></div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  )
}
