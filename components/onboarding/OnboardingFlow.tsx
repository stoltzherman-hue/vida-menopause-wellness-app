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
    <div style={{ minHeight: '100vh', backgroundColor: '#faf8f4' }}>
      {step !== 'plan' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '4px', backgroundColor: '#e2d9d0' }}>
          <div style={{ height: '100%', backgroundColor: '#5a8a6b', width: `${progress}%`, transition: 'width 0.5s ease' }} />
        </div>
      )}
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 16px 32px' }}>
        {step !== 'plan' && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#3d2c35' }}>Vida</span>
            {step === 'stage' && (
              <p style={{ fontSize: '16px', color: '#5a8a6b', marginTop: '6px', fontStyle: 'italic' }}>
                Welcome to Vida 🌸
              </p>
            )}
            <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Step {stepIndex + 1} of {STEPS.length}
            </p>
            {step === 'stage' && (
              <p style={{ fontSize: '14px', color: '#718096', marginTop: '8px' }}>
                Tell us a little about yourself so we can personalise your experience
              </p>
            )}
          </div>
        )}
        {step === 'stage' && <StepStage {...commonProps} />}
        {step === 'symptoms' && <StepSymptoms {...commonProps} />}
        {step === 'medical' && <StepMedical {...commonProps} />}
        {step === 'lifestyle' && <StepLifestyle {...commonProps} />}
        {step === 'goals' && <StepGoals {...commonProps} />}
        {step === 'consent' && <StepConsent {...commonProps} onSubmit={submit} saving={saving} />}
        {step === 'plan' && <StepWellnessPlan data={data} onFinish={() => router.push('/dashboard')} />}
        {step !== 'plan' && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#a0aec0', textDecoration: 'none', padding: '8px 12px' }}
            >
              Skip for now →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
