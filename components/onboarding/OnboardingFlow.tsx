'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepStage } from './StepStage'
import { StepSymptoms } from './StepSymptoms'
import { StepMedical } from './StepMedical'
import { StepLifestyle } from './StepLifestyle'
import { StepGoals } from './StepGoals'
import { StepConsent } from './StepConsent'
import { StepWellnessPlan } from './StepWellnessPlan'

export interface OnboardingData {
  ageRange: string
  menopauseStage: string
  primarySymptoms: string[]
  hrtStatus: string
  medicalHistory: string[]
  lifestyle: {
    sleepHoursAvg: number | null
    stressLevel: number | null
    alcoholFrequency: string
    caffeineFrequency: string
    exerciseFrequency: string
    dietPreferences: string[]
    smokingStatus: string
  }
  goals: string[]
  consentHealthData: boolean
  consentAiAnalysis: boolean
  consentCommunity: boolean
  consentNotifications: boolean
  consentMarketing: boolean
}

const INITIAL: OnboardingData = {
  ageRange: '', menopauseStage: '', primarySymptoms: [], hrtStatus: '', medicalHistory: [],
  lifestyle: { sleepHoursAvg: null, stressLevel: null, alcoholFrequency: '', caffeineFrequency: '', exerciseFrequency: '', dietPreferences: [], smokingStatus: '' },
  goals: [], consentHealthData: false, consentAiAnalysis: false, consentCommunity: false, consentNotifications: false, consentMarketing: false,
}

const STEPS = ['stage', 'symptoms', 'medical', 'lifestyle', 'goals', 'consent', 'plan'] as const
type Step = typeof STEPS[number]

export function OnboardingFlow() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('stage')
  const [data, setData] = useState<OnboardingData>(INITIAL)
  const [saving, setSaving] = useState(false)

  const stepIndex = STEPS.indexOf(step)
  const progress = Math.round((stepIndex / (STEPS.length - 1)) * 100)

  function update(partial: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...partial }))
  }

  function next() {
    const nextStep = STEPS[stepIndex + 1]
    if (nextStep) setStep(nextStep)
  }

  function back() {
    const prevStep = STEPS[stepIndex - 1]
    if (prevStep) setStep(prevStep)
  }

  async function submit() {
    setSaving(true)
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      next()
    } finally { setSaving(false) }
  }

  const commonProps = { data, update, onNext: next, onBack: back }

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      {step !== 'plan' && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#e2d9d0]">
          <div className="h-full bg-[#5a8a6b] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      )}
      <div className="max-w-xl mx-auto px-4 py-8 pt-10">
        {step !== 'plan' && (
          <div className="text-center mb-8">
            <span className="text-2xl font-bold text-[#5a8a6b]">Vida</span>
            <p className="text-xs text-[#a0aec0] mt-1">Step {stepIndex + 1} of {STEPS.length}</p>
          </div>
        )}
        {step === 'stage' && <StepStage {...commonProps} />}
        {step === 'symptoms' && <StepSymptoms {...commonProps} />}
        {step === 'medical' && <StepMedical {...commonProps} />}
        {step === 'lifestyle' && <StepLifestyle {...commonProps} />}
        {step === 'goals' && <StepGoals {...commonProps} />}
        {step === 'consent' && <StepConsent {...commonProps} onSubmit={submit} saving={saving} />}
        {step === 'plan' && <StepWellnessPlan data={data} onFinish={() => router.push('/dashboard')} />}
      </div>
    </div>
  )
}
