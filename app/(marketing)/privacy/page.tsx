import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy · Vida',
  description: 'How Vida collects, uses, and protects your health data.',
}

const section = (title: string, body: React.ReactNode) => (
  <section style={{ marginBottom: 40 }}>
    <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1a1220', marginBottom: 14 }}>{title}</h2>
    <div style={{ fontSize: 15, color: '#4a3a42', lineHeight: 1.8 }}>{body}</div>
  </section>
)

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fdf8f4', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="m-nav-glass">
          <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#1a1220', letterSpacing: '-0.02em' }}>
              vida<span style={{ color: '#2d8b7a' }}>.</span>
            </Link>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link href="/login" className="m-btn m-btn-ghost-sm">Sign in</Link>
              <Link href="/signup" className="m-btn m-btn-sage-sm">Join free</Link>
            </nav>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 740, margin: '0 auto', padding: 'clamp(48px, 6vw, 80px) 24px 96px' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#2d8b7a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Legal</p>
        <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#1a1220', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 12 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 14, color: '#8a7a72', marginBottom: 48 }}>Last updated: June 2026</p>

        {section('Our commitment to your privacy', (
          <p>Vida is a health and wellness platform, and we understand that the information you share with us — symptoms, moods, medications, journal entries — is deeply personal. We treat it with the utmost care. Your health data is yours. We do not sell it, share it with advertisers, or use it for purposes beyond operating and improving the Vida service.</p>
        ))}

        {section('What data we collect', (
          <>
            <p style={{ marginBottom: 12 }}><strong>Account data:</strong> Email address, display name, date of birth (optional), and menopause stage (optional) provided at signup.</p>
            <p style={{ marginBottom: 12 }}><strong>Health tracking data:</strong> Symptoms, mood, sleep, energy, hot flush counts, triggers, and notes you log in daily check-ins.</p>
            <p style={{ marginBottom: 12 }}><strong>AI companion conversations:</strong> Messages you exchange with the AI companion. These are stored to provide continuity of conversation and are never used for advertising purposes.</p>
            <p style={{ marginBottom: 12 }}><strong>Community content:</strong> Posts, replies, and profile information you choose to share in the community. This is intentionally separate from your private health data.</p>
            <p><strong>Usage data:</strong> Standard server logs, page views, and feature usage to operate and improve the service. We do not log the content of your health data in standard app logs.</p>
          </>
        ))}

        {section('How we use your data', (
          <>
            <p style={{ marginBottom: 12 }}>To provide the Vida service — including symptom tracking, AI companion responses, community features, and doctor reports.</p>
            <p style={{ marginBottom: 12 }}>To generate insights within the app (e.g. pattern detection, weekly summaries). These are generated on your data for your benefit.</p>
            <p>To communicate with you about your account, including essential service emails. We will not send marketing emails without your explicit consent.</p>
          </>
        ))}

        {section('Data sharing', (
          <>
            <p style={{ marginBottom: 12 }}>We do not sell your personal or health data to any third party.</p>
            <p style={{ marginBottom: 12 }}>We use the following service providers to operate Vida: Supabase (database and authentication), Vercel (hosting), Stripe (subscription billing), and an AI model provider for the companion feature. Each provider processes only the data necessary for their function and is bound by data processing agreements.</p>
            <p>We may disclose data if required by law, or to protect the safety of users or the public.</p>
          </>
        ))}

        {section('Data security', (
          <p>All data is encrypted in transit (TLS) and at rest. Health data tables are protected by row-level security policies so that only you can access your data. AI companion content is not stored in standard application logs.</p>
        ))}

        {section('Your rights', (
          <>
            <p style={{ marginBottom: 12 }}>You have the right to access, correct, and delete your data at any time. You can export your data from Settings. You can request account deletion from Settings → Delete account, which will permanently remove all your health data.</p>
            <p>If you are in the EEA or UK, you have additional rights under GDPR, including the right to data portability and the right to object to processing.</p>
          </>
        ))}

        {section('Contact', (
          <p>For privacy questions or requests, email us at <a href="mailto:privacy@vida.health" style={{ color: '#2d8b7a' }}>privacy@vida.health</a>.</p>
        ))}

        <div style={{ borderTop: '1px solid rgba(237,224,216,0.7)', paddingTop: 28, marginTop: 12 }}>
          <Link href="/terms" style={{ fontSize: 14, color: '#2d8b7a', fontWeight: 600 }}>Read our Terms of Service →</Link>
        </div>
      </div>
    </div>
  )
}
