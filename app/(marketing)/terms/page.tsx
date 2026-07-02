import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service · Vida',
  description: 'Terms governing your use of the Vida wellness platform.',
}

const section = (title: string, body: React.ReactNode) => (
  <section style={{ marginBottom: 40 }}>
    <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.88)', marginBottom: 14 }}>{title}</h2>
    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>{body}</div>
  </section>
)

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.32)', marginBottom: 48 }}>Last updated: July 2026</p>

        {section('Acceptance of terms', (
          <p>By creating an account and using Vida, you agree to these Terms of Service. If you do not agree, please do not use the service.</p>
        ))}

        {section('What Vida is — and is not', (
          <>
            <p style={{ marginBottom: 12 }}>Vida is a wellness tracking and community platform. It is designed to help you understand your own patterns, connect with others, and access educational information about perimenopause and menopause.</p>
            <p style={{ marginBottom: 12 }}><strong style={{ color: 'rgba(255,255,255,0.88)' }}>Vida is not a medical device and does not provide medical advice, diagnosis, or treatment.</strong> The AI companion provides educational information and general wellness guidance based on your tracking data. It does not replace consultation with a qualified healthcare professional.</p>
            <p>Always consult a doctor or qualified health provider for medical decisions, including decisions about medication, hormone therapy, or any treatment.</p>
          </>
        ))}

        {section('Your account', (
          <>
            <p style={{ marginBottom: 12 }}>You must be 18 or over to create an account. You are responsible for maintaining the security of your account credentials.</p>
            <p>You agree to provide accurate information and to update it if it changes. You may not share your account with others.</p>
          </>
        ))}

        {section('Community rules', (
          <>
            <p style={{ marginBottom: 12 }}>Vida&apos;s community is a space for women navigating menopause to support one another. By participating, you agree to:</p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Treat other members with kindness and respect</li>
              <li>Not share medical advice presented as definitive or prescriptive</li>
              <li>Not post commercial promotions or spam</li>
              <li>Not post content that is abusive, discriminatory, or harmful</li>
              <li>Not share personally identifying information about others</li>
            </ul>
            <p style={{ marginTop: 12 }}>We reserve the right to remove content or suspend accounts that violate these rules.</p>
          </>
        ))}

        {section('Subscriptions and billing', (
          <>
            <p style={{ marginBottom: 12 }}>Vida offers a free tier and a paid Premium subscription. Subscription pricing is displayed in South African Rand (ZAR) at the point of purchase.</p>
            <p style={{ marginBottom: 12 }}>Premium subscriptions renew automatically at the end of each billing period. You can cancel at any time from Settings → Subscription. Cancellation takes effect at the end of the current billing period — you retain Premium access until then.</p>
            <p>We do not offer refunds for partial subscription periods except where required by applicable law, including the Consumer Protection Act 68 of 2008. Where a refund is due, it will be processed to your original payment method.</p>
          </>
        ))}

        {section('Payment processing', (
          <>
            <p style={{ marginBottom: 12 }}>Online payments on Vida are processed by <strong style={{ color: 'rgba(255,255,255,0.88)' }}>Payfast (Pty) Ltd</strong>, a registered South African payment services provider. Vida does not store your full card details — payment information is handled directly and securely by Payfast.</p>
            <p style={{ marginBottom: 12 }}>By making a payment on Vida, you also agree to Payfast&apos;s terms and conditions, which are incorporated into these Terms by reference. You can read them at <a href="https://payfast.io/legal/" target="_blank" rel="noopener noreferrer" style={{ color: '#9b7cc8' }}>payfast.io/legal</a>.</p>
            <p>Upon successful payment, Premium access is activated on your account immediately (digital delivery — no physical goods are shipped). For billing queries, contact us at the address in the Contact section below.</p>
          </>
        ))}

        {section('Intellectual property', (
          <p>The content, design, and technology of Vida are owned by Vida and protected by copyright and other intellectual property laws. You retain ownership of the data you enter — your health records, journal entries, and community posts.</p>
        ))}

        {section('Limitation of liability', (
          <p>To the fullest extent permitted by law, Vida shall not be liable for indirect, incidental, or consequential damages arising from your use of the service. Our liability is limited to the amount you paid us in the 12 months preceding the claim.</p>
        ))}

        {section('Changes to these terms', (
          <p>We may update these terms from time to time. If we make material changes, we will notify you by email or in-app notice. Continued use after notification constitutes acceptance of the updated terms.</p>
        ))}

        {section('Contact', (
          <p>Questions about these terms? Email <a href="mailto:legal@vida.health" style={{ color: '#9b7cc8' }}>legal@vida.health</a>.</p>
        ))}

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.09)', paddingTop: 28, marginTop: 12 }}>
          <Link href="/privacy" style={{ fontSize: 14, color: '#9b7cc8', fontWeight: 300 }}>Read our Privacy Policy →</Link>
        </div>
      </div>
    </div>
  )
}
