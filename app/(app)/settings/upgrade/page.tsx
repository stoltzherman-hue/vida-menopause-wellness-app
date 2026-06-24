export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

export const metadata: Metadata = { title: 'Upgrade to Premium · Vida' }

const FREE_FEATURES = [
  'Community forums & Circles',
  'Daily symptom check-in',
  'Basic 30-day symptom history',
  'Limited AI messages (5/week)',
  'Breathing & grounding tools',
]

const PREMIUM_FEATURES = [
  'Everything in Free',
  'Unlimited AI companion',
  'All 3 AI conversation modes',
  'Advanced pattern insights & charts',
  'Unlimited symptom history',
  'Doctor visit symptom reports',
  'Personalised weekly wellness summary',
  'Priority community support',
]

export default function UpgradePage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 16px 100px' }}>
      <Link href="/settings" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.55)', marginBottom: 24, textDecoration: 'none' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Settings
      </Link>

      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(155,124,200,0.10)', border: '1px solid rgba(155,124,200,0.22)', borderRadius: 9999, padding: '8px 18px', marginBottom: 20 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9b7cc8" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span style={{ fontSize: 12, fontWeight: 300, color: '#c4b8e0', letterSpacing: '0.04em' }}>Premium membership</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 12 }}>
          Unlock everything in Vida
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
          Get your AI companion, unlimited tracking, and deeper insights — all for less than a cup of coffee a week.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 32 }}>
        {/* Free */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 24, padding: '28px 24px', backdropFilter: 'blur(24px)' }}>
          <p style={{ fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Your current plan</p>
          <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 36, fontWeight: 300, color: 'rgba(255,255,255,0.88)', lineHeight: 1, marginBottom: 4 }}>Free</p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.32)', marginBottom: 24 }}>Always free, forever</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FREE_FEATURES.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>
                <Check size={16} style={{ color: '#9b7cc8', flexShrink: 0, marginTop: 1 }} strokeWidth={2.5} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Premium */}
        <div style={{ background: 'linear-gradient(148deg, rgba(155,124,200,0.12) 0%, rgba(122,82,176,0.08) 55%, rgba(9,7,14,0.95) 100%)', border: '1px solid rgba(155,124,200,0.25)', borderRadius: 24, padding: '28px 24px', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(24px)' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(155,124,200,0.08)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Premium</p>
              <span style={{ fontSize: 11, fontWeight: 300, background: 'rgba(155,124,200,0.15)', color: '#c4b8e0', border: '1px solid rgba(155,124,200,0.28)', borderRadius: 9999, padding: '4px 12px' }}>Most popular</span>
            </div>
            <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 36, fontWeight: 300, color: 'rgba(255,255,255,0.88)', lineHeight: 1, marginBottom: 4 }}>$12.99</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.32)', marginBottom: 24 }}>per month · cancel any time</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {PREMIUM_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                  <Check size={16} style={{ color: '#9b7cc8', flexShrink: 0, marginTop: 1 }} strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/api/stripe/checkout" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)', color: '#fff', borderRadius: 14, padding: '15px',
              fontSize: 15, fontWeight: 300, textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(155,124,200,0.32)',
            }}>
              Start 7-day free trial <ArrowRight size={16} />
            </Link>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', textAlign: 'center', marginTop: 12 }}>No charge until trial ends · Cancel any time</p>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', textAlign: 'center' }}>
        Questions? <Link href="/learn" style={{ color: '#c4b8e0', fontWeight: 300 }}>Visit our knowledge hub</Link> or email us at hello@vida.health
      </p>
    </div>
  )
}
