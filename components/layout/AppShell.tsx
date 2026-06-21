import { MobileNav } from './MobileNav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#fdf8f4',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient colour blobs */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage: [
          'radial-gradient(ellipse 55% 38% at 18% 8%, rgba(107,158,128,0.13) 0%, transparent 60%)',
          'radial-gradient(ellipse 45% 32% at 82% 88%, rgba(196,149,158,0.11) 0%, transparent 55%)',
          'radial-gradient(ellipse 38% 28% at 58% 42%, rgba(184,169,201,0.08) 0%, transparent 50%)',
        ].join(', '),
      }} />

      {/* Woman watermark — fixed right edge, behind content */}
      <div style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '48vw',
        maxWidth: 520,
        pointerEvents: 'none',
        zIndex: 0,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-woman.svg"
          alt=""
          aria-hidden="true"
          style={{
            height: '100vh',
            width: 'auto',
            opacity: 0.55,
            objectFit: 'cover',
            objectPosition: 'left top',
          }}
        />
      </div>

      <main style={{ flex: 1, paddingBottom: 90, position: 'relative', zIndex: 1 }}>
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
