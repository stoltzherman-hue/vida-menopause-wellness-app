'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard',  label: 'Dashboard',    emoji: '🏡' },
  { href: '/check-in',   label: 'Check-in',     emoji: '🤍' },
  { href: '/tracker',    label: 'Tracker',       emoji: '📈' },
  { href: '/medication', label: 'Medications',   emoji: '💊' },
  { href: '/companion',  label: 'AI Companion',  emoji: '💬' },
  { href: '/community',  label: 'Community',     emoji: '👥' },
]

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <div style={{ paddingLeft: 6, marginBottom: 36 }}>
        <p style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 28, fontWeight: 700, color: '#3d2c35', margin: 0, lineHeight: 1,
        }}>Vida</p>
        <p style={{
          fontSize: 11, color: '#8a7a72', marginTop: 5, letterSpacing: '0.04em',
          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
          textTransform: 'uppercase',
        }}>Wellness companion</p>
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {NAV.map(({ href, label, emoji }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className={`sidebar-link${active ? ' active' : ''}`}>
              <span style={{ fontSize: 17, width: 22, textAlign: 'center' }}>{emoji}</span>
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Settings */}
      <div style={{ borderTop: '1px solid rgba(61,44,53,0.08)', paddingTop: 14 }}>
        <Link href="/settings" className={`sidebar-link${pathname === '/settings' ? ' active' : ''}`}>
          <span style={{ fontSize: 17, width: 22, textAlign: 'center' }}>⚙️</span>
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  )
}
