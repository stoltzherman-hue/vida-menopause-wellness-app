export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { ExportButton } from '@/components/settings/ExportButton'
import { DeleteAccountButton } from '@/components/settings/DeleteAccountButton'

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

const rowBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '15px 20px',
  borderTop: '1px solid rgba(237,224,216,0.5)',
  fontSize: 15,
  fontWeight: 500,
  color: '#3d2c35',
  textDecoration: 'none',
  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
}

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '28px 16px 100px' }}>
      <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#3d2c35', margin: '0 0 28px' }}>Settings</h1>

      {/* Account */}
      <div style={card}>
        <p style={sectionTitle}>Account</p>
        <Link href="/settings/profile" style={rowBase}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>👤</span>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>Edit profile</p>
              <p style={{ margin: 0, fontSize: 12, color: '#8a7a72' }}>Name, stage, goals</p>
            </div>
          </div>
          <span style={{ color: '#c8bdb8', fontSize: 18 }}>›</span>
        </Link>
        <Link href="/settings/password" style={rowBase}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>🔒</span>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>Change password</p>
              <p style={{ margin: 0, fontSize: 12, color: '#8a7a72' }}>Update your login password</p>
            </div>
          </div>
          <span style={{ color: '#c8bdb8', fontSize: 18 }}>›</span>
        </Link>
        <Link href="/settings/notifications" style={rowBase}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>Notification preferences</p>
              <p style={{ margin: 0, fontSize: 12, color: '#8a7a72' }}>Reminders, alerts, times</p>
            </div>
          </div>
          <span style={{ color: '#c8bdb8', fontSize: 18 }}>›</span>
        </Link>
      </div>

      {/* Subscription */}
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

      {/* Privacy & data */}
      <div style={card}>
        <p style={sectionTitle}>Privacy &amp; data</p>
        <div style={{ borderTop: '1px solid rgba(237,224,216,0.5)', padding: '0' }}>
          <ExportButton />
        </div>
        <Link href="/privacy" style={{ ...rowBase, borderTop: '1px solid rgba(237,224,216,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>📄</span>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>Privacy policy</p>
          </div>
          <span style={{ color: '#c8bdb8', fontSize: 18 }}>›</span>
        </Link>
        <Link href="/terms" style={{ ...rowBase, borderTop: '1px solid rgba(237,224,216,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>📋</span>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>Terms of service</p>
          </div>
          <span style={{ color: '#c8bdb8', fontSize: 18 }}>›</span>
        </Link>
        <div style={{ borderTop: '1px solid rgba(237,224,216,0.5)', padding: '0' }}>
          <DeleteAccountButton />
        </div>
      </div>

      {/* App info */}
      <p style={{ textAlign: 'center', fontSize: 12, color: '#c8bdb8', marginTop: 32 }}>
        Vida v1.1 · Made with care for women everywhere
      </p>
    </div>
  )
}
