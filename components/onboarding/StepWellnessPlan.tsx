'use client'
import { useEffect, useState } from 'react'
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

const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PF = 'var(--font-playfair), Georgia, serif'

interface Props { data: OnboardingData; onFinish: () => void }

export function StepWellnessPlan({ data, onFinish }: Props) {
  const [visible, setVisible] = useState(false)
  const planPoints = generatePlanPoints(data)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 400); return () => clearTimeout(t) }, [])

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
          background: 'radial-gradient(circle, rgba(139,109,181,0.3) 0%, rgba(139,109,181,0.05) 100%)',
          border: '1px solid rgba(155,124,200,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: PF, fontSize: 22, fontWeight: 300, color: '#c4b8e0' }}>v</span>
        </div>
        <h1 style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          Your wellness plan is ready
        </h1>
        <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Based on what you&apos;ve shared, here&apos;s where to focus first.
        </p>
      </div>

      {data.goals.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px' }}>
          <p style={{ fontFamily: DM, fontSize: 11, fontWeight: 400, color: 'rgba(196,184,224,0.55)', margin: '0 0 14px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Your goals
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.goals.map((g) => (
              <div key={g} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#9b7cc8', flexShrink: 0 }} />
                <span style={{ fontFamily: DM, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.65)' }}>{GOAL_LABELS[g] ?? g}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px' }}>
        <p style={{ fontFamily: DM, fontSize: 11, fontWeight: 400, color: 'rgba(196,184,224,0.55)', margin: '0 0 14px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Personalised starting points
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {planPoints.map((point, i) => (
            <div key={i} style={{ display: 'flex', gap: 14 }}>
              <span style={{ fontFamily: PF, fontSize: 14, fontWeight: 300, color: 'rgba(155,124,200,0.6)', flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
              <p style={{ fontFamily: DM, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.6 }}>{point}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px' }}>
        <p style={{ fontFamily: DM, fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.32)', margin: '0 0 4px', letterSpacing: '0.04em' }}>Educational support only</p>
        <p style={{ fontFamily: DM, fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.22)', margin: 0, lineHeight: 1.6 }}>
          This plan is based on your self-reported information and general wellness evidence. It is not medical advice. Always discuss symptoms and treatment decisions with your healthcare provider.
        </p>
      </div>

      <button type="button" onClick={onFinish}
        style={{
          width: '100%', padding: '15px',
          background: 'rgba(139,109,181,0.15)',
          border: '1px solid rgba(155,124,200,0.3)',
          borderRadius: 14,
          fontFamily: DM, fontSize: 14, fontWeight: 300,
          color: '#c4b8e0', cursor: 'pointer', transition: 'all 0.2s',
        }}>
        Go to my dashboard
      </button>
    </div>
  )
}
