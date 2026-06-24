'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/check-in',
    label: 'Check-in',
    icon: (
      <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    href: '/tracker',
    label: 'Tracker',
    icon: (
      <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    href: '/tools',
    label: 'Wellness Tools',
    icon: (
      <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    badge: 'NEW',
  },
  {
    href: '/report',
    label: 'Doctor Report',
    icon: (
      <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    href: '/medication',
    label: 'Medications',
    icon: (
      <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4"/>
        <path d="M12 8v8m-4-4h8"/>
      </svg>
    ),
  },
  {
    href: '/companion',
    label: 'AI Companion',
    icon: (
      <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    premiumBadge: true,
  },
  {
    href: '/community',
    label: 'Community',
    icon: (
      <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
          fontSize: 28, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: 0, lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          vida<span style={{ color: '#9b7cc8' }}>.</span>
        </p>
        <p style={{
          fontSize: 10, color: 'rgba(255,255,255,0.22)', marginTop: 6, letterSpacing: '0.1em',
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          textTransform: 'uppercase', fontWeight: 400,
        }}>Wellness companion</p>
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {NAV.map((item) => {
          const { href, label, icon } = item
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className={`sidebar-link${active ? ' active' : ''}`}>
              {icon}
              <span>{label}</span>
              {(item as { premiumBadge?: boolean }).premiumBadge && (
                <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 400, color: '#c9a96e', background: 'rgba(201,169,110,0.10)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 6, padding: '2px 6px', letterSpacing: '0.06em' }}>PRO</span>
              )}
              {(item as { badge?: string }).badge && (
                <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 400, color: 'rgba(196,184,224,0.8)', background: 'rgba(139,109,181,0.12)', border: '1px solid rgba(139,109,181,0.2)', borderRadius: 6, padding: '2px 6px', letterSpacing: '0.06em' }}>{(item as { badge: string }).badge}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Settings */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, marginBottom: 12 }}>
        <Link href="/settings" className={`sidebar-link${pathname === '/settings' ? ' active' : ''}`}>
          <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>Settings</span>
        </Link>
      </div>

      {/* Premium upgrade card */}
      <div className="sidebar-upgrade">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'rgba(201,169,110,0.12)',
            border: '1px solid rgba(201,169,110,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 10,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <p style={{ fontWeight: 400, color: 'rgba(255,255,255,0.82)', fontSize: 13, margin: '0 0 4px', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>Upgrade to Premium</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', margin: '0 0 14px', lineHeight: 1.5, fontWeight: 300, fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
            Unlock AI companion, advanced insights & more
          </p>
          <Link href="/settings" style={{
            display: 'block',
            background: 'linear-gradient(135deg, #c9a96e, #a8843a)',
            color: 'white',
            borderRadius: 10,
            padding: '9px 14px',
            fontSize: 12,
            fontWeight: 400,
            textAlign: 'center',
            textDecoration: 'none',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            boxShadow: '0 3px 12px rgba(201,169,110,0.25)',
            minHeight: 'unset',
          }}>
            View plans
          </Link>
        </div>
      </div>
    </aside>
  )
}
