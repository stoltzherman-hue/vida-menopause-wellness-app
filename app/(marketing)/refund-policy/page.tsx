import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy · Vida',
  description: 'How subscription cancellations and refunds work on Vida.',
}

const section = (title: string, body: React.ReactNode) => (
  <section style={{ marginBottom: 40 }}>
    <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.88)', marginBottom: 14 }}>{title}</h2>
    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>{body}</div>
  </section>
)

export default function RefundPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#09070e', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(24px)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em', textDecoration: 'none' }}>
              vida<span style={{ color: '#9b7cc8' }}>.</span>
            </Link>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link href="/login" className="m-btn m-btn-ghost-sm">Sign in</Link>
              <Link href="/signup" className="m-btn m-btn-sage-sm">Join free</Link>
            </nav>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 740, margin: '0 auto', padding: 'clamp(48px, 6vw, 80px) 24px 96px' }}>
        <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(155,124,200,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Legal</p>
        <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 12 }}>
          Refund &amp; Cancellation Policy
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.32)', marginBottom: 48 }}>Last updated: July 2026</p>

        {section('Overview', (
          <p>Vida offers a free tier and a paid Premium subscription billed monthly in South African Rand (ZAR). Payments are processed securely by Payfast (Pty) Ltd. This policy explains how cancellations and refunds work. It should be read together with our <Link href="/terms" style={{ color: '#9b7cc8' }}>Terms of Service</Link>.</p>
        ))}

        {section('Cancelling your subscription', (
          <>
            <p style={{ marginBottom: 12 }}>You can cancel your Premium subscription at any time — no phone calls, no forms, no questions asked:</p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Go to <strong style={{ color: 'rgba(255,255,255,0.88)' }}>Settings → Subscription</strong> in the app and select Cancel</li>
              <li>Or email us at the address below and we will cancel it for you</li>
            </ul>
            <p style={{ marginTop: 12 }}>Cancellation takes effect at the end of your current billing period. You keep full Premium access until that date, and you will not be billed again. Your account then reverts to the free tier — your data, community profile, and tracking history remain intact.</p>
          </>
        ))}

        {section('Refunds', (
          <>
            <p style={{ marginBottom: 12 }}><strong style={{ color: 'rgba(255,255,255,0.88)' }}>Billing errors:</strong> if you were charged incorrectly — a duplicate charge, a charge after cancellation, or an incorrect amount — we will refund the incorrect charge in full. Contact us within 30 days of the charge.</p>
            <p style={{ marginBottom: 12 }}><strong style={{ color: 'rgba(255,255,255,0.88)' }}>First subscription payment:</strong> if you subscribed to Premium for the first time and are not satisfied, contact us within 7 days of the first charge and we will refund it in full.</p>
            <p style={{ marginBottom: 12 }}><strong style={{ color: 'rgba(255,255,255,0.88)' }}>Renewal payments:</strong> we do not generally refund renewal charges for partial or unused subscription periods, except where required by applicable law, including the Consumer Protection Act 68 of 2008 and the Electronic Communications and Transactions Act 25 of 2002.</p>
            <p>Approved refunds are processed to your original payment method via Payfast, normally within 7–14 business days depending on your bank.</p>
          </>
        ))}

        {section('Free tier', (
          <p>The free tier requires no payment details and can be used indefinitely. You can delete your account at any time from Settings — see our <Link href="/privacy" style={{ color: '#9b7cc8' }}>Privacy Policy</Link> for how data deletion works.</p>
        ))}

        {section('How to reach us', (
          <p>For any billing, cancellation, or refund query, email <a href="mailto:support@vidaapp.co.za" style={{ color: '#9b7cc8' }}>support@vidaapp.co.za</a>. We aim to respond within 2 business days.</p>
        ))}

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.09)', paddingTop: 28, marginTop: 12, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ fontSize: 14, color: '#9b7cc8', fontWeight: 300 }}>Terms of Service →</Link>
          <Link href="/privacy" style={{ fontSize: 14, color: '#9b7cc8', fontWeight: 300 }}>Privacy Policy →</Link>
        </div>
      </div>
    </div>
  )
}
