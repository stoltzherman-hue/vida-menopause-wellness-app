import type { Metadata } from 'next'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
export const metadata: Metadata = { title: 'Welcome to Vida' }
export default function OnboardingPage() {
  return <OnboardingFlow />
}
