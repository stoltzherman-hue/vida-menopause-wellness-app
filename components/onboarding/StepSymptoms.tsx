'use client'
import type { OnboardingData } from './OnboardingFlow'

const SYMPTOMS = ['Hot flashes', 'Night sweats', 'Insomnia', 'Restless sleep', 'Early waking', 'Anxiety', 'Mood swings', 'Irritability', 'Depression', 'Brain fog', 'Memory lapses', 'Fatigue', 'Joint pain', 'Muscle aches', 'Headaches', 'Heart palpitations', 'Dizziness', 'Weight gain', 'Bloating', 'Breast tenderness', 'Vaginal dryness', 'Painful intercourse', 'Decreased libido', 'Urinary urgency', 'Frequent urination', 'Dry skin', 'Hair thinning', 'Acne', 'Tingling / numbness', 'Chills']

const HRT_OPTIONS = [
  { value: 'yes_hrt', label: 'Yes, on HRT / HT' },
  { value: 'yes_non_hormonal', label: 'Yes, non-hormonal prescription' },
  { value: 'yes_supplements', label: 'Yes, supplements only' },
  { value: 'no', label: 'No medication' },
  { value: 'considering', label: 'Considering starting' },
  { value: 'prefer_not', label: 'Prefer not to say' },
]

const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PF = 'var(--font-playfair), Georgia, serif'

interface Props { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; onNext: () => void; onBack: () => void }

export function StepSymptoms({ data, update, onNext, onBack }: Props) {
  function toggle(label: string) {
    const has = data.primarySymptoms.includes(label)
    update({ primarySymptoms: has ? data.primarySymptoms.filter((s) => s !== label) : [...data.primarySymptoms, label] })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Your symptoms
        </h1>
        <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Select everything you&apos;re experiencing. All optional.
        </p>
      </div>

      <div>
        <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 400, color: 'rgba(196,184,224,0.55)', margin: '0 0 12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Symptoms
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SYMPTOMS.map((label) => {
            const sel = data.primarySymptoms.includes(label)
            return (
              <button key={label} type="button" onClick={() => toggle(label)}
                style={{
                  background: sel ? 'rgba(139,109,181,0.18)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${sel ? 'rgba(155,124,200,0.55)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 9999, padding: '9px 16px',
                  fontFamily: DM, fontSize: 13, fontWeight: 300,
                  color: sel ? '#c4b8e0' : 'rgba(255,255,255,0.45)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                {label}
              </button>
            )
          })}
        </div>
        {data.primarySymptoms.length > 0 && (
          <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(155,124,200,0.7)', marginTop: 10 }}>
            {data.primarySymptoms.length} selected
          </p>
        )}
      </div>

      <div>
        <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 400, color: 'rgba(196,184,224,0.55)', margin: '0 0 12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Current medication or HRT
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {HRT_OPTIONS.map((opt) => {
            const sel = data.hrtStatus === opt.value
            return (
              <button key={opt.value} type="button" onClick={() => update({ hrtStatus: opt.value })}
                style={{
                  width: '100%', textAlign: 'left',
                  background: sel ? 'rgba(139,109,181,0.1)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${sel ? 'rgba(155,124,200,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12, padding: '12px 16px',
                  fontFamily: DM, fontSize: 13, fontWeight: 300,
                  color: sel ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                {opt.label}
              </button>
            )
          })}
        </div>
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
