'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/check-in',
    label: 'Check-in',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    href: '/tracker',
    label: 'Tracker',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    href: '/medication',
    label: 'Medications',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
        <path d="m8.5 8.5 7 7"/>
      </svg>
    ),
  },
  {
    href: '/companion',
    label: 'AI Companion',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    badge: 'Premium',
  },
  {
    href: '/community',
    label: 'Community',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
]

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <div style={{ paddingLeft: 8, marginBottom: 40 }}>
        <p style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 30, fontWeight: 700, color: '#1a1220', margin: 0, lineHeight: 1,
          letterSpacing: '-0.03em',
        }}>vida<span style={{ color: '#3d7a58' }}>.</span></p>
        <p style={{
          fontSize: 10, color: '#a09098', marginTop: 6, letterSpacing: '0.10em',
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          textTransform: 'uppercase', fontWeight: 600,
        }}>Wellness companion</p>
      </div>

      {/* Section label */}
      <p style={{
        fontSize: 10, fontWeight: 700, color: '#c0b0b8', letterSpacing: '0.10em',
        textTransform: 'uppercase', paddingLeft: 14, marginBottom: 8,
        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
      }}>Navigation</p>

      {/* Nav links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {NAV.map(({ href, label, icon, badge }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className={`sidebar-link${active ? ' active' : ''}`}>
              <span style={{ flexShrink: 0 }}>{icon}</span>
              <span style={{ flex: 1 }}>{label}</span>
              {badge && (
                <span style={{
                  fontSize: 9, fontWeight: 700, color: '#a8843a',
                  background: 'rgba(201,169,110,0.14)',
                  border: '1px solid rgba(201,169,110,0.26)',
                  borderRadius: 6, padding: '2px 6px', letterSpacing: '0.04em',
                  flexShrink: 0,
                }}>PRO</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Divider + Settings */}
      <div style={{ borderTop: '1px solid rgba(90,143,110,0.10)', paddingTop: 14, marginTop: 8 }}>
        <Link href="/settings" className={`sidebar-link${pathname === '/settings' ? ' active' : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>Settings</span>
        </Link>
      </div>

      {/* Bottom user hint */}
      <div style={{
        marginTop: 20,
        background: 'linear-gradient(135deg, rgba(90,143,110,0.08) 0%, rgba(45,139,122,0.05) 100%)',
        border: '1px solid rgba(90,143,110,0.14)',
        borderRadius: 16, padding: '14px 14px',
      }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#2e6044', margin: '0 0 4px', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
          You&apos;re on Free
        </p>
        <p style={{ fontSize: 11, color: '#8a7a72', margin: '0 0 12px', lineHeight: 1.5 }}>
          Unlock AI companion & advanced insights
        </p>
        <Link href="/settings" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 6, background: 'linear-gradient(135deg, #3d7a58 0%, #2d8b7a 100%)',
          borderRadius: 10, padding: '9px 14px', fontSize: 12, fontWeight: 700, color: 'white',
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(45,139,122,0.30)',
        }}>
          Upgrade to Premium
        </Link>
      </div>
    </aside>
  )
}
