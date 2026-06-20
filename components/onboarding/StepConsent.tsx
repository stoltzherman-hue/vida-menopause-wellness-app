'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { OnboardingData } from './OnboardingFlow'

interface Props {
  data: OnboardingData; update: (p: Partial<OnboardingData>) => void
  onNext: () => void; onBack: () => void; onSubmit: () => void; saving: boolean
}

function ConsentRow({ label, description, checked, onChange, required }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void; required?: boolean }) {
  return (
    <button type="button" onClick={() => !required && onChange(!checked)}
      className={cn('w-full text-left rounded-xl border p-4 transition-all', checked ? 'border-[#5a8a6b] bg-[#5a8a6b]/5' : 'border-[#e2d9d0]', required && checked && 'cursor-default')}>
      <div className="flex items-start gap-3">
        <div className={cn('mt-0.5 w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-colors', checked ? 'bg-[#5a8a6b] border-[#5a8a6b]' : 'border-[#e2d9d0]')}>
          {checked && <span className="text-white text-xs">✓</span>}
        </div>
        <div>
          <p className="font-medium text-[#2d3748] text-sm">{label}{required && <span className="text-[#c47a5a] ml-1">*</span>}</p>
          <p className="text-xs text-[#718096] mt-0.5">{description}</p>
        </div>
      </div>
    </button>
  )
}

export function StepConsent({ data, update, onBack, onSubmit, saving }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3748]">Your privacy choices</h1>
        <p className="text-[#718096] mt-2">You control exactly how your data is used.</p>
      </div>
      <div className="space-y-3">
        <ConsentRow label="Health data storage" description="Store your check-ins, symptom logs, and health profile on Vida's encrypted servers." checked={data.consentHealthData} onChange={(v) => update({ consentHealthData: v })} required />
        <ConsentRow label="AI analysis of my data" description="Allow the AI companion to read your symptom patterns for personalised insights. Without this, AI responses will be general only." checked={data.consentAiAnalysis} onChange={(v) => update({ consentAiAnalysis: v })} />
        <ConsentRow label="Community display name" description="Create a pseudonymous profile for forums and Circles. Your health data is never shared with the community." checked={data.consentCommunity} onChange={(v) => update({ consentCommunity: v })} />
        <ConsentRow label="Reminders & notifications" description="Check-in reminders, medication alerts, and wellness tips. Customise or turn off any time." checked={data.consentNotifications} onChange={(v) => update({ consentNotifications: v })} />
        <ConsentRow label="Occasional updates from Vida" description="New features and evidence-based wellness content. No spam, unsubscribe any time." checked={data.consentMarketing} onChange={(v) => update({ consentMarketing: v })} />
      </div>
      <div className="bg-[#f0ece4] rounded-xl px-4 py-3 text-xs text-[#718096] space-y-1">
        <p>✶ Your data is encrypted at rest and in transit.</p>
        <p>✶ We never sell your data.</p>
        <p>✶ Export or delete everything at any time in Settings.</p>
        <p>✶ Vida is educational support — not a medical provider.</p>
      </div>
      {!data.consentHealthData && <p className="text-sm text-[#c47a5a]">Please accept health data storage to continue.</p>}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onSubmit} className="flex-1" disabled={!data.consentHealthData || saving}>{saving ? 'Saving…' : 'Finish setup'}</Button>
      </div>
    </div>
  )
}
