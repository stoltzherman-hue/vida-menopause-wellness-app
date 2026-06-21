'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#3d7a58' : 'none'} stroke={active ? '#3d7a58' : '#a09098'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22" stroke={active ? '#3d7a58' : '#a09098'} fill="none"/>
      </svg>
    ),
  },
  {
    href: '/check-in',
    label: 'Check-in',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#3d7a58' : 'none'} stroke={active ? '#3d7a58' : '#a09098'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={active ? 'rgba(61,122,88,0.2)' : 'none'}/>
      </svg>
    ),
  },
  {
    href: '/companion',
    label: 'Companion',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'rgba(61,122,88,0.2)' : 'none'} stroke={active ? '#3d7a58' : '#a09098'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    href: '/community',
    label: 'Community',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#3d7a58' : '#a09098'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill={active ? 'rgba(61,122,88,0.15)' : 'none'}/>
        <circle cx="9" cy="7" r="4" fill={active ? 'rgba(61,122,88,0.15)' : 'none'}/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#3d7a58' : '#a09098'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      padding: '0 12px 14px',
    }}>
      <div style={{
        background: 'rgba(250,247,245,0.94)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderRadius: 30,
        border: '1px solid rgba(90,143,110,0.14)',
        boxShadow: '0 -2px 4px rgba(42,30,38,0.04), 0 8px 40px -4px rgba(42,30,38,0.18), 0 2px 8px -2px rgba(42,30,38,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 6px',
      }}>
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '7px 12px',
                borderRadius: 20,
                minHeight: 54,
                minWidth: 54,
                justifyContent: 'center',
                textDecoration: 'none',
                position: 'relative',
                background: active
                  ? 'linear-gradient(135deg, rgba(90,143,110,0.14) 0%, rgba(45,139,122,0.10) 100%)'
                  : 'transparent',
                transition: 'background 0.2s',
              }}
            >
              {/* Active top accent line */}
              {active && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 24, height: 3,
                  borderRadius: '0 0 3px 3px',
                  background: 'linear-gradient(90deg, #3d7a58, #2d8b7a)',
                }} />
              )}
              {icon(active)}
              <span style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                letterSpacing: '0.01em',
                color: active ? '#2e6044' : '#a09098',
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                lineHeight: 1,
              }}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
