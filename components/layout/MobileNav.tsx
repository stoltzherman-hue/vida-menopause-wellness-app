'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard',  label: 'Home',      emoji: '🏡' },
  { href: '/check-in',   label: 'Check-in',  emoji: '🤍' },
  { href: '/companion',  label: 'Companion',  emoji: '💬' },
  { href: '/community',  label: 'Community',  emoji: '👥' },
  { href: '/settings',   label: 'Settings',   emoji: '⚙️' },
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
      padding: '0 12px 10px',
    }}>
      <div style={{
        background: 'rgba(253,248,244,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 28,
        border: '1.5px solid rgba(255,255,255,0.75)',
        boxShadow: '0 8px 32px -4px rgba(61,44,53,0.16), 0 2px 8px -2px rgba(61,44,53,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '6px 8px',
      }}>
        {NAV.map(({ href, label, emoji }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                padding: '6px 10px',
                borderRadius: 18,
                minHeight: 52,
                minWidth: 52,
                justifyContent: 'center',
                textDecoration: 'none',
                color: active ? '#3d2c35' : '#b8a9a0',
                transition: 'color 0.2s',
                background: active ? 'rgba(107,158,128,0.12)' : 'transparent',
              }}
            >
              <span style={{ fontSize: active ? 22 : 20, lineHeight: 1 }}>{emoji}</span>
              <span style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                letterSpacing: '0.01em',
                color: active ? '#6b9e80' : '#b8a9a0',
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              }}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
