import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Settings · Vida' }

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.82)',
  border: '1.5px solid rgba(237,224,216,0.7)',
  borderRadius: 22,
  backdropFilter: 'blur(12px)',
  overflow: 'hidden',
  marginBottom: 14,
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-playfair), Georgia, serif',
  fontSize: 13,
  fontWeight: 700,
  color: '#b8a9a0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  padding: '14px 20px 10px',
  margin: 0,
}

function SettingsRow({ label, href, danger }: { label: string; href?: string; danger?: boolean }) {
  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px 20px',
    borderTop: '1px solid rgba(237,224,216,0.5)',
    fontSize: 15,
    fontWeight: 500,
    color: danger ? '#c0392b' : '#3d2c35',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'transparent',
    width: '100%',
    border: 'none',
    borderTop: '1px solid rgba(237,224,216,0.5)',
    textAlign: 'left' as const,
    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
  }
  if (href) {
    return (
      <Link href={href} style={style}>
        <span>{label}</span>
        <span style={{ color: '#c8bdb8', fontSize: 18 }}>›</span>
      </Link>
    )
  }
  return (
    <button style={style}>
      <span>{label}</span>
      <span style={{ color: danger ? '#e99' : '#c8bdb8', fontSize: 18 }}>›</span>
    </button>
  )
}

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '28px 16px 100px' }}>
      <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#3d2c35', margin: '0 0 28px' }}>Settings</h1>

      <div style={card}>
        <p style={sectionTitle}>Account</p>
        <SettingsRow label="Edit profile" href="/settings/profile" />
        <SettingsRow label="Change password" href="/settings/password" />
        <SettingsRow label="Export my data" />
      </div>

      <div style={card}>
        <p style={sectionTitle}>Subscription</p>
        <div style={{ padding: '12px 20px 4px' }}>
          <p style={{ fontSize: 14, color: '#8a7a72', margin: '0 0 14px' }}>
            You&apos;re on the <strong style={{ color: '#3d2c35' }}>Free</strong> plan.
          </p>
        </div>
        <div style={{ padding: '0 20px 18px' }}>
          <Link href="/settings/upgrade" style={{
            display: 'block', textAlign: 'center',
            background: 'linear-gradient(135deg, #3d2c35 0%, #5a3d4a 100%)',
            color: 'white', borderRadius: 14, padding: '14px',
            fontSize: 15, fontWeight: 600, textDecoration: 'none',
            boxShadow: '0 4px 18px rgba(61,44,53,0.25)',
          }}>
            Upgrade to Premium — $12.99/mo
          </Link>
        </div>
      </div>

      <div style={card}>
        <p style={sectionTitle}>Privacy & data</p>
        <SettingsRow label="Manage AI memory" />
        <SettingsRow label="Notification preferences" />
        <SettingsRow label="Delete account" danger />
      </div>
    </div>
  )
}
