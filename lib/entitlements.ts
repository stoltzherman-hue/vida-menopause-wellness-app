export type Tier = 'free' | 'premium' | 'voice'

// Monthly voice-minute allowance per tier (hard caps that protect margin)
export const VOICE_MINUTES_BY_TIER: Record<Tier, number> = {
  free: 0,
  premium: 15, // taster
  voice: 150,
}

export function voiceMinutesForTier(tier?: string | null): number {
  if (tier === 'voice') return VOICE_MINUTES_BY_TIER.voice
  if (tier === 'premium') return VOICE_MINUTES_BY_TIER.premium
  return 0
}

export const TIER_PRICE_ZAR: Record<'premium' | 'voice', string> = {
  premium: '149.00',
  voice: '249.00',
}

export const TIER_ITEM_NAME: Record<'premium' | 'voice', string> = {
  premium: 'Vida Premium Monthly',
  voice: 'Vida Voice Monthly',
}

// The billing-period key used to bucket voice usage. Aligns to the PayFast
// billing cycle when we have it, otherwise the current calendar month (UTC).
export function billingPeriodStart(currentPeriodStart?: string | null): string {
  if (currentPeriodStart) return currentPeriodStart.slice(0, 10)
  const d = new Date()
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString().slice(0, 10)
}
