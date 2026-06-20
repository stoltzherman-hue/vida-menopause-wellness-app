export type MenopauseStage =
  | 'perimenopause'
  | 'menopause'
  | 'post_menopause'
  | 'surgical_menopause'
  | 'premature_ovarian_insufficiency'
  | 'unsure'

export type SubscriptionTier = 'free' | 'premium'

export type SubscriptionStatus =
  | 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'paused'

export type MedicationCategory =
  | 'estrogen' | 'progesterone' | 'combined_hrt' | 'vaginal_estrogen'
  | 'testosterone' | 'non_hormonal_prescription' | 'supplement' | 'other'

export interface UserProfile {
  id: string; userId: string; displayName: string | null; ageRange: string | null
  menopauseStage: MenopauseStage | null; primarySymptoms: string[]
  medicalHistory: string[]; lifestyle: Record<string, unknown>; goals: string[]
  onboardingCompleted: boolean; createdAt: Date; updatedAt: Date
}

export interface DailyCheckin {
  id: string; userId: string; checkinDate: string; overallWellbeing: number | null
  mood: number | null; sleepHours: number | null; sleepQuality: number | null
  energyLevel: number | null; hotFlashCount: number | null; hotFlashSeverity: number | null
  nightSweatsCount: number | null; nightSweatsSeverity: number | null
  periodStatus: string | null; triggers: string[]; notes: string | null
  createdAt: Date; updatedAt: Date
}

export interface Medication {
  id: string; userId: string; name: string; dose: string | null; route: string | null
  frequency: string | null; timeOfDay: string[]; startDate: string | null
  endDate: string | null; category: MedicationCategory
  prescribingClinician: string | null; active: boolean; notes: string | null; createdAt: Date
}

export interface AiMessage {
  id: string; conversationId: string; role: 'user' | 'assistant' | 'system'
  content: string; createdAt: Date
}

export interface Subscription {
  id: string; userId: string; stripeCustomerId: string | null
  stripeSubscriptionId: string | null; tier: SubscriptionTier; status: SubscriptionStatus
  currentPeriodStart: Date | null; currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean; createdAt: Date; updatedAt: Date
}

export interface Entitlements {
  tier: SubscriptionTier; aiMessagesRemaining: number | null
  canAccessVoice: boolean; canAccessAdvancedInsights: boolean
  canAccessReports: boolean; canAccessUnlimitedTracking: boolean
}

export interface ApiSuccess<T> { data: T; error: null }
export interface ApiError { data: null; error: { message: string; code?: string } }
export type ApiResult<T> = ApiSuccess<T> | ApiError
