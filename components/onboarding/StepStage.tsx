'use client'
import type { OnboardingData } from './OnboardingFlow'

const AGE_RANGES = ['Under 40', '40–44', '45–49', '50–54', '55–59', '60–64', '65+', 'Prefer not to say']

const STAGES = [
  { value: 'perimenopause', label: 'Perimenopause', desc: 'Irregular periods, symptoms starting — still having cycles' },
  { value: 'menopause', label: 'Menopause', desc: 'No period for 12 months or just reached this point' },
  { value: 'post_menopause', label: 'Post-menopause', desc: 'More than 12 months since last period' },
  { value: 'surgical_menopause', label: 'Surgical menopause', desc: 'After hysterectomy or oophorectomy' },
  { value: 'premature_ovarian_insufficiency', label: 'Premature ovarian insufficiency', desc: 'Menopause before age 40' },
  { value: 'unsure', label: "I'm not sure", desc: "That's okay — we can help you figure it out" },
]

const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PF = 'var(--font-playfair), Georgia, serif'

interface Props { data: OnboardingData; update: (p: Partial<OnboardingData>) => void; onNext: () => void; onBack: () => void }

export function StepStage({ data, update, onNext }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Where are you in your journey?
        </h1>
        <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          All questions are optional — answer what feels right.
        </p>
      </div>

      <div>
        <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 400, color: 'rgba(196,184,224,0.55)', margin: '0 0 12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Age range
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {AGE_RANGES.map((age) => {
            const sel = data.ageRange === age
            return (
              <button key={age} type="button" onClick={() => update({ ageRange: sel ? '' : age })}
                style={{
                  background: sel ? 'rgba(139,109,181,0.18)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${sel ? 'rgba(155,124,200,0.55)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 9999, padding: '9px 18px',
                  fontFamily: DM, fontSize: 13, fontWeight: 300,
                  color: sel ? '#c4b8e0' : 'rgba(255,255,255,0.45)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                {age}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 400, color: 'rgba(196,184,224,0.55)', margin: '0 0 12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Menopause stage
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {STAGES.map((s) => {
            const sel = data.menopauseStage === s.value
            return (
              <button key={s.value} type="button" onClick={() => update({ menopauseStage: s.value })}
                style={{
                  width: '100%', textAlign: 'left',
                  background: sel ? 'rgba(139,109,181,0.1)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${sel ? 'rgba(155,124,200,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 14, padding: '14px 18px',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: sel ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.65)', margin: '0 0 3px' }}>{s.label}</p>
                <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.32)', margin: 0 }}>{s.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      <button type="button" onClick={onNext}
        style={{
          width: '100%', padding: '14px',
          background: 'rgba(139,109,181,0.15)',
          border: '1px solid rgba(155,124,200,0.3)',
          borderRadius: 14,
          fontFamily: DM, fontSize: 14, fontWeight: 300,
          color: '#c4b8e0', cursor: 'pointer', transition: 'all 0.2s',
        }}>
        Continue
      </button>
    </div>
  )
}
