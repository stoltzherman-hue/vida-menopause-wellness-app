'use client'
import type { OnboardingData } from './OnboardingFlow'

const GOALS = [
  { value: 'manage_hot_flashes', label: 'Manage hot flashes & night sweats' },
  { value: 'improve_sleep', label: 'Improve sleep quality' },
  { value: 'support_mood', label: 'Support mood & reduce anxiety' },
  { value: 'reduce_brain_fog', label: 'Reduce brain fog & improve focus' },
  { value: 'manage_weight', label: 'Manage weight changes' },
  { value: 'bone_health', label: 'Support bone health' },
  { value: 'heart_health', label: 'Support heart health' },
  { value: 'sexual_health', label: 'Improve sexual health & comfort' },
  { value: 'doctor_communication', label: 'Better communicate with my doctor' },
  { value: 'track_patterns', label: 'Understand my symptom patterns' },
  { value: 'community', label: 'Connect with others who understand' },
  { value: 'feel_less_alone', label: 'Feel less alone in this journey' },
]

const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PF = 'var(--font-playfair), Georgia, serif'

interface Props { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; onNext: () => void; onBack: () => void }

export function StepGoals({ data, update, onNext, onBack }: Props) {
  function toggle(value: string) {
    const has = data.goals.includes(value)
    if (has) { update({ goals: data.goals.filter((g) => g !== value) }) }
    else if (data.goals.length < 3) { update({ goals: [...data.goals, value] }) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          What matters most?
        </h1>
        <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Pick up to 3 goals. Optional — you can change these later.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {GOALS.map(({ value, label }) => {
          const selected = data.goals.includes(value)
          const maxed = data.goals.length >= 3 && !selected
          const rank = data.goals.indexOf(value)
          return (
            <button key={value} type="button" onClick={() => toggle(value)} disabled={maxed}
              style={{
                width: '100%', textAlign: 'left',
                background: selected ? 'rgba(139,109,181,0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${selected ? 'rgba(155,124,200,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 12, padding: '13px 16px',
                fontFamily: DM, fontSize: 13, fontWeight: 300,
                color: selected ? 'rgba(255,255,255,0.88)' : maxed ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.55)',
                cursor: maxed ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
              <span>{label}</span>
              {selected && (
                <span style={{ fontFamily: DM, fontSize: 11, color: 'rgba(155,124,200,0.7)', fontWeight: 400, flexShrink: 0, marginLeft: 12 }}>
                  #{rank + 1}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {data.goals.length > 0 && (
        <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(155,124,200,0.7)', margin: '-12px 0 0' }}>
          {data.goals.length}/3 selected
        </p>
      )}

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
