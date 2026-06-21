import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_placeholder_not_configured')
export const PREMIUM_MONTHLY_PRICE_ID = process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!
export const PREMIUM_ANNUAL_PRICE_ID = process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID!
export function formatPrice(usd: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usd)
}
