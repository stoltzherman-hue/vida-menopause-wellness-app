'use client'
import type { OnboardingData } from './OnboardingFlow'

const FREQ = ['Never / rarely', '1–2 times/week', '3–4 times/week', 'Daily', 'Multiple times daily']
const EXERCISE = ['Sedentary', 'Light (1–2x/week)', 'Moderate (3–4x/week)', 'Active (5+x/week)']
const SMOKE = ['Never', 'Former smoker', 'Current smoker', 'Vaping', 'Prefer not to say']
const DIET = ['Omnivore', 'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Low carb', 'Mediterranean', 'Other']

const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PF = 'var(--font-playfair), Georgia, serif'

function Chips({ options, selected, onToggle, accent = 'violet' }: {
  options: string[]
  selected: string | string[]
  onToggle: (v: string) => void
  accent?: 'violet' | 'warm'
}) {
  const sel = Array.isArray(selected) ? selected : [selected]
  const selBg = accent === 'warm' ? 'rgba(196,122,90,0.15)' : 'rgba(139,109,181,0.18)'
  const selBorder = accent === 'warm' ? 'rgba(196,122,90,0.45)' : 'rgba(155,124,200,0.55)'
  const selColor = accent === 'warm' ? 'rgba(255,210,190,0.88)' : '#c4b8e0'
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => {
        const active = sel.includes(opt)
        return (
          <button key={opt} type="button" onClick={() => onToggle(opt)}
            style={{
              background: active ? selBg : 'rgba(255,255,255,0.03)',
              border: `1px solid ${active ? selBorder : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 9999, padding: '9px 16px',
              fontFamily: DM, fontSize: 13, fontWeight: 300,
              color: active ? selColor : 'rgba(255,255,255,0.45)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 400, color: 'rgba(196,184,224,0.55)', margin: '0 0 10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {children}
    </p>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Your lifestyle
        </h1>
        <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Lifestyle factors can significantly affect symptoms. All optional.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div><SectionLabel>Alcohol</SectionLabel><Chips options={FREQ} selected={ls.alcoholFrequency} onToggle={(v) => upLs({ alcoholFrequency: ls.alcoholFrequency === v ? '' : v })} /></div>
        <div><SectionLabel>Caffeine</SectionLabel><Chips options={FREQ} selected={ls.caffeineFrequency} onToggle={(v) => upLs({ caffeineFrequency: ls.caffeineFrequency === v ? '' : v })} /></div>
        <div><SectionLabel>Exercise</SectionLabel><Chips options={EXERCISE} selected={ls.exerciseFrequency} onToggle={(v) => upLs({ exerciseFrequency: ls.exerciseFrequency === v ? '' : v })} /></div>

        <div>
          <SectionLabel>Typical sleep hours</SectionLabel>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[4, 5, 6, 7, 8, 9, 10].map((h) => {
              const sel = ls.sleepHoursAvg === h
              return (
                <button key={h} type="button" onClick={() => upLs({ sleepHoursAvg: sel ? null : h })}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: sel ? 'rgba(139,109,181,0.18)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${sel ? 'rgba(155,124,200,0.55)' : 'rgba(255,255,255,0.1)'}`,
                    fontFamily: DM, fontSize: 13, fontWeight: 300,
                    color: sel ? '#c4b8e0' : 'rgba(255,255,255,0.45)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                  {h}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <SectionLabel>Average stress level</SectionLabel>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => {
              const sel = ls.stressLevel === v
              return (
                <button key={v} type="button" onClick={() => upLs({ stressLevel: sel ? null : v })}
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: sel ? 'rgba(196,122,90,0.18)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${sel ? 'rgba(196,122,90,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    fontFamily: DM, fontSize: 13, fontWeight: 300,
                    color: sel ? 'rgba(255,210,190,0.88)' : 'rgba(255,255,255,0.45)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                  {v}
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, padding: '0 2px' }}>
            <span style={{ fontFamily: DM, fontSize: 11, color: 'rgba(255,255,255,0.22)', fontWeight: 300 }}>Low</span>
            <span style={{ fontFamily: DM, fontSize: 11, color: 'rgba(255,255,255,0.22)', fontWeight: 300 }}>High</span>
          </div>
        </div>

        <div><SectionLabel>Diet</SectionLabel><Chips options={DIET} selected={ls.dietPreferences} onToggle={toggleDiet} /></div>
        <div><SectionLabel>Smoking / vaping</SectionLabel><Chips options={SMOKE} selected={ls.smokingStatus} onToggle={(v) => upLs({ smokingStatus: ls.smokingStatus === v ? '' : v })} /></div>
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
