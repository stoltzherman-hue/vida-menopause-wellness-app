'use client'
import type { OnboardingData } from './OnboardingFlow'

const DM = 'var(--font-dm-sans), system-ui, sans-serif'
const PF = 'var(--font-playfair), Georgia, serif'

interface ConsentRowProps {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
  required?: boolean
}

function ConsentRow({ label, description, checked, onChange, required }: ConsentRowProps) {
  return (
    <button type="button" onClick={() => !required && onChange(!checked)}
      style={{
        width: '100%', textAlign: 'left',
        background: checked ? 'rgba(139,109,181,0.08)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${checked ? 'rgba(155,124,200,0.35)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 12, padding: '14px 16px',
        cursor: required && checked ? 'default' : 'pointer',
        transition: 'all 0.2s',
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}>
      <div style={{
        marginTop: 1, width: 18, height: 18, borderRadius: 5, flexShrink: 0,
        background: checked ? 'rgba(139,109,181,0.5)' : 'transparent',
        border: `1.5px solid ${checked ? 'rgba(155,124,200,0.7)' : 'rgba(255,255,255,0.2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}>
        {checked && <span style={{ color: '#c4b8e0', fontSize: 10, lineHeight: 1 }}>✓</span>}
      </div>
      <div>
        <p style={{ fontFamily: DM, fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.75)', margin: '0 0 3px' }}>
          {label}
          {required && <span style={{ color: 'rgba(196,122,90,0.8)', marginLeft: 4 }}>*</span>}
        </p>
        <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.32)', margin: 0, lineHeight: 1.55 }}>
          {description}
        </p>
      </div>
    </button>
  )
}

interface Props {
  data: OnboardingData; update: (p: Partial<OnboardingData>) => void
  onNext: () => void; onBack: () => void; onSubmit: () => void; saving: boolean
}

export function StepConsent({ data, update, onBack, onSubmit, saving }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontFamily: PF, fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Your privacy choices
        </h1>
        <p style={{ fontFamily: DM, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          You control exactly how your data is used.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ConsentRow label="Health data storage" description="Store your check-ins, symptom logs, and health profile on Vida's encrypted servers." checked={data.consentHealthData} onChange={(v) => update({ consentHealthData: v })} required />
        <ConsentRow label="AI analysis of my data" description="Allow the AI companion to read your symptom patterns for personalised insights. Without this, AI responses will be general only." checked={data.consentAiAnalysis} onChange={(v) => update({ consentAiAnalysis: v })} />
        <ConsentRow label="Community display name" description="Create a pseudonymous profile for forums and Circles. Your health data is never shared with the community." checked={data.consentCommunity} onChange={(v) => update({ consentCommunity: v })} />
        <ConsentRow label="Reminders & notifications" description="Check-in reminders, medication alerts, and wellness tips. Customise or turn off any time." checked={data.consentNotifications} onChange={(v) => update({ consentNotifications: v })} />
        <ConsentRow label="Occasional updates from Vida" description="New features and evidence-based wellness content. No spam, unsubscribe any time." checked={data.consentMarketing} onChange={(v) => update({ consentMarketing: v })} />
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: 5,
      }}>
        {['Your data is encrypted at rest and in transit.', 'We never sell your data.', 'Export or delete everything at any time in Settings.', 'Vida is educational support — not a medical provider.'].map((line) => (
          <p key={line} style={{ fontFamily: DM, fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.28)', margin: 0, lineHeight: 1.5 }}>
            · {line}
          </p>
        ))}
      </div>

      {!data.consentHealthData && (
        <p style={{ fontFamily: DM, fontSize: 12, fontWeight: 300, color: 'rgba(196,122,90,0.75)', margin: '-14px 0 0' }}>
          Please accept health data storage to continue.
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
        <button type="button" onClick={onSubmit} disabled={!data.consentHealthData || saving}
          style={{
            flex: 1, padding: '14px',
            background: data.consentHealthData && !saving ? 'rgba(139,109,181,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${data.consentHealthData && !saving ? 'rgba(155,124,200,0.3)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 14,
            fontFamily: DM, fontSize: 14, fontWeight: 300,
            color: data.consentHealthData && !saving ? '#c4b8e0' : 'rgba(255,255,255,0.22)',
            cursor: !data.consentHealthData || saving ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}>
          {saving ? 'Saving…' : 'Finish setup'}
        </button>
      </div>
    </div>
  )
}
