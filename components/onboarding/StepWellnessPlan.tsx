'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { OnboardingData } from './OnboardingFlow'

const GOAL_LABELS: Record<string, string> = {
  manage_hot_flashes: 'Managing hot flashes & night sweats',
  improve_sleep: 'Improving sleep quality',
  support_mood: 'Supporting mood & reducing anxiety',
  reduce_brain_fog: 'Reducing brain fog',
  manage_weight: 'Managing weight changes',
  bone_health: 'Supporting bone health',
  heart_health: 'Supporting heart health',
  sexual_health: 'Improving sexual health & comfort',
  doctor_communication: 'Better doctor communication',
  track_patterns: 'Understanding symptom patterns',
  community: 'Connecting with others',
  feel_less_alone: 'Feeling less alone',
}

function generatePlanPoints(data: OnboardingData): string[] {
  const points: string[] = []
  if (data.goals.includes('improve_sleep') || data.primarySymptoms.includes('Insomnia') || data.primarySymptoms.includes('Night sweats')) {
    points.push('Track your sleep quality daily — even small improvements show up in your data over time.')
  }
  if (data.goals.includes('manage_hot_flashes') || data.primarySymptoms.includes('Hot flashes')) {
    points.push('Log hot flash frequency and severity. Your data may reveal patterns related to caffeine, alcohol, or stress triggers.')
  }
  if (data.goals.includes('support_mood') || data.primarySymptoms.includes('Anxiety') || data.primarySymptoms.includes('Mood swings')) {
    points.push('Daily mood tracking can reveal patterns between sleep, symptoms, and emotional wellbeing worth discussing with your provider.')
  }
  if (data.goals.includes('doctor_communication') || data.goals.includes('track_patterns')) {
    points.push('After 4 weeks of check-ins, generate a Doctor Visit Report summarising your symptom trends — a valuable conversation starter.')
  }
  if (data.lifestyle.caffeineFrequency === 'Daily' || data.lifestyle.caffeineFrequency === 'Multiple times daily') {
    points.push('Caffeine is a common trigger for hot flashes and disrupted sleep. Tracking alongside symptoms may reveal useful patterns.')
  }
  if (data.goals.includes('community') || data.goals.includes('feel_less_alone')) {
    points.push('Our community forums and Circles connect you with women at the same stage — free and always available.')
  }
  if (points.length < 3) {
    points.push('Start with a daily check-in — even logging just mood and sleep takes under a minute and builds your wellness picture over time.')
    points.push("Your AI companion is here whenever you need to talk through how you're feeling or prepare for a doctor's appointment.")
  }
  return points.slice(0, 5)
}

interface Props { data: OnboardingData; onFinish: () => void }

export function StepWellnessPlan({ data, onFinish }: Props) {
  const [visible, setVisible] = useState(false)
  const planPoints = generatePlanPoints(data)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 400); return () => clearTimeout(t) }, [])

  return (
    <div className={`space-y-6 transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center space-y-3">
        <div className="text-5xl">🌿</div>
        <h1 className="text-2xl font-bold text-[#2d3748]">Your Vida wellness plan</h1>
        <p className="text-[#718096]">Based on what you&apos;ve shared, here&apos;s where to focus first.</p>
      </div>
      {data.goals.length > 0 && (
        <Card><CardContent className="p-5 space-y-3">
          <p className="font-semibold text-[#2d3748]">Your top goals</p>
          <ul className="space-y-2">
            {data.goals.map((g) => (
              <li key={g} className="flex items-center gap-2 text-sm text-[#718096]">
                <span className="text-[#5a8a6b]">✓</span>{GOAL_LABELS[g] ?? g}
              </li>
            ))}
          </ul>
        </CardContent></Card>
      )}
      <Card><CardContent className="p-5 space-y-4">
        <p className="font-semibold text-[#2d3748]">Personalised starting points</p>
        <ul className="space-y-3">
          {planPoints.map((point, i) => (
            <li key={i} className="flex gap-3 text-sm text-[#718096]">
              <span className="text-[#5a8a6b] font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </CardContent></Card>
      <div className="bg-[#f0ece4] rounded-xl px-4 py-3 text-xs text-[#718096]">
        <p className="font-medium text-[#2d3748] mb-1">Educational support only</p>
        <p>This plan is based on your self-reported information and general wellness evidence. It is not medical advice and does not replace assessment by a qualified healthcare provider. Always discuss symptoms, medications, and treatment decisions with your doctor.</p>
      </div>
      <Button onClick={onFinish} className="w-full" size="lg">Go to my dashboard →</Button>
    </div>
  )
}
