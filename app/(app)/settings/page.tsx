export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { ExportButton } from '@/components/settings/ExportButton'
import { DeleteAccountButton } from '@/components/settings/DeleteAccountButton'

export const metadata: Metadata = { title: 'Settings · Vida' }

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 22,
  backdropFilter: 'blur(24px)',
  overflow: 'hidden',
  marginBottom: 14,
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-playfair), Georgia, serif',
  fontSize: 13,
  fontWeight: 300,
  color: 'rgba(255,255,255,0.32)',
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
  borderTop: '1px solid rgba(255,255,255,0.09)',
  fontSize: 15,
  fontWeight: 300,
  color: 'rgba(255,255,255,0.88)',
  textDecoration: 'none',
  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
}

function IconDot({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(155,124,200,0.15)', border: '1px solid rgba(155,124,200,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '28px 16px 100px' }}>
      <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: '0 0 28px' }}>Settings</h1>

      {/* Account */}
      <div style={card}>
        <p style={sectionTitle}>Account</p>
        <Link href="/settings/profile" style={rowBase}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconDot>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9b7cc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </IconDot>
            <div>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 15, color: 'rgba(255,255,255,0.88)' }}>Edit profile</p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.32)' }}>Name, stage, goals</p>
            </div>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: 18 }}>›</span>
        </Link>
        <Link href="/settings/password" style={rowBase}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconDot>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9b7cc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </IconDot>
            <div>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 15, color: 'rgba(255,255,255,0.88)' }}>Change password</p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.32)' }}>Update your login password</p>
            </div>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: 18 }}>›</span>
        </Link>
        <Link href="/settings/notifications" style={rowBase}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconDot>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9b7cc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </IconDot>
            <div>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 15, color: 'rgba(255,255,255,0.88)' }}>Notification preferences</p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.32)' }}>Reminders, alerts, times</p>
            </div>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: 18 }}>›</span>
        </Link>
      </div>

      {/* Subscription */}
      <div style={card}>
        <p style={sectionTitle}>Subscription</p>
        <div style={{ padding: '12px 20px 4px' }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: '0 0 14px' }}>
            You&apos;re on the <strong style={{ color: 'rgba(255,255,255,0.88)' }}>Free</strong> plan.
          </p>
        </div>
        <div style={{ padding: '0 20px 18px' }}>
          <Link href="/settings/upgrade" style={{
            display: 'block', textAlign: 'center',
            background: 'linear-gradient(135deg, #9b7cc8 0%, #7a52b0 100%)',
            color: 'white', borderRadius: 14, padding: '14px',
            fontSize: 15, fontWeight: 300, textDecoration: 'none',
            boxShadow: '0 4px 18px rgba(155,124,200,0.28)',
          }}>
            Upgrade to Premium — $12.99/mo
          </Link>
        </div>
      </div>

      {/* Privacy & data */}
      <div style={card}>
        <p style={sectionTitle}>Privacy &amp; data</p>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.09)', padding: '0' }}>
          <ExportButton />
        </div>
        <Link href="/privacy" style={{ ...rowBase, borderTop: '1px solid rgba(255,255,255,0.09)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconDot>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9b7cc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </IconDot>
            <p style={{ margin: 0, fontWeight: 500, fontSize: 15, color: 'rgba(255,255,255,0.88)' }}>Privacy policy</p>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: 18 }}>›</span>
        </Link>
        <Link href="/terms" style={{ ...rowBase, borderTop: '1px solid rgba(255,255,255,0.09)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconDot>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9b7cc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </IconDot>
            <p style={{ margin: 0, fontWeight: 500, fontSize: 15, color: 'rgba(255,255,255,0.88)' }}>Terms of service</p>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: 18 }}>›</span>
        </Link>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.09)', padding: '0' }}>
          <DeleteAccountButton />
        </div>
      </div>

      {/* App info */}
      <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.22)', marginTop: 32 }}>
        Vida v1.1 · Made with care for women everywhere
      </p>
    </div>
  )
}
