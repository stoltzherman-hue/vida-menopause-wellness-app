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

  const DM = 'var(--font-dm-sans), system-ui, sans-serif'
  const PF = 'var(--font-playfair), Georgia, serif'

  return (
    <div style={{ minHeight: '100vh', background: '#09070e', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient orb */}
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,82,176,0.14) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,149,158,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Progress bar */}
      {step !== 'plan' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 2, background: 'rgba(255,255,255,0.06)' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #9b7cc8, #c4b8e0)', width: `${progress}%`, transition: 'width 0.5s ease' }} />
        </div>
      )}

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px 20px 80px', position: 'relative', zIndex: 1 }}>
        {step !== 'plan' && (
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em' }}>
              vida<span style={{ color: '#9b7cc8' }}>.</span>
            </span>
            {step === 'stage' && (
              <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: 'rgba(196,184,224,0.6)', marginTop: 8 }}>
                Welcome — let&apos;s personalise your experience
              </p>
            )}
            <p style={{ fontFamily: DM, fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.22)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Step {stepIndex + 1} of {STEPS.length}
            </p>
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
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: DM, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.22)', padding: '8px 12px' }}
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
