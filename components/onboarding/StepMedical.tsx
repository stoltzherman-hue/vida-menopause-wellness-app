'use client'
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

const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PF = 'var(--font-playfair), Georgia, serif'

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Medical background
        </h1>
        <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Helps us give more relevant information. Private and never shared.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {CONDITIONS.map(({ value, label }) => {
          const sel = data.medicalHistory.includes(value)
          return (
            <button key={value} type="button" onClick={() => toggle(value)}
              style={{
                background: sel ? 'rgba(196,122,90,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${sel ? 'rgba(196,122,90,0.45)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 9999, padding: '9px 18px',
                fontFamily: DM, fontSize: 13, fontWeight: 300,
                color: sel ? 'rgba(255,210,190,0.88)' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
              {label}
            </button>
          )
        })}
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: '14px 16px',
      }}>
        <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.32)', margin: 0, lineHeight: 1.6 }}>
          This information personalises your Vida experience. It is not a medical assessment — Vida does not provide diagnoses.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" onClick={onBack}
          style={{
            flex: 1, padding: '14px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            fontFamily: DM, fontSize: 14, fontWeight: 300,
            color: 'rgba(255,255,255,0.42)', cursor: 'pointer',
          }}>
          Back
        </button>
        <button type="button" onClick={onNext}
          style={{
            flex: 1, padding: '14px',
            background: 'rgba(139,109,181,0.15)',
            border: '1px solid rgba(155,124,200,0.3)',
            borderRadius: 14,
            fontFamily: DM, fontSize: 14, fontWeight: 300,
            color: '#c4b8e0', cursor: 'pointer',
          }}>
          Continue
        </button>
      </div>
    </div>
  )
}
